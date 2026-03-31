#!/bin/bash

echo "Pulling repo"
git pull
echo "Building new image"
docker compose build hub

echo "Starting new image"
docker compose up -d hub
