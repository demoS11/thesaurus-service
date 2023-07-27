import { ServerRoute } from "@hapi/hapi";
import CreateController from "./CreateController";
import FetchController from "./FetchController";

// Defines the route configuration for the synonym endpoints
const routes: ServerRoute[] = [
    {
        path: "/synonyms",
        method: "GET",
        options: FetchController,
    },
    {
        path: "/synonyms",
        method: "POST",
        options: CreateController,
    },
];

export default routes;
