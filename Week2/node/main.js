const { ask, closeInput } = require("./utils/input");
const { parseNumberList } = require("./utils/parse");
const { printMainMenu } = require("./menu/menuPrinter");
const { runSearchFlow } = require("./flows/searchFlow");
const { runSortFlow } = require("./flows/sortFlow");

async function getArrayFromUser() {
  while (true) {
    const raw = await ask(
      "\nEnter array numbers (space or comma separated), e.g. 10 3 25 7 1: "
    );

    const parsed = parseNumberList(raw);
    if (parsed.ok) return parsed.value;

    console.log(`Error: ${parsed.error} Try again.`);
  }
}

async function app() {
  while (true) {
    console.log("\n=== Welcome ===");
    console.log("1. Start");
    console.log("0. Exit");

    const startChoice = await ask("Select an option: ");

    if (startChoice === "0") {
      console.log("Goodbye!");
      return;
    }

    if (startChoice === "1") {
      break;
    }

    console.log("Invalid option. Try again.");
  }

  const arr = await getArrayFromUser();

  while (true) {
    printMainMenu();
    const action = await ask("Select an action (1-2) or 0 to Exit: ");

    if (action === "0") {
      console.log("Goodbye!");
      return;
    }

    if (action === "1") {
      await runSearchFlow(arr);
      continue;
    }

    if (action === "2") {
      await runSortFlow(arr);
      continue;
    }

    console.log("Invalid action.");
  }
}


(async () => {
  try {
    await app();
  } catch (err) {
    console.error("Something went wrong:", err?.message ?? err);
    process.exitCode = 1;
  } finally {
    closeInput();
  }
})();
