import certifi
import ssl
import whisper
import sys

# Установка правильного SSL-контекста
ssl_context = ssl.create_default_context(cafile=certifi.where())
ssl._create_default_https_context = lambda: ssl_context

model = whisper.load_model("base")
print("Model loaded successfully.")

# Получите путь к файлу из аргументов командной строки
file_path = sys.argv[1]

# Выполните распознавание
result = model.transcribe(file_path)
text_output = file_path.replace('.wav', '.txt')

# Сохраните результат в текстовый файл
with open(text_output, 'w') as f:
    f.write(result['text'])

print("Transcription completed and saved.")