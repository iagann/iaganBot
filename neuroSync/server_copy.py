import torch
import librosa
import numpy as np
from fastapi import FastAPI, WebSocket, File, UploadFile
from transformers import AutoConfig, AutoFeatureExtractor, AutoModelForAudioClassification
import io
import uvicorn
import os

# Настройка устройства
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"--- [Neuro-Sync] Инициализация на: {device} ---")

# model_id = "xbgoose/hubert-large-speech-emotion-recognition-russian-dusha-finetuned"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_id = os.path.join(BASE_DIR, "model")

print(f"--- [Neuro-Sync] Загрузка модели: {model_id} ---")

try:
    config = AutoConfig.from_pretrained(model_id)
    feature_extractor = AutoFeatureExtractor.from_pretrained(model_id)
    model = AutoModelForAudioClassification.from_pretrained(model_id).to(device)
    model.eval() # Перевод в режим инференса
    print("--- [Neuro-Sync] Модель готова к работе! ---")
except Exception as e:
    print(f"--- [!] Критическая ошибка загрузки: {e} ---")
    exit(1)

app = FastAPI()

SENSITIVITY = {
    "neutral": 0.4,   # Понижаем вес нейтральности (штраф)
    "angry": 2.5,     # Усиливаем злость (даже слабый сигнал станет заметным)
    "positive": 1.5,  # Позитив обычно и так ловится, но чуть подтянем
    "sad": 2.0,       # Грусть ловится хорошо, но сделаем её четче
    "other": 1.0
}

def predict_emotion(audio_bytes):
    try:
        # 1. Читаем сырые байты как массив 16-битных целых чисел (Int16)
        # Наш Node.js шлет s16le, так что это идеальное совпадение
        audio_int16 = np.frombuffer(audio_bytes, dtype=np.int16)

        # 2. Переводим в Float32 (диапазон от -1.0 до 1.0) - формат для нейронки
        audio_float = audio_int16.astype(np.float32) / 32768.0

        # 3. Нормализация (подтягиваем громкость)
        if np.max(np.abs(audio_float)) > 0:
            audio_float = audio_float / np.max(np.abs(audio_float))

        # 4. Обрезка тишины (убираем хвосты)
        audio_input, _ = librosa.effects.trim(audio_float, top_db=30)

        # Проверка длины (нужно хотя бы полсекунды звука)
        if len(audio_input) < 8000:
            return {"status": "error", "message": "Too short audio"}

        # Обработка моделью
        inputs = feature_extractor(audio_input, sampling_rate=16000, return_tensors="pt", padding=True)
        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            logits = model(**inputs).logits
        
        probs = torch.nn.functional.softmax(logits, dim=-1)[0]
        labels = model.config.id2label

        # Применяем наши коэффициенты чувствительности (из прошлого шага)
        adjusted_results = {}
        for i, label in labels.items():
            multiplier = SENSITIVITY.get(label, 1.0)
            adjusted_results[label] = float(probs[i]) * multiplier

        total = sum(adjusted_results.values())
        final_scores = {k: round(v / total, 4) for k, v in adjusted_results.items()}
        
        top_emotion = max(final_scores, key=final_scores.get)

        return {
            "status": "success",
            "top_emotion": top_emotion,
            "confidence": final_scores[top_emotion],
            "scores": final_scores
        }
    except Exception as e:
        print(f"[Python Error]: {e}")
        return {"status": "error", "message": str(e)}

@app.websocket("/ws/analyze")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("[Python] Соединение активно")
    try:
        while True:
            # Ждем бинарные данные от Node.js
            data = await websocket.receive_bytes()
            if not data:
                continue
                
            prediction = predict_emotion(data)
            await websocket.send_json(prediction)
    except Exception as e:
        print(f"[Python] Соединение закрыто: {e}")
    finally:
        await websocket.close()

@app.post("/analyze")
async def analyze_http(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    return predict_emotion(audio_bytes)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=3010)