#!/bin/bash

PROJECT_DIR="$HOME/store"
PID_FILE="$PROJECT_DIR/app.pid"
DESKTOP_FILE="$HOME/.local/share/applications/store.desktop"

# If already running → STOP
if [ -f "$PID_FILE" ]; then
    kill $(cat "$PID_FILE") 2>/dev/null
    rm "$PID_FILE"

    # Change icon back to START
    sed -i "s|Icon=.*|Icon=media-playback-start|" "$DESKTOP_FILE"

    notify-send "Store Stopped"
    exit 0
fi

# --------------------
# START MODE
# --------------------

cd "$PROJECT_DIR/backend"

node server.js > "$PROJECT_DIR/backend.log" 2>&1 &
echo $! > "$PID_FILE"

# Wait until backend ready
until curl -s http://localhost:5000 > /dev/null; do
  sleep 1
done

# Change icon to STOP
sed -i "s|Icon=.*|Icon=media-playback-stop|" "$DESKTOP_FILE"

# Open browser
xdg-open http://localhost:5000

notify-send "Store Started"
