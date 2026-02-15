#!/bin/bash

PROJECT_DIR="$HOME/store"
PID_FILE="$PROJECT_DIR/app.pid"
DESKTOP_FILE="$HOME/.local/share/applications/store.desktop"
PORT=5000
URL="http://localhost:$PORT"

# ---------------------------
# STOP MODE
# ---------------------------
if [ -f "$PID_FILE" ]; then
    kill $(cat "$PID_FILE") 2>/dev/null
    rm "$PID_FILE"

    sed -i "s|Icon=.*|Icon=media-playback-start|" "$DESKTOP_FILE"

    notify-send "Store Stopped"
    exit 0
fi

# ---------------------------
# START MODE
# ---------------------------

cd "$PROJECT_DIR/backend"

echo "Starting backend..."

node server.js > "$PROJECT_DIR/backend.log" 2>&1 &
echo $! > "$PID_FILE"

# Wait until backend ready (max 40 seconds)
echo "Waiting for backend to be ready..."

for i in {1..40}; do
    if curl -s "$URL" > /dev/null; then
        echo "Backend ready!"
        break
    fi
    sleep 1
done

# Check if backend actually started
if ! curl -s "$URL" > /dev/null; then
    notify-send "Store Failed to Start"
    echo "Backend did not respond. Check backend.log"
    exit 1
fi

# Change icon to STOP
sed -i "s|Icon=.*|Icon=media-playback-stop|" "$DESKTOP_FILE"

# Force browser open
xdg-open "$URL" >/dev/null 2>&1 &

notify-send "Store Started Successfully"
