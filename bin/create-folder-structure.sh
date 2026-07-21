#!/bin/bash
mkdir -p data/torrents/{movies,tv}
mkdir -p data/media/{movies,tv}
mkdir -p docker-config/{vpn,transmission,radarr,sonarr,prowlarr,jellyfin,postgres,seerr}

# Run python app configuration script
python3 "$(dirname "$0")/configure-apps.py"

