// crypto module for hashing
const crypto = require("crypto");

// uses sha256 for hashing, returns a string 64 characters long
export function hash(string: string) {
  return crypto.createHash("sha256").update(string).digest("hex");
}

// generates a random string for things like tokens and salts, also 64 chars long
export function randomString() {
  return crypto.randomBytes(32).toString("hex");
}

// pads out a string using hyphens (-) so i dont have to manually count them in my tests. Has a prefix, and suffix and the total length of the desired string.
// a suffix is needed for things like file extentions for images. The padding goes between the prefix and suffix.
export function padString(prefix: string, suffix: string, length: number) {
  let output: string = prefix;
  while (output.length < length - suffix.length) {
    output += "-";
  }
  return output + suffix;
}
