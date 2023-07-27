import { ServerInjectOptions } from "@hapi/hapi";
import { synonymStore } from "../../src/components/synonyms/helpers";
import { getConfig } from "../../src/config";
import { init, server } from "../../src/server";

describe("POST /synonyms", () => {
    beforeAll(() => {
        init(getConfig());
    });

    beforeEach(() => {
        //for not passing logs during testing
        jest.spyOn(console, "log").mockImplementation();

        Object.keys(synonymStore).forEach((key) => delete synonymStore[key]);
    });

    const getInjectOptions = (): ServerInjectOptions => ({
        method: "post",
        url: `/synonyms`,
    });

    const createPayload = (): any => {
        return {
            word: "test",
            synonym: "test_synonym",
        };
    };

    it("should return 400 when word is not provided", async () => {
        const payload = createPayload();
        delete payload.word;

        const options = getInjectOptions();
        options.payload = payload;

        const res = await server.inject(options);
        const result = res.result as any;
        expect(res.statusCode).toBe(400);
        expect(result.validation.keys).toEqual(["word"]);
    });

    it("should return 400 when word is shorter than 2 letter", async () => {
        const payload = createPayload();
        payload.word = "a";

        const options = getInjectOptions();
        options.payload = payload;

        const res = await server.inject(options);
        const result = res.result as any;
        expect(res.statusCode).toBe(400);
        expect(result.validation.keys).toEqual(["word"]);
    });

    it("should return 400 when synonym is not provided", async () => {
        const payload = createPayload();
        delete payload.synonym;

        const options = getInjectOptions();
        options.payload = payload;

        const res = await server.inject(options);
        const result = res.result as any;
        expect(res.statusCode).toBe(400);
        expect(result.validation.keys).toEqual(["synonym"]);
    });

    it("should return 400 when synonym is shorter than 2 letter", async () => {
        const payload = createPayload();
        payload.synonym = "a";

        const options = getInjectOptions();
        options.payload = payload;

        const res = await server.inject(options);
        const result = res.result as any;
        expect(res.statusCode).toBe(400);
        expect(result.validation.keys).toEqual(["synonym"]);
    });

    it("should return 201 and add synonym to storage when word and synonym provided for first time", async () => {
        const payload = createPayload();
        payload.word = "start";
        payload.synonym = "begin";

        const options = getInjectOptions();
        options.payload = payload;

        const res = await server.inject(options);
        const result = res.result as any;

        expect(res.statusCode).toBe(201);
        expect(result).toEqual({ message: "Synonyms added successfully." });
        expect(synonymStore["start"]).toEqual(["begin"]);
        expect(synonymStore["begin"]).toEqual(["start"]);
    });

    it("should return 201 and add synonym to already exist word when success", async () => {
        synonymStore["begin"] = ["start"];
        synonymStore["start"] = ["begin"];

        const payload = createPayload();
        payload.word = "start";
        payload.synonym = "commence";

        const options = getInjectOptions();
        options.payload = payload;

        const res = await server.inject(options);
        const result = res.result as any;

        expect(res.statusCode).toBe(201);
        expect(result).toEqual({ message: "Synonyms added successfully." });
        expect(synonymStore["start"]).toEqual(["begin", "commence"]);
        expect(synonymStore["begin"]).toEqual(["start"]);
    });

    it("should return 200 and add synonym to already exist synonym when success", async () => {
        synonymStore["commence"] = ["begin"];
        synonymStore["start"] = ["begin"];

        const payload = createPayload();
        payload.word = "start";
        payload.synonym = "commence";

        const options = getInjectOptions();
        options.payload = payload;

        const res = await server.inject(options);
        const result = res.result as any;

        expect(res.statusCode).toBe(201);
        expect(result).toEqual({ message: "Synonyms added successfully." });
        expect(synonymStore["start"]).toEqual(["begin", "commence"]);
        expect(synonymStore["commence"]).toEqual(["begin", "start"]);
    });
});
