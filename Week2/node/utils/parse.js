function parseNumberList(input) {
  const tokens = input.trim().split(/[,\s]+/).filter(Boolean);

  if (tokens.length === 0) {
    return { ok: false, error: "You did not enter any numbers." };
  }

  const numbers = tokens.map((t) => Number(t));
  if (numbers.some((n) => Number.isNaN(n))) {
    return { ok: false, error: "Invalid input: please enter only numbers." };
  }

  return { ok: true, value: numbers };
}

function parseNumber(input) {
  const n = Number(input.trim());
  if (Number.isNaN(n)) {
    return { ok: false, error: "Please enter a valid number." };
  }
  return { ok: true, value: n };
}

module.exports = { parseNumberList, parseNumber };
