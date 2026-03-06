# Collaborative Drawing Game — System Design Document

---

# 1. Introduction

This document describes the **system design** for a lightweight two-player collaborative drawing web application.

The system allows two users to:

* Create or join a drawing room
* Draw together on a shared canvas
* See drawing updates in real time
* Download the final drawing

The design intentionally avoids:

* User authentication
* Databases
* Persistent storage

All room data exists **temporarily in server memory**.

---

# 2. System Goals

### Primary Goals

* Enable **real-time collaborative drawing**
* Allow **two players per room**
* Provide **instant room creation**
* Allow users to **download the final drawing**

### Secondary Goals

* Minimal system complexity
* Fast connection setup
* Lightweight backend

---

# 3. High-Level Architecture

The system follows a **client-server architecture**.

Components:

* Frontend application
* WebSocket server
* In-memory room manager

```id="zkwdso"
              ┌───────────────────────────┐
              │         Client            │
              │       (Next.js App)       │
              │   Canvas + WebSocket      │
              └─────────────┬─────────────┘
                            │
                            │ WebSocket
                            │
                            ▼
              ┌───────────────────────────┐
              │       FastAPI Server      │
              │     WebSocket Endpoint    │
              │       Room Manager        │
              └─────────────┬─────────────┘
                            │
                            │
                     In-Memory Storage
                     (Python Dictionary)
```

---

# 4. System Components

## 4.1 Frontend (Next.js)

Responsibilities:

* Render drawing interface
* Handle user input
* Send drawing events
* Render incoming drawing updates
* Manage WebSocket connection
* Enable canvas download

Core technologies:

* Next.js
* React
* HTML5 Canvas API
* WebSocket client

---

## 4.2 Backend (FastAPI)

Responsibilities:

* Handle WebSocket connections
* Manage rooms
* Broadcast drawing events
* Handle player disconnections

The backend acts primarily as a **real-time message relay**.

---

## 4.3 Room Manager

The room manager controls:

* active rooms
* connected players
* room capacity
* player removal

Rooms are stored using an **in-memory dictionary**.

Example:

```id="pf3gfo"
rooms = {
  "room_id": [player1_socket, player2_socket]
}
```

---

# 5. Data Flow

## 5.1 Room Creation

Room creation occurs on the frontend.

Steps:

```id="xsm23x"
User clicks Create Room
        ↓
Frontend generates random room ID
        ↓
User navigates to /room/{room_id}
        ↓
WebSocket connection established
        ↓
Server registers room
```

---

## 5.2 Room Joining

Second player joins using the same room link.

Flow:

```id="0v42yd"
User opens shared link
        ↓
Frontend connects to WebSocket
        ↓
Server checks room capacity
        ↓
Connection accepted if < 2 players
```

If room capacity is full:

```id="ra6qyb"
Server rejects connection
```

---

# 6. WebSocket Design

WebSockets provide **low-latency communication** between players.

### Endpoint

```id="22hhyf"
/ws/{room_id}
```

Example:

```id="ysyz4d"
ws://server/ws/abc123
```

---

# 7. Message Format

All communication uses JSON messages.

Example drawing event:

```id="3n9ml7"
{
  "type": "draw",
  "x": 120,
  "y": 340,
  "color": "#000000",
  "size": 5
}
```

Fields:

| Field | Description     |
| ----- | --------------- |
| type  | event type      |
| x     | x coordinate    |
| y     | y coordinate    |
| color | brush color     |
| size  | brush thickness |

---

# 8. Drawing Synchronization

The server does not process drawing logic.

Instead it **forwards messages**.

Event flow:

```id="p80u2g"
Player 1 draws
        ↓
Frontend sends draw event
        ↓
FastAPI receives message
        ↓
Server broadcasts message
        ↓
Player 2 receives event
        ↓
Canvas updated
```

---

# 9. Canvas Rendering

Rendering happens entirely on the client.

Responsibilities:

* handle mouse movement
* draw strokes locally
* apply remote drawing updates

Canvas API handles:

* line drawing
* brush color
* stroke thickness

---

# 10. Download System

The drawing can be exported using the browser canvas API.

Process:

```id="v3hyl0"
User clicks Download
        ↓
Canvas converted to image
        ↓
PNG file generated
        ↓
Browser downloads file
```

Implementation method:

```id="kncgt6"
canvas.toDataURL("image/png")
```

---

# 11. Room Capacity Control

Rooms allow **maximum two players**.

Server validation:

```id="4v8yk3"
if len(room_players) >= 2:
    reject_connection
```

This ensures the room remains a **two-player session**.

---

# 12. Disconnect Handling

WebSocket connections can close due to:

* browser closing
* refresh
* network loss

Server handling:

```id="vo2r7u"
detect disconnect
remove socket from room
cleanup empty room
```

Example:

```id="ryj94r"
if room empty:
    delete room
```

---

# 13. Scalability

This architecture supports multiple rooms simultaneously.

Each room contains:

* up to 2 WebSocket connections
* minimal server memory usage

Scalability limits depend on:

* server memory
* WebSocket connection limits

Since rooms are temporary, resource usage remains low.

---

# 14. Performance Considerations

### Low Latency

WebSockets provide near real-time updates.

Target latency:

```
< 200 ms
```

### Lightweight Messages

Drawing events only send coordinates and brush data.

This keeps network traffic minimal.

---

# 15. Security Considerations

Because there is no authentication:

Potential risks include:

* room spam
* malicious messages
* random connection attempts

Mitigations:

* limit room size
* validate message format
* restrict payload size

Future improvements may include:

* rate limiting
* room expiration

---

# 16. Failure Scenarios

### Server Restart

Impact:

* all rooms disappear
* players disconnected

Reason:

Rooms stored only in memory.

---

### Network Disconnection

Impact:

* player removed from room
* other player remains

Possible mitigation:

* reconnection logic on client

---

# 17. Deployment Architecture

Typical deployment setup:

```id="9cxci6"
Internet
   │
   ▼
Frontend (Next.js)
   │
   │ WebSocket
   ▼
Backend (FastAPI Server)
```

Frontend hosting options:

* static hosting
* edge hosting

Backend hosting options:

* cloud VM
* container service

---

# 18. Future System Improvements

Possible enhancements:

* Redis for distributed room storage
* horizontal scaling
* drawing history replay
* room persistence
* multiplayer rooms (more than two players)

These features would require a **more complex backend architecture**.

---

# 19. Summary

This system is designed to be:

* simple
* lightweight
* real-time
* easy to deploy

By avoiding authentication and databases, the architecture focuses purely on **real-time collaborative drawing between two users** while keeping development and infrastructure complexity minimal.
