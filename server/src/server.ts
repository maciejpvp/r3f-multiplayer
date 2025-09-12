import { createServer } from "http";
import app from "./app";
import { initSocket } from "./socket";

const httpServer = createServer(app);

initSocket(httpServer);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
