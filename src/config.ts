import Joi from "joi";

// Define an interface to represent the server configuration
export interface Config {
    env: string;
    port: number;
}

const configSchema = Joi.object({
    env: Joi.string().valid("development", "production", "test").required(),
    port: Joi.number().required(),
});

let _config: Config;

// Function to get the server configuration
export const getConfig = () => {
    if (!_config) {
        const config: Config = {
            env: process.env.NODE_ENV || "development",
            port: parseInt(process.env.PORT ?? "5001"),
        };

        const { value, error } = configSchema.validate(config);
        if (error) {
            throw Error(`Error while parsing config file: ${error}`);
        }

        _config = value as Config;
    }

    return _config;
};
