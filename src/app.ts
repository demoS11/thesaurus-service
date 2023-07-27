import { getConfig } from "./config";
import { init, start } from "./server";

// Initialize and starts the server.
async function startServer() {
    await init(getConfig());
    await start();
}

startServer();
