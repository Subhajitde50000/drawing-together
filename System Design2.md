# Hide-and-Seek Multiplayer Game – System Design

## 1. High-Level Components

### 1.1 Frontend (Next.js)

* **Canvas / Phaser Renderer:** Draw map tiles and players
* **Input Handler:** Capture keyboard/mouse movement and actions
* **WebSocket Client:** Send and receive game state updates
* **UI Components:** Lobby, player list, timers, scoreboards

### 1.2 Backend (Python)

* **WebSocket Server (FastAPI + uvicorn):** Accepts connections, broadcasts updates
* **Game Manager:** Handles rooms, player roles, and game logic
* **Physics & Collision Module:** Checks player positions and captures
* **Timer / Tick Loop:** Updates game state on fixed intervals (20 TPS)
* **Persistence (Optional):** Store player stats, high scores

### 1.3 Database (Optional)

* **Player Profiles & Stats:** PostgreSQL / MongoDB
* **Maps Storage:** JSON files or DB

---

## 2. System Flow

### 2.1 Player Connection & Lobby

1. Player opens browser → WebSocket connects to backend
2. Backend generates `player_id` and assigns to room
3. Lobby displays waiting players
4. Once enough players join, server starts game

### 2.2 Role Assignment & Game Start

* Randomly select one player as **Police**
* Others become **Thieves**
* Start hide timer (e.g., 30 seconds)

### 2.3 Game Loop / Tick System

* Runs on server at fixed interval (20 TPS)
* Updates positions, collision checks, and captures
* Broadcasts updated player states to all clients
* Frontend interpolates positions at ~60 FPS for smooth visuals

### 2.4 Capture Logic

* Distance-based check between players
* If Police collides with Thief → Thief becomes spectator
* If Thief collides with Police → Thief wins, Police loses

### 2.5 Win Condition

* **Police wins:** catches all thieves
* **Thieves win:** catch police or survive until time runs out
* Update roles for next round accordingly

---

## 3. Data Models

### 3.1 Player

```json
{
  "id": "uuid",
  "name": "player_name",
  "x": 0,
  "y": 0,
  "role": "police|thief",
  "alive": true
}
```

### 3.2 Room

```json
{
  "room_id": "uuid",
  "players": [player],
  "police_id": "uuid",
  "thieves_ids": ["uuid", ...],
  "timer": 30,
  "state": "waiting|hiding|active|finished"
}
```

### 3.3 Map

* 2D array of tiles:

  * `0` = floor
  * `1` = wall
  * `2` = obstacle
* Loaded from JSON exported from Tiled

---

## 4. Module Design

### 4.1 Frontend Modules

* **Renderer:** Draw map and players
* **Input Module:** Track player keys / movement
* **Network Module:** WebSocket send/receive
* **UI Module:** Timer, lobby, role info

### 4.2 Backend Modules

* **Room Manager:** Handles rooms and player lists
* **Role Assigner:** Randomly selects police/thieves
* **Game Loop:** Server tick system (update physics, collisions, timers)
* **Collision Manager:** Check capture events
* **Broadcast Manager:** Sends updated state to all clients

---

## 5. Communication Flow

**Client → Server:**

* Player movement `{id, x, y}`
* Player actions (if implemented, e.g., throw smoke)

**Server → Client:**

* Game state `{players, roles, timers}`
* Capture notifications
* Win/loss results

WebSocket ensures **low-latency, bidirectional communication** for real-time multiplayer.

---

## 6. Tick System

* **Server Tick Rate:** 20 TPS (every 50ms)
* **Frontend Render Rate:** 60 FPS (interpolated positions)
* **Tasks per Tick:**

  1. Update player positions
  2. Detect collisions
  3. Check win/loss
  4. Broadcast updated state

---

## 7. Security Considerations

* Validate all client movement on server to prevent cheating
* Roles and capture logic handled **only on server**
* Limit map boundaries to prevent leaving playable area
* Optional: Anti-cheat measures for speed hacks or teleporting

---

## 8. Scalability & Future Enhancements

* Multiple rooms with unique maps
* More players (increase server tick handling efficiency)
* Power-ups or abilities for police/thieves
* Persistent player stats and leaderboards
* Map rotation / procedural map generation
