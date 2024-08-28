import { describe, expect, test, afterAll } from "@jest/globals";
import * as crypto from "../src/crypto";

test("hash a string", () => {
  const string: string = "string1";
  expect(crypto.hash(string).length).toBe(64);
});

test("generate random string", () => {
  expect(crypto.randomString().length).toBe(64);
});

test("pad a string", () => {
  expect(crypto.padString("prefix", "suffix", 64).length).toBe(64);
});
