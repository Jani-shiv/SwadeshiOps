#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu jammy stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin git make

sudo usermod -aG docker azureuser

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

cd /home/azureuser
sudo -u azureuser git clone https://github.com/swadeshiops/swadeshiops.git
cd swadeshiops
sudo -u azureuser cp .env.example .env
sed -i "s/port: 5173,/port: 5173, host: '0.0.0.0',/" web/vite.config.ts

sudo docker compose up -d

cd web
sudo -u azureuser npm install
sudo -u azureuser nohup npm run dev > frontend.log 2>&1 &
