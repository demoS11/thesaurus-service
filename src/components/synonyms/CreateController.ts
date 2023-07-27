import { Request, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import {
    createControllerPayload,
    createResponseSchema,
} from "./ValidationSchemas";
import { addSynonym } from "./helpers";

// Route options for adding a new synonym
const options: RouteOptions = {
    tags: ["api"],
    description: "add a new synonym if not exist.",
    validate: createControllerPayload,
    response: createResponseSchema,
    async handler(req: Request, h: ResponseToolkit) {
        const { word, synonym } = req.payload as any;

        await addSynonym({ word, synonym });

        return h
            .response({ message: "Synonyms added successfully." })
            .code(201);
    },
};

export default options;
