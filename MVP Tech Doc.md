# Collaborative Drawing Game — MVP Technical Document

## 1. MVP Goal

The goal of the MVP (Minimum Viable Product) is to build a **simple two-player collaborative drawing game** where:

* One player creates a room
* Another player joins the room
* Both players draw on the same canvas in real time
* The final drawing can be downloaded

The MVP intentionally **avoids complex systems** such as:

* User authentication
* Databases
* Persistent storage

Rooms exist **only in server memory** and disappear when the server restarts.

---

# 2. MVP Scope

## Included Features

1. Room creation
2. Room joining via link
3. Maximum two players per room
4. Real-time drawing synchronization
5. Canvas download as image
6. Basic drawing tools

## Excluded Features (Not MVP)

These features are intentionally excluded to keep development fast:

* Login system
* User profiles
* Chat system
* Drawing history storage
* Spectator mode
* Game scoring
* Prompt generator

---

# 3. Tech Stack

## Frontend

Framework:

* Next.js

Libraries:

* React
* HTML5 Canvas API

Responsibilities:

* Drawing UI
* Capturing user input
* WebSocket communication
* Rendering remote drawing updates
* Downloading canvas image

---

## Backend

Framework:

* FastAPI

Language:

* Python

Responsibilities:

* WebSocket connections
* Room management
* Broadcasting drawing events
* Connection handling

---

# 4. Architecture Overview

```
Browser (Next.js)
   │
   │ WebSocket
   │
   ▼
FastAPI Server
   │
   │
In-Memory Room Storage
```

All drawing synchronization happens through **WebSocket communication**.

---

# 5. Room System

## Room Creation

When a user clicks **Create Room**, the frontend generates a random room ID.

Example:

```
/room/x8a92b
```

The room is considered active once the first WebSocket connection is established.

---

## Room Joining

Player 2 opens the same room URL and connects to the same WebSocket endpoint.

Example WebSocket URL:

```
ws://server/ws/x8a92b
```

If the room already contains **two players**, the server rejects the connection.

---

# 6. In-Memory Data Structure

Rooms are stored in a Python dictionary.

Example:

```
rooms = {
  "x8a92b": [player1_socket, player2_socket]
}
```

Responsibilities:

* Track player connections
* Limit room size
* Broadcast events
* Remove disconnected sockets

---

# 7. WebSocket Communication

WebSockets enable **real-time drawing synchronization**.

## Connection

Client connects to:

```
/ws/{room_id}
```

Example:

```
ws://server/ws/x8a92b
```

---

## Message Format

All messages are JSON.

Example drawing event:

```
{
  "type": "draw",
  "x": 150,
  "y": 220,
  "color": "#000000",
  "size": 4
}
```

---

## Event Flow

```
Player draws
      ↓
Frontend sends coordinates
      ↓
FastAPI WebSocket receives data
      ↓
Server broadcasts message
      ↓
Other player receives event
      ↓
Canvas updates
```

---

# 8. Canvas Drawing

The frontend uses the **HTML5 Canvas API**.

Responsibilities:

* Track mouse movement
* Draw strokes locally
* Send coordinates to server
* Render remote strokes

Events captured:

* mouse down
* mouse move
* mouse up

These determine when drawing starts and stops.

---

# 9. Download Drawing Feature

Users can download the final canvas as a PNG file.

Implementation uses:

```
canvas.toDataURL("image/png")
```

Download flow:

```
User clicks Download
        ↓
Canvas converted to image
        ↓
Browser downloads file
```

---

# 10. Player Limits

Each room supports **maximum 2 players**.

Server logic:

```
if len(room_players) >= 2:
    reject_connection
```

This prevents additional users from joining.

---

# 11. Disconnect Handling

The backend must handle WebSocket disconnections.

Possible causes:

* browser closed
* page refresh
* internet connection lost

Server responsibilities:

1. Remove socket from room
2. Delete empty rooms
3. Allow new players to join

Example cleanup logic:

```
if room has 0 players:
    delete room
```

---

# 12. Error Handling

Basic error handling should include:

Room full

```
Room already contains two players
```

Invalid room

```
Room does not exist
```

Connection failure

```
WebSocket connection lost
```

Frontend should show simple messages to users.

---

# 13. Folder Structure

Example project layout:

```
project

frontend/
  nextjs-app
    pages/
    components/
      CanvasBoard
      RoomControls

backend/
  main.py
  websocket_routes.py
  room_manager.py
```

---

# 14. Development Workflow

### Step 1

Build basic **canvas drawing locally** in Next.js.

### Step 2

Implement **WebSocket connection** to FastAPI.

### Step 3

Send drawing events to server.

### Step 4

Broadcast events to other player.

### Step 5

Render incoming strokes on canvas.

### Step 6

Add room creation and joining.

### Step 7

Add canvas download feature.

---

# 15. Deployment Plan

Frontend:

Deploy Next.js application.

Backend:

Deploy FastAPI server with WebSocket support.

Required configuration:

* Public backend URL
* WebSocket endpoint
* CORS configuration

Example flow:

```
User opens site
      ↓
Creates room
      ↓
Shares link
      ↓
Second player joins
      ↓
Both draw together
      ↓
Download drawing
```

---

# 16. MVP Limitations

Because the MVP prioritizes simplicity:

* Rooms are temporary
* Drawings are not saved
* Server restart removes all rooms
* No player identity
* No moderation

These trade-offs reduce development complexity.

---

# 17. Success Criteria

The MVP is successful if:

1. Two players can join the same room
2. Both see drawing updates in real time
3. Drawing feels responsive
4. The final image can be downloaded
5. The system works without authentication or databases
