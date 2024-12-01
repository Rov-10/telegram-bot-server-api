#!/usr/bin/env fish

# Check if ngrok process is running
function check_ngrok_running
    set ngrok_processes (pgrep -x ngrok)
    if test -z "$ngrok_processes"
        echo "Ngrok is not running."
        echo "Ngrok is not running." > NgrokTCPLink.txt
        return 1
    end
    return 0
end

# Extract the TCP link from ngrok API
function get_ngrok_tcp_link
    # Default ngrok API address
    set ngrok_api_url "http://127.0.0.1:4040/api/tunnels"

    # Fetch the API data
    set tunnels_json (curl -s "$ngrok_api_url")

    # Extract TCP link
    set tcp_link (echo $tunnels_json | jq -r '.tunnels[] | select(.proto == "tcp") | .public_url')

    if test -z "$tcp_link"
        echo "No TCP tunnel found."
        return 1
    end

    echo "Ngrok TCP Link: $tcp_link"
    echo $tcp_link > NgrokTCPLink.txt
end

# Main function
function main
    if check_ngrok_running
        get_ngrok_tcp_link
    end
end

# Run the main function
main
