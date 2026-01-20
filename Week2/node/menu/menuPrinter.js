function printMainMenu() {
  console.log("\n=== Week 2 DSA Menu ===");
  console.log("\n=== Select one option ===");
  console.log("1. Search");
  console.log("2. Sort");
  console.log("0. Exit");
}

function printSearchMenu() {
  console.log("\n--- Search Menu ---");
  console.log("1. Linear Search");
  console.log("2. Binary Search");
  console.log("0. Back");
}

function printSortMenu() {
  console.log("\n--- Sort Menu ---");
  console.log("1. Insertion Sort");
  console.log("2. Bubble Sort");
  console.log("3. Merge Sort");
  console.log("0. Back");
}

module.exports = { printMainMenu, printSearchMenu, printSortMenu };
