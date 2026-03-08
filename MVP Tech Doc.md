# Collaborative Drawing Game — MVP Technical Document (Updated)

---

# 1. MVP Goal

The goal of this MVP is to build a **real-time multiplayer drawing web application** that supports two simple modes:

1. **Collaborative Drawing Mode** (2 players draw together)
2. **Guess The Drawing Mode** (2–6 players guessing game)

The application allows players to create rooms, invite others via a shared link, and interact in real time.

Core constraints:

* No login system
* No database
* Rooms exist **only in server memory**
* Real-time communication using **WebSockets**

If the server restarts, all rooms and game sessions disappear.

---

# 2. MVP Scope

## Included Features

### Core Platform

* Room creation
* Room joining via link
* WebSocket real-time communication
* In-memory room storage

### Collaborative Drawing Mode

* 2 players per room
* Shared drawing canvas
* Real-time drawing synchronization
* Download drawing as image

### Guess The Drawing Mode

* 2–6 players per room
* Round-based gameplay
* Secret word drawing
* Guess input system
* Timer per round (default 70 seconds)
* Scoreboard system
* Round summary

---

# 3. Excluded Features (Not MVP)

To keep the MVP achievable, the following are excluded:

* User accounts
* Persistent game history
* Chat moderation
* Spectator mode
* Voice chat
* Word category selection
* Replay system

---

# 4. Tech Stack

## Frontend

Framework:

* Next.js

Libraries / APIs:

* React
* HTML5 Canvas API
* WebSocket client

Frontend Responsibilities:

* Render drawing canvas
* Handle drawing input
* Render guesses and chat
* Display timer
* Display scoreboard
* Manage WebSocket connection

---

## Backend

Framework:

* FastAPI

Language:

* Python

Backend Responsibilities:

* Manage WebSocket connections
* Manage room state
* Broadcast drawing events
* Handle guessing logic
* Manage round lifecycle
* Maintain scoreboard
* Manage timer events

---

# 5. Architecture Overview

```id="3st63m"
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

The server acts as both:

* a **real-time message router**
* a **game state manager** for Guess Mode.

---

# 6. Room System

Rooms are created dynamically.

Room ID example:

```id="fxn0qb"
/room/ab32cd
```

Each room stores:

* room ID
* game mode
* player list
* WebSocket connections
* game state (for Guess Mode)

Example structure:

```id="df6vym"
rooms = {
 "ab32cd": {
   "mode": "guess",
   "players": [],
   "sockets": [],
   "game_state": {}
 }
}
```

---

# 7. Player Limits

Different modes support different player counts.

Collaborative Mode:

```id="hhju4o"
Max players = 2
```

Guess Mode:

```id="0s5vd1"
Max players = 6
```

Server rejects additional players if the room limit is reached.

---

# 8. WebSocket Endpoint

Clients connect to:

```id="aah65p"
/ws/{room_id}
```

Example:

```id="0g4q0y"
ws://server/ws/ab32cd
```

WebSocket is used for all real-time communication.

---

# 9. Message Format

All messages use JSON.

Example:

```id="l25js3"
{
 "type": "event_type",
 "data": {}
}
```

---

# 10. Drawing Event

Used in both modes.

Example:

```id="9rjdrb"
{
 "type": "draw",
 "x": 120,
 "y": 340,
 "color": "#000000",
 "size": 4
}
```

The server broadcasts drawing events to all players in the room.

---

# 11. Guess Event

Players submit guesses via a chat input.

Example message:

```id="2t4l9z"
{
 "type": "guess",
 "player": "player2",
 "text": "tree"
}
```

Server checks if the guess matches the secret word.

---

# 12. Guess Mode Game State

For Guess Mode, the server maintains a game state object.

Example:

```id="izun6q"
game_state = {
 "round": 1,
 "current_drawer": "player3",
 "word": "tree",
 "timer": 70,
 "scores": {},
 "guessed_players": []
}
```

This state is updated during gameplay.

---

# 13. Round System

Each game contains multiple rounds.

Example flow:

```id="r2hwlt"
Round starts
     ↓
Select drawing player
     ↓
Secret word generated
     ↓
Timer starts
     ↓
Drawer draws
     ↓
Players submit guesses
     ↓
Round ends
     ↓
Scoreboard update
     ↓
Next round begins
```

---

# 14. Word System

Words are selected from a predefined list.

Example:

```id="0fnt7a"
tree
car
pizza
guitar
dragon
robot
banana
```

The drawer sees the full word.

Other players see a hint:

```id="c5jsht"
T _ _ _
```

---

# 15. Timer System

Each round has a timer.

Default:

```id="lmp1ju"
70 seconds
```

Timer responsibilities:

* Start when round begins
* Broadcast updates every second
* End round when timer reaches zero

Example timer event:

```id="65uee5"
{
 "type": "timer_update",
 "remaining": 42
}
```

---

# 16. Score System

Points are awarded for correct guesses.

Example scoring:

```id="zpsl9t"
Correct guess = +10 points
```

Optional:

Drawer receives points if players guess correctly.

Scores are stored in room memory.

Example:

```id="lfk3v3"
scores = {
 "player1": 20,
 "player2": 10,
 "player3": 0
}
```

---

# 17. Round Summary

After each round, the system shows:

* the correct word
* players who guessed correctly
* updated scoreboard

Example:

```id="43ggrh"
Word: TREE

Scores
Player1  20
Player2  10
Player3   0
```

After a short delay, the next round begins.

---

# 18. Disconnect Handling

Possible cases:

* player closes browser
* internet disconnect
* page refresh

Server must:

1. Remove player from room
2. Update player list
3. Continue game if possible

If the drawer disconnects:

```id="c70tn3"
Select new drawer
```

If the room becomes empty:

```id="k7wbb2"
Delete room
```

---

# 19. Development Workflow

Suggested development order:

1. Build canvas drawing locally
2. Implement WebSocket drawing sync
3. Implement room system
4. Add collaborative mode
5. Add player lobby
6. Implement guess chat system
7. Implement round logic
8. Implement timer
9. Implement scoreboard

---

# 20. MVP Success Criteria

The MVP is considered complete when:

* Rooms can be created
* Players can join via link
* Drawing synchronizes in real time
* Guess Mode rounds work correctly
* Timer works correctly
* Scoreboard updates correctly
* Players can download drawings
* System runs without login or database
