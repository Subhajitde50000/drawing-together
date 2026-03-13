# Hide-and-Seek Multiplayer Game Architecture

## Overview

This document outlines the architecture for a multiplayer hide-and-seek style web game using **Next.js frontend** and **Python backend**. The game supports 2–6 players, where one player is randomly assigned as police and the others as thieves. Players can move on a 2D tile-based map, hide, and capture each other.

---

## 1. System Architecture

```
Player Browser (Next.js)
        |
    WebSocket Connection
        |
Python Backend (FastAPI + WebSockets)
        |
Game Logic + Player State Management
```

### Frontend Responsibilities (Next.js)

* Render the 2D map and players
* Handle player input (movement, actions)
* Maintain local player state
* Connect to server via WebSockets
* Update game view every tick

### Backend Responsibilities (Python)

* Manage game rooms and player sessions
* Randomly assign roles (Police/Thief)
* Run game ticks (movement, collision, capture)
* Enforce rules and win conditions
* Broadcast state updates to all clients

---

## 2. Libraries / Dependencies

### Frontend (Next.js / React)

* **react** – UI framework
* **next** – React framework for routing and server-side rendering
* **canvas API** – for 2D rendering (native)
* Optional: **Phaser.js** – simplifies tilemaps, collisions, and animations
* Optional: **Socket.IO client** – easier WebSocket management

### Backend (Python)

* **fastapi** – web framework with async support
* **uvicorn** – ASGI server
* **asyncio** – for async game loop
* **uuid** – for unique player IDs
* Optional: **pydantic** – for message validation

---

## 3. Game Loop (Tick System)

**Server Tick (Python):** ~20 TPS (ticks per second)

* Update player positions
* Detect collisions and captures
* Check win conditions
* Broadcast game state to clients

**Client Render Tick (Next.js):** ~60 FPS

* Render map tiles
* Render all players
* Interpolate positions for smooth movement
* Handle input and send movement updates to server

---

## 4. Data Structures

### Player Object

```json
{
  "id": "uuid",
  "x": 0,
  "y": 0,
  "role": "police|thief",
  "alive": true
}
```

### Room Object

```json
{
  "room_id": "uuid",
  "players": [player],
  "police_id": "uuid",
  "thieves_ids": ["uuid", ...],
  "timer": 30
}
```

### Map

* 2D array of tiles:

  * `0 = floor`
  * `1 = wall`
  * `2 = obstacle`
* Can be exported/imported from **Tiled Map Editor**

---

## 5. Frontend Flow

1. Player connects → WebSocket established
2. Server assigns player ID
3. Player waits in lobby until game starts
4. Map and roles received from server
5. Player can move; updates sent to server
6. Game renders every frame based on server state

---

## 6. Backend Flow

1. Server accepts WebSocket connections
2. Server generates unique player IDs and stores in room
3. Randomly assigns roles (police/thief)
4. Runs game loop (tick system)
5. Detects collisions and captures
6. Updates player states
7. Broadcasts updated state to all connected clients

---

## 7. Collision Detection

* Distance-based check:

```python
distance = sqrt((x1 - x2)**2 + (y1 - y2)**2)
if distance < capture_threshold:
    handle_capture()
```

* Walls / obstacles prevent movement using tilemap lookup

---

## 8. Map Design Guidelines

* Tile-based (e.g., 32x32 px)
* Multiple hiding spots and obstacles
* Small pathways for strategic movement
* Size recommendation: 20x20 tiles for beginner maps

---

## 9. Notes / Recommendations

* Start with **single-player prototype** first
* Then implement multiplayer WebSockets
* Use **Tiled Map Editor** for easy map design
* Keep roles, timers, and collisions on the server to prevent cheating
* Interpolate player positions on the frontend for smooth movement
