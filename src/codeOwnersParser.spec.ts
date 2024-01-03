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
});