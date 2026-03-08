# Collaborative Drawing Game — Product Requirements Document (PRD) (Updated)

---

# 1. Product Overview

The product is a **real-time multiplayer drawing web application** that allows players to create rooms, invite friends, and interact through drawing-based activities.

The application includes **two core game modes**:

1. **Collaborative Drawing Mode** – two players draw together on the same canvas.
2. **Guess The Drawing Mode** – a multiplayer drawing and guessing game for up to six players.

The product focuses on **instant play and minimal friction**, meaning users can start playing immediately without accounts or setup.

Key constraints:

* No login system
* No database
* Temporary rooms stored in server memory
* Real-time communication using WebSockets

---

# 2. Product Vision

Create a **fast, social drawing experience** where people can instantly start playing with friends.

The product should feel:

* simple
* responsive
* playful
* easy to share

The core idea is **quick multiplayer fun with zero friction**.

---

# 3. Target Users

## Primary Users

Friends who want a quick casual multiplayer activity.

Examples:

* friends sharing a funny drawing game
* classmates playing during breaks
* small online groups

## Secondary Users

Users who want a **simple shared whiteboard** to draw together.

---

# 4. User Problems

Most collaborative drawing tools require:

* account creation
* complicated interfaces
* setup steps
* invitations

This creates friction for users who simply want to **quickly play or draw together**.

Users need:

* instant room creation
* simple UI
* real-time interaction
* easy sharing

---

# 5. Product Goals

## Primary Goal

Allow players to **instantly join a shared drawing room and interact in real time**.

## Secondary Goals

* provide an engaging drawing game
* support small multiplayer groups
* keep the system simple and lightweight

---

# 6. Game Modes

## Mode 1 — Collaborative Drawing

Players: **2**

Purpose:
Two players draw together on the same canvas.

Features:

* shared canvas
* real-time drawing sync
* download final drawing

Example flow:

```id="m1l0z3"
Player creates room
      ↓
Second player joins
      ↓
Both draw together
      ↓
Download drawing
```

---

## Mode 2 — Guess The Drawing

Players: **2–6**

Purpose:
A drawing-based guessing game.

One player draws a secret word while the others try to guess it.

Correct guesses earn points.

Example flow:

```id="i6snye"
Round starts
     ↓
One player becomes drawer
     ↓
Secret word shown to drawer
     ↓
Timer starts
     ↓
Drawer draws the object
     ↓
Other players guess
     ↓
Correct guesses earn points
     ↓
Round ends
```

---

# 7. Core Features

## Room Creation

Users can create a room instantly.

System generates a unique room link.

Example:

```id="mpx4gj"
/room/ab39df
```

Users can share the link with friends.

---

## Room Joining

Players join rooms by opening the shared link.

Rules:

* collaborative mode: max **2 players**
* guess mode: max **6 players**

If a room is full, users see an error page.

---

## Shared Drawing Canvas

Players interact with a shared drawing board.

Capabilities:

* draw lines
* see drawings in real time
* basic drawing tools

---

## Guess Input System

In Guess Mode, players submit guesses using a text input.

Example:

```id="1v8n4q"
guess: tree
```

Server checks if the guess matches the secret word.

---

## Timer System

Each Guess Mode round includes a timer.

Default value:

```id="g9y4zk"
70 seconds
```

When the timer ends, the round automatically finishes.

---

## Scoreboard

The game tracks player scores.

Example:

```id="x48lti"
Player1 - 20
Player2 - 10
Player3 - 5
Player4 - 0
```

Scores update when players guess correctly.

---

## Round Summary

After each round, players see:

* the correct word
* players who guessed correctly
* updated scores

Example:

```id="aw0r6n"
Word: TREE

Scores
Player1 20
Player2 10
Player3 0
```

Then the next round begins.

---

# 8. User Stories

### Create Room

As a user,
I want to create a room quickly,
so that I can invite friends to play.

---

### Join Room

As a user,
I want to join a room using a link,
so that I can start playing instantly.

---

### Draw Objects

As a player,
I want to draw objects on the canvas,
so that others can guess the word.

---

### Guess Word

As a player,
I want to type guesses while watching the drawing,
so that I can earn points.

---

### See Scoreboard

As a player,
I want to see the current scores after each round,
so that I know who is winning.

---

# 9. User Flow

## Collaborative Mode

```id="vau2sa"
User opens website
      ↓
Creates room
      ↓
Shares link
      ↓
Second player joins
      ↓
Both draw together
```

---

## Guess Mode

```id="rjckd1"
User creates room
      ↓
Friends join (max 6)
      ↓
Owner starts game
      ↓
Round begins
      ↓
Drawer draws word
      ↓
Players guess
      ↓
Scores updated
      ↓
Next round
```

---

# 10. Functional Requirements

### Room Management

* users must be able to create rooms
* users must be able to join rooms via link
* rooms must limit player count

---

### Drawing System

* drawing must synchronize in real time
* strokes must appear smoothly
* canvas must support basic drawing tools

---

### Guess System

* players must be able to submit guesses
* system must detect correct guesses
* system must update scores

---

### Game Rounds

* system must rotate drawing players
* rounds must end when timer finishes
* round summary must appear before next round

---

# 11. Non-Functional Requirements

## Performance

Drawing latency target:

```
< 200 ms
```

Timer synchronization should remain consistent across players.

---

## Reliability

System must handle:

* player disconnects
* page refresh
* temporary connection loss

---

## Scalability

The system should support multiple rooms simultaneously.

Each room operates independently.

---

# 12. Risks

## Connection Issues

WebSocket connections may drop.

Mitigation:

* reconnection logic
* connection status indicators

---

## Cheating

Players may try to reveal the word.

Possible mitigation:

* prevent drawer from typing guesses
* discourage drawing letters

---

## Server Restart

Since rooms are stored in memory:

* all games reset if the server restarts

---

# 13. Future Features (Post-MVP)

Possible improvements:

* word categories
* difficulty levels
* drawing replay
* spectator mode
* persistent accounts
* saved drawings
* global leaderboards
* mobile optimization

---

# 14. Release Criteria

The MVP is ready when:

* players can create rooms
* players can join rooms
* drawing works in real time
* Guess Mode gameplay works
* timer and rounds function correctly
* scoreboard updates correctly
* rooms work without login or database
