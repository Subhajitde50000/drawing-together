# Hide-and-Seek Multiplayer Game – Game Rules

## 1. Players

* Minimum: 2 players
* Maximum: 6 players per game
* Players can be friends or random online players

## 2. Roles

* **Police:** 1 player per round
* **Thieves:** All other players
* Roles are assigned **randomly** at the start of each round

## 3. Game Objective

* **Police:** Find and catch all thieves
* **Thieves:** Avoid police or catch the police to win

## 4. Gameplay Flow

1. **Lobby:** Players join and wait until all participants are ready
2. **Role Assignment:** Server randomly selects 1 police and remaining thieves
3. **Hiding Phase:**

   * Thieves have a fixed time (e.g., 30 seconds) to hide anywhere on the map
   * Police waits until hiding timer ends
4. **Active Phase:**

   * Police starts searching for thieves
   * Thieves can move and attempt to avoid capture
5. **Capture:**

   * Police catches a thief → thief becomes spectator
   * Thief catches police → thieves win immediately
6. **Round End:**

   * Police wins → all thieves caught
   * Thieves win → police caught or time expires

## 5. Win Conditions

* **Police Wins:** Captures all thieves
* **Thieves Win:** Catch police or survive until timer ends

## 6. Post-Round Role Assignment

* If **Police wins:** first thief caught becomes next round’s police
* If **Thieves win:** current police remains police for next round
* Spectator players watch the next round without active participation until next join

## 7. Map & Movement Rules

* Game takes place on a **2D tile-based map**
* Players cannot move through walls or obstacles
* Hiding spots: trees, boxes, buildings, corners
* Map size recommended: 20x20 tiles for beginner maps

## 8. Player Restrictions

* Spectator mode: eliminated thieves can only **watch** remaining players
* No movement or interference while spectating
* All role and capture logic handled by **server** to prevent cheating

## 9. Timer Rules

* **Hiding timer:** fixed duration for thieves to hide
* **Round timer:** optional, if police fails to catch all thieves within time, thieves win
* Timer displayed to all players in UI

## 10. Optional Gameplay Enhancements

* Power-ups for thieves or police (speed boost, invisibility)
* Night mode or map obstacles to increase difficulty
* Multiple police in advanced modes
* Leaderboards and persistent stats
