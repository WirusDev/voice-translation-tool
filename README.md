# Voice Translation Tool

## Description

This project is a bot for translating voice messages from WhatsApp to Russian. The bot accepts audio files, recognizes the text, and translates it into Russian using the DeepL API. This project is created to help my Ukrainian friends translate voice messages into Russian.

## Requirements

- Node.js
- npm
- Python 3
- pip
- ffmpeg

## Installation and Setup

Follow these steps to install and run the project on your Ubuntu server.

### 1. Clone the Repository

Clone the project repository to your server:

```sh
git clone https://github.com/yourusername/voice-translation-tool.git
cd voice-translation-tool
```

### 2. Install Node.js and npm

Install Node.js and npm if they are not already installed:

```sh
sudo apt update
sudo apt install nodejs npm
```

### 3. Install ffmpeg

Install ffmpeg for audio file conversion:

```sh
sudo apt install ffmpeg
```

### 4. Install Python and pip

Install Python and pip if they are not already installed:

```sh
sudo apt install python3 python3-pip
```

### 5. Install Python Dependencies

Install the required Python dependencies, including Whisper:

```sh
pip3 install torch
pip3 install git+https://github.com/openai/whisper.git
```

### 6. Install Node.js Dependencies

Navigate to the project directory and install the Node.js dependencies:

```sh
npm install
```

### 7. Configure Environment Variables

Create a `.env` file in the project root directory and add your API keys:

```sh
nano .env
```

Add the following lines, replacing with your keys:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
DEEPL_API_KEY=your_deepl_api_key
```

### 8. Run the Bot

Run the bot using npx:

```sh
npx ts-node index.ts
```

### 9. Keep the Bot Running

To keep the bot running after closing the terminal, use `pm2`:

```sh
sudo npm install -g pm2
pm2 start index.ts --interpreter ts-node
pm2 save
pm2 startup
```

## .gitignore File

Add the following lines to the `.gitignore` file to exclude temporary files and other unnecessary files from the repository:

```gitignore
# Ignore temp folder contents
/temp/

# Ignore Node.js dependencies
node_modules/

# Ignore Python cache
__pycache__/
*.py[cod]

# Ignore environment configuration files
.env

# Ignore logs
logs/
*.log

# Ignore OS files
.DS_Store
Thumbs.db
```

## Conclusion

Your bot is now set up and ready to use. It will accept audio files, recognize the text, and translate it into Russian, helping your Ukrainian friends.

If you have any questions or issues, please refer to the documentation or create an issue in the project repository on GitHub.
