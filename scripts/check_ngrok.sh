#!/bin/sh

# Function to check if ngrok is running
check_ngrok_running() {
    file="$HOME/minecraft-server/telegram-bot-server-api/NgrokTCPLink.txt"
    ngrok_processes=$(pgrep -x ngrok)
    if [ -z "$ngrok_processes" ]; then
        echo "Ngrok is not running." > "$file"
        return 1
    fi
    return 0
}

# Function to extract the TCP link from ngrok API
get_ngrok_tcp_link() {
    # Default ngrok API address
    ngrok_api_url="http://127.0.0.1:4040/api/tunnels"

    # Fetch the API data
    tunnels_json=$(curl -s "$ngrok_api_url")

    # Extract TCP link using jq
    tcp_link=$(echo "$tunnels_json" | jq -r '.tunnels[] | select(.proto == "tcp") | .public_url')

    if [ -z "$tcp_link" ]; then
        echo "No TCP tunnel found." > "$file"
        return 1
    fi
    echo "Ngrok TCP Link: $tcp_link" 
    echo "Ngrok TCP Link: $tcp_link" > "$file"
}

# Main function
main() {
    if check_ngrok_running; then
        get_ngrok_tcp_link
    fi
}

# Run the main function
main
