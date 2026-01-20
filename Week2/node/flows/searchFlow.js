const { linearSearch, binarySearch } = require("../algorithms/search");
const { ask } = require("../utils/input");
const { parseNumber } = require("../utils/parse");
const { printSearchMenu } = require("../menu/menuPrinter");

async function getTargetFromUser() {
  while (true) {
    const raw = await ask("Enter target number (e.g. 7): ");
    const parsed = parseNumber(raw);
    if (parsed.ok) return parsed.value;
    console.log(`Error: ${parsed.error} Try again.`);
  }
}

async function runSearchFlow(arr) {
  printSearchMenu();
  const choice = await ask("Select search type (1-2) or 0 to go back: ");

  if (choice === "0") return { next: "back" };

  const target = await getTargetFromUser();

  if (choice === "1") {
    console.log("\nArray:", arr);
    console.log(`Linear Search → Target ${target} index:`, linearSearch(arr, target));
    return { next: "done" };
  }

  if (choice === "2") {
    const sorted = [...arr].sort((a, b) => a - b);
    console.log("\nSorted Array (for Binary Search):", sorted);
    console.log(`Binary Search → Target ${target} index:`, binarySearch(sorted, target));
    return { next: "done" };
  }

  console.log("Invalid search option.");
  return { next: "done" };
}

module.exports = { runSearchFlow };
