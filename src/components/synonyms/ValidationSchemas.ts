import Joi from "joi";

// Payload validation schema for the create controller
export const createControllerPayload = {
    payload: Joi.object({
        word: Joi.string().required().max(255).min(2),
        synonym: Joi.string().required().max(255).min(2),
    }),
};

// Response validation schema for the create controller
export const createResponseSchema = {
    status: {
        200: Joi.object({
            message: Joi.string(),
        }),
        400: Joi.any(),
    },
};

// Response validation schema for the fetch controller
export const fetchResponseSchema = {
    status: {
        200: Joi.object({
            synonyms: Joi.array().required().items(Joi.string()),
        }),
        400: Joi.any(),
    },
};
