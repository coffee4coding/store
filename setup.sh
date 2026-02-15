#!/bin/bash

PROJECT_DIR="$HOME/store"

echo "Installing dependencies..."

sudo apt update
sudo apt install -y curl git docker.io nodejs npm

# Add user to docker group (no password needed after relogin)
sudo usermod -aG docker $USER

# Install k3d
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

echo "Creating Kubernetes cluster..."
k3d cluster create store --agents 2 -p "80:80@loadbalancer"

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

chmod +x start.sh

echo "Creating Desktop Launcher..."

mkdir -p ~/.local/share/applications

cat <<EOF > ~/.local/share/applications/store.desktop
[Desktop Entry]
Version=1.0
Name=Store
Comment=Start or Stop Store
Exec=$PROJECT_DIR/start.sh
Icon=media-playback-start
Terminal=false
Type=Application
Categories=Development;
EOF

chmod +x ~/.local/share/applications/store.desktop

cp ~/.local/share/applications/store.desktop ~/Desktop/
chmod +x ~/Desktop/store.desktop

echo ""
echo "Setup Complete!"
echo "Please logout and login again for Docker permissions."
echo "After that, click the Store icon on Desktop."
