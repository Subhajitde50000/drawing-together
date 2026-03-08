# Collaborative Drawing Game — Architecture

## 1. Overview

This project is a **real-time multiplayer drawing web application** that supports two different modes:

1. **Collaborative Drawing Mode** (2 players)
2. **Guess The Drawing Mode** (2–6 players)

Players can create rooms, invite others using a shared link, and interact in real time using a shared drawing canvas.

Key constraints:

* No login system
* No database
* Rooms stored in **server memory**
* Real-time communication using **WebSockets**

Rooms disappear when the server restarts.

---

# 2. Tech Stack

## Frontend

* Next.js
* React
* HTML5 Canvas API
* WebSocket client

Responsibilities:

* Drawing UI
* Room interface
* Guess chat system
* Game state rendering
* Timer display
* Scoreboard display

---

## Backend

* FastAPI
* Python
* WebSockets

Responsibilities:

* Manage WebSocket connections
* Manage rooms
* Handle drawing synchronization
* Handle game state (rounds, words, scores)
* Broadcast events to players

---

# 3. System Architecture

```id="k8u9sx"
             ┌───────────────────────┐
             │        Browser         │
             │      Next.js App       │
             │ Canvas + Game UI       │
             └───────────┬────────────┘
                         │
                         │ WebSocket
                         │
                         ▼
             ┌───────────────────────┐
             │       FastAPI          │
             │   WebSocket Server     │
             │     Game Manager       │
             └───────────┬────────────┘
                         │
                In-Memory Storage
                    (Python Dict)
```

The backend works as a **real-time event router and game state manager**.

---

# 4. Game Modes

## 4.1 Collaborative Drawing Mode

Players: **2**

Features:

* Shared canvas
* Real-time drawing sync
* Download final drawing

Flow:

```id="2kn2n7"
Player 1 creates room
        ↓
Player 2 joins
        ↓
Both draw together
        ↓
Canvas updates in real time
```

---

## 4.2 Guess The Drawing Mode

Players: **2–6**

Gameplay:

* One player draws a secret word
* Other players guess the word
* Correct guesses earn points
* Game continues for several rounds

Example flow:

```id="8dc9ld"
Round starts
      ↓
One player becomes drawer
      ↓
Word revealed to drawer
      ↓
Timer starts
      ↓
Drawer draws object
      ↓
Players submit guesses
      ↓
Correct guess = points
      ↓
Round summary
      ↓
Next player draws
```

---

# 5. Room System

Each room contains:

* room ID
* game mode
* player list
* WebSocket connections
* game state (if guess mode)

Example structure:

```id="f5mqyo"
rooms = {
  "room123": {
    "mode": "guess",
    "players": [],
    "sockets": [],
    "game_state": {}
  }
}
```

---

# 6. In-Memory Game State

For Guess Mode, the server must track additional data.

Example:

```id="5e25m7"
game_state = {
  "current_drawer": player_id,
  "word": "tree",
  "round": 1,
  "timer": 70,
  "scores": {
     "player1": 10,
     "player2": 0
  },
  "guessed_players": []
}
```

This data resets when the room closes.

---

# 7. WebSocket Communication

WebSockets handle all real-time updates.

Endpoint:

```id="9qwe88"
/ws/{room_id}
```

Example connection:

```id="2c4y76"
ws://server/ws/room123
```

---

# 8. Event System

All communication uses **JSON events**.

### Drawing Event

```id="l5q8gd"
{
 "type": "draw",
 "x": 200,
 "y": 150,
 "color": "#000000",
 "size": 4
}
```

---

### Guess Event

```id="p9h0km"
{
 "type": "guess",
 "player": "player2",
 "text": "tree"
}
```

---

### Round Start Event

```id="t12hzq"
{
 "type": "round_start",
 "drawer": "player3",
 "hint": "T _ _ _"
}
```

---

### Score Update Event

```id="udxql5"
{
 "type": "score_update",
 "scores": {
   "player1": 20,
   "player2": 10
 }
}
```

---

### Timer Update Event

```id="c2us6f"
{
 "type": "timer",
 "remaining": 45
}
```

---

# 9. Drawing Synchronization

Drawing events are broadcast to all players except the sender.

Flow:

```id="88nhjv"
Player draws
      ↓
Client sends draw event
      ↓
FastAPI receives event
      ↓
Server broadcasts to room
      ↓
Other clients render stroke
```

---

# 10. Guess System

Players submit guesses via chat.

Server logic:

```id="njl2k1"
if guess == secret_word:
    mark player as correct
    add score
    broadcast result
```

Players who guessed correctly **cannot guess again** in the same round.

---

# 11. Timer System

Each round includes a **70-second timer**.

Timer responsibilities:

* start when round begins
* update clients every second
* end round when timer reaches 0

Timer events are broadcast to all players.

---

# 12. Scoreboard System

Scores are stored in room memory.

Example:

```id="np7jlb"
scores = {
  "player1": 30,
  "player2": 20,
  "player3": 10
}
```

Scoreboard is updated:

* when a correct guess happens
* at the end of each round

---

# 13. Drawer Rotation

Each round selects a new drawer.

Example order:

```id="e8sn1c"
Round 1 → Player1
Round 2 → Player2
Round 3 → Player3
Round 4 → Player4
Round 5 → Player5
Round 6 → Player6
```

This ensures every player gets a turn.

---

# 14. Round Summary

At the end of each round, players see:

* the correct word
* who guessed correctly
* updated scoreboard

Example display:

```id="7qyk97"
Word: TREE

Scores
Player1 - 20
Player2 - 10
Player3 - 0
```

After a short delay, the next round begins.

---

# 15. Disconnect Handling

Possible events:

* player closes browser
* internet lost
* page refresh

Server must:

1. Remove socket from room
2. Update player list
3. Continue game if possible

If the drawer disconnects:

```id="hl4e2a"
new drawer selected
```

If the room becomes empty:

```id="j27db1"
room deleted
```

---

# 16. Scalability

The system supports multiple rooms simultaneously.

Each room contains:

* up to 6 WebSocket connections
* temporary game state
* minimal memory usage

Scaling limits depend on:

* server RAM
* concurrent WebSocket connections

---

# 17. Security Considerations

Without authentication, risks include:

* spam rooms
* malicious messages
* cheating attempts

Mitigations:

* validate message format
* restrict message size
* limit players per room

Future improvements:

* rate limiting
* room expiration

---

# 18. Deployment Architecture

Example deployment:

```id="ed3y0l"
Internet
   │
   ▼
Next.js Frontend
   │
   │ WebSocket
   ▼
FastAPI Backend
```

Frontend handles UI and rendering.

Backend handles **real-time communication and game logic**.

---

# 19. Key Limitations

Because the system avoids persistent storage:

* rooms are temporary
* scores are not saved
* server restart deletes all rooms
* no user accounts

This keeps the system **lightweight and easy to deploy**.
