# 🛡️ Home Media Server (VPN Secured)

This repository contains the configuration for a fully automated, VPN-secured media center. It uses the **Servarr** suite to find, download, and organize movies and TV shows.

---

## 🏗️ Global Architecture

The setup follows the **"Sidecar VPN"** design. All traffic-sensitive containers (Downloaders and Managers) are routed through a single VPN tunnel.

### 🧩 Services Breakdown

| Service | Role | Network |
| :--- | :--- | :--- |
| **Gluetun (VPN)** | The Gateway. Establishes the encrypted tunnel. | Direct (Exposes ports) |
| **Transmission** | The Downloader. Handles P2P traffic. | Routed via VPN |
| **Prowlarr** | The Indexer Manager. Connects to torrent sites. | Routed via VPN |
| **Radarr** | Movie Manager. Searches and organizes movies. | Routed via VPN |
| **Sonarr** | TV Show Manager. Searches and organizes series. | Routed via VPN |
| **Jellyfin** | The Media Player. Streams your library. | Local / Direct |

---

## 📂 Folder Structure & Hardlinks

To avoid double disk usage and ensure instant file moves, we use a **Single Root Dataset** (`/data`).

```text
data/
├── torrents/       # In-progress and seeding files
│   ├── movies/
│   └── tv/
└── media/          # Organized library (Jellyfin source)
    ├── movies/
    └── tv/
docker-config/      # Persistence for app settings
    ├── vpn/
    ├── transmission/
    ├── radarr/
    ├── sonarr/
    └── prowlarr/

**Pro-Tip**: By mounting ./data:/data in every container, Radarr/Sonarr can perform Hardlinks. 
This means a file exists in both torrents/ and media/ simultaneously without taking extra space.

## 🚀 Getting Started

### 1. Create the directories
Run these commands in your terminal to prepare the environment:
```
mkdir -p data/torrents/{movies,tv}
mkdir -p data/media/{movies,tv}
mkdir -p docker-config/{vpn,transmission,radarr,sonarr,prowlarr}
````

###2. Add your VPN Config
Place your ClearVPN (or other) .ovpn file inside docker-config/vpn/ and rename it to client.conf.

###3. DeployLaunch the stack:
```
docker compose up -d
```
