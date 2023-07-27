import { Plugin, Request, ResponseToolkit, Server } from "@hapi/hapi";

// Register function for the devError plugin
async function register(server: Server) {
    server.ext(
        "onPreResponse",
        async (request: Request, h: ResponseToolkit) => {
            const response = request.response as any;
            if (response.isBoom && response.output.statusCode === 500) {
                console.error(response);
            }

            return h.continue;
        },
    );
}

const plugin: Plugin<any> = {
    name: "Dev error logger",
    register,
};

export default plugin;
