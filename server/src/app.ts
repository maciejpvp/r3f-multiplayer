import express from "express";

const app = express();

// Routes
app.get("/", (_req, res) => {
  res.send("Socket.IO server running!");
});

export default app;
