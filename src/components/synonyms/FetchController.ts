import { Request, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import Joi from "joi";
import { fetchResponseSchema } from "./ValidationSchemas";
import { findSynonyms } from "./helpers";

// Route options for finding synonyms of a word
const options: RouteOptions = {
    tags: ["api"],
    description: "get existing synonyms of a word",
    validate: {
        query: {
            word: Joi.string().required().max(255).min(2),
        },
    },
    response: fetchResponseSchema,
    async handler(req: Request, h: ResponseToolkit) {
        const { word } = req.query as any;

        const synonyms = await findSynonyms(word);

        return h.response({ synonyms }).code(200);
    },
};

export default options;
