import certifi
import ssl
import whisper
import sys
import json

# Установка правильного SSL-контекста
ssl_context = ssl.create_default_context(cafile=certifi.where())
ssl._create_default_https_context = lambda: ssl_context

model = whisper.load_model("base")
print("Model loaded successfully.")

# Получите путь к файлу из аргументов командной строки
file_path = sys.argv[1]

# Выполните распознавание
result = model.transcribe(file_path)
json_output = file_path.replace('.wav', '.json')

# Сохраните результат в JSON файл
with open(json_output, 'w') as f:
    json.dump(result, f)

print("Transcription completed and saved as JSON.")