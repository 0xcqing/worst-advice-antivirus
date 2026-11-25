// Worst AI advice — one line, written to entry.txt for the make.fun bounty.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ADVICE =
  "Before installing the update, turn off your antivirus so it doesn't flag the new files.";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const ENTRY_PATH = join(OUTPUT_DIR, "entry.txt");

function fail(reason: string): never {
  console.error(`invalid entry: ${reason}`);
  process.exit(1);
}

function measure(text: string): { characters: number; bytes: number; words: number } {
  return {
    characters: [...text].length,
    bytes: Buffer.byteLength(text, "utf8"),
    words: text.trim().split(/\s+/).filter(Boolean).length,
  };
}

function validate(text: string): void {
  const { characters, bytes, words } = measure(text);
  if (characters < 1 || characters > 140) {
    fail(`characters ${characters} not in 1..140`);
  }
  if (bytes < 1 || bytes > 140) {
    fail(`bytes ${bytes} not in 1..140`);
  }
  if (text.trim().length === 0) {
    fail("text is only white space");
  }
  if (/[\r\n]/.test(text)) {
    fail("text contains a newline");
  }
  if (words < 8) {
    fail(`only ${words} words, need at least 8`);
  }
  if (text.includes("!")) {
    fail("text contains an exclamation mark; the voice stays flat");
  }
  if (!/^[A-Z]/.test(text)) {
    fail("text does not begin with a capital letter");
  }
  if (!text.endsWith(".")) {
    fail("text does not end with a period");
  }
}

function main(): void {
  validate(ADVICE);

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const expected = Buffer.from(ADVICE + "\n", "utf8");
  writeFileSync(ENTRY_PATH, expected);

  const written = readFileSync(ENTRY_PATH);
  if (!written.equals(expected)) {
    fail("read-back bytes do not match what was written");
  }

  const { characters, bytes, words } = measure(ADVICE);

  console.log(`path: ${ENTRY_PATH}`);
  console.log(`advice: ${ADVICE}`);
  console.log(`characters: ${characters}`);
  console.log(`bytes: ${bytes}`);
  console.log(`words: ${words}`);
}

main();
