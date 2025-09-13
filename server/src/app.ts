import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Socket.IO + Rapier server running!");
});

export default app;
