const path = require("path");
const logger = require("./logger");
const { processFile } = require("./processor");

/**
 * Parse command-line arguments
 * Example:
 * node src/index.js --input input/sample.txt --output output/report.txt --top 10
 */
function parseArguments(args) {
  const parsed = {};

  for (let i = 0; i < args.length; i++) {
    const current = args[i];

    if (current === "--input") {
      parsed.input = args[i + 1];
      i++;
    } else if (current === "--output") {
      parsed.output = args[i + 1];
      i++;
    } else if (current === "--top") {
      parsed.top = Number(args[i + 1]);
      i++;
    }
  }

  return parsed;
}

function showUsage() {
  console.log(`
Usage:
  node src/index.js --input <input-file> --output <output-file> --top <number>

Example:
  node src/index.js --input input/sample.txt --output output/report.txt --top 10
  `);
}

async function main() {
  try {
    const args = parseArguments(process.argv.slice(2));

    if (!args.input || !args.output) {
      logger.error("Missing required arguments.");
      showUsage();
      process.exit(1);
    }

    if (args.top !== undefined && (!Number.isInteger(args.top) || args.top <= 0)) {
      throw new Error("The --top value must be a positive integer.");
    }

    const inputPath = path.resolve(args.input);
    const outputPath = path.resolve(args.output);
    const topN = args.top || 10;

    const result = await processFile(inputPath, outputPath, topN);

    console.log("\nAnalysis completed successfully.\n");
    console.log(`Lines: ${result.lineCount}`);
    console.log(`Words: ${result.wordCount}`);
    console.log(`Characters: ${result.charCount}`);
    console.log(`Output written to: ${result.outputPath}\n`);
  } catch (error) {
    logger.error(error.message);
    console.error(`\nError: ${error.message}\n`);
    process.exit(1);
  }
}

main();