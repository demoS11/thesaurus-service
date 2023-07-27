import * as Boom from "@hapi/boom";
import * as Hapi from "@hapi/hapi";
import { Server } from "@hapi/hapi";
import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as HapiSwagger from "hapi-swagger";
import Joi from "joi";
import { Config } from "./config";
import devError from "./plugins/devError/index";
import { logger } from "./plugins/logging/index";
import { swaggerOptions } from "./plugins/swagger";

import serverRoutes from "./routes";

export let server: Server;

// Initialize the Hapi.js server with the given configuration
export async function init(config: Config): Promise<void> {
    server = Hapi.server({
        port: config.port,
        host: "0.0.0.0",
        routes: {
            validate: {
                failAction: async (
                    _request: Hapi.Request,
                    _h: Hapi.ResponseToolkit,
                    err: Error | undefined,
                ) => {
                    if (config.env === "production") {
                        console.log(`ValidationError: ${err?.message}`);

                        throw Boom.badRequest(`Invalid request payload input`);
                    } else {
                        console.log("ValidationError: ", err);

                        throw err;
                    }
                },
            },
        },
        state: {
            strictHeader: false,
        },
    });

    // Set the Hapi.js server validator to use Joi for payload validation
    server.validator(Joi);

    // Register the server routes defined in the 'routes.ts' file
    server.route(serverRoutes);

    const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [
        {
            plugin: HapiSwagger,
            options: swaggerOptions,
        },
    ];

    if (config.env === "development") {
        plugins.push(
            {
                plugin: Inert,
            },
            {
                plugin: Vision,
            },
            {
                plugin: devError,
            },
            {
                plugin: logger,
            },
        );
    }

    // Register the plugins with the Hapi.js server
    await server.register(plugins);
}

// Start the Hapi.js server
export async function start() {
    await server.start();
    console.log(
        `Server Listening on ${server.settings.host}:${server.settings.port}`,
    );
}
