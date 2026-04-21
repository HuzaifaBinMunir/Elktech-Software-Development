const fs = require("fs");
const path = require("path");
const readline = require("readline");
const logger = require("./logger");

/**
 * Normalize a word:
 * - lowercase
 * - remove punctuation around it
 */
function normalizeWord(word) {
  return word.toLowerCase().replace(/[^a-z0-9]/gi, "").trim();
}

/**
 * Get top N frequent words from a frequency map
 */
function getTopWords(wordFrequency, topN = 10) {
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);
}

/**
 * Process text file using streams
 */
async function processFile(inputPath, outputPath, topN = 10) {
  return new Promise((resolve, reject) => {
    try {
      if (!inputPath || !outputPath) {
        return reject(new Error("Input path and output path are required."));
      }

      const resolvedInputPath = path.resolve(inputPath);
      const resolvedOutputPath = path.resolve(outputPath);

      if (!fs.existsSync(resolvedInputPath)) {
        return reject(new Error(`Input file not found: ${resolvedInputPath}`));
      }

      const stats = fs.statSync(resolvedInputPath);
      if (!stats.isFile()) {
        return reject(new Error("Provided input path is not a file."));
      }

      const outputDir = path.dirname(resolvedOutputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      let lineCount = 0;
      let wordCount = 0;
      let charCount = 0;
      const wordFrequency = {};

      logger.info(`Starting processing: ${resolvedInputPath}`);

      const readStream = fs.createReadStream(resolvedInputPath, {
        encoding: "utf8"
      });

      readStream.on("error", (err) => {
        reject(new Error(`Error reading file: ${err.message}`));
      });

      const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
      });

      rl.on("line", (line) => {
        lineCount++;
        charCount += line.length;

        const words = line.split(/\s+/).filter(Boolean);
        wordCount += words.length;

        for (const word of words) {
          const normalized = normalizeWord(word);
          if (normalized) {
            wordFrequency[normalized] = (wordFrequency[normalized] || 0) + 1;
          }
        }
      });

      rl.on("close", () => {
        try {
          const topWords = getTopWords(wordFrequency, topN);

          const report = [
            "===== TEXT FILE ANALYSIS REPORT =====",
            `Input File: ${resolvedInputPath}`,
            `Total Lines: ${lineCount}`,
            `Total Words: ${wordCount}`,
            `Total Characters (excluding line breaks): ${charCount}`,
            "",
            `Top ${topN} Most Frequent Words:`,
            ...topWords.map(([word, count], index) => `${index + 1}. ${word} - ${count}`),
            "",
            "===== END OF REPORT ====="
          ].join("\n");

          fs.writeFileSync(resolvedOutputPath, report, "utf8");

          logger.info(`Processing completed successfully.`);
          logger.info(`Report written to: ${resolvedOutputPath}`);

          resolve({
            lineCount,
            wordCount,
            charCount,
            topWords,
            outputPath: resolvedOutputPath
          });
        } catch (err) {
          reject(new Error(`Error writing output file: ${err.message}`));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  processFile
};