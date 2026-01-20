const { bubbleSort, insertionSort, mergeSort } = require("../algorithms/sort");
const { ask } = require("../utils/input");
const { printSortMenu } = require("../menu/menuPrinter");

async function runSortFlow(arr) {
  printSortMenu();
  const choice = await ask("Select sort type (1-3) or 0 to go back: ");

  if (choice === "0") return { next: "back" };

  if (choice === "1") {
    console.log("\nOriginal:", arr);
    console.log("Insertion Sort:", insertionSort(arr));
    return { next: "done" };
  }

  if (choice === "2") {
    console.log("\nOriginal:", arr);
    console.log("Bubble Sort:", bubbleSort(arr));
    return { next: "done" };
  }

  if (choice === "3") {
    console.log("\nOriginal:", arr);
    console.log("Merge Sort:", mergeSort(arr));
    return { next: "done" };
  }

  console.log("Invalid sort option.");
  return { next: "done" };
}

module.exports = { runSortFlow };
