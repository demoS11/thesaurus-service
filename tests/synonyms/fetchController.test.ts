import { ServerInjectOptions } from "@hapi/hapi";
import { synonymStore } from "../../src/components/synonyms/helpers";
import { getConfig } from "../../src/config";
import { init, server } from "../../src/server";

describe("GET /synonyms?word={word}", () => {
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation();

        Object.keys(synonymStore).forEach((key) => delete synonymStore[key]);
    });

    beforeAll(() => {
        init(getConfig());
    });

    const getInjectOptions = (word: string): ServerInjectOptions => ({
        method: "get",
        url: `/synonyms?word=${word}`,
    });

    it("should return 400 when word is not valid", async () => {
        const options = getInjectOptions("");

        const res = await server.inject(options);
        const result = res.result as any;
        expect(res.statusCode).toBe(400);
        expect(result.validation.keys).toEqual(["word"]);
    });

    it("should return 400 when word is shorter than 2 letter", async () => {
        const options = getInjectOptions("a");

        const res = await server.inject(options);
        const result = res.result as any;
        expect(res.statusCode).toBe(400);
        expect(result.validation.keys).toEqual(["word"]);
    });

    it("should return 200 and empty array when there is no synonyms", async () => {
        const options = getInjectOptions("love");

        const res = await server.inject(options);
        const result = res.result as any;
        expect(res.statusCode).toBe(200);
        expect(result).toEqual({ synonyms: [] });
    });

    it("should return 200 and synonyms when synonyms found with given word", async () => {
        synonymStore["begin"] = ["start"];
        synonymStore["start"] = ["commence", "begin"];

        const options = getInjectOptions("begin");

        const res = await server.inject(options);
        const result = res.result as any;

        expect(res.statusCode).toBe(200);
        expect(result.synonyms).toEqual(
            expect.arrayContaining(["start", "commence"]),
        );
    });

    it("should return 200 and synonyms when synonyms found with transitive rule", async () => {
        synonymStore["begin"] = ["start", "start"];
        synonymStore["start"] = ["commence", "begin"];

        const options = getInjectOptions("begin");

        const res = await server.inject(options);
        const result = res.result as any;

        expect(res.statusCode).toBe(200);
        expect(result.synonyms).toEqual(
            expect.arrayContaining(["start", "commence"]),
        );
    });
});
