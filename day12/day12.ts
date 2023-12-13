import { every, filter, flatmap, map, pipe, toarray, zip } from "powerseq";

const fs = require("fs");

const input = fs.readFileSync("./day12/input.txt", "utf-8");

interface SpringRow {
  springRow: string;
  damaged: number[];
}

function generatePossibleStringRow(inputString: string): string[] {
  if (!inputString.includes("?")) return [inputString];

  const index: number = inputString.indexOf("?");
  const withDot: string[] = inputString.split("");
  const withHash: string[] = inputString.split("");

  withDot[index] = ".";
  withHash[index] = "#";

  const stringsWithDot: string[] = generatePossibleStringRow(withDot.join(""));
  const stringsWithHash: string[] = generatePossibleStringRow(
    withHash.join("")
  );

  return stringsWithDot.concat(stringsWithHash);
}

function isCorrectLine(springGroups: string[], damaged: number[]) {
  if (springGroups.length !== damaged.length) return false;
  return pipe(
    zip(springGroups, damaged, (g, d) => [g, d]),
    every(([spring, num]: any) => spring.length === num)
  );
}

function parseInput(input: string): SpringRow[] {
  return pipe(
    input.split("\n"),
    map((line) => line.split(" ")),
    map(([map, nums]) => ({
      springRow: map,
      damaged: nums.split(",").map((n) => parseInt(n)),
    })),
    toarray()
  );
}

const springRows = parseInput(input);

function getPossibleStringRows(springRows: SpringRow[]) {
  return pipe(
    springRows,
    flatmap((springRowData) =>
      pipe(
        generatePossibleStringRow(springRowData.springRow),
        map((r) => r.split(".").filter((g) => !!g)),
        filter((r) => isCorrectLine(r, springRowData.damaged)),
        toarray()
      )
    ),
    toarray()
  ).length;
}

console.log(getPossibleStringRows(springRows));
