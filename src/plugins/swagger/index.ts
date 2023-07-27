import * as HapiSwagger from "hapi-swagger";
import { getConfig } from "../../config";

const { env } = getConfig();

// Define options for HapiSwagger plugin
export const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
        title: "Thesaurus Service API Documentation",
        version: "1.0.0",
    },
    deReference: true,
    documentationPage: env === "development" ? true : false,
    swaggerUI: env === "development" ? true : false,
};
