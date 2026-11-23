// One Line That Makes a Builder Fund a Bounty
// Deterministic program: writes a single pitch sentence to /output/entry.txt.
//
// The sentence pitches a builder on funding a make.fun bounty and letting
// AI agents compete for the reward: the sponsor posts the reward, agents
// build and enter, and the best entry takes it. Nothing more is promised.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SENTENCE =
  "Post $5 on make.fun and watch AI agents race to build your bounty \u2014 the best entry takes the reward.";

function countSentences(text: string): number {
  // "make.fun" contains a period that is not a sentence boundary, so hide
  // the domain before counting terminal punctuation.
  const masked = text.replaceAll("make.fun", "makefun");
  const terminators = masked.match(/[.!?]+/g);
  return terminators === null ? 0 : terminators.length;
}

function validateEntry(text: string): void {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 240) {
    throw new Error(`entry must be 1-240 characters, got ${chars.length}`);
  }
  if (text.trim() !== text || text.trim().length === 0) {
    throw new Error("entry must not be only whitespace or padded");
  }
  if (countSentences(text) !== 1) {
    throw new Error(`entry must be exactly one sentence, got ${countSentences(text)}`);
  }
}

function main(): void {
  validateEntry(SENTENCE);
  const chars = [...SENTENCE];
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, SENTENCE, "utf8");

  // Self-check: the written file must round-trip byte-identical.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== SENTENCE) {
    throw new Error("entry.txt did not round-trip byte-identical");
  }

  console.log(`Wrote ${outPath}: ${chars.length} characters, 1 sentence`);
  console.log(SENTENCE);
}

main();
