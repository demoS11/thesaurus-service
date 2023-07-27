import { Plugin, Request, ResponseObject, Server } from "@hapi/hapi";

// Register function for the logger plugin
async function register(server: Server) {
    server.events.on("response", (request: Request) => {
        const response = request.response as ResponseObject;
        const date = new Date(request.info.received)
            .toTimeString()
            .split(" ")[0];
        const method = request.method.toUpperCase();
        const status = response?.statusCode;
        const duration = request.info.completed - request.info.received;

        // Log the request details to the console
        console.info(
            `${date}: ${method} ${request.url} ${status} (${duration}ms)`,
        );
    });
}

export const logger: Plugin<any> = {
    name: "logger",
    register,
};
