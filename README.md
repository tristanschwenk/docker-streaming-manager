# 🛡️ Home Media Server (VPN Secured)

This repository contains the configuration for a fully automated, VPN-secured media center. It uses the **Servarr** suite to find, download, and organize movies and TV shows.

---

## 🏗️ Global Architecture

The setup follows the **"Sidecar VPN"** design. All traffic-sensitive containers (Downloaders and Managers) are routed through a single VPN tunnel.

### 🧩 Services Breakdown

| Service           | Role                                            | Network                |
| :---------------- | :---------------------------------------------- | :--------------------- |
| **Gluetun (VPN)** | The Gateway. Establishes the encrypted tunnel.  | Direct (Exposes ports) |
| **Transmission**  | The Downloader. Handles P2P traffic.            | Routed via VPN         |
| **Prowlarr**      | The Indexer Manager. Connects to torrent sites. | Routed via VPN         |
| **Radarr**        | Movie Manager. Searches and organizes movies.   | Routed via VPN         |
| **Sonarr**        | TV Show Manager. Searches and organizes series. | Routed via VPN         |
| **Jellyfin**      | The Media Player. Streams your library.         | Local / Direct         |

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
```

**Pro-Tip**: By mounting ./data:/data in every container, Radarr/Sonarr can perform Hardlinks.
This means a file exists in both torrents/ and media/ simultaneously without taking extra space.

## 🚀 Getting Started

### 1. Create the directories

Run these commands in your terminal to prepare the environment:

```
mkdir -p data/torrents/{movies,tv}
mkdir -p data/media/{movies,tv}
mkdir -p docker-config/{vpn,transmission,radarr,sonarr,prowlarr}
```

### 2. Add your VPN Config

Place your ClearVPN (or other) .ovpn file inside docker-config/vpn/ and rename it to client.conf.

### 3. Deploy

Launch the stack:

```
docker compose up -d
```

## 📡 Access & Ports

All management interfaces are accessible via your server's local IP (e.g., 192.168.1.50).

| Service          | URL              | Note                                    |
| ---------------- | ---------------- | --------------------------------------- |
| **Transmission** | http://<IP>:9091 | Change "Download to" to /data/torrents  |
| **Prowlarr**     | http://<IP>:9696 | Add Indexers here first                 |
| **Radarr**       | http://<IP>:7878 | Link to Transmission via localhost:9091 |
| **Sonarr**       | http://<IP>:8989 | Link to Transmission via localhost:9091 |
| **Jellyfin**     | http://<IP>:8096 | Point libraries to /data/media          |
| **Jellystat**    | http://<IP>:3001 | Get stats about your media              |
| **Overseerr**    | http://<IP>:5055 | Request media from the managers         |

## 🔧 Internal Communication

Because most services use network_mode: "container:vpn", they share the same network stack. When linking them together in their web interfaces:

- **Host**: Use localhost (not the server IP).
- **Port**: Use the standard port (e.g., 9091 for Transmission).

## 🛡️ Killswitch Check

To ensure your traffic is actually hidden, run:

```
docker exec transmission curl https://ifconfig.me
```

_The result should be your VPN's IP address, not your home ISP's IP._
