# Week 2 – Data Structures & Algorithms (Node.js)

## Overview
This project implements core **searching and sorting algorithms** using **Node.js**, structured as a **clean, modular, menu-driven CLI application**.

The purpose of this work is to:
- Practice fundamental DSA concepts
- Apply **Clean Code** principles (modularity, single responsibility)
- Build a user-friendly CLI with proper input validation and error handling
- Run all algorithms from a **single entry point**

---

## Features
- Menu-based CLI (Search / Sort)
- User-entered array input (space or comma separated)
- User-entered target value for searching
- Searching Algorithms:
  - Linear Search
  - Binary Search
- Sorting Algorithms:
  - Insertion Sort
  - Bubble Sort
  - Merge Sort
- Input validation (handles empty and invalid input)
- Graceful error handling using `try / catch / finally`
- Clean multi-file project structure

---

## Project Structure
Week2/node/
│
├── main.js                  # Application entry point
│
├── algorithms/              # Pure algorithm implementations
│   ├── search.js            # Linear & Binary Search
│   └── sort.js              # Bubble, Insertion & Merge Sort
│
├── flows/                   # Application flows (business logic)
│   ├── searchFlow.js        # Search execution flow
│   └── sortFlow.js          # Sort execution flow
│
├── menu/                    # Menu printing (UI only)
│   └── menuPrinter.js
│
├── utils/                   # Utilities
│   ├── input.js             # Readline wrapper (async/await)
│   └── parse.js             # Input parsing & validation
│
└── README.md



