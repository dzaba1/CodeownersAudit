import { CodeOwnersLine } from "./codeOwnersLine";

describe("CodeOwnersLine", () => {
    it("displayOwners - when owners undefined then undefined", () => {
        const sut = new CodeOwnersLine("*", undefined);
        const result = sut.displayOwners();
        expect(result).toBeUndefined();
    });

    it("displayOwners - when owners then concat", () => {
        const sut = new CodeOwnersLine("*", ["user1", "user2"]);
        const result = sut.displayOwners();
        expect(result).toBe("user1 user2");
    });
});