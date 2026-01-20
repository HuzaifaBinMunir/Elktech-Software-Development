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
```
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
```

How the Application Works
1️⃣ Startup

User is prompted to enter an array of numbers
(space- or comma-separated, e.g. 10 3 25 7 1)

2️⃣ Main Menu
1. Search
2. Sort
0. Exit

3️⃣ Search Flow

* User selects:
  * Linear Search
  * Binary Search
* User enters a target number
* Result is displayed
  * Index if found
  * Friendly message if not found (-1 is handled safely)

4️⃣ Sort Flow

* User selects:
  * Insertion Sort
  * Bubble Sort
  * Merge Sort
* Original array and sorted result are displayed


5️⃣ Exit

* User can exit cleanly at any time

* Readline interface is always closed properly

## Clean Code Practices Applied

* Single Responsibility Principle
  * Algorithms contain no I/O
  * Menus only print options
  * Flows handle execution logic
  * Parsing & validation isolated in utilities

* Readable & Intent-Driven Code
  * Meaningful function and file names
  * Menus only print options
  

* No Magic Values
  * Input is taken from the user
  * Sentinel values (-1) are handled explicitly

* Error Handling
  * All async execution wrapped in try/catch/finally
  * Invalid input handled gracefully (no crashes)

How to Run

From the Week2/node directory:

```
node main.js
```

Summary

This project demonstrates:

* Correct implementation of core DSA algorithms

* Clean, maintainable Node.js code

* Practical use of Clean Code principles

* Proper CLI input handling and error management





