#!/bin/bash

# Назва процесу (може змінюватись залежно від команди запуску сервера)
PROCESS_NAME="java"  # Minecraft сервер зазвичай запускається через Java

# Шукаємо процес із вказаним ім'ям і ключовими словами "fabric-server"
PROCESS_CHECK=$(ps aux | grep -v grep | grep "$PROCESS_NAME" | grep "fabric-server")

# Перевіряємо, чи знайдений процес
if [ -n "$PROCESS_CHECK" ]; then
    echo "Minecraft Fabric сервер запущений."
else
    echo "Minecraft Fabric сервер не запущений."
fi
