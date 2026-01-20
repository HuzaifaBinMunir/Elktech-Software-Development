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

* Main Item 1 User selects:
  * Sub Item 1.1 Linear Search
  * Sub Item 1.2 Binary Search
* Main Item 2 User enters a target number
* Main Item 3 Result is displayed
  * Sub Item 3.1 Index if found
  * Friendly message if not found (-1 is handled safely)

4️⃣ Sort Flow

* Main Item 1 User selects:
  * Sub Item 1.1 Insertion Sort
  * Sub Item 1.2 Bubble Sort
  * Sub Item 1.2 Merge Sort
* Main Item 2 Original array and sorted result are displayed
  * Sub Item 2.1


5️⃣ Exit

* Main Item 1 User can exit cleanly at any time

* Main Item 2 Readline interface is always closed properly

## Clean Code Practices Applied

* Main Item 1 Single Responsibility Principle
  * Sub Item 1.1 Algorithms contain no I/O
  * Sub Item 1.2 Menus only print options
  * Sub Item 1.3 Flows handle execution logic
  * Sub Item 1.4 Parsing & validation isolated in utilities

* Main Item 2 Readable & Intent-Driven Code
  * Sub Item 1.1 Meaningful function and file names
  * Sub Item 1.2 Menus only print options
  

* Main Item 3 No Magic Values
  * Sub Item 1.1 Input is taken from the user
  * Sub Item 1.2 Sentinel values (-1) are handled explicitly

* Main Item 4 Error Handling
  * Sub Item 1.1 All async execution wrapped in try/catch/finally
  * Sub Item 1.2 Invalid input handled gracefully (no crashes)





