# Collaborative Drawing Game — System Design (Updated)

---

# 1. System Overview

This system is a **real-time multiplayer drawing game platform** that supports two gameplay modes:

1. **Collaborative Drawing Mode**
2. **Guess The Drawing Mode**

Players interact through a **shared room** using a browser.
Communication between clients and the server happens through **WebSockets**.

The system uses:

* **Next.js frontend**
* **FastAPI backend**
* **In-memory room storage**
* **No database**
* **No authentication**

Rooms and game sessions exist **only while the server is running**.

---

# 2. High-Level Architecture

System components:

```
Browser (Next.js)
     │
     │ WebSocket
     │
     ▼
FastAPI Server
     │
     │
Room Manager (Memory)
     │
     │
Game Engine (Guess Mode)
```

Responsibilities:

**Frontend**

* Canvas rendering
* Drawing input
* Guess input
* Timer display
* Scoreboard UI

**Backend**

* Room lifecycle
* WebSocket connection management
* Game logic
* Event broadcasting

---

# 3. Core Components

The backend system is divided into several logical modules.

### Room Manager

Responsible for:

* Creating rooms
* Storing room state
* Tracking players
* Managing WebSocket connections

Data stored in memory:

```
rooms = {
   room_id: RoomObject
}
```

---

### Game Engine

Handles **Guess Mode game logic**.

Responsibilities:

* Round management
* Word generation
* Timer management
* Guess validation
* Score updates
* Round summaries

---

### WebSocket Gateway

Handles all **real-time communication**.

Responsibilities:

* Player connection
* Message routing
* Broadcasting events
* Disconnect handling

---

# 4. Room Structure

Each room stores game state and player information.

Example structure:

```
Room {
    room_id
    mode
    owner
    players[]
    sockets[]
    game_state
}
```

---

### Player Object

```
Player {
    id
    name
    socket
    score
    has_guessed
}
```

---

### Game State (Guess Mode)

```
GameState {
    round
    max_rounds
    current_drawer
    word
    masked_word
    timer
    guessed_players[]
}
```

---

# 5. Game Modes

## Collaborative Drawing Mode

Purpose:
Players draw together on a shared canvas.

Constraints:

```
Max players = 2
```

System behavior:

* Drawing events broadcast to all players
* No scoring
* No rounds
* Canvas download supported

---

## Guess The Drawing Mode

Purpose:
Players guess a word based on a drawing.

Constraints:

```
Max players = 6
Min players = 2
```

Game flow includes:

* Rounds
* Drawer rotation
* Word guessing
* Timer
* Scoreboard

---

# 6. WebSocket Communication

Clients connect using:

```
/ws/{room_id}
```

Example:

```
ws://server/ws/ab12cd
```

All gameplay communication happens through WebSocket messages.

---

# 7. Event System

The system uses an **event-based message architecture**.

Example message format:

```
{
  "type": "event_type",
  "data": {}
}
```

---

### Common Events

| Event             | Purpose                |
| ----------------- | ---------------------- |
| player_join       | new player enters room |
| player_leave      | player disconnects     |
| draw              | drawing event          |
| guess             | player guess message   |
| round_start       | start of round         |
| timer_update      | countdown update       |
| round_end         | round finished         |
| scoreboard_update | scores updated         |

---

# 8. Drawing Synchronization

Drawing uses the HTML5 canvas.

When a player draws:

```
Client → Server → Broadcast to room
```

Example drawing message:

```
{
 "type": "draw",
 "x": 230,
 "y": 420,
 "color": "#000",
 "size": 5
}
```

Server simply **broadcasts the event**.

---

# 9. Guess Processing

Players submit guesses through chat.

Example message:

```
{
 "type": "guess",
 "text": "tree"
}
```

Server process:

```
receive guess
      ↓
compare with secret word
      ↓
correct?
      ↓
update score
      ↓
broadcast result
```

---

# 10. Word System

Words are selected from a predefined word list.

Example:

```
tree
car
dragon
pizza
banana
guitar
castle
robot
```

Only the **drawer sees the full word**.

Other players see:

```
T _ _ _
```

This helps guide guesses.

---

# 11. Round Lifecycle

Each round follows this lifecycle.

```
Select drawer
      ↓
Generate word
      ↓
Send masked word to players
      ↓
Start timer
      ↓
Drawer draws
      ↓
Players guess
      ↓
Correct guesses tracked
      ↓
Timer ends or all guessed
      ↓
Round summary
      ↓
Next round
```

---

# 12. Timer System

Each round includes a countdown timer.

Default duration:

```
70 seconds
```

Server responsibilities:

* Start timer
* Broadcast countdown
* End round when timer reaches zero

Example timer event:

```
{
 "type": "timer_update",
 "remaining": 34
}
```

---

# 13. Score System

Players receive points when guessing correctly.

Default scoring:

```
Correct guess = +10 points
```

Optional logic:

Drawer may receive points if players guess correctly.

Scoreboard example:

```
Player1   30
Player2   20
Player3   10
Player4    0
```

Scores are stored in **room memory**.

---

# 14. Round Summary

At the end of each round the server broadcasts:

* Correct word
* Players who guessed correctly
* Updated scores

Example:

```
Round Over

Word: TREE

Scores:
Alice 30
Bob   20
Eve   10
```

After a short delay the next round begins.

---

# 15. Player Disconnect Handling

Possible scenarios:

* Browser closed
* Network lost
* Page refresh

Server must:

```
Remove player from room
Broadcast updated player list
```

If drawer disconnects:

```
Select new drawer
Continue round
```

If the room becomes empty:

```
Delete room
```

---

# 16. Room Lifecycle

Room lifecycle:

```
Room created
      ↓
Players join
      ↓
Game starts
      ↓
Rounds played
      ↓
Players leave
      ↓
Room deleted
```

Since there is **no database**, rooms disappear when:

```
Server restarts
```

---

# 17. Scalability Considerations

Current MVP limitations:

* Single server instance
* In-memory state
* No horizontal scaling

Future scaling options:

* Redis room storage
* WebSocket gateway layer
* Distributed game servers

These are **not required for MVP**.

---

# 18. Security Considerations

Basic protections:

* Room player limits
* Input validation
* Guess message filtering
* Rate limiting guesses (optional)

Since there are **no accounts**, abuse risk is minimal for MVP.

---

# 19. Failure Handling

Possible failures:

| Issue                | Handling          |
| -------------------- | ----------------- |
| WebSocket disconnect | Remove player     |
| Server restart       | All rooms reset   |
| Drawer leaves        | Assign new drawer |
| Timer failure        | Restart round     |

---

# 20. System Summary

The system focuses on **simplicity and real-time gameplay**.

Key principles:

* WebSocket-driven architecture
* In-memory room management
* Event-based communication
* Minimal backend complexity

This design enables a **fast, lightweight multiplayer drawing game MVP** with both collaborative and competitive gameplay modes.
