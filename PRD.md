# Collaborative Drawing Game — Product Requirements Document (PRD)

---

# 1. Product Overview

The product is a **lightweight two-player collaborative drawing web game** where users can create a room, invite a friend, and draw together on a shared canvas in real time.

The primary goal is to create **fun and entertaining moments** between two players by allowing them to draw together and save their final artwork.

The product intentionally keeps the experience **simple and frictionless**:

* No login required
* No account creation
* No database storage
* Instant room creation via shareable link

The entire experience should work within a few seconds of opening the website.

---

# 2. Product Vision

Create a **fast, playful, and zero-friction drawing experience** where two people can instantly start drawing together and share a funny moment.

Key principles:

* Instant access
* Minimal interface
* Real-time interaction
* Easy sharing
* Lightweight architecture

---

# 3. Target Users

### Primary Users

Friends who want to quickly draw something together.

Examples:

* Friends sharing funny sketches
* Couples doodling together
* Casual creative play

### Secondary Users

People who want a quick **shared whiteboard** for simple drawing or brainstorming.

---

# 4. User Problem

Current drawing tools usually require:

* account creation
* complex UI
* installation
* collaboration setup

This creates friction for users who simply want to **quickly draw something together**.

Users need:

* instant room creation
* simple interface
* real-time collaboration
* easy download of drawing

---

# 5. Product Goals

### Primary Goal

Enable **two users to draw together on the same canvas in real time**.

### Secondary Goals

* Keep the experience extremely simple
* Ensure fast connection between players
* Allow downloading the final drawing

---

# 6. Success Metrics

Key metrics for evaluating success:

### Functional Metrics

* Two users can successfully join the same room
* Drawing updates sync in real time
* Canvas download works

### User Experience Metrics

* Room creation time < 2 seconds
* Second player can join in < 5 seconds
* Drawing latency < 200ms

---

# 7. User Stories

### Room Creation

**As a user**,
I want to create a drawing room quickly,
so that I can invite a friend to draw together.

---

### Room Joining

**As a user**,
I want to join a shared drawing room via a link,
so that I can draw with another player.

---

### Real-Time Drawing

**As a user**,
I want to see the other player's drawing instantly,
so that we can collaborate naturally.

---

### Download Drawing

**As a user**,
I want to download the final drawing as an image,
so that I can keep or share it.

---

# 8. Core Features

## 1. Room Creation

Users can create a room instantly.

System generates:

* unique room ID
* shareable room link

Example:

```
/room/ab39df
```

---

## 2. Room Joining

Another user opens the room link and joins the session.

Room capacity:

* Maximum **2 players**

If the room is full, additional users are rejected.

---

## 3. Shared Drawing Canvas

Both players interact with the same drawing board.

Capabilities:

* draw lines
* see each other's strokes in real time
* smooth drawing experience

---

## 4. Download Drawing

Users can export the canvas as an image file.

Supported format:

* PNG

This allows users to save or share their drawing.

---

# 9. User Flow

### Flow 1 — Create Room

```
User opens website
      ↓
Clicks "Create Room"
      ↓
Room ID generated
      ↓
Room link shown
      ↓
User shares link
```

---

### Flow 2 — Join Room

```
Second user opens link
      ↓
User enters room
      ↓
WebSocket connection established
      ↓
Both players see shared canvas
```

---

### Flow 3 — Drawing Session

```
Player draws
      ↓
Coordinates sent to server
      ↓
Server broadcasts event
      ↓
Other player sees drawing
```

---

### Flow 4 — Download Drawing

```
User clicks Download
      ↓
Canvas converted to image
      ↓
File downloaded
```

---

# 10. Functional Requirements

### Room System

* Users must be able to create a room
* Users must be able to join a room via link
* Room must allow **only two players**

---

### Real-Time Drawing

* Drawing updates must be visible to both players
* Drawing latency should be minimal
* Canvas state should update smoothly

---

### Canvas Export

* Users must be able to download the drawing
* Downloaded image must match canvas content

---

# 11. Non-Functional Requirements

### Performance

* Real-time drawing latency under **200ms**

### Reliability

* WebSocket connections must reconnect gracefully

### Scalability

* System should support multiple rooms simultaneously

---

# 12. Constraints

The product intentionally avoids:

* login system
* user accounts
* database storage

This means:

* rooms are temporary
* drawings are not stored
* server restart removes active rooms

---

# 13. Risks

### Connection Stability

WebSocket disconnections could interrupt drawing sessions.

Mitigation:

* reconnect logic
* connection status indicators

---

### Room ID Collisions

Random IDs might theoretically collide.

Mitigation:

* sufficiently random room IDs

---

### Abuse

Without authentication, rooms could be spammed.

Mitigation (future):

* rate limiting
* room expiration

---

# 14. Future Features (Post-MVP)

Possible improvements:

* drawing prompts
* timer challenges
* guess-the-drawing mode
* brush colors
* brush sizes
* undo button
* spectator mode
* drawing replay
* mobile touch optimization

---

# 15. Release Criteria

The MVP is ready for release when:

1. Room creation works
2. Two players can join a room
3. Drawing sync works in real time
4. Canvas download works
5. Basic UI is functional
6. System runs without login or database
