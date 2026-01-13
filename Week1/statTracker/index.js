// Input fom CLI
const readline = require('readline'); // import node's built-in 'readline' module
// to handle user input from the command line

const rl = readline.createInterface({
  input: process.stdin,  // keyboard input 
  output: process.stdout // console output
});

function ask(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans)));
}

// Session Analytics('the brain')
const session = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  totalGuesses: 0,
};

function winPercentage() {
  if (session.totalGames === 0) return 0;
  return (session.wins / session.totalGames) * 100;
}

function averageGuessesPerGame() {
  if (session.totalGames === 0) return 0;
  return session.totalGuesses / session.totalGames;
}


// Menu System
async function mainMenu() {
  while (true) {
    console.clear();
    console.log("==================================");
    console.log("GUESS THE NUMBER: ANALYTICS");
    console.log("==================================");
    console.log("1. Play New Game");
    console.log("2. View Session Stats");
    console.log("3. Exit\n");

    const choice = (await ask("> Select an option: ")).trim();

    if (choice === "1") {
      await playGame();         // (we’ll create next)
    } else if (choice === "2") {
      await viewStats();        // (we’ll create next)
    } else if (choice === "3") {
      rl.close();
      process.exit(0);
    } else {
      console.log("\nInvalid option. Press Enter to continue...");
      await ask("");
    }
  }
}
// Session Stats View
async function viewStats() {
  console.clear();
  console.log("----- SESSION STATISTICS -----\n");

  console.log(`Total Games:      ${session.totalGames}`);
  console.log(`Wins:             ${session.wins}`);
  console.log(`Losses:           ${session.losses}`);
  console.log(`Win Percentage:   ${winPercentage().toFixed(1)}%`);
  console.log(`Total Guesses:    ${session.totalGuesses}`);
  console.log(`Average Guesses:  ${averageGuessesPerGame().toFixed(1)} per game\n`);

  console.log("[Press Enter to return to menu...]");
  await ask("");
}

// Play New Game
async function playGame() {

  console.clear();
  console.log("----- NEW GAME -----\n");

  const selectedNumber = Math.floor(Math.random() * 100) + 1; // Random number between 1-100
  const maxAttempts = 5;
  
  let attemptsUsed = 0;       // count only valid attempts
  const guessed = new Set();

  console.log("Guess a number between 1 and 100.");
  console.log(`You have ${maxAttempts} attempts to guess the correct number.\n`);

    while (attemptsUsed < maxAttempts) {
        const guess = await getValidatedGuess(attemptsUsed + 1,guessed);

        if (guess === null){
            continue;
        }

        guessed.add(guess);
        attemptsUsed++;
        session.totalGuesses++;

        if (guess === selectedNumber) {
            console.log(`\nCongratulations! You've guessed the correct number ${selectedNumber} in ${attemptsUsed} attempts!\n`);
            session.wins++;
            session.totalGames++;
            console.log("[Press Enter to return to menu...]");
            await ask("");
            return;
        }
        if (guess < selectedNumber) {
            console.log("Too low!\n");
        } else {
            console.log("Too high!\n");
        }
    }

    if (attemptsUsed === maxAttempts) {
        console.log("\nGame Over! You ran out of moves.\n");
        console.log(`The correct number was ${selectedNumber}.\n`);

        session.totalGames++;
        session.losses++;
    }

    console.log("[Press Enter to return to menu...]");
    await ask("");

}

// Validation Function 
async function getValidatedGuess(attemptNumber, guessedSet){
    const raw = (await ask(`> Attempt ${attemptNumber}: `)).trim();

    //Case1: handle null values 
    if (raw.length === 0){
        console.log("Please enter a valid number.\n");
        return null;
    }
    // Case2: Not a number

    const num = Number(raw);

    if(!Number.isFinite(num) || !Number.isInteger(num)){
        console.log("Please enter a valid number between 1 and 100.\n");
        return null;
    }

    // Case3: Out of Range
    if (num < 1 || num > 100){
        console.log("Your guess is out of range. Please guess a number between 1 and 100.\n");
        return null;
    }

    // Case4: Repeat
    if (guessedSet.has(num)){
        console.log("You've already guessed that number. Try a different one.\n");
        return null;
    }

    return num;
}

// Start the application
mainMenu();
   


