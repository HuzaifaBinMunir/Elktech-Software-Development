/**
 * Two Sum - Assessment Version
 * Time: O(n)
 * Space: O(n)
 */

const readline = require("readline");

function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return null;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter numbers (space separated): ", (numsInput) => {
  rl.question("Enter target: ", (targetInput) => {
    try {
      const nums = numsInput
        .trim()
        .split(/\s+/)
        .map(Number);

      if (nums.some(isNaN)) {
        throw new Error("Array must contain only numbers.");
      }

      const target = Number(targetInput);
      if (isNaN(target)) {
        throw new Error("Target must be a number.");
      }

      const result = twoSum(nums, target);

      if (result) {
        console.log(`Indices: [${result[0]}, ${result[1]}]`);
      } else {
        console.log("No solution found.");
      }
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      rl.close();
    }
  });
});
