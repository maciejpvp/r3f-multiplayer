# R3F Multiplayer Proof of Concept

## 🚀 Overview

This project is a **multiplayer proof of concept built with React Three Fiber (R3F)**.  
Players spawn into a shared 3D environment where they can see each other and interact with the world.  
The server is fully responsible for physics simulation, while clients only render the synchronized game state.  
This ensures consistency across all players and prevents desync issues.

---

## 🛠 Tech Stack

- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [@react-three/rapier](https://pmndrs.github.io/react-three-rapier/)
- [Socket.IO](https://socket.io/)
- [Other tools/libraries]

---

## ⚙️ Installation & Running

### 1. Clone the repository

```bash
git clone https://github.com/maciejpvp/r3f-multiplayer.git
cd r3f-multiplayer
```

### 2. Setup the server

```bash
cd server
pnpm install
pnpm run dev
```

### 3. Setup the client

```bash
cd client
npm install
npm run dev
```
