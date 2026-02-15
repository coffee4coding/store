# #!/bin/bash

# PROJECT_DIR="$HOME/store-platform"
# PID_FILE="$PROJECT_DIR/app.pid"
# LOCK_FILE="$PROJECT_DIR/.lock"
# DESKTOP_FILE="$HOME/.local/share/applications/store-platform.desktop"

# # Prevent double click spam
# if [ -f "$LOCK_FILE" ]; then
#     exit 0
# fi
# touch "$LOCK_FILE"

# # If running → STOP
# if [ -f "$PID_FILE" ]; then
#     kill $(cat "$PID_FILE") 2>/dev/null
#     rm "$PID_FILE"

#     # Stop cluster (optional but cleaner)
#     k3d cluster stop store-platform > /dev/null 2>&1

#     # Change icon back to START
#     sed -i "s|Icon=.*|Icon=media-playback-start|" "$DESKTOP_FILE"

#     notify-send "Store Platform Stopped"

#     rm "$LOCK_FILE"
#     exit 0
# fi

# # START MODE

# # Ensure Docker running
# systemctl --user start docker 2>/dev/null || true

# # Start cluster (if stopped)
# k3d cluster start store-platform > /dev/null 2>&1 || true

# # Start backend
# cd "$PROJECT_DIR/backend"
# node server.js > "$PROJECT_DIR/backend.log" 2>&1 &
# echo $! > "$PID_FILE"

# # Wait until backend ready
# until curl -s http://localhost:5000 > /dev/null; do
#     sleep 1
# done

# # Change icon to STOP
# sed -i "s|Icon=.*|Icon=media-playback-stop|" "$DESKTOP_FILE"

# # Open browser like real app
# xdg-open http://localhost:5000

# notify-send "Store Platform Started"

# rm "$LOCK_FILE"

#!/bin/bash

PROJECT_DIR="$HOME/store-platform"
PID_FILE="$PROJECT_DIR/app.pid"
DESKTOP_FILE="$HOME/.local/share/applications/store-platform.desktop"

# If already running → STOP
if [ -f "$PID_FILE" ]; then
    kill $(cat "$PID_FILE") 2>/dev/null
    rm "$PID_FILE"

    # Change icon back to START
    sed -i "s|Icon=.*|Icon=media-playback-start|" "$DESKTOP_FILE"

    notify-send "Store Platform Stopped"
    exit 0
fi

# START MODE

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

notify-send "Store Platform Started"
