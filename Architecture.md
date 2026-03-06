# Collaborative Drawing Game — Architecture

## 1. Overview

This project is a **two-player collaborative drawing web game** where players can join the same room and draw together on a shared canvas. The goal is to create a fun and simple experience where users can draw together and download the final artwork.

Key constraints:

* No login system
* No database
* Maximum **2 players per room**
* Rooms exist **temporarily in server memory**
* Real-time drawing synchronization
* Ability to **download the final drawing**

---

# 2. Tech Stack

## Frontend

* **Next.js**
* **React**
* **HTML5 Canvas API**
* WebSocket client

## Backend

* **FastAPI**
* **Python**
* **WebSockets**

## Hosting (Example)

Frontend:

* Vercel

Backend:

* Railway / Render / VPS

---

# 3. System Architecture

```
             ┌─────────────────────┐
             │       Browser        │
             │  Next.js Frontend    │
             │  Canvas Drawing UI   │
             └──────────┬──────────┘
                        │
                        │ WebSocket
                        │
                        ▼
             ┌─────────────────────┐
             │      FastAPI         │
             │  WebSocket Server    │
             │  Room Manager        │
             └──────────┬──────────┘
                        │
                        │
                In-Memory Storage
                  (Python Dict)
```

Important:
Since there is **no database**, all room data is stored temporarily in memory.

If the server restarts, all rooms are lost.

---

# 4. Room System

Rooms allow exactly **two players** to join and draw together.

### Room Creation

Player 1 creates a room.

Server generates a random room ID.

Example:

```
/room/ab32cd
```

### Room Joining

Player 2 opens the same room link and connects via WebSocket.

If the room already has 2 players, the connection is rejected.

---

# 5. In-Memory Room Storage

Rooms are stored inside the backend using a Python dictionary.

Example structure:

```
rooms = {
  "room123": [
      websocket_player_1,
      websocket_player_2
  ]
}
```

Responsibilities:

* Track players in each room
* Broadcast drawing events
* Remove disconnected players

---

# 6. WebSocket Communication

WebSockets allow real-time communication between the frontend and backend.

Connection URL example:

```
ws://server/ws/{room_id}
```

Example:

```
ws://server/ws/ab32cd
```

### Event Types

Drawing events are sent as JSON.

Example message:

```
{
  "type": "draw",
  "x": 120,
  "y": 300
}
```

Flow:

```
Player 1 draws
      ↓
send coordinates
      ↓
FastAPI WebSocket server
      ↓
broadcast to other player
      ↓
Player 2 canvas updates
```

---

# 7. Canvas Drawing System

The frontend uses the **HTML5 Canvas API**.

Responsibilities:

* Capture mouse/touch movement
* Send drawing coordinates to server
* Render incoming drawing data

Drawing data includes:

* x coordinate
* y coordinate
* brush color
* brush size

---

# 8. Download Drawing Feature

Players can export the canvas as an image.

Implementation uses the browser's canvas API:

```
canvas.toDataURL()
```

This generates a PNG image that can be downloaded.

---

# 9. Player Limits

Each room only allows **two players**.

Connection logic:

```
if room_size >= 2:
    reject_connection
```

If a player disconnects:

* Remove them from the room
* Allow another player to join

---

# 10. Handling Disconnections

Possible scenarios:

Player closes browser
Player loses internet
Player refreshes page

The server must:

1. Detect WebSocket disconnect
2. Remove player from room
3. Clean empty rooms

Example cleanup:

```
if room becomes empty:
    delete room
```

---

# 11. Security Considerations

Because there is no authentication:

* Room IDs should be **random**
* Limit room size
* Validate incoming drawing data

This prevents basic abuse or crashes.

---

# 12. Future Improvements

Potential features to improve gameplay:

* Drawing prompts
* Timer challenges
* Guess-the-drawing mode
* Color palette
* Brush size controls
* Spectator mode

---

# 13. Project Folder Structure

```
project

frontend/
  nextjs-app
    pages/
    components/
    canvas/

backend/
  main.py
  websocket_handler.py
```

---

# 14. Deployment Flow

1. Deploy backend FastAPI server
2. Deploy Next.js frontend
3. Configure WebSocket endpoint URL
4. Share room links

Example flow:

```
User opens website
        ↓
Creates room
        ↓
Shares link
        ↓
Second player joins
        ↓
Both draw together
        ↓
Download final drawing
```

---

# 15. Key Limitations

Because the project intentionally avoids databases and login systems:

* Rooms are temporary
* No saved drawings
* Server restart deletes everything
* No user identity tracking

This design keeps the project **simple and lightweight**.
