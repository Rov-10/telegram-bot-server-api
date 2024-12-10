#!/usr/bin/env bash

# Path to the server directory
SERVER_DIR="$HOME/minecraft-server/server"

# Check if the server is already running
if pgrep -f "fabric-server-launch.jar" > /dev/null; then
    echo "Minecraft server is already running."
    exit 0
fi

# Change directory to the Minecraft server folder
cd "$SERVER_DIR" || {
    echo "Failed to change directory to $SERVER_DIR."
    exit 1
}

# Start the Minecraft server
if java -Xmx4G -jar fabric-server-launch.jar nogui; then
    echo "Minecraft server started successfully."
else
    echo "Failed to start the Minecraft server."
    exit 1
fi
