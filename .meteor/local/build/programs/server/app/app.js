var require = meteorInstall({"server":{"bots.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/bots.js                                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Empirica;
module.link("meteor/empirica:core", {
  default(v) {
    Empirica = v;
  }

}, 0);
// This is where you add bots, like Bob:
Empirica.bot("bob", {
  // // NOT SUPPORTED Called at the beginning of each stage (after onRoundStart/onStageStart)
  // onStageStart(bot, game, round, stage, players) {},
  // Called during each stage at tick interval (~1s at the moment)
  onStageTick(bot, game, round, stage, secondsRemaining) {} // // NOT SUPPORTED A player has changed a value
  // // This might happen a lot!
  // onStagePlayerChange(bot, game, round, stage, players, player) {}
  // // NOT SUPPORTED Called at the end of the stage (after it finished, before onStageEnd/onRoundEnd is called)
  // onStageEnd(bot, game, round, stage, players) {}


});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"callbacks.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/callbacks.js                                                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Empirica;
module.link("meteor/empirica:core", {
  default(v) {
    Empirica = v;
  }

}, 0);
let getFullyConnectedLayer;
module.link("./util", {
  getFullyConnectedLayer(v) {
    getFullyConnectedLayer = v;
  }

}, 1);
// onGameStart is triggered opnce per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart(game => {
  console.log("Game started");
  game.players.forEach(player => {
    player.set("inactive", false);
    const network = player.get("neighbors");
    const activeChats = [];
    network.map(otherNodeId => {
      var pairOfPlayers = [player.get("nodeId"), parseInt(otherNodeId)];
      pairOfPlayers.sort((p1, p2) => p1 - p2);
      const otherPlayer = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId)); // const otherPlayerId = otherPlayer.id;

      const chatKey = "".concat(pairOfPlayers[0], "-").concat(pairOfPlayers[1]);
      activeChats.push(chatKey);
    }); // Default all chats to be open when game starts

    player.set("activeChats", activeChats);
    console.log(player.get("activeChats"));
  });
  game.set("previousNumActivePlayers", game.players.length);
}); // onRoundStart is triggered before each round starts, and before onStageStart.
// It receives the same options as onGameStart, and the round that is starting.

Empirica.onRoundStart((game, round) => {
  game.players.forEach(player => {
    player.set("submitted", false);
    player.set("symbolSelected", "");
  });
  round.set("result", false);
  round.set("numPlayersSubmitted", 0); // const activePlayers = game.players.filter(p => p.online === true && !p.get("inactive"));

  const activePlayers = game.players.filter(p => !p.get("inactive"));

  if (activePlayers.length < game.get("previousNumActivePlayers")) {
    // Someone left in the middle of the round
    if (game.treatment.endGameIfPlayerIdle) {
      activePlayers.forEach(p => {
        p.exit("someoneInactive");
      });
    } else {
      getFullyConnectedLayer(game); // Updates the neighbors to be fully connected
    }
  }

  game.set("previousNumActivePlayers", activePlayers.length);
  console.log("Round Started");
}); // onStageStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.

Empirica.onStageStart((game, round, stage) => {
  console.log("Stage Started"); // const activePlayers = game.players.filter(p => p.online === true && !p.get("inactive"));

  const activePlayers = game.players.filter(p => !p.get("inactive"));

  if (stage.name === "Task") {
    activePlayers.forEach(player => {
      console.log(player.id);
      console.log("Symbols : ".concat(player.get("".concat(stage.displayName))));
    });
    console.log("Answer: ".concat(stage.get("answer")));
  }

  if (stage.name === "Survey") {
    activePlayers.forEach(player => {
      player.set("surveyNumber", 1);
    });
  } // game.players.forEach((player) => {
  //   player.set("submitted", false);
  // });
  // stage.set("showResults", false);
  // stage.set("resultsShown", false);

}); // onStageEnd is triggered after each stage.
// It receives the same options as onRoundEnd, and the stage that just ended.

Empirica.onStageEnd((game, round, stage) => {
  console.log("Stage Ended");
}); // onRoundEnd is triggered after each round.
// It receives the same options as onGameEnd, and the round that just ended.

Empirica.onRoundEnd((game, round) => {// game.players.forEach(player => {
  //   const value = player.round.get("value") || 0;
  //   const prevScore = player.get("score") || 0;
  //   player.set("score", prevScore + value);
  // });
}); // onGameEnd is triggered when the game ends.
// It receives the same options as onGameStart.

Empirica.onGameEnd(game => {}); // ===========================================================================
// => onSet, onAppend and onChange ==========================================
// ===========================================================================
// onSet, onAppend and onChange are called on every single update made by all
// players in each game, so they can rapidly become quite expensive and have
// the potential to slow down the app. Use wisely.
//
// It is very useful to be able to react to each update a user makes. Try
// nontheless to limit the amount of computations and database saves (.set)
// done in these callbacks. You can also try to limit the amount of calls to
// set() and append() you make (avoid calling them on a continuous drag of a
// slider for example) and inside these callbacks use the `key` argument at the
// very beginning of the callback to filter out which keys your need to run
// logic against.
//
// If you are not using these callbacks, comment them out so the system does
// not call them for nothing.
// // onSet is called when the experiment code call the .set() method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onSet((
//   game,
//   round,
//   stage,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // // Example filtering
//   // if (key !== "value") {
//   //   return;
//   // }
// });

Empirica.onSet((game, round, stage, player, // Player who made the change
target, // Object on which the change was made (eg. player.set() => player)
targetType, // Type of object on which the change was made (eg. player.set() => "player")
key, // Key of changed value (e.g. player.set("score", 1) => "score")
value, // New value
prevValue // Previous value
) => {
  const players = game.players; // const activePlayers = game.players.filter(p => p.online === true && !p.get("inactive"));

  const activePlayers = game.players.filter(p => !p.get("inactive")); // Some player decides to reconsider their answer

  console.log("key", key);

  if (key === "submitted") {
    console.log("Updated a submission"); // Checks if everyone has submitted their answer and if so, submit the stage

    let allSubmitted = true;
    let numPlayersSubmitted = 0;
    activePlayers.forEach(player => {
      if (player.get("submitted")) {
        numPlayersSubmitted += 1;
      }

      allSubmitted = player.get("submitted") && allSubmitted;
    });
    round.set("numPlayersSubmitted", numPlayersSubmitted);

    if (allSubmitted) {
      const log = stage.get("log");
      computeScore(activePlayers, stage, round); // Need to submit for submit the stage for every player

      game.players.forEach(player => {
        player.stage.submit();
      });
    } //   if (stage.get("resultsShown")) {
    //     players.forEach((player) => {
    //       player.stage.submit();
    //     })
    //   }
    // }
    // if (targetType === "stage" && key === "resultsShown") {
    //   if (stage.get("resultsShown")) {
    //     players.forEach((player) => {
    //       player.stage.submit();
    //     })
    //   }

  } // else if (key === "inactive") {
  // getFullyConnectedLayer(game);
  // }


  return;
});

function computeScore(activePlayers, stage, round) {
  let success = true;
  console.log("CORRECT ANSWER:");
  console.log(stage.get("answer"));
  console.log("Players guessed:");
  activePlayers.forEach(player => {
    const submission = player.get("symbolSelected");
    console.log(submission);

    if (submission !== stage.get("answer")) {
      success = false;
    }
  });
  round.set("result", success);

  if (success) {
    activePlayers.forEach(player => {
      const prevScore = player.get("score") || 0;
      player.set("score", prevScore + 1);
    });
    console.log(" All players got it correctly");
  }
} // // onAppend is called when the experiment code call the `.append()` method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onAppend((
//   game,
//   round,
//   stage,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // Note: `value` is the single last value (e.g 0.2), while `prevValue` will
//   //       be an array of the previsous valued (e.g. [0.3, 0.4, 0.65]).
// });
// // onChange is called when the experiment code call the `.set()` or the
// // `.append()` method on games, rounds, stages, players, playerRounds or
// // playerStages.
// Empirica.onChange((
//   game,
//   round,
//   stage,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue, // Previous value
//   isAppend // True if the change was an append, false if it was a set
// ) => {
//   // `onChange` is useful to run server-side logic for any user interaction.
//   // Note the extra isAppend boolean that will allow to differenciate sets and
//   // appends.
//    Game.set("lastChangeAt", new Date().toString())
// });
// // onSubmit is called when the player submits a stage.
// Empirica.onSubmit((
//   game,
//   round,
//   stage,
//   player // Player who submitted
// ) => {
// });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/constants.js                                                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  testTangrams: () => testTangrams
});
const fillerNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const allSymbols = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12"]; // n = number of people , p = number of symbols
// (n-1)*p + 1
// i.e. n = 3, p = 3 : 7

const testTangrams = [{
  _id: "0",
  taskName: "Task 1",
  symbols: allSymbols,
  answer: "t1"
}, {
  _id: "1",
  taskName: "Task 2",
  symbols: allSymbols,
  answer: "t2"
}, {
  _id: "2",
  taskName: "Task 3",
  symbols: allSymbols,
  answer: "t3"
}, {
  _id: "3",
  taskName: "Task 4",
  symbols: allSymbols,
  answer: "t4"
}, {
  _id: "4",
  taskName: "Task 5",
  symbols: allSymbols,
  answer: "t5"
}, {
  _id: "5",
  taskName: "Task 6",
  symbols: allSymbols,
  answer: "t6"
}, {
  _id: "6",
  taskName: "Task 7",
  symbols: allSymbols,
  answer: "t7"
}, {
  _id: "7",
  taskName: "Task 8",
  symbols: allSymbols,
  answer: "t8"
}, {
  _id: "8",
  taskName: "Task 9",
  symbols: allSymbols,
  answer: "t9"
}, {
  _id: "9",
  taskName: "Task 10",
  symbols: allSymbols,
  answer: "t10"
}, {
  _id: "10",
  taskName: "Task 11",
  symbols: allSymbols,
  answer: "t11"
}, {
  _id: "11",
  taskName: "Task 12",
  symbols: allSymbols,
  answer: "t12"
}, {
  _id: "12",
  taskName: "Task 13",
  symbols: allSymbols,
  answer: "t1"
}, {
  _id: "13",
  taskName: "Task 14",
  symbols: allSymbols,
  answer: "t2"
}, {
  _id: "14",
  taskName: "Task 15",
  symbols: allSymbols,
  answer: "t3"
}];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"util.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/util.js                                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  getNeighbors: () => getNeighbors,
  getFullyConnectedLayer: () => getFullyConnectedLayer
});

function getNeighbors(structure, player) {
  const neighbors = [];
  let network = structure.split(",");
  network.forEach(n => {
    const connection = n.split("-");
    const playerIndex = player.get("nodeId");

    if (playerIndex === parseInt(connection[0])) {
      neighbors.push(connection[1]);
    } else if (playerIndex === parseInt(connection[1])) {
      neighbors.push(connection[0]);
    }
  });
  return _.uniq(neighbors, true);
}

function getFullyConnectedLayer(game) {
  const activeNodes = [];
  const allNodes = []; // const activePlayers = game.players.filter(p => p.online === true && !p.get("inactive"));

  const activePlayers = game.players.filter(p => !p.get("inactive")); // activePlayers.forEach((p) => {
  //   activeNodes.push(`${p.get("nodeId")}`);
  // })

  game.players.forEach(p => {
    // if (p.online === true && !p.get("inactve")) {
    if (!p.get("inactve")) {
      activeNodes.push("".concat(p.get("nodeId")));
    }

    allNodes.push("".concat(p.get("nodeId")));
  });
  game.players.forEach(p => {
    // Only show active people
    // const newNeighbors = activeNodes.filter(id => parseInt(id) !== p.get("nodeId"))
    // p.set("neighbors", newNeighbors);
    // Show everyone, mark offline people as offline
    const newNeighbors = allNodes.filter(id => parseInt(id) !== p.get("nodeId"));
    p.set("neighbors", newNeighbors);
    console.log(p.get("neighbors"));
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/main.js                                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Empirica;
module.link("meteor/empirica:core", {
  default(v) {
    Empirica = v;
  }

}, 0);
module.link("./bots.js");
module.link("./callbacks.js");
let testSymbols, testTangrams;
module.link("./constants", {
  testSymbols(v) {
    testSymbols = v;
  },

  testTangrams(v) {
    testTangrams = v;
  }

}, 1);
let getNeighbors, getFullyConnectedLayer;
module.link("./util", {
  getNeighbors(v) {
    getNeighbors = v;
  },

  getFullyConnectedLayer(v) {
    getFullyConnectedLayer = v;
  }

}, 2);
// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.
Empirica.gameInit(game => {
  const {
    treatment: {
      playerCount,
      networkStructure,
      numTaskRounds,
      numSurveyRounds,
      setSizeBasedOnPlayerCount,
      userInactivityDuration,
      taskDuration,
      defaultSetSize,
      surveyDuration,
      resultsDuration,
      maxNumOverlap
    }
  } = game;
  const symbolSet = testTangrams;
  const setSize = setSizeBasedOnPlayerCount ? playerCount + 1 : defaultSetSize; //TODO: can change default value in settings

  const numRoundsBeforeSurvey = numTaskRounds / numSurveyRounds;
  const colors = ["Green", "Red", "Yellow", "Blue", "Purlpe", "White", "Black"];
  game.players.forEach((player, i) => {
    player.set("avatar", "/avatars/jdenticon/".concat(player._id));
    player.set("score", 0); // Give each player a nodeId based on their position (indexed at 1)

    player.set("nodeId", i + 1);
    player.set("name", player.id);
    player.set("anonymousName", colors[i]);
  });

  if (game.players.length < game.treatment.playerCount) {
    getFullyConnectedLayer(game);
    game.players.forEach(p => {
      console.log(p.get("neighbors"));
    });
  } else {
    game.players.forEach(p => {
      p.set("neighbors", getNeighbors(networkStructure, p));
      console.log(p.get("neighbors"));
    });
  } // For each round, add all the symbols, randomly select a correct answer and
  // Constraints: Must ensure that everyone has only one symbol in common


  _.times(numTaskRounds, i => {
    const round = game.addRound();
    const {
      symbols,
      taskName,
      answer
    } = symbolSet[i];
    const taskStage = round.addStage({
      name: "Task",
      displayName: taskName,
      answer: answer,
      durationInSeconds: taskDuration
    });
    taskStage.set("task", symbolSet[i]);
    getSymbolsForPlayers(symbols, answer, setSize, taskName, game, maxNumOverlap);
    taskStage.set("answer", symbolSet[i].answer);
    const resultStage = round.addStage({
      name: "Result",
      displayName: "Result",
      durationInSeconds: resultsDuration
    });

    if ((i + 1) % numRoundsBeforeSurvey === 0) {
      // After 5 task rounds, add a survey round
      const surveyRound = game.addRound();
      const surveyStages = surveyRound.addStage({
        name: "Survey",
        displayName: "Survey",
        durationInSeconds: surveyDuration
      });
    } // Question: What's the difference between setting something and
    // adding it into add stage

  }); // function getSymbolsForPlayers(symbolSet, answer, size, taskName, game) {
  //   let symbolsWithoutAnswer = symbolSet.filter(symbol => symbol !== answer);
  //   let shuffledSymbols = shuffle(symbolsWithoutAnswer);
  //   // game.players.forEach((p) => {
  //   //   // Finding a random splice of symbols without the answer (hence -2)
  //   //   const randomIndex = Math.floor(Math.random() * (symbolsWithoutAnswer.length + size - 2));
  //   //   let subset = shuffledSymbols.splice(randomIndex, randomIndex + size)
  //   //   // Adding in the answer in a random spot
  //   //   subset.splice(randomIndex % size, 0, answer);
  //   //   p.set(`${taskName}`, subset);
  //   // })
  //   let symbolFreq = {}
  //   for (let i = 0; i < symbolsWithoutAnswer.length; i++) {
  //     const symbol = symbolsWithoutAnswer[i]
  //     // console.log(!symbolFreq.hasOwnProperty(symbol));
  //     if (!symbolFreq.hasOwnProperty(symbol)) {
  //       symbolFreq[symbol] = 0
  //     }
  //   }
  //   let subsetsToCreate = game.players.length;
  //   let subsetArray = []
  //   let subset = []
  //   let maxFreq = 0;
  //   let allSameFreq = true;
  //   // console.log(subsetsToCreate);
  //   // console.log("Hi");
  //   // console.log(symbolFreq);
  //   while (subsetsToCreate > 0) {
  //     if (allSameFreq) {
  //       maxFreq += 1
  //     }
  //     for (let i = 0; i < symbolsWithoutAnswer.length; i++) {
  //       const symbol = symbolsWithoutAnswer[i]
  //       if (symbolFreq[symbol] < maxFreq && !subset.includes(symbol)) { // Add symbols to subset based on the symbol freq
  //         symbolFreq[symbol] += 1
  //         subset.push(symbol);
  //         allSameFreq = false;
  //       }
  //       // Subset is only missing answer => add answer
  //       // Add subset to overall array and reset 
  //       if (subset.length === size - 1) { 
  //         const randomIndex = Math.floor(Math.random() * (size- 1));
  //         subset.splice(randomIndex, 0, answer);
  //         subsetArray.push(subset);
  //         console.log(subset);
  //         subsetsToCreate -= 1;
  //         subset = []
  //       }
  //     }
  //     // Check the frequencies of the symbols
  //     allSameFreq = Object.keys(symbolFreq).every((key) => symbolFreq[key] === maxFreq);
  //     // console.log("Same freq");
  //     // console.log(allSameFreq);
  //   }
  //   let i = 0;
  //   game.players.forEach((p) => {
  //     p.set(`${taskName}`, subsetArray[i]);
  //     i += 1;
  //   })
  // }


  function getSymbolsForPlayers(symbolSet, answer, setSize, taskName, game, maxNumOverlap) {
    let symbolsWithoutAnswer = symbolSet.filter(symbol => symbol !== answer);
    symbolsWithoutAnswer = shuffle(symbolsWithoutAnswer);
    let numPlayers = game.players.length;
    let numOverlap = 0; // Create a dictionary to keep track of how many times symbol has been used

    let symbolFreq = {};

    for (let i = 0; i < symbolsWithoutAnswer.length; i++) {
      let symbol = symbolsWithoutAnswer[i]; // console.log(!symbolFreq.hasOwnProperty(symbol));

      if (!symbolFreq.hasOwnProperty(symbol)) {
        symbolFreq[symbol] = numPlayers - 1; // Total time a symbol can be used 
      }
    }

    game.players.forEach(player => {
      let symbolsPicked = [];

      for (let i = 0; i < symbolsWithoutAnswer.length; i++) {
        let symbol = symbolsWithoutAnswer[i];

        if (symbolsPicked.length < setSize - 1) {
          // Add symbols until setSize - 1 for answer
          if (symbolFreq[symbol] - 1 === 0) {
            // This symbol will overlap
            if (numOverlap < maxNumOverlap) {
              // Only add if less than max overlap
              symbolsPicked.push(symbol);
              symbolFreq[symbol] -= 1;
              numOverlap += 1;
            }
          } else {
            symbolsPicked.push(symbol);
            symbolFreq[symbol] -= 1;
          }
        }
      }

      symbolsPicked.push(answer); // Add the answer

      for (var symbolToRemove of symbolsPicked) {
        if (symbolFreq[symbolToRemove] === 0) {
          // If symbol has been picked n-1 players times, remove it from the set
          symbolsWithoutAnswer = symbolsWithoutAnswer.filter(symbol => symbol !== symbolToRemove);
        }
      }

      symbolsPicked = shuffle(symbolsPicked);
      player.set(taskName, symbolsPicked);
    });
  } // Shuffling arrays:
  // https://stackoverflow.com/questions/50536044/swapping-all-elements-of-an-array-except-for-first-and-last


  function shuffle(symbolSet) {
    for (i = symbolSet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [symbolSet[i], symbolSet[j]] = [symbolSet[j], symbolSet[i]];
    }

    return symbolSet;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".mjs"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm9uR2FtZVN0YXJ0IiwiY29uc29sZSIsImxvZyIsInBsYXllcnMiLCJmb3JFYWNoIiwicGxheWVyIiwic2V0IiwibmV0d29yayIsImdldCIsImFjdGl2ZUNoYXRzIiwibWFwIiwib3RoZXJOb2RlSWQiLCJwYWlyT2ZQbGF5ZXJzIiwicGFyc2VJbnQiLCJzb3J0IiwicDEiLCJwMiIsIm90aGVyUGxheWVyIiwiZmluZCIsInAiLCJjaGF0S2V5IiwicHVzaCIsImxlbmd0aCIsIm9uUm91bmRTdGFydCIsImFjdGl2ZVBsYXllcnMiLCJmaWx0ZXIiLCJ0cmVhdG1lbnQiLCJlbmRHYW1lSWZQbGF5ZXJJZGxlIiwiZXhpdCIsIm9uU3RhZ2VTdGFydCIsIm5hbWUiLCJpZCIsImRpc3BsYXlOYW1lIiwib25TdGFnZUVuZCIsIm9uUm91bmRFbmQiLCJvbkdhbWVFbmQiLCJvblNldCIsInRhcmdldCIsInRhcmdldFR5cGUiLCJrZXkiLCJ2YWx1ZSIsInByZXZWYWx1ZSIsImFsbFN1Ym1pdHRlZCIsIm51bVBsYXllcnNTdWJtaXR0ZWQiLCJjb21wdXRlU2NvcmUiLCJzdWJtaXQiLCJzdWNjZXNzIiwic3VibWlzc2lvbiIsInByZXZTY29yZSIsImV4cG9ydCIsInRlc3RUYW5ncmFtcyIsImZpbGxlck5hbWVzIiwic3BsaXQiLCJhbGxTeW1ib2xzIiwiX2lkIiwidGFza05hbWUiLCJzeW1ib2xzIiwiYW5zd2VyIiwiZ2V0TmVpZ2hib3JzIiwic3RydWN0dXJlIiwibmVpZ2hib3JzIiwibiIsImNvbm5lY3Rpb24iLCJwbGF5ZXJJbmRleCIsIl8iLCJ1bmlxIiwiYWN0aXZlTm9kZXMiLCJhbGxOb2RlcyIsIm5ld05laWdoYm9ycyIsInRlc3RTeW1ib2xzIiwiZ2FtZUluaXQiLCJwbGF5ZXJDb3VudCIsIm5ldHdvcmtTdHJ1Y3R1cmUiLCJudW1UYXNrUm91bmRzIiwibnVtU3VydmV5Um91bmRzIiwic2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCIsInVzZXJJbmFjdGl2aXR5RHVyYXRpb24iLCJ0YXNrRHVyYXRpb24iLCJkZWZhdWx0U2V0U2l6ZSIsInN1cnZleUR1cmF0aW9uIiwicmVzdWx0c0R1cmF0aW9uIiwibWF4TnVtT3ZlcmxhcCIsInN5bWJvbFNldCIsInNldFNpemUiLCJudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkiLCJjb2xvcnMiLCJpIiwidGltZXMiLCJhZGRSb3VuZCIsInRhc2tTdGFnZSIsImFkZFN0YWdlIiwiZHVyYXRpb25JblNlY29uZHMiLCJnZXRTeW1ib2xzRm9yUGxheWVycyIsInJlc3VsdFN0YWdlIiwic3VydmV5Um91bmQiLCJzdXJ2ZXlTdGFnZXMiLCJzeW1ib2xzV2l0aG91dEFuc3dlciIsInN5bWJvbCIsInNodWZmbGUiLCJudW1QbGF5ZXJzIiwibnVtT3ZlcmxhcCIsInN5bWJvbEZyZXEiLCJoYXNPd25Qcm9wZXJ0eSIsInN5bWJvbHNQaWNrZWQiLCJzeW1ib2xUb1JlbW92ZSIsImoiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsUUFBSjtBQUFhQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSixZQUFRLEdBQUNJLENBQVQ7QUFBVzs7QUFBdkIsQ0FBbkMsRUFB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QixFQWpCK0IsQ0FpQkg7O0FBQzVCLFdBQUssSUFBSStDLGNBQVQsSUFBMkJELGFBQTNCLEVBQTBDO0FBQ3hDLFlBQUlGLFVBQVUsQ0FBQ0csY0FBRCxDQUFWLEtBQStCLENBQW5DLEVBQXNDO0FBQUU7QUFDdENSLDhCQUFvQixHQUFHQSxvQkFBb0IsQ0FBQ3ZFLE1BQXJCLENBQTRCd0UsTUFBTSxJQUFJQSxNQUFNLEtBQUtPLGNBQWpELENBQXZCO0FBRUQ7QUFDRjs7QUFFREQsbUJBQWEsR0FBR0wsT0FBTyxDQUFDSyxhQUFELENBQXZCO0FBRUFsRyxZQUFNLENBQUNDLEdBQVAsQ0FBV2lELFFBQVgsRUFBcUJnRCxhQUFyQjtBQUNELEtBNUJEO0FBK0JILEdBM011QixDQTZNeEI7QUFDQTs7O0FBQ0EsV0FBU0wsT0FBVCxDQUFpQmhCLFNBQWpCLEVBQTRCO0FBQzFCLFNBQUtJLENBQUMsR0FBR0osU0FBUyxDQUFDNUQsTUFBVixHQUFrQixDQUEzQixFQUErQmdFLENBQUMsR0FBRyxDQUFuQyxFQUFzQ0EsQ0FBQyxFQUF2QyxFQUEyQztBQUN6QyxZQUFNbUIsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLE1BQWlCdEIsQ0FBQyxHQUFHLENBQXJCLENBQVgsQ0FBVjtBQUVBLE9BQUNKLFNBQVMsQ0FBQ0ksQ0FBRCxDQUFWLEVBQWVKLFNBQVMsQ0FBQ3VCLENBQUQsQ0FBeEIsSUFBK0IsQ0FBQ3ZCLFNBQVMsQ0FBQ3VCLENBQUQsQ0FBVixFQUFldkIsU0FBUyxDQUFDSSxDQUFELENBQXhCLENBQS9CO0FBQ0Q7O0FBQ0QsV0FBT0osU0FBUDtBQUNEO0FBRUYsQ0F4TkQsRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuXG4vLyBUaGlzIGlzIHdoZXJlIHlvdSBhZGQgYm90cywgbGlrZSBCb2I6XG5cbkVtcGlyaWNhLmJvdChcImJvYlwiLCB7XG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaCBzdGFnZSAoYWZ0ZXIgb25Sb3VuZFN0YXJ0L29uU3RhZ2VTdGFydClcbiAgLy8gb25TdGFnZVN0YXJ0KGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzKSB7fSxcblxuICAvLyBDYWxsZWQgZHVyaW5nIGVhY2ggc3RhZ2UgYXQgdGljayBpbnRlcnZhbCAofjFzIGF0IHRoZSBtb21lbnQpXG4gIG9uU3RhZ2VUaWNrKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBzZWNvbmRzUmVtYWluaW5nKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQSBwbGF5ZXIgaGFzIGNoYW5nZWQgYSB2YWx1ZVxuICAvLyAvLyBUaGlzIG1pZ2h0IGhhcHBlbiBhIGxvdCFcbiAgLy8gb25TdGFnZVBsYXllckNoYW5nZShib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycywgcGxheWVyKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBlbmQgb2YgdGhlIHN0YWdlIChhZnRlciBpdCBmaW5pc2hlZCwgYmVmb3JlIG9uU3RhZ2VFbmQvb25Sb3VuZEVuZCBpcyBjYWxsZWQpXG4gIC8vIG9uU3RhZ2VFbmQoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMpIHt9XG59KTtcbiIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcblxuaW1wb3J0IHsgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcblxuXG4vLyBvbkdhbWVTdGFydCBpcyB0cmlnZ2VyZWQgb3BuY2UgcGVyIGdhbWUgYmVmb3JlIHRoZSBnYW1lIHN0YXJ0cywgYW5kIGJlZm9yZVxuLy8gdGhlIGZpcnN0IG9uUm91bmRTdGFydC4gSXQgcmVjZWl2ZXMgdGhlIGdhbWUgYW5kIGxpc3Qgb2YgYWxsIHRoZSBwbGF5ZXJzIGluXG4vLyB0aGUgZ2FtZS5cbkVtcGlyaWNhLm9uR2FtZVN0YXJ0KGdhbWUgPT4ge1xuICBjb25zb2xlLmxvZyhcIkdhbWUgc3RhcnRlZFwiKTtcbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5zZXQoXCJpbmFjdGl2ZVwiLCBmYWxzZSk7XG4gICAgY29uc3QgbmV0d29yayA9IHBsYXllci5nZXQoXCJuZWlnaGJvcnNcIik7XG4gICAgY29uc3QgYWN0aXZlQ2hhdHMgPSBbXTtcbiAgICBuZXR3b3JrLm1hcChvdGhlck5vZGVJZCA9PiB7XG4gICAgICB2YXIgcGFpck9mUGxheWVycyA9IFtwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpLCBwYXJzZUludChvdGhlck5vZGVJZCldO1xuICAgICAgcGFpck9mUGxheWVycy5zb3J0KChwMSxwMikgPT4gcDEgLSBwMik7XG4gICAgICBjb25zdCBvdGhlclBsYXllciA9IGdhbWUucGxheWVycy5maW5kKHAgPT4gcC5nZXQoXCJub2RlSWRcIikgPT09IHBhcnNlSW50KG90aGVyTm9kZUlkKSk7XG4gICAgICAvLyBjb25zdCBvdGhlclBsYXllcklkID0gb3RoZXJQbGF5ZXIuaWQ7XG4gICAgICBjb25zdCBjaGF0S2V5ID0gYCR7cGFpck9mUGxheWVyc1swXX0tJHtwYWlyT2ZQbGF5ZXJzWzFdfWA7XG4gICAgICBhY3RpdmVDaGF0cy5wdXNoKGNoYXRLZXkpO1xuICAgIH0pO1xuICAgIC8vIERlZmF1bHQgYWxsIGNoYXRzIHRvIGJlIG9wZW4gd2hlbiBnYW1lIHN0YXJ0c1xuICAgIHBsYXllci5zZXQoXCJhY3RpdmVDaGF0c1wiLCBhY3RpdmVDaGF0cyk7XG4gICAgY29uc29sZS5sb2cocGxheWVyLmdldChcImFjdGl2ZUNoYXRzXCIpKTtcbiAgfSk7XG4gIGdhbWUuc2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIsIGdhbWUucGxheWVycy5sZW5ndGgpO1xufSk7XG5cbi8vIG9uUm91bmRTdGFydCBpcyB0cmlnZ2VyZWQgYmVmb3JlIGVhY2ggcm91bmQgc3RhcnRzLCBhbmQgYmVmb3JlIG9uU3RhZ2VTdGFydC5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lU3RhcnQsIGFuZCB0aGUgcm91bmQgdGhhdCBpcyBzdGFydGluZy5cbkVtcGlyaWNhLm9uUm91bmRTdGFydCgoZ2FtZSwgcm91bmQpID0+IHtcbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAgIHBsYXllci5zZXQoXCJzeW1ib2xTZWxlY3RlZFwiLCBcIlwiKTtcbiAgfSk7XG4gIHJvdW5kLnNldChcInJlc3VsdFwiLCBmYWxzZSk7XG4gIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgMCk7XG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoYWN0aXZlUGxheWVycy5sZW5ndGggPCBnYW1lLmdldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiKSApIHsgLy8gU29tZW9uZSBsZWZ0IGluIHRoZSBtaWRkbGUgb2YgdGhlIHJvdW5kXG4gICAgaWYgKGdhbWUudHJlYXRtZW50LmVuZEdhbWVJZlBsYXllcklkbGUpIHtcbiAgICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICBwLmV4aXQoXCJzb21lb25lSW5hY3RpdmVcIik7XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpOyAvLyBVcGRhdGVzIHRoZSBuZWlnaGJvcnMgdG8gYmUgZnVsbHkgY29ubmVjdGVkXG4gICAgfVxuICBcbiAgfVxuICBnYW1lLnNldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiLCBhY3RpdmVQbGF5ZXJzLmxlbmd0aCk7XG5cbiAgY29uc29sZS5sb2coXCJSb3VuZCBTdGFydGVkXCIpO1xuXG59KTtcblxuLy8gb25TdGFnZVN0YXJ0IGlzIHRyaWdnZXJlZCBiZWZvcmUgZWFjaCBzdGFnZSBzdGFydHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uUm91bmRTdGFydCwgYW5kIHRoZSBzdGFnZSB0aGF0IGlzIHN0YXJ0aW5nLlxuRW1waXJpY2Eub25TdGFnZVN0YXJ0KChnYW1lLCByb3VuZCwgc3RhZ2UpID0+IHtcbiAgY29uc29sZS5sb2coXCJTdGFnZSBTdGFydGVkXCIpXG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJUYXNrXCIpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgY29uc29sZS5sb2cocGxheWVyLmlkKTtcbiAgICAgIGNvbnNvbGUubG9nKCBgU3ltYm9scyA6ICR7cGxheWVyLmdldChgJHtzdGFnZS5kaXNwbGF5TmFtZX1gKX1gKTtcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyhgQW5zd2VyOiAke3N0YWdlLmdldChcImFuc3dlclwiKX1gKTtcbiAgfVxuICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJTdXJ2ZXlcIikge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0KFwic3VydmV5TnVtYmVyXCIgLCAxKVxuICAgIH0pO1xuICB9XG4gIC8vIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgLy8gICBwbGF5ZXIuc2V0KFwic3VibWl0dGVkXCIsIGZhbHNlKTtcbiAgLy8gfSk7XG4gIC8vIHN0YWdlLnNldChcInNob3dSZXN1bHRzXCIsIGZhbHNlKTtcbiAgLy8gc3RhZ2Uuc2V0KFwicmVzdWx0c1Nob3duXCIsIGZhbHNlKTtcblxufSk7XG5cbi8vIG9uU3RhZ2VFbmQgaXMgdHJpZ2dlcmVkIGFmdGVyIGVhY2ggc3RhZ2UuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uUm91bmRFbmQsIGFuZCB0aGUgc3RhZ2UgdGhhdCBqdXN0IGVuZGVkLlxuRW1waXJpY2Eub25TdGFnZUVuZCgoZ2FtZSwgcm91bmQsIHN0YWdlKSA9PntcbiAgY29uc29sZS5sb2coXCJTdGFnZSBFbmRlZFwiKVxuICBcbn0pO1xuXG4vLyBvblJvdW5kRW5kIGlzIHRyaWdnZXJlZCBhZnRlciBlYWNoIHJvdW5kLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvbkdhbWVFbmQsIGFuZCB0aGUgcm91bmQgdGhhdCBqdXN0IGVuZGVkLlxuRW1waXJpY2Eub25Sb3VuZEVuZCgoZ2FtZSwgcm91bmQpID0+IHtcbiAgLy8gZ2FtZS5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgLy8gICBjb25zdCB2YWx1ZSA9IHBsYXllci5yb3VuZC5nZXQoXCJ2YWx1ZVwiKSB8fCAwO1xuICAvLyAgIGNvbnN0IHByZXZTY29yZSA9IHBsYXllci5nZXQoXCJzY29yZVwiKSB8fCAwO1xuICAvLyAgIHBsYXllci5zZXQoXCJzY29yZVwiLCBwcmV2U2NvcmUgKyB2YWx1ZSk7XG4gIC8vIH0pO1xuXG59KTtcblxuLy8gb25HYW1lRW5kIGlzIHRyaWdnZXJlZCB3aGVuIHRoZSBnYW1lIGVuZHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZVN0YXJ0LlxuRW1waXJpY2Eub25HYW1lRW5kKGdhbWUgPT4ge30pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID0+IG9uU2V0LCBvbkFwcGVuZCBhbmQgb25DaGFuZ2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gb25TZXQsIG9uQXBwZW5kIGFuZCBvbkNoYW5nZSBhcmUgY2FsbGVkIG9uIGV2ZXJ5IHNpbmdsZSB1cGRhdGUgbWFkZSBieSBhbGxcbi8vIHBsYXllcnMgaW4gZWFjaCBnYW1lLCBzbyB0aGV5IGNhbiByYXBpZGx5IGJlY29tZSBxdWl0ZSBleHBlbnNpdmUgYW5kIGhhdmVcbi8vIHRoZSBwb3RlbnRpYWwgdG8gc2xvdyBkb3duIHRoZSBhcHAuIFVzZSB3aXNlbHkuXG4vL1xuLy8gSXQgaXMgdmVyeSB1c2VmdWwgdG8gYmUgYWJsZSB0byByZWFjdCB0byBlYWNoIHVwZGF0ZSBhIHVzZXIgbWFrZXMuIFRyeVxuLy8gbm9udGhlbGVzcyB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGNvbXB1dGF0aW9ucyBhbmQgZGF0YWJhc2Ugc2F2ZXMgKC5zZXQpXG4vLyBkb25lIGluIHRoZXNlIGNhbGxiYWNrcy4gWW91IGNhbiBhbHNvIHRyeSB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGNhbGxzIHRvXG4vLyBzZXQoKSBhbmQgYXBwZW5kKCkgeW91IG1ha2UgKGF2b2lkIGNhbGxpbmcgdGhlbSBvbiBhIGNvbnRpbnVvdXMgZHJhZyBvZiBhXG4vLyBzbGlkZXIgZm9yIGV4YW1wbGUpIGFuZCBpbnNpZGUgdGhlc2UgY2FsbGJhY2tzIHVzZSB0aGUgYGtleWAgYXJndW1lbnQgYXQgdGhlXG4vLyB2ZXJ5IGJlZ2lubmluZyBvZiB0aGUgY2FsbGJhY2sgdG8gZmlsdGVyIG91dCB3aGljaCBrZXlzIHlvdXIgbmVlZCB0byBydW5cbi8vIGxvZ2ljIGFnYWluc3QuXG4vL1xuLy8gSWYgeW91IGFyZSBub3QgdXNpbmcgdGhlc2UgY2FsbGJhY2tzLCBjb21tZW50IHRoZW0gb3V0IHNvIHRoZSBzeXN0ZW0gZG9lc1xuLy8gbm90IGNhbGwgdGhlbSBmb3Igbm90aGluZy5cblxuLy8gLy8gb25TZXQgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSAuc2V0KCkgbWV0aG9kXG4vLyAvLyBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvciBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vblNldCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4vLyApID0+IHtcbi8vICAgLy8gLy8gRXhhbXBsZSBmaWx0ZXJpbmdcbi8vICAgLy8gaWYgKGtleSAhPT0gXCJ2YWx1ZVwiKSB7XG4vLyAgIC8vICAgcmV0dXJuO1xuLy8gICAvLyB9XG4vLyB9KTtcblxuRW1waXJpY2Eub25TZXQoKFxuICBnYW1lLFxuICByb3VuZCxcbiAgc3RhZ2UsXG4gIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2VcbiAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4gIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbiAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4gIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuKSA9PiB7XG4gIGNvbnN0IHBsYXllcnMgPSBnYW1lLnBsYXllcnM7XG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICAvLyBTb21lIHBsYXllciBkZWNpZGVzIHRvIHJlY29uc2lkZXIgdGhlaXIgYW5zd2VyXG4gIGNvbnNvbGUubG9nKFwia2V5XCIsIGtleSk7XG4gIGlmIChrZXkgPT09IFwic3VibWl0dGVkXCIpIHsgXG4gICAgY29uc29sZS5sb2coXCJVcGRhdGVkIGEgc3VibWlzc2lvblwiKTtcbiAgICAvLyBDaGVja3MgaWYgZXZlcnlvbmUgaGFzIHN1Ym1pdHRlZCB0aGVpciBhbnN3ZXIgYW5kIGlmIHNvLCBzdWJtaXQgdGhlIHN0YWdlXG4gICAgbGV0IGFsbFN1Ym1pdHRlZCA9IHRydWU7XG4gICAgbGV0IG51bVBsYXllcnNTdWJtaXR0ZWQgPSAwO1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmdldChcInN1Ym1pdHRlZFwiKSkge1xuICAgICAgICBudW1QbGF5ZXJzU3VibWl0dGVkICs9IDE7XG4gICAgICB9XG4gICAgICBhbGxTdWJtaXR0ZWQgPSBwbGF5ZXIuZ2V0KFwic3VibWl0dGVkXCIpICYmIGFsbFN1Ym1pdHRlZDtcbiAgICB9KVxuICAgIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgbnVtUGxheWVyc1N1Ym1pdHRlZCk7XG4gICAgaWYgKGFsbFN1Ym1pdHRlZCkge1xuICAgICAgY29uc3QgbG9nID0gc3RhZ2UuZ2V0KFwibG9nXCIpO1xuICAgICAgY29tcHV0ZVNjb3JlKGFjdGl2ZVBsYXllcnMsIHN0YWdlLCByb3VuZCk7XG4gICAgICAvLyBOZWVkIHRvIHN1Ym1pdCBmb3Igc3VibWl0IHRoZSBzdGFnZSBmb3IgZXZlcnkgcGxheWVyXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgICAgIH0pXG4gICAgfVxuICAvLyAgIGlmIChzdGFnZS5nZXQoXCJyZXN1bHRzU2hvd25cIikpIHtcbiAgLy8gICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgLy8gICAgIH0pXG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gaWYgKHRhcmdldFR5cGUgPT09IFwic3RhZ2VcIiAmJiBrZXkgPT09IFwicmVzdWx0c1Nob3duXCIpIHtcbiAgLy8gICBpZiAoc3RhZ2UuZ2V0KFwicmVzdWx0c1Nob3duXCIpKSB7XG4gIC8vICAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4gIC8vICAgICB9KVxuICAvLyAgIH1cbiAgfVxuXG4gIC8vIGVsc2UgaWYgKGtleSA9PT0gXCJpbmFjdGl2ZVwiKSB7XG4gICAgLy8gZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgLy8gfVxuXG4gIHJldHVybjtcblxufSk7XG5cbmZ1bmN0aW9uIGNvbXB1dGVTY29yZShhY3RpdmVQbGF5ZXJzLCBzdGFnZSwgcm91bmQpIHtcbiAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuICBjb25zb2xlLmxvZyhcIkNPUlJFQ1QgQU5TV0VSOlwiKVxuICBjb25zb2xlLmxvZyhzdGFnZS5nZXQoXCJhbnN3ZXJcIikpO1xuICBjb25zb2xlLmxvZyhcIlBsYXllcnMgZ3Vlc3NlZDpcIilcblxuICBhY3RpdmVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICBjb25zdCBzdWJtaXNzaW9uID0gcGxheWVyLmdldChcInN5bWJvbFNlbGVjdGVkXCIpO1xuICAgIGNvbnNvbGUubG9nKHN1Ym1pc3Npb24pO1xuICAgIGlmIChzdWJtaXNzaW9uICE9PSBzdGFnZS5nZXQoXCJhbnN3ZXJcIikpIHtcbiAgICAgIHN1Y2Nlc3MgPSBmYWxzZVxuICAgIH1cbiAgfSlcbiAgcm91bmQuc2V0KFwicmVzdWx0XCIsIHN1Y2Nlc3MpO1xuICBpZiAoc3VjY2Vzcykge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgY29uc3QgcHJldlNjb3JlID0gcGxheWVyLmdldChcInNjb3JlXCIpIHx8IDA7XG4gICAgICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgcHJldlNjb3JlICsgMSk7XG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyhcIiBBbGwgcGxheWVycyBnb3QgaXQgY29ycmVjdGx5XCIpO1xuICB9IFxufVxuXG4vLyAvLyBvbkFwcGVuZCBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIGAuYXBwZW5kKClgIG1ldGhvZFxuLy8gLy8gb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3IgcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25BcHBlbmQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gKSA9PiB7XG4vLyAgIC8vIE5vdGU6IGB2YWx1ZWAgaXMgdGhlIHNpbmdsZSBsYXN0IHZhbHVlIChlLmcgMC4yKSwgd2hpbGUgYHByZXZWYWx1ZWAgd2lsbFxuLy8gICAvLyAgICAgICBiZSBhbiBhcnJheSBvZiB0aGUgcHJldmlzb3VzIHZhbHVlZCAoZS5nLiBbMC4zLCAwLjQsIDAuNjVdKS5cbi8vIH0pO1xuXG5cbi8vIC8vIG9uQ2hhbmdlIGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgYC5zZXQoKWAgb3IgdGhlXG4vLyAvLyBgLmFwcGVuZCgpYCBtZXRob2Qgb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3Jcbi8vIC8vIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uQ2hhbmdlKChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUsIC8vIFByZXZpb3VzIHZhbHVlXG4vLyAgIGlzQXBwZW5kIC8vIFRydWUgaWYgdGhlIGNoYW5nZSB3YXMgYW4gYXBwZW5kLCBmYWxzZSBpZiBpdCB3YXMgYSBzZXRcbi8vICkgPT4ge1xuLy8gICAvLyBgb25DaGFuZ2VgIGlzIHVzZWZ1bCB0byBydW4gc2VydmVyLXNpZGUgbG9naWMgZm9yIGFueSB1c2VyIGludGVyYWN0aW9uLlxuLy8gICAvLyBOb3RlIHRoZSBleHRyYSBpc0FwcGVuZCBib29sZWFuIHRoYXQgd2lsbCBhbGxvdyB0byBkaWZmZXJlbmNpYXRlIHNldHMgYW5kXG4vLyAgIC8vIGFwcGVuZHMuXG4vLyAgICBHYW1lLnNldChcImxhc3RDaGFuZ2VBdFwiLCBuZXcgRGF0ZSgpLnRvU3RyaW5nKCkpXG4vLyB9KTtcblxuLy8gLy8gb25TdWJtaXQgaXMgY2FsbGVkIHdoZW4gdGhlIHBsYXllciBzdWJtaXRzIGEgc3RhZ2UuXG4vLyBFbXBpcmljYS5vblN1Ym1pdCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyIC8vIFBsYXllciB3aG8gc3VibWl0dGVkXG4vLyApID0+IHtcbi8vIH0pO1xuIiwiY29uc3QgZmlsbGVyTmFtZXMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCIuc3BsaXQoXCJcIik7XG5jb25zdCBhbGxTeW1ib2xzID0gW1widDFcIiwgXCJ0MlwiLCBcInQzXCIsIFwidDRcIiwgXCJ0NVwiLCBcInQ2XCIsIFwidDdcIixcInQ4XCIsXCJ0OVwiLFwidDEwXCIsXCJ0MTFcIixcInQxMlwiXTtcblxuLy8gbiA9IG51bWJlciBvZiBwZW9wbGUgLCBwID0gbnVtYmVyIG9mIHN5bWJvbHNcbi8vIChuLTEpKnAgKyAxXG4vLyBpLmUuIG4gPSAzLCBwID0gMyA6IDdcblxuZXhwb3J0IGNvbnN0IHRlc3RUYW5ncmFtcyA9IFtcbiAge1xuICAgIF9pZDogXCIwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAyXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAzXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDNcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIzXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDRcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI0XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA1XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDVcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI1XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA2XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDZcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI2XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA3XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDdcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI3XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA4XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDhcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI4XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA5XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDlcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI5XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMFwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjExXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMlwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxM1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTNcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDE0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxNFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTVcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0M1wiLFxuICB9LFxuXG5dO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldE5laWdoYm9ycyhzdHJ1Y3R1cmUsIHBsYXllcikge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGxldCBuZXR3b3JrID0gc3RydWN0dXJlLnNwbGl0KFwiLFwiKTtcblxuICAgIG5ldHdvcmsuZm9yRWFjaCgobikgPT4ge1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IG4uc3BsaXQoXCItXCIpO1xuICAgICAgY29uc3QgcGxheWVySW5kZXggPSBwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpO1xuICBcbiAgICAgIGlmIChwbGF5ZXJJbmRleCA9PT0gcGFyc2VJbnQoY29ubmVjdGlvblswXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goY29ubmVjdGlvblsxXSk7XG4gICAgICB9IGVsc2UgaWYgKHBsYXllckluZGV4ID09PSBwYXJzZUludChjb25uZWN0aW9uWzFdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChjb25uZWN0aW9uWzBdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgXG4gICAgcmV0dXJuIF8udW5pcShuZWlnaGJvcnMsIHRydWUpO1xuICB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpIHtcbiAgICBjb25zdCBhY3RpdmVOb2RlcyA9IFtdO1xuICAgIGNvbnN0IGFsbE5vZGVzID0gW107XG4gICAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gICAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cblxuICAgIC8vIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgIC8vICAgYWN0aXZlTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICAvLyB9KVxuXG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIC8vIGlmIChwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdHZlXCIpKSB7XG4gICAgICBpZiAoIXAuZ2V0KFwiaW5hY3R2ZVwiKSkge1xuXG4gICAgICAgIGFjdGl2ZU5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgICB9XG4gICAgICBhbGxOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgIH0pXG5cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgLy8gT25seSBzaG93IGFjdGl2ZSBwZW9wbGVcbiAgICAgIC8vIGNvbnN0IG5ld05laWdoYm9ycyA9IGFjdGl2ZU5vZGVzLmZpbHRlcihpZCA9PiBwYXJzZUludChpZCkgIT09IHAuZ2V0KFwibm9kZUlkXCIpKVxuICAgICAgLy8gcC5zZXQoXCJuZWlnaGJvcnNcIiwgbmV3TmVpZ2hib3JzKTtcblxuICAgICAgLy8gU2hvdyBldmVyeW9uZSwgbWFyayBvZmZsaW5lIHBlb3BsZSBhcyBvZmZsaW5lXG4gICAgICBjb25zdCBuZXdOZWlnaGJvcnMgPSBhbGxOb2Rlcy5maWx0ZXIoaWQgPT4gcGFyc2VJbnQoaWQpICE9PSBwLmdldChcIm5vZGVJZFwiKSlcbiAgICAgIHAuc2V0KFwibmVpZ2hib3JzXCIsIG5ld05laWdoYm9ycyk7XG4gICAgICBjb25zb2xlLmxvZyhwLmdldChcIm5laWdoYm9yc1wiKSk7XG4gICAgfSlcbn0iLCJpbXBvcnQgRW1waXJpY2EgZnJvbSBcIm1ldGVvci9lbXBpcmljYTpjb3JlXCI7XG5pbXBvcnQgXCIuL2JvdHMuanNcIjtcbmltcG9ydCBcIi4vY2FsbGJhY2tzLmpzXCI7XG5cbmltcG9ydCB7IHRlc3RTeW1ib2xzLCB0ZXN0VGFuZ3JhbXMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjsgXG5pbXBvcnQgeyBnZXROZWlnaGJvcnMsIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIgfSBmcm9tIFwiLi91dGlsXCI7XG5cbi8vIGdhbWVJbml0IGlzIHdoZXJlIHRoZSBzdHJ1Y3R1cmUgb2YgYSBnYW1lIGlzIGRlZmluZWQuXG4vLyBKdXN0IGJlZm9yZSBldmVyeSBnYW1lIHN0YXJ0cywgb25jZSBhbGwgdGhlIHBsYXllcnMgbmVlZGVkIGFyZSByZWFkeSwgdGhpc1xuLy8gZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggdGhlIHRyZWF0bWVudCBhbmQgdGhlIGxpc3Qgb2YgcGxheWVycy5cbi8vIFlvdSBtdXN0IHRoZW4gYWRkIHJvdW5kcyBhbmQgc3RhZ2VzIHRvIHRoZSBnYW1lLCBkZXBlbmRpbmcgb24gdGhlIHRyZWF0bWVudFxuLy8gYW5kIHRoZSBwbGF5ZXJzLiBZb3UgY2FuIGFsc28gZ2V0L3NldCBpbml0aWFsIHZhbHVlcyBvbiB5b3VyIGdhbWUsIHBsYXllcnMsXG4vLyByb3VuZHMgYW5kIHN0YWdlcyAod2l0aCBnZXQvc2V0IG1ldGhvZHMpLCB0aGF0IHdpbGwgYmUgYWJsZSB0byB1c2UgbGF0ZXIgaW5cbi8vIHRoZSBnYW1lLlxuRW1waXJpY2EuZ2FtZUluaXQoZ2FtZSA9PiB7XG4gIGNvbnN0IHtcbiAgICB0cmVhdG1lbnQ6IHtcbiAgICAgIHBsYXllckNvdW50LFxuICAgICAgbmV0d29ya1N0cnVjdHVyZSxcbiAgICAgIG51bVRhc2tSb3VuZHMsXG4gICAgICBudW1TdXJ2ZXlSb3VuZHMsXG4gICAgICBzZXRTaXplQmFzZWRPblBsYXllckNvdW50LFxuICAgICAgdXNlckluYWN0aXZpdHlEdXJhdGlvbixcbiAgICAgIHRhc2tEdXJhdGlvbixcbiAgICAgIGRlZmF1bHRTZXRTaXplLFxuICAgICAgc3VydmV5RHVyYXRpb24sXG4gICAgICByZXN1bHRzRHVyYXRpb24sXG4gICAgICBtYXhOdW1PdmVybGFwLFxuICAgIH0sXG4gIH0gPSBnYW1lO1xuXG5cbiAgY29uc3Qgc3ltYm9sU2V0ID0gdGVzdFRhbmdyYW1zO1xuICBjb25zdCBzZXRTaXplID0gc2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCA/IHBsYXllckNvdW50ICsgMSA6IGRlZmF1bHRTZXRTaXplOyAvL1RPRE86IGNhbiBjaGFuZ2UgZGVmYXVsdCB2YWx1ZSBpbiBzZXR0aW5nc1xuICBjb25zdCBudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkgPSBudW1UYXNrUm91bmRzL251bVN1cnZleVJvdW5kcztcblxuICBjb25zdCBjb2xvcnMgPSBbXCJHcmVlblwiLCBcIlJlZFwiLCBcIlllbGxvd1wiLCBcIkJsdWVcIiwgXCJQdXJscGVcIiwgXCJXaGl0ZVwiLCBcIkJsYWNrXCJdXG5cblxuICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyLCBpKSA9PiB7XG4gICAgcGxheWVyLnNldChcImF2YXRhclwiLCBgL2F2YXRhcnMvamRlbnRpY29uLyR7cGxheWVyLl9pZH1gKTtcbiAgICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMCk7XG5cbiAgICAvLyBHaXZlIGVhY2ggcGxheWVyIGEgbm9kZUlkIGJhc2VkIG9uIHRoZWlyIHBvc2l0aW9uIChpbmRleGVkIGF0IDEpXG4gICAgcGxheWVyLnNldChcIm5vZGVJZFwiLCBpICsgMSk7XG4gICAgcGxheWVyLnNldChcIm5hbWVcIiwgcGxheWVyLmlkKTtcbiAgICBwbGF5ZXIuc2V0KFwiYW5vbnltb3VzTmFtZVwiLCBjb2xvcnNbaV0pXG4gIH0pO1xuXG5cbiAgaWYgKGdhbWUucGxheWVycy5sZW5ndGggPCBnYW1lLnRyZWF0bWVudC5wbGF5ZXJDb3VudCkge1xuICAgIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSk7XG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHAuZ2V0KFwibmVpZ2hib3JzXCIpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgcC5zZXQoXCJuZWlnaGJvcnNcIiwgZ2V0TmVpZ2hib3JzKG5ldHdvcmtTdHJ1Y3R1cmUsIHApKTtcbiAgICAgIGNvbnNvbGUubG9nKHAuZ2V0KFwibmVpZ2hib3JzXCIpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEZvciBlYWNoIHJvdW5kLCBhZGQgYWxsIHRoZSBzeW1ib2xzLCByYW5kb21seSBzZWxlY3QgYSBjb3JyZWN0IGFuc3dlciBhbmRcbiAgLy8gQ29uc3RyYWludHM6IE11c3QgZW5zdXJlIHRoYXQgZXZlcnlvbmUgaGFzIG9ubHkgb25lIHN5bWJvbCBpbiBjb21tb25cbiAgXy50aW1lcyggbnVtVGFza1JvdW5kcywgaSA9PiB7XG4gICAgY29uc3Qgcm91bmQgPSBnYW1lLmFkZFJvdW5kKCk7XG5cbiAgICBjb25zdCB7c3ltYm9scywgdGFza05hbWUsIGFuc3dlcn0gPSBzeW1ib2xTZXRbaV07XG5cbiAgICBjb25zdCB0YXNrU3RhZ2UgPSByb3VuZC5hZGRTdGFnZSh7XG4gICAgICBuYW1lOiBcIlRhc2tcIixcbiAgICAgIGRpc3BsYXlOYW1lOiB0YXNrTmFtZSxcbiAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgZHVyYXRpb25JblNlY29uZHM6IHRhc2tEdXJhdGlvblxuICAgIH0pO1xuICAgIHRhc2tTdGFnZS5zZXQoXCJ0YXNrXCIsIHN5bWJvbFNldFtpXSk7XG4gICAgZ2V0U3ltYm9sc0ZvclBsYXllcnMoc3ltYm9scywgYW5zd2VyLCBzZXRTaXplLCB0YXNrTmFtZSwgZ2FtZSwgbWF4TnVtT3ZlcmxhcClcbiAgICB0YXNrU3RhZ2Uuc2V0KFwiYW5zd2VyXCIsIHN5bWJvbFNldFtpXS5hbnN3ZXIpXG5cbiAgICBjb25zdCByZXN1bHRTdGFnZSA9IHJvdW5kLmFkZFN0YWdlKHtcbiAgICAgIG5hbWU6IFwiUmVzdWx0XCIsXG4gICAgICBkaXNwbGF5TmFtZTogXCJSZXN1bHRcIixcbiAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiByZXN1bHRzRHVyYXRpb25cbiAgICB9KTtcbiAgICBcbiAgICBpZiAoKGkrMSkgJSBudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkgPT09IDApIHsgLy8gQWZ0ZXIgNSB0YXNrIHJvdW5kcywgYWRkIGEgc3VydmV5IHJvdW5kXG4gICAgICBjb25zdCBzdXJ2ZXlSb3VuZCA9IGdhbWUuYWRkUm91bmQoKTtcblxuICAgICAgY29uc3Qgc3VydmV5U3RhZ2VzID0gc3VydmV5Um91bmQuYWRkU3RhZ2Uoe1xuICAgICAgICBuYW1lOiBcIlN1cnZleVwiLFxuICAgICAgICBkaXNwbGF5TmFtZTogXCJTdXJ2ZXlcIixcbiAgICAgICAgZHVyYXRpb25JblNlY29uZHM6IHN1cnZleUR1cmF0aW9uXG4gICAgICB9KVxuICAgIH1cblxuXG4gICAgLy8gUXVlc3Rpb246IFdoYXQncyB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHNldHRpbmcgc29tZXRoaW5nIGFuZFxuICAgIC8vIGFkZGluZyBpdCBpbnRvIGFkZCBzdGFnZVxuICB9KTtcblxuXG5cbiAgLy8gZnVuY3Rpb24gZ2V0U3ltYm9sc0ZvclBsYXllcnMoc3ltYm9sU2V0LCBhbnN3ZXIsIHNpemUsIHRhc2tOYW1lLCBnYW1lKSB7XG4gIC8vICAgbGV0IHN5bWJvbHNXaXRob3V0QW5zd2VyID0gc3ltYm9sU2V0LmZpbHRlcihzeW1ib2wgPT4gc3ltYm9sICE9PSBhbnN3ZXIpO1xuICAvLyAgIGxldCBzaHVmZmxlZFN5bWJvbHMgPSBzaHVmZmxlKHN5bWJvbHNXaXRob3V0QW5zd2VyKTtcblxuICAvLyAgIC8vIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gIC8vICAgLy8gICAvLyBGaW5kaW5nIGEgcmFuZG9tIHNwbGljZSBvZiBzeW1ib2xzIHdpdGhvdXQgdGhlIGFuc3dlciAoaGVuY2UgLTIpXG4gIC8vICAgLy8gICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChzeW1ib2xzV2l0aG91dEFuc3dlci5sZW5ndGggKyBzaXplIC0gMikpO1xuICAvLyAgIC8vICAgbGV0IHN1YnNldCA9IHNodWZmbGVkU3ltYm9scy5zcGxpY2UocmFuZG9tSW5kZXgsIHJhbmRvbUluZGV4ICsgc2l6ZSlcbiAgICAgIFxuICAvLyAgIC8vICAgLy8gQWRkaW5nIGluIHRoZSBhbnN3ZXIgaW4gYSByYW5kb20gc3BvdFxuICAvLyAgIC8vICAgc3Vic2V0LnNwbGljZShyYW5kb21JbmRleCAlIHNpemUsIDAsIGFuc3dlcik7XG4gIC8vICAgLy8gICBwLnNldChgJHt0YXNrTmFtZX1gLCBzdWJzZXQpO1xuICAvLyAgIC8vIH0pXG5cbiAgLy8gICBsZXQgc3ltYm9sRnJlcSA9IHt9XG4gIC8vICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzeW1ib2xzV2l0aG91dEFuc3dlci5sZW5ndGg7IGkrKykge1xuICAvLyAgICAgY29uc3Qgc3ltYm9sID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXJbaV1cbiAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCFzeW1ib2xGcmVxLmhhc093blByb3BlcnR5KHN5bWJvbCkpO1xuICAvLyAgICAgaWYgKCFzeW1ib2xGcmVxLmhhc093blByb3BlcnR5KHN5bWJvbCkpIHtcbiAgLy8gICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdID0gMFxuICAvLyAgICAgfVxuICAvLyAgIH1cblxuICAvLyAgIGxldCBzdWJzZXRzVG9DcmVhdGUgPSBnYW1lLnBsYXllcnMubGVuZ3RoO1xuICAvLyAgIGxldCBzdWJzZXRBcnJheSA9IFtdXG4gIC8vICAgbGV0IHN1YnNldCA9IFtdXG4gIC8vICAgbGV0IG1heEZyZXEgPSAwO1xuICAvLyAgIGxldCBhbGxTYW1lRnJlcSA9IHRydWU7XG4gIC8vICAgLy8gY29uc29sZS5sb2coc3Vic2V0c1RvQ3JlYXRlKTtcbiAgLy8gICAvLyBjb25zb2xlLmxvZyhcIkhpXCIpO1xuICAvLyAgIC8vIGNvbnNvbGUubG9nKHN5bWJvbEZyZXEpO1xuICAvLyAgIHdoaWxlIChzdWJzZXRzVG9DcmVhdGUgPiAwKSB7XG4gIC8vICAgICBpZiAoYWxsU2FtZUZyZXEpIHtcbiAgLy8gICAgICAgbWF4RnJlcSArPSAxXG4gIC8vICAgICB9XG4gIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN5bWJvbHNXaXRob3V0QW5zd2VyLmxlbmd0aDsgaSsrKSB7XG4gIC8vICAgICAgIGNvbnN0IHN5bWJvbCA9IHN5bWJvbHNXaXRob3V0QW5zd2VyW2ldXG4gIC8vICAgICAgIGlmIChzeW1ib2xGcmVxW3N5bWJvbF0gPCBtYXhGcmVxICYmICFzdWJzZXQuaW5jbHVkZXMoc3ltYm9sKSkgeyAvLyBBZGQgc3ltYm9scyB0byBzdWJzZXQgYmFzZWQgb24gdGhlIHN5bWJvbCBmcmVxXG4gIC8vICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdICs9IDFcbiAgLy8gICAgICAgICBzdWJzZXQucHVzaChzeW1ib2wpO1xuICAvLyAgICAgICAgIGFsbFNhbWVGcmVxID0gZmFsc2U7XG5cbiAgLy8gICAgICAgfVxuICAvLyAgICAgICAvLyBTdWJzZXQgaXMgb25seSBtaXNzaW5nIGFuc3dlciA9PiBhZGQgYW5zd2VyXG4gIC8vICAgICAgIC8vIEFkZCBzdWJzZXQgdG8gb3ZlcmFsbCBhcnJheSBhbmQgcmVzZXQgXG4gIC8vICAgICAgIGlmIChzdWJzZXQubGVuZ3RoID09PSBzaXplIC0gMSkgeyBcbiAgLy8gICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChzaXplLSAxKSk7XG4gIC8vICAgICAgICAgc3Vic2V0LnNwbGljZShyYW5kb21JbmRleCwgMCwgYW5zd2VyKTtcbiAgLy8gICAgICAgICBzdWJzZXRBcnJheS5wdXNoKHN1YnNldCk7XG4gIC8vICAgICAgICAgY29uc29sZS5sb2coc3Vic2V0KTtcbiAgLy8gICAgICAgICBzdWJzZXRzVG9DcmVhdGUgLT0gMTtcbiAgLy8gICAgICAgICBzdWJzZXQgPSBbXVxuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgICAvLyBDaGVjayB0aGUgZnJlcXVlbmNpZXMgb2YgdGhlIHN5bWJvbHNcbiAgLy8gICAgIGFsbFNhbWVGcmVxID0gT2JqZWN0LmtleXMoc3ltYm9sRnJlcSkuZXZlcnkoKGtleSkgPT4gc3ltYm9sRnJlcVtrZXldID09PSBtYXhGcmVxKTtcbiAgLy8gICAgIC8vIGNvbnNvbGUubG9nKFwiU2FtZSBmcmVxXCIpO1xuICAvLyAgICAgLy8gY29uc29sZS5sb2coYWxsU2FtZUZyZXEpO1xuICAvLyAgIH1cbiAgLy8gICBsZXQgaSA9IDA7XG4gIC8vICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgLy8gICAgIHAuc2V0KGAke3Rhc2tOYW1lfWAsIHN1YnNldEFycmF5W2ldKTtcbiAgLy8gICAgIGkgKz0gMTtcbiAgLy8gICB9KVxuXG4gIC8vIH1cblxuICBmdW5jdGlvbiBnZXRTeW1ib2xzRm9yUGxheWVycyhzeW1ib2xTZXQsIGFuc3dlciwgc2V0U2l6ZSwgdGFza05hbWUsIGdhbWUsIG1heE51bU92ZXJsYXApIHtcbiAgICAgIGxldCBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHN5bWJvbFNldC5maWx0ZXIoc3ltYm9sID0+IHN5bWJvbCAhPT0gYW5zd2VyKTtcbiAgICAgIHN5bWJvbHNXaXRob3V0QW5zd2VyID0gc2h1ZmZsZShzeW1ib2xzV2l0aG91dEFuc3dlcik7XG4gICAgICBsZXQgbnVtUGxheWVycyA9IGdhbWUucGxheWVycy5sZW5ndGg7XG4gICAgICBsZXQgbnVtT3ZlcmxhcCA9IDA7XG5cblxuICAgICAgLy8gQ3JlYXRlIGEgZGljdGlvbmFyeSB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IHRpbWVzIHN5bWJvbCBoYXMgYmVlbiB1c2VkXG4gICAgICBsZXQgc3ltYm9sRnJlcSA9IHt9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN5bWJvbHNXaXRob3V0QW5zd2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBzeW1ib2wgPSBzeW1ib2xzV2l0aG91dEFuc3dlcltpXVxuICAgICAgICAvLyBjb25zb2xlLmxvZyghc3ltYm9sRnJlcS5oYXNPd25Qcm9wZXJ0eShzeW1ib2wpKTtcbiAgICAgICAgaWYgKCFzeW1ib2xGcmVxLmhhc093blByb3BlcnR5KHN5bWJvbCkpIHtcbiAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gPSBudW1QbGF5ZXJzIC0gMTsgLy8gVG90YWwgdGltZSBhIHN5bWJvbCBjYW4gYmUgdXNlZCBcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIGxldCBzeW1ib2xzUGlja2VkID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ltYm9sc1dpdGhvdXRBbnN3ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgc3ltYm9sID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXJbaV1cbiAgICAgICAgICBpZiAoc3ltYm9sc1BpY2tlZC5sZW5ndGggPCBzZXRTaXplIC0gMSkgeyAvLyBBZGQgc3ltYm9scyB1bnRpbCBzZXRTaXplIC0gMSBmb3IgYW5zd2VyXG4gICAgICAgICAgICBpZiAoc3ltYm9sRnJlcVtzeW1ib2xdIC0gMSA9PT0gMCkgeyAvLyBUaGlzIHN5bWJvbCB3aWxsIG92ZXJsYXBcbiAgICAgICAgICAgICAgICBpZiAobnVtT3ZlcmxhcCA8IG1heE51bU92ZXJsYXAgKSB7IC8vIE9ubHkgYWRkIGlmIGxlc3MgdGhhbiBtYXggb3ZlcmxhcFxuICAgICAgICAgICAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gLT0gMTtcbiAgICAgICAgICAgICAgICAgIG51bU92ZXJsYXAgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKGFuc3dlcik7IC8vIEFkZCB0aGUgYW5zd2VyXG4gICAgICAgIGZvciAodmFyIHN5bWJvbFRvUmVtb3ZlIG9mIHN5bWJvbHNQaWNrZWQpIHtcbiAgICAgICAgICBpZiAoc3ltYm9sRnJlcVtzeW1ib2xUb1JlbW92ZV0gPT09IDApIHsgLy8gSWYgc3ltYm9sIGhhcyBiZWVuIHBpY2tlZCBuLTEgcGxheWVycyB0aW1lcywgcmVtb3ZlIGl0IGZyb20gdGhlIHNldFxuICAgICAgICAgICAgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xzV2l0aG91dEFuc3dlci5maWx0ZXIoc3ltYm9sID0+IHN5bWJvbCAhPT0gc3ltYm9sVG9SZW1vdmUpO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3ltYm9sc1BpY2tlZCA9IHNodWZmbGUoc3ltYm9sc1BpY2tlZCk7XG5cbiAgICAgICAgcGxheWVyLnNldCh0YXNrTmFtZSwgc3ltYm9sc1BpY2tlZCk7XG4gICAgICB9KVxuXG5cbiAgfVxuXG4gIC8vIFNodWZmbGluZyBhcnJheXM6XG4gIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUwNTM2MDQ0L3N3YXBwaW5nLWFsbC1lbGVtZW50cy1vZi1hbi1hcnJheS1leGNlcHQtZm9yLWZpcnN0LWFuZC1sYXN0XG4gIGZ1bmN0aW9uIHNodWZmbGUoc3ltYm9sU2V0KSB7XG4gICAgZm9yIChpID0gc3ltYm9sU2V0Lmxlbmd0aCAtMSA7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcblxuICAgICAgW3N5bWJvbFNldFtpXSwgc3ltYm9sU2V0W2pdXSA9IFtzeW1ib2xTZXRbal0sIHN5bWJvbFNldFtpXV07XG4gICAgfVxuICAgIHJldHVybiBzeW1ib2xTZXQ7XG4gIH1cblxufSk7XG4iXX0=
