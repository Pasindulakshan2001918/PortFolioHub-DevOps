# Dockerized PortfolioHub (MERN)

This repository contains a dockerized MERN stack composed of:
- backend: Express + MongoDB
- frontend: React (Vite) built and served by Nginx
- mongo: official MongoDB image

What's changed:
- Frontend Dockerfile is now a multi-stage build (Node builder + Nginx server).
- `docker-compose.yml` updated to serve frontend on port 80 and pass VITE_API_URL as build arg.
- `.dockerignore` files added to backend and frontend.
- `nginx.conf` added to frontend to enable SPA routing and proxy /api to backend.

How to run (Windows PowerShell):

# Build and start containers
docker-compose up --build

# Run in detached mode
docker-compose up --build -d

# Stop and remove containers
docker-compose down

Notes:
- The frontend build uses the build-arg VITE_API_URL (set in docker-compose) so the built app will use http://backend:5000 when running in Docker.
- Backend uses environment variables from `backend/.env` or docker-compose environment.
- If you want to develop locally (fast refresh), you can run the frontend with `npm run dev` on your host and the backend with `npm run dev`.
