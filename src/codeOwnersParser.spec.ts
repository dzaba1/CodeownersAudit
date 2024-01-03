import os from "os";
import path from "path";
import fs from "fs";
import { IO } from "./io";
import { CodeOwnersParser } from "./codeOwnersParser";

describe("CodeOwnersLine", () => {
    let tempPath: string;

    function cleanUp() {
        if (tempPath && IO.directoryExists(tempPath)) {
            IO.removeDirectory(tempPath);
        }
    }

    beforeEach(() => {
        const temp = os.tmpdir();
        tempPath = path.join(temp, "CodeOwnersLine");

        cleanUp();
        fs.mkdirSync(tempPath);
    });

    afterEach(() => {
        cleanUp();
    });

    function createSut(): CodeOwnersParser {
        return new CodeOwnersParser();
    }

    function writeContent(content: string): string {
        const filepath = path.join(tempPath, "CODEOWNERS");
        fs.writeFileSync(filepath, content);
        return filepath;
    }

    it("parse - when empty file then noting", () => {
        const filename = writeContent(`
        

        `);

        const sut = createSut();
        const result = [...sut.parse(filename)];
        expect(result.length).toBe(0);
    });

    it("parse - when comment then noting", () => {
        const filename = writeContent(`# this is a comment
   # this is a comment`);

        const sut = createSut();
        const result = [...sut.parse(filename)];
        expect(result.length).toBe(0);
    });

    it("parse - when no codeowners then codeowners undefined", () => {
        const filename = writeContent(`*  `);

        const sut = createSut();
        const result = [...sut.parse(filename)];
        expect(result.length).toBe(1);
        expect(result[0].pattern).toBe("*");
        expect(result[0].owners).toBeUndefined();
    });

    it("parse - when codeowners then codeowners", () => {
        const filename = writeContent(`* myGroup1 myGroup2`);

        const sut = createSut();
        const result = [...sut.parse(filename)];
        expect(result.length).toBe(1);
        expect(result[0].pattern).toBe("*");
        expect(result[0].owners!.length).toBe(2);
        expect(result[0].owners![0]).toBe("myGroup1");
        expect(result[0].owners![1]).toBe("myGroup2");
    });
});