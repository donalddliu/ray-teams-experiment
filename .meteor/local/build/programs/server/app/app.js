var require = meteorInstall({"server":{"bots.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/bots.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"callbacks.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/callbacks.js                                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
let moment;
module.link("moment", {
  default(v) {
    moment = v;
  }

}, 2);
let TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync(v) {
    TimeSync = v;
  }

}, 3);
// onGameStart is triggered opnce per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart(game => {
  console.log("Game started");
  game.players.forEach(player => {
    player.set("inactive", false);
    player.set("inactiveWarningUsed", false);
    player.set("lastActive", moment(Date.now()));
    const network = player.get("neighbors");
    const activeChats = [];
    network.map(otherNodeId => {
      var pairOfPlayers = [player.get("nodeId"), parseInt(otherNodeId)];
      pairOfPlayers.sort((p1, p2) => p1 - p2);
      const otherPlayer = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId));
      const chatKey = "".concat(pairOfPlayers[0], "-").concat(pairOfPlayers[1]);
      activeChats.push(chatKey);
    }); // Default all chats to be open when game starts

    player.set("activeChats", activeChats);
  });
  game.set("previousNumActivePlayers", game.players.length);
  game.set("gameStartTime", moment(Date.now()));

  if (game.treatment.maxGameTime) {
    game.set("maxGameEndTime", moment(Date.now()).add(game.treatment.maxGameTime, 'm'));
  }
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
        // p.exit("someoneInactive");
        p.exit("minPlayerCountNotMaintained");
      });
    } else {
      getFullyConnectedLayer(game); // Updates the neighbors to be fully connected

      game.set("checkForSimilarSymbol", true);
    }
  }

  game.set("previousNumActivePlayers", activePlayers.length);

  if (game.treatment.minPlayerCount && activePlayers.length < game.treatment.minPlayerCount) {
    activePlayers.forEach(p => {
      p.exit("minPlayerCountNotMaintained");
    });
  }

  console.log("Round Started");
}); // onStageStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.

Empirica.onStageStart((game, round, stage) => {
  console.log("Stage Started"); // const activePlayers = game.players.filter(p => p.online === true && !p.get("inactive"));

  const activePlayers = game.players.filter(p => !p.get("inactive"));

  if (stage.name === "Task") {
    activePlayers.forEach(player => {
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

Empirica.onRoundEnd((game, round) => {
  console.log("Round Ended"); // game.players.forEach(player => {
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
  console.log("key", key); // const activePlayers = game.players.filter(p => p.online === true && !p.get("inactive"));

  const activePlayers = game.players.filter(p => !p.get("inactive")); // Some player decides to reconsider their answer

  if (key === "submitted") {
    // Checks if everyone has submitted their answer and if so, submit the stage
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
      if (stage.name === "Task") {
        computeScore(activePlayers, game, stage, round);
      } // Need to submit for submit the stage for every player


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

function computeScore(activePlayers, game, stage, round) {
  let success = true;
  console.log("CORRECT ANSWER:");
  console.log(stage.get("answer"));
  console.log("Players guessed:");
  let playerAnswers = [];

  const allAnswersEqual = arr => arr.every(v => v === arr[0]); //Func to check if all player answers are equal


  activePlayers.forEach(player => {
    const submission = player.get("symbolSelected");
    console.log(submission);

    if (game.get("checkForSimilarSymbol")) {
      playerAnswers.push(submission);
    }

    if (submission !== stage.get("answer")) {
      success = false;
    }
  });

  if (game.get("checkForSimilarSymbol")) {
    if (allAnswersEqual(playerAnswers)) {
      success = true;
    }
  }

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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/constants.js                                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  testTangrams: () => testTangrams
});
const allSymbols = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12"]; // n = number of people , p = number of symbols
// (n-1)*p + 1
// i.e. n = 3, p = 3 : 7

const testTangrams = [{
  _id: "0",
  taskName: "Task 1",
  symbols: allSymbols
}, {
  _id: "1",
  taskName: "Task 2",
  symbols: allSymbols
}, {
  _id: "2",
  taskName: "Task 3",
  symbols: allSymbols
}, {
  _id: "3",
  taskName: "Task 4",
  symbols: allSymbols
}, {
  _id: "4",
  taskName: "Task 5",
  symbols: allSymbols
}, {
  _id: "5",
  taskName: "Task 6",
  symbols: allSymbols
}, {
  _id: "6",
  taskName: "Task 7",
  symbols: allSymbols
}, {
  _id: "7",
  taskName: "Task 8",
  symbols: allSymbols
}, {
  _id: "8",
  taskName: "Task 9",
  symbols: allSymbols
}, {
  _id: "9",
  taskName: "Task 10",
  symbols: allSymbols
}, {
  _id: "10",
  taskName: "Task 11",
  symbols: allSymbols
}, {
  _id: "11",
  taskName: "Task 12",
  symbols: allSymbols
}, {
  _id: "12",
  taskName: "Task 13",
  symbols: allSymbols
}, {
  _id: "13",
  taskName: "Task 14",
  symbols: allSymbols
}, {
  _id: "14",
  taskName: "Task 15",
  symbols: allSymbols
}];
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"util.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/util.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  getNeighbors: () => getNeighbors,
  getFullyConnectedLayer: () => getFullyConnectedLayer
});

function getNeighbors(structure, player) {
  const neighbors = [];
  let network = structure.split(",");
  const playerIndex = player.get("nodeId");
  network.forEach(n => {
    const connection = n.split("-");

    if (playerIndex === parseInt(connection[0])) {
      neighbors.push(connection[1].replace(/\s/g, ''));
    } else if (playerIndex === parseInt(connection[1])) {
      neighbors.push(connection[0].replace(/\s/g, ''));
    }
  });
  return [...new Set(neighbors)];
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
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Empirica;
module.link("meteor/empirica:core", {
  default(v) {
    Empirica = v;
  }

}, 0);
module.link("./bots.js");
module.link("./callbacks.js");

let _;

module.link("lodash", {
  default(v) {
    _ = v;
  }

}, 1);
let testSymbols, testTangrams;
module.link("./constants", {
  testSymbols(v) {
    testSymbols = v;
  },

  testTangrams(v) {
    testTangrams = v;
  }

}, 2);
let getNeighbors, getFullyConnectedLayer;
module.link("./util", {
  getNeighbors(v) {
    getNeighbors = v;
  },

  getFullyConnectedLayer(v) {
    getFullyConnectedLayer = v;
  }

}, 3);
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
  let colors = ["Green", "Red", "Yellow", "Blue", "Purple", "White", "Black", "Brown", "Gray", "Peach", "Cyan", "Orange"];
  let surveyNum = 1;
  colors = _.shuffle(colors);
  game.players.forEach((player, i) => {
    player.set("avatar", "/avatars/jdenticon/".concat(player._id));
    player.set("score", 0); // Give each player a nodeId based on their position (indexed at 1)

    player.set("nodeId", i + 1);
    player.set("name", player.id);
    player.set("anonymousName", colors[i]);
  });

  if (game.players.length < game.treatment.playerCount) {
    // if not a full game, default to fully connected layer
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
      taskName
    } = symbolSet[i];
    const taskStage = round.addStage({
      name: "Task",
      displayName: taskName,
      durationInSeconds: taskDuration
    });
    taskStage.set("task", symbolSet[i]);
    let answer = distributeSymbolsForPlayers(symbols, playerCount, taskName, game);
    taskStage.set("answer", answer);
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
        displayName: "Survey " + surveyNum,
        durationInSeconds: surveyDuration
      });
      surveyNum++;
    }
  });

  function getSymbolsForPlayers(symbolSet, answer, setSize, taskName, game, maxNumOverlap) {
    let symbolsWithoutAnswer = symbolSet.filter(symbol => symbol !== answer);
    symbolsWithoutAnswer = _.shuffle(symbolsWithoutAnswer);
    let numPlayers = game.players.length;
    let numOverlap = 0; // Create a dictionary to keep track of how many times symbol has been used

    let symbolFreq = {};

    for (let i = 0; i < symbolsWithoutAnswer.length; i++) {
      let symbol = symbolsWithoutAnswer[i];

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

      symbolsPicked = _.shuffle(symbolsPicked);
      player.set(taskName, symbolsPicked);
    });
  }

  function distributeSymbolsForPlayers(symbolSet, playerCount, taskName, game) {
    // Find a subset of N+1 symbols to use
    // TODO: Might need a different algorithm to select the subset of symbols
    let reducedSymbolSet = [];

    for (let i = 1; i <= playerCount + 1; i++) {
      let symbolNum = _.sample(symbolSet);

      let removedSymbolNum = _.remove(symbolSet, num => num === symbolNum);

      reducedSymbolSet.push(symbolNum);
    }

    let fullSymbolDistribution = createSymbolSetDistribution(reducedSymbolSet); // Give player a specific symbol that their set of cards won't have

    let cardDistributions = {};
    game.players.forEach(player => {
      let cardSetNum = _.sample(reducedSymbolSet);

      let removedCardSetNum = _.remove(reducedSymbolSet, num => num === cardSetNum);

      cardDistributions[player.get("nodeId")] = cardSetNum;
    }); // The last symbol remaining is the answer

    let answer = _.sample(reducedSymbolSet); // Distrbute players a set of cards that all have the answer, but without their specific symbol


    game.players.forEach(player => {
      let symbolsPicked = fullSymbolDistribution[answer][cardDistributions[player.get("nodeId")]];
      player.set(taskName, symbolsPicked);
    });
    return answer;
  }

  function createSymbolSetDistribution(symbolSet) {
    // Given the symbol set, creates all combinations of sets with one commmon answer and one specfic symbol removed
    let fullDistribution = {};
    symbolSet.forEach(answer => {
      symbolsWithoutAnswer = symbolSet.filter(s => s !== answer);
      let distribution = {};
      let i = 0;
      symbolsWithoutAnswer.forEach(s => {
        let symbolsWithoutSymbolToRemove = symbolsWithoutAnswer.filter(remove => remove !== s);
        symbolsWithoutSymbolToRemove.push(answer);
        distribution[s] = _.sortBy(symbolsWithoutSymbolToRemove);
        i++;
      });
      fullDistribution[answer] = distribution;
    });
    return fullDistribution;
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".mjs"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm1vbWVudCIsIlRpbWVTeW5jIiwib25HYW1lU3RhcnQiLCJjb25zb2xlIiwibG9nIiwicGxheWVycyIsImZvckVhY2giLCJwbGF5ZXIiLCJzZXQiLCJEYXRlIiwibm93IiwibmV0d29yayIsImdldCIsImFjdGl2ZUNoYXRzIiwibWFwIiwib3RoZXJOb2RlSWQiLCJwYWlyT2ZQbGF5ZXJzIiwicGFyc2VJbnQiLCJzb3J0IiwicDEiLCJwMiIsIm90aGVyUGxheWVyIiwiZmluZCIsInAiLCJjaGF0S2V5IiwicHVzaCIsImxlbmd0aCIsInRyZWF0bWVudCIsIm1heEdhbWVUaW1lIiwiYWRkIiwib25Sb3VuZFN0YXJ0IiwiYWN0aXZlUGxheWVycyIsImZpbHRlciIsImVuZEdhbWVJZlBsYXllcklkbGUiLCJleGl0IiwibWluUGxheWVyQ291bnQiLCJvblN0YWdlU3RhcnQiLCJuYW1lIiwiZGlzcGxheU5hbWUiLCJvblN0YWdlRW5kIiwib25Sb3VuZEVuZCIsIm9uR2FtZUVuZCIsIm9uU2V0IiwidGFyZ2V0IiwidGFyZ2V0VHlwZSIsImtleSIsInZhbHVlIiwicHJldlZhbHVlIiwiYWxsU3VibWl0dGVkIiwibnVtUGxheWVyc1N1Ym1pdHRlZCIsImNvbXB1dGVTY29yZSIsInN1Ym1pdCIsInN1Y2Nlc3MiLCJwbGF5ZXJBbnN3ZXJzIiwiYWxsQW5zd2Vyc0VxdWFsIiwiYXJyIiwiZXZlcnkiLCJzdWJtaXNzaW9uIiwicHJldlNjb3JlIiwiZXhwb3J0IiwidGVzdFRhbmdyYW1zIiwiYWxsU3ltYm9scyIsIl9pZCIsInRhc2tOYW1lIiwic3ltYm9scyIsImdldE5laWdoYm9ycyIsInN0cnVjdHVyZSIsIm5laWdoYm9ycyIsInNwbGl0IiwicGxheWVySW5kZXgiLCJuIiwiY29ubmVjdGlvbiIsInJlcGxhY2UiLCJTZXQiLCJhY3RpdmVOb2RlcyIsImFsbE5vZGVzIiwibmV3TmVpZ2hib3JzIiwiaWQiLCJfIiwidGVzdFN5bWJvbHMiLCJnYW1lSW5pdCIsInBsYXllckNvdW50IiwibmV0d29ya1N0cnVjdHVyZSIsIm51bVRhc2tSb3VuZHMiLCJudW1TdXJ2ZXlSb3VuZHMiLCJzZXRTaXplQmFzZWRPblBsYXllckNvdW50IiwidXNlckluYWN0aXZpdHlEdXJhdGlvbiIsInRhc2tEdXJhdGlvbiIsImRlZmF1bHRTZXRTaXplIiwic3VydmV5RHVyYXRpb24iLCJyZXN1bHRzRHVyYXRpb24iLCJtYXhOdW1PdmVybGFwIiwic3ltYm9sU2V0Iiwic2V0U2l6ZSIsIm51bVJvdW5kc0JlZm9yZVN1cnZleSIsImNvbG9ycyIsInN1cnZleU51bSIsInNodWZmbGUiLCJpIiwidGltZXMiLCJhZGRSb3VuZCIsInRhc2tTdGFnZSIsImFkZFN0YWdlIiwiZHVyYXRpb25JblNlY29uZHMiLCJhbnN3ZXIiLCJkaXN0cmlidXRlU3ltYm9sc0ZvclBsYXllcnMiLCJyZXN1bHRTdGFnZSIsInN1cnZleVJvdW5kIiwic3VydmV5U3RhZ2VzIiwiZ2V0U3ltYm9sc0ZvclBsYXllcnMiLCJzeW1ib2xzV2l0aG91dEFuc3dlciIsInN5bWJvbCIsIm51bVBsYXllcnMiLCJudW1PdmVybGFwIiwic3ltYm9sRnJlcSIsImhhc093blByb3BlcnR5Iiwic3ltYm9sc1BpY2tlZCIsInN5bWJvbFRvUmVtb3ZlIiwicmVkdWNlZFN5bWJvbFNldCIsInN5bWJvbE51bSIsInNhbXBsZSIsInJlbW92ZWRTeW1ib2xOdW0iLCJyZW1vdmUiLCJudW0iLCJmdWxsU3ltYm9sRGlzdHJpYnV0aW9uIiwiY3JlYXRlU3ltYm9sU2V0RGlzdHJpYnV0aW9uIiwiY2FyZERpc3RyaWJ1dGlvbnMiLCJjYXJkU2V0TnVtIiwicmVtb3ZlZENhcmRTZXROdW0iLCJmdWxsRGlzdHJpYnV0aW9uIiwicyIsImRpc3RyaWJ1dGlvbiIsInN5bWJvbHNXaXRob3V0U3ltYm9sVG9SZW1vdmUiLCJzb3J0QnkiLCJqIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLFFBQUo7QUFBYUMsTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0osWUFBUSxHQUFDSSxDQUFUO0FBQVc7O0FBQXZCLENBQW5DLEVBQTRELENBQTVEO0FBRWI7QUFFQUosUUFBUSxDQUFDSyxHQUFULENBQWEsS0FBYixFQUFvQjtBQUNsQjtBQUNBO0FBRUE7QUFDQUMsYUFBVyxDQUFDRCxHQUFELEVBQU1FLElBQU4sRUFBWUMsS0FBWixFQUFtQkMsS0FBbkIsRUFBMEJDLGdCQUExQixFQUE0QyxDQUFFLENBTHZDLENBT2xCO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7OztBQVprQixDQUFwQixFOzs7Ozs7Ozs7OztBQ0pBLElBQUlWLFFBQUo7QUFBYUMsTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0osWUFBUSxHQUFDSSxDQUFUO0FBQVc7O0FBQXZCLENBQW5DLEVBQTRELENBQTVEO0FBQStELElBQUlPLHNCQUFKO0FBQTJCVixNQUFNLENBQUNDLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNTLHdCQUFzQixDQUFDUCxDQUFELEVBQUc7QUFBQ08sMEJBQXNCLEdBQUNQLENBQXZCO0FBQXlCOztBQUFwRCxDQUFyQixFQUEyRSxDQUEzRTtB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LEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcblxuLy8gVGhpcyBpcyB3aGVyZSB5b3UgYWRkIGJvdHMsIGxpa2UgQm9iOlxuXG5FbXBpcmljYS5ib3QoXCJib2JcIiwge1xuICAvLyAvLyBOT1QgU1VQUE9SVEVEIENhbGxlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGVhY2ggc3RhZ2UgKGFmdGVyIG9uUm91bmRTdGFydC9vblN0YWdlU3RhcnQpXG4gIC8vIG9uU3RhZ2VTdGFydChib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycykge30sXG5cbiAgLy8gQ2FsbGVkIGR1cmluZyBlYWNoIHN0YWdlIGF0IHRpY2sgaW50ZXJ2YWwgKH4xcyBhdCB0aGUgbW9tZW50KVxuICBvblN0YWdlVGljayhib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgc2Vjb25kc1JlbWFpbmluZykge31cblxuICAvLyAvLyBOT1QgU1VQUE9SVEVEIEEgcGxheWVyIGhhcyBjaGFuZ2VkIGEgdmFsdWVcbiAgLy8gLy8gVGhpcyBtaWdodCBoYXBwZW4gYSBsb3QhXG4gIC8vIG9uU3RhZ2VQbGF5ZXJDaGFuZ2UoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMsIHBsYXllcikge31cblxuICAvLyAvLyBOT1QgU1VQUE9SVEVEIENhbGxlZCBhdCB0aGUgZW5kIG9mIHRoZSBzdGFnZSAoYWZ0ZXIgaXQgZmluaXNoZWQsIGJlZm9yZSBvblN0YWdlRW5kL29uUm91bmRFbmQgaXMgY2FsbGVkKVxuICAvLyBvblN0YWdlRW5kKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzKSB7fVxufSk7XG4iLCJpbXBvcnQgRW1waXJpY2EgZnJvbSBcIm1ldGVvci9lbXBpcmljYTpjb3JlXCI7XG5cbmltcG9ydCB7IGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIgfSBmcm9tIFwiLi91dGlsXCI7XG5pbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcbmltcG9ydCB7IFRpbWVTeW5jIH0gZnJvbSBcIm1ldGVvci9taXp6YW86dGltZXN5bmNcIjtcblxuXG5cbi8vIG9uR2FtZVN0YXJ0IGlzIHRyaWdnZXJlZCBvcG5jZSBwZXIgZ2FtZSBiZWZvcmUgdGhlIGdhbWUgc3RhcnRzLCBhbmQgYmVmb3JlXG4vLyB0aGUgZmlyc3Qgb25Sb3VuZFN0YXJ0LiBJdCByZWNlaXZlcyB0aGUgZ2FtZSBhbmQgbGlzdCBvZiBhbGwgdGhlIHBsYXllcnMgaW5cbi8vIHRoZSBnYW1lLlxuRW1waXJpY2Eub25HYW1lU3RhcnQoZ2FtZSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiR2FtZSBzdGFydGVkXCIpO1xuICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgcGxheWVyLnNldChcImluYWN0aXZlXCIsIGZhbHNlKTtcbiAgICBwbGF5ZXIuc2V0KFwiaW5hY3RpdmVXYXJuaW5nVXNlZFwiLCBmYWxzZSk7XG4gICAgcGxheWVyLnNldChcImxhc3RBY3RpdmVcIiwgbW9tZW50KERhdGUubm93KCkpKTtcbiAgICBjb25zdCBuZXR3b3JrID0gcGxheWVyLmdldChcIm5laWdoYm9yc1wiKTtcbiAgICBjb25zdCBhY3RpdmVDaGF0cyA9IFtdO1xuICAgIG5ldHdvcmsubWFwKG90aGVyTm9kZUlkID0+IHtcbiAgICAgIHZhciBwYWlyT2ZQbGF5ZXJzID0gW3BsYXllci5nZXQoXCJub2RlSWRcIiksIHBhcnNlSW50KG90aGVyTm9kZUlkKV07XG4gICAgICBwYWlyT2ZQbGF5ZXJzLnNvcnQoKHAxLHAyKSA9PiBwMSAtIHAyKTtcbiAgICAgIGNvbnN0IG90aGVyUGxheWVyID0gZ2FtZS5wbGF5ZXJzLmZpbmQocCA9PiBwLmdldChcIm5vZGVJZFwiKSA9PT0gcGFyc2VJbnQob3RoZXJOb2RlSWQpKTtcbiAgICAgIGNvbnN0IGNoYXRLZXkgPSBgJHtwYWlyT2ZQbGF5ZXJzWzBdfS0ke3BhaXJPZlBsYXllcnNbMV19YDtcbiAgICAgIGFjdGl2ZUNoYXRzLnB1c2goY2hhdEtleSk7XG4gICAgfSk7XG4gICAgLy8gRGVmYXVsdCBhbGwgY2hhdHMgdG8gYmUgb3BlbiB3aGVuIGdhbWUgc3RhcnRzXG4gICAgcGxheWVyLnNldChcImFjdGl2ZUNoYXRzXCIsIGFjdGl2ZUNoYXRzKTtcbiAgfSk7XG4gIGdhbWUuc2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIsIGdhbWUucGxheWVycy5sZW5ndGgpO1xuICBnYW1lLnNldChcImdhbWVTdGFydFRpbWVcIiwgbW9tZW50KERhdGUubm93KCkpKTtcbiAgaWYgKGdhbWUudHJlYXRtZW50Lm1heEdhbWVUaW1lKSB7XG4gICAgZ2FtZS5zZXQoXCJtYXhHYW1lRW5kVGltZVwiLCBtb21lbnQoRGF0ZS5ub3coKSkuYWRkKGdhbWUudHJlYXRtZW50Lm1heEdhbWVUaW1lLCAnbScpKVxuICB9XG59KTtcblxuLy8gb25Sb3VuZFN0YXJ0IGlzIHRyaWdnZXJlZCBiZWZvcmUgZWFjaCByb3VuZCBzdGFydHMsIGFuZCBiZWZvcmUgb25TdGFnZVN0YXJ0LlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvbkdhbWVTdGFydCwgYW5kIHRoZSByb3VuZCB0aGF0IGlzIHN0YXJ0aW5nLlxuRW1waXJpY2Eub25Sb3VuZFN0YXJ0KChnYW1lLCByb3VuZCkgPT4ge1xuICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgcGxheWVyLnNldChcInN1Ym1pdHRlZFwiLCBmYWxzZSk7XG4gICAgcGxheWVyLnNldChcInN5bWJvbFNlbGVjdGVkXCIsIFwiXCIpO1xuICB9KTtcbiAgcm91bmQuc2V0KFwicmVzdWx0XCIsIGZhbHNlKTtcbiAgcm91bmQuc2V0KFwibnVtUGxheWVyc1N1Ym1pdHRlZFwiLCAwKTtcbiAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG4gIGlmIChhY3RpdmVQbGF5ZXJzLmxlbmd0aCA8IGdhbWUuZ2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIpICkgeyAvLyBTb21lb25lIGxlZnQgaW4gdGhlIG1pZGRsZSBvZiB0aGUgcm91bmRcbiAgICBpZiAoZ2FtZS50cmVhdG1lbnQuZW5kR2FtZUlmUGxheWVySWRsZSkge1xuICAgICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgIC8vIHAuZXhpdChcInNvbWVvbmVJbmFjdGl2ZVwiKTtcbiAgICAgICAgcC5leGl0KFwibWluUGxheWVyQ291bnROb3RNYWludGFpbmVkXCIpO1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTsgLy8gVXBkYXRlcyB0aGUgbmVpZ2hib3JzIHRvIGJlIGZ1bGx5IGNvbm5lY3RlZFxuICAgICAgZ2FtZS5zZXQoXCJjaGVja0ZvclNpbWlsYXJTeW1ib2xcIiwgdHJ1ZSk7XG4gICAgfVxuICBcbiAgfVxuICBnYW1lLnNldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiLCBhY3RpdmVQbGF5ZXJzLmxlbmd0aCk7XG5cbiAgaWYgKGdhbWUudHJlYXRtZW50Lm1pblBsYXllckNvdW50ICYmIGFjdGl2ZVBsYXllcnMubGVuZ3RoIDwgZ2FtZS50cmVhdG1lbnQubWluUGxheWVyQ291bnQpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIHAuZXhpdChcIm1pblBsYXllckNvdW50Tm90TWFpbnRhaW5lZFwiKTtcbiAgICB9KVxuICB9XG5cbiAgY29uc29sZS5sb2coXCJSb3VuZCBTdGFydGVkXCIpO1xuXG59KTtcblxuLy8gb25TdGFnZVN0YXJ0IGlzIHRyaWdnZXJlZCBiZWZvcmUgZWFjaCBzdGFnZSBzdGFydHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uUm91bmRTdGFydCwgYW5kIHRoZSBzdGFnZSB0aGF0IGlzIHN0YXJ0aW5nLlxuRW1waXJpY2Eub25TdGFnZVN0YXJ0KChnYW1lLCByb3VuZCwgc3RhZ2UpID0+IHtcbiAgY29uc29sZS5sb2coXCJTdGFnZSBTdGFydGVkXCIpXG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJUYXNrXCIpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgY29uc29sZS5sb2coIGBTeW1ib2xzIDogJHtwbGF5ZXIuZ2V0KGAke3N0YWdlLmRpc3BsYXlOYW1lfWApfWApO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKGBBbnN3ZXI6ICR7c3RhZ2UuZ2V0KFwiYW5zd2VyXCIpfWApO1xuICB9XG4gIGlmIChzdGFnZS5uYW1lID09PSBcIlN1cnZleVwiKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIHBsYXllci5zZXQoXCJzdXJ2ZXlOdW1iZXJcIiAsIDEpXG4gICAgfSk7XG4gIH1cbiAgLy8gZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAvLyB9KTtcbiAgLy8gc3RhZ2Uuc2V0KFwic2hvd1Jlc3VsdHNcIiwgZmFsc2UpO1xuICAvLyBzdGFnZS5zZXQoXCJyZXN1bHRzU2hvd25cIiwgZmFsc2UpO1xuXG59KTtcblxuLy8gb25TdGFnZUVuZCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgZWFjaCBzdGFnZS5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25Sb3VuZEVuZCwgYW5kIHRoZSBzdGFnZSB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblN0YWdlRW5kKChnYW1lLCByb3VuZCwgc3RhZ2UpID0+e1xuICBjb25zb2xlLmxvZyhcIlN0YWdlIEVuZGVkXCIpXG4gIFxufSk7XG5cbi8vIG9uUm91bmRFbmQgaXMgdHJpZ2dlcmVkIGFmdGVyIGVhY2ggcm91bmQuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZUVuZCwgYW5kIHRoZSByb3VuZCB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblJvdW5kRW5kKChnYW1lLCByb3VuZCkgPT4ge1xuICBjb25zb2xlLmxvZyhcIlJvdW5kIEVuZGVkXCIpXG4gIC8vIGdhbWUucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gIC8vICAgY29uc3QgdmFsdWUgPSBwbGF5ZXIucm91bmQuZ2V0KFwidmFsdWVcIikgfHwgMDtcbiAgLy8gICBjb25zdCBwcmV2U2NvcmUgPSBwbGF5ZXIuZ2V0KFwic2NvcmVcIikgfHwgMDtcbiAgLy8gICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgcHJldlNjb3JlICsgdmFsdWUpO1xuICAvLyB9KTtcblxufSk7XG5cbi8vIG9uR2FtZUVuZCBpcyB0cmlnZ2VyZWQgd2hlbiB0aGUgZ2FtZSBlbmRzLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvbkdhbWVTdGFydC5cbkVtcGlyaWNhLm9uR2FtZUVuZChnYW1lID0+IHt9KTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PiBvblNldCwgb25BcHBlbmQgYW5kIG9uQ2hhbmdlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIG9uU2V0LCBvbkFwcGVuZCBhbmQgb25DaGFuZ2UgYXJlIGNhbGxlZCBvbiBldmVyeSBzaW5nbGUgdXBkYXRlIG1hZGUgYnkgYWxsXG4vLyBwbGF5ZXJzIGluIGVhY2ggZ2FtZSwgc28gdGhleSBjYW4gcmFwaWRseSBiZWNvbWUgcXVpdGUgZXhwZW5zaXZlIGFuZCBoYXZlXG4vLyB0aGUgcG90ZW50aWFsIHRvIHNsb3cgZG93biB0aGUgYXBwLiBVc2Ugd2lzZWx5LlxuLy9cbi8vIEl0IGlzIHZlcnkgdXNlZnVsIHRvIGJlIGFibGUgdG8gcmVhY3QgdG8gZWFjaCB1cGRhdGUgYSB1c2VyIG1ha2VzLiBUcnlcbi8vIG5vbnRoZWxlc3MgdG8gbGltaXQgdGhlIGFtb3VudCBvZiBjb21wdXRhdGlvbnMgYW5kIGRhdGFiYXNlIHNhdmVzICguc2V0KVxuLy8gZG9uZSBpbiB0aGVzZSBjYWxsYmFja3MuIFlvdSBjYW4gYWxzbyB0cnkgdG8gbGltaXQgdGhlIGFtb3VudCBvZiBjYWxscyB0b1xuLy8gc2V0KCkgYW5kIGFwcGVuZCgpIHlvdSBtYWtlIChhdm9pZCBjYWxsaW5nIHRoZW0gb24gYSBjb250aW51b3VzIGRyYWcgb2YgYVxuLy8gc2xpZGVyIGZvciBleGFtcGxlKSBhbmQgaW5zaWRlIHRoZXNlIGNhbGxiYWNrcyB1c2UgdGhlIGBrZXlgIGFyZ3VtZW50IGF0IHRoZVxuLy8gdmVyeSBiZWdpbm5pbmcgb2YgdGhlIGNhbGxiYWNrIHRvIGZpbHRlciBvdXQgd2hpY2gga2V5cyB5b3VyIG5lZWQgdG8gcnVuXG4vLyBsb2dpYyBhZ2FpbnN0LlxuLy9cbi8vIElmIHlvdSBhcmUgbm90IHVzaW5nIHRoZXNlIGNhbGxiYWNrcywgY29tbWVudCB0aGVtIG91dCBzbyB0aGUgc3lzdGVtIGRvZXNcbi8vIG5vdCBjYWxsIHRoZW0gZm9yIG5vdGhpbmcuXG5cbi8vIC8vIG9uU2V0IGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgLnNldCgpIG1ldGhvZFxuLy8gLy8gb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3IgcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25TZXQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gKSA9PiB7XG4vLyAgIC8vIC8vIEV4YW1wbGUgZmlsdGVyaW5nXG4vLyAgIC8vIGlmIChrZXkgIT09IFwidmFsdWVcIikge1xuLy8gICAvLyAgIHJldHVybjtcbi8vICAgLy8gfVxuLy8gfSk7XG5cbkVtcGlyaWNhLm9uU2V0KChcbiAgZ2FtZSxcbiAgcm91bmQsXG4gIHN0YWdlLFxuICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4gIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4gIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbiAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbikgPT4ge1xuICBjb25zb2xlLmxvZyhcImtleVwiLCBrZXkpO1xuICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cbiAgLy8gU29tZSBwbGF5ZXIgZGVjaWRlcyB0byByZWNvbnNpZGVyIHRoZWlyIGFuc3dlclxuICBpZiAoa2V5ID09PSBcInN1Ym1pdHRlZFwiKSB7IFxuICAgIC8vIENoZWNrcyBpZiBldmVyeW9uZSBoYXMgc3VibWl0dGVkIHRoZWlyIGFuc3dlciBhbmQgaWYgc28sIHN1Ym1pdCB0aGUgc3RhZ2VcbiAgICBsZXQgYWxsU3VibWl0dGVkID0gdHJ1ZTtcbiAgICBsZXQgbnVtUGxheWVyc1N1Ym1pdHRlZCA9IDA7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuZ2V0KFwic3VibWl0dGVkXCIpKSB7XG4gICAgICAgIG51bVBsYXllcnNTdWJtaXR0ZWQgKz0gMTtcbiAgICAgIH1cbiAgICAgIGFsbFN1Ym1pdHRlZCA9IHBsYXllci5nZXQoXCJzdWJtaXR0ZWRcIikgJiYgYWxsU3VibWl0dGVkO1xuICAgIH0pXG4gICAgcm91bmQuc2V0KFwibnVtUGxheWVyc1N1Ym1pdHRlZFwiLCBudW1QbGF5ZXJzU3VibWl0dGVkKTtcbiAgICBpZiAoYWxsU3VibWl0dGVkKSB7XG4gICAgICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJUYXNrXCIpIHtcbiAgICAgICAgY29tcHV0ZVNjb3JlKGFjdGl2ZVBsYXllcnMsIGdhbWUsIHN0YWdlLCByb3VuZCk7XG4gICAgICB9XG4gICAgICAvLyBOZWVkIHRvIHN1Ym1pdCBmb3Igc3VibWl0IHRoZSBzdGFnZSBmb3IgZXZlcnkgcGxheWVyXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgICAgIH0pXG4gICAgfVxuICAvLyAgIGlmIChzdGFnZS5nZXQoXCJyZXN1bHRzU2hvd25cIikpIHtcbiAgLy8gICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgLy8gICAgIH0pXG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gaWYgKHRhcmdldFR5cGUgPT09IFwic3RhZ2VcIiAmJiBrZXkgPT09IFwicmVzdWx0c1Nob3duXCIpIHtcbiAgLy8gICBpZiAoc3RhZ2UuZ2V0KFwicmVzdWx0c1Nob3duXCIpKSB7XG4gIC8vICAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4gIC8vICAgICB9KVxuICAvLyAgIH1cbiAgfVxuXG4gIC8vIGVsc2UgaWYgKGtleSA9PT0gXCJpbmFjdGl2ZVwiKSB7XG4gICAgLy8gZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgLy8gfVxuXG4gIHJldHVybjtcblxufSk7XG5cbmZ1bmN0aW9uIGNvbXB1dGVTY29yZShhY3RpdmVQbGF5ZXJzLCBnYW1lLCBzdGFnZSwgcm91bmQpIHtcbiAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuICBjb25zb2xlLmxvZyhcIkNPUlJFQ1QgQU5TV0VSOlwiKVxuICBjb25zb2xlLmxvZyhzdGFnZS5nZXQoXCJhbnN3ZXJcIikpO1xuICBjb25zb2xlLmxvZyhcIlBsYXllcnMgZ3Vlc3NlZDpcIilcblxuICBsZXQgcGxheWVyQW5zd2VycyA9IFtdO1xuICBjb25zdCBhbGxBbnN3ZXJzRXF1YWwgPSBhcnIgPT4gYXJyLmV2ZXJ5KCB2ID0+IHYgPT09IGFyclswXSApIC8vRnVuYyB0byBjaGVjayBpZiBhbGwgcGxheWVyIGFuc3dlcnMgYXJlIGVxdWFsXG5cbiAgYWN0aXZlUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgY29uc3Qgc3VibWlzc2lvbiA9IHBsYXllci5nZXQoXCJzeW1ib2xTZWxlY3RlZFwiKTtcbiAgICBjb25zb2xlLmxvZyhzdWJtaXNzaW9uKTtcbiAgICBpZiAoZ2FtZS5nZXQoXCJjaGVja0ZvclNpbWlsYXJTeW1ib2xcIikpIHtcbiAgICAgIHBsYXllckFuc3dlcnMucHVzaChzdWJtaXNzaW9uKTtcbiAgICB9XG4gICAgaWYgKHN1Ym1pc3Npb24gIT09IHN0YWdlLmdldChcImFuc3dlclwiKSkge1xuICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgIH1cbiAgfSlcblxuICBpZiAoZ2FtZS5nZXQoXCJjaGVja0ZvclNpbWlsYXJTeW1ib2xcIikpIHtcbiAgICBpZiAoYWxsQW5zd2Vyc0VxdWFsKHBsYXllckFuc3dlcnMpKSB7XG4gICAgICBzdWNjZXNzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByb3VuZC5zZXQoXCJyZXN1bHRcIiwgc3VjY2Vzcyk7XG4gIGlmIChzdWNjZXNzKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICBjb25zdCBwcmV2U2NvcmUgPSBwbGF5ZXIuZ2V0KFwic2NvcmVcIikgfHwgMDtcbiAgICAgIHBsYXllci5zZXQoXCJzY29yZVwiLCBwcmV2U2NvcmUgKyAxKTtcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKFwiIEFsbCBwbGF5ZXJzIGdvdCBpdCBjb3JyZWN0bHlcIik7XG4gIH0gXG59XG5cbi8vIC8vIG9uQXBwZW5kIGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgYC5hcHBlbmQoKWAgbWV0aG9kXG4vLyAvLyBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvciBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vbkFwcGVuZCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4vLyApID0+IHtcbi8vICAgLy8gTm90ZTogYHZhbHVlYCBpcyB0aGUgc2luZ2xlIGxhc3QgdmFsdWUgKGUuZyAwLjIpLCB3aGlsZSBgcHJldlZhbHVlYCB3aWxsXG4vLyAgIC8vICAgICAgIGJlIGFuIGFycmF5IG9mIHRoZSBwcmV2aXNvdXMgdmFsdWVkIChlLmcuIFswLjMsIDAuNCwgMC42NV0pLlxuLy8gfSk7XG5cblxuLy8gLy8gb25DaGFuZ2UgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSBgLnNldCgpYCBvciB0aGVcbi8vIC8vIGAuYXBwZW5kKClgIG1ldGhvZCBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvclxuLy8gLy8gcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25DaGFuZ2UoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSwgLy8gUHJldmlvdXMgdmFsdWVcbi8vICAgaXNBcHBlbmQgLy8gVHJ1ZSBpZiB0aGUgY2hhbmdlIHdhcyBhbiBhcHBlbmQsIGZhbHNlIGlmIGl0IHdhcyBhIHNldFxuLy8gKSA9PiB7XG4vLyAgIC8vIGBvbkNoYW5nZWAgaXMgdXNlZnVsIHRvIHJ1biBzZXJ2ZXItc2lkZSBsb2dpYyBmb3IgYW55IHVzZXIgaW50ZXJhY3Rpb24uXG4vLyAgIC8vIE5vdGUgdGhlIGV4dHJhIGlzQXBwZW5kIGJvb2xlYW4gdGhhdCB3aWxsIGFsbG93IHRvIGRpZmZlcmVuY2lhdGUgc2V0cyBhbmRcbi8vICAgLy8gYXBwZW5kcy5cbi8vICAgIEdhbWUuc2V0KFwibGFzdENoYW5nZUF0XCIsIG5ldyBEYXRlKCkudG9TdHJpbmcoKSlcbi8vIH0pO1xuXG4vLyAvLyBvblN1Ym1pdCBpcyBjYWxsZWQgd2hlbiB0aGUgcGxheWVyIHN1Ym1pdHMgYSBzdGFnZS5cbi8vIEVtcGlyaWNhLm9uU3VibWl0KChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIgLy8gUGxheWVyIHdobyBzdWJtaXR0ZWRcbi8vICkgPT4ge1xuLy8gfSk7XG4iLCJjb25zdCBhbGxTeW1ib2xzID0gW1widDFcIiwgXCJ0MlwiLCBcInQzXCIsIFwidDRcIiwgXCJ0NVwiLCBcInQ2XCIsIFwidDdcIixcInQ4XCIsXCJ0OVwiLFwidDEwXCIsXCJ0MTFcIixcInQxMlwiXTtcblxuLy8gbiA9IG51bWJlciBvZiBwZW9wbGUgLCBwID0gbnVtYmVyIG9mIHN5bWJvbHNcbi8vIChuLTEpKnAgKyAxXG4vLyBpLmUuIG4gPSAzLCBwID0gMyA6IDdcblxuZXhwb3J0IGNvbnN0IHRlc3RUYW5ncmFtcyA9IFtcbiAge1xuICAgIF9pZDogXCIwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAyXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgfSxcbiAge1xuICAgIF9pZDogXCIyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAzXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgfSxcbiAge1xuICAgIF9pZDogXCIzXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgfSxcbiAge1xuICAgIF9pZDogXCI0XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA1XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgfSxcbiAge1xuICAgIF9pZDogXCI1XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA2XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgfSxcbiAge1xuICAgIF9pZDogXCI2XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA3XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgfSxcbiAge1xuICAgIF9pZDogXCI3XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA4XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgfSxcbiAge1xuICAgIF9pZDogXCI4XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA5XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgfSxcbiAge1xuICAgIF9pZDogXCI5XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTBcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDExXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxMVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTJcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxM1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTNcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDE0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxNFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTVcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICB9LFxuXG5dO1xuXG5cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXROZWlnaGJvcnMoc3RydWN0dXJlLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBsZXQgbmV0d29yayA9IHN0cnVjdHVyZS5zcGxpdChcIixcIik7XG4gICAgY29uc3QgcGxheWVySW5kZXggPSBwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpO1xuXG4gICAgbmV0d29yay5mb3JFYWNoKChuKSA9PiB7XG4gICAgICBjb25zdCBjb25uZWN0aW9uID0gbi5zcGxpdChcIi1cIik7XG5cbiAgICAgIGlmIChwbGF5ZXJJbmRleCA9PT0gcGFyc2VJbnQoY29ubmVjdGlvblswXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goY29ubmVjdGlvblsxXS5yZXBsYWNlKC9cXHMvZywgJycpKTtcbiAgICAgIH0gZWxzZSBpZiAocGxheWVySW5kZXggPT09IHBhcnNlSW50KGNvbm5lY3Rpb25bMV0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGNvbm5lY3Rpb25bMF0ucmVwbGFjZSgvXFxzL2csICcnKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIHJldHVybiBbLi4uIG5ldyBTZXQobmVpZ2hib3JzKV07XG4gIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSkge1xuICAgIGNvbnN0IGFjdGl2ZU5vZGVzID0gW107XG4gICAgY29uc3QgYWxsTm9kZXMgPSBbXTtcbiAgICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuXG4gICAgLy8gYWN0aXZlUGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgLy8gICBhY3RpdmVOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgIC8vIH0pXG5cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgLy8gaWYgKHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0dmVcIikpIHtcbiAgICAgIGlmICghcC5nZXQoXCJpbmFjdHZlXCIpKSB7XG5cbiAgICAgICAgYWN0aXZlTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICAgIH1cbiAgICAgIGFsbE5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgfSlcblxuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAvLyBPbmx5IHNob3cgYWN0aXZlIHBlb3BsZVxuICAgICAgLy8gY29uc3QgbmV3TmVpZ2hib3JzID0gYWN0aXZlTm9kZXMuZmlsdGVyKGlkID0+IHBhcnNlSW50KGlkKSAhPT0gcC5nZXQoXCJub2RlSWRcIikpXG4gICAgICAvLyBwLnNldChcIm5laWdoYm9yc1wiLCBuZXdOZWlnaGJvcnMpO1xuXG4gICAgICAvLyBTaG93IGV2ZXJ5b25lLCBtYXJrIG9mZmxpbmUgcGVvcGxlIGFzIG9mZmxpbmVcbiAgICAgIGNvbnN0IG5ld05laWdoYm9ycyA9IGFsbE5vZGVzLmZpbHRlcihpZCA9PiBwYXJzZUludChpZCkgIT09IHAuZ2V0KFwibm9kZUlkXCIpKVxuICAgICAgcC5zZXQoXCJuZWlnaGJvcnNcIiwgbmV3TmVpZ2hib3JzKTtcbiAgICB9KVxufSIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcbmltcG9ydCBcIi4vYm90cy5qc1wiO1xuaW1wb3J0IFwiLi9jYWxsYmFja3MuanNcIjtcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgdGVzdFN5bWJvbHMsIHRlc3RUYW5ncmFtcyB9IGZyb20gXCIuL2NvbnN0YW50c1wiOyBcbmltcG9ydCB7IGdldE5laWdoYm9ycywgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcblxuLy8gZ2FtZUluaXQgaXMgd2hlcmUgdGhlIHN0cnVjdHVyZSBvZiBhIGdhbWUgaXMgZGVmaW5lZC5cbi8vIEp1c3QgYmVmb3JlIGV2ZXJ5IGdhbWUgc3RhcnRzLCBvbmNlIGFsbCB0aGUgcGxheWVycyBuZWVkZWQgYXJlIHJlYWR5LCB0aGlzXG4vLyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgdHJlYXRtZW50IGFuZCB0aGUgbGlzdCBvZiBwbGF5ZXJzLlxuLy8gWW91IG11c3QgdGhlbiBhZGQgcm91bmRzIGFuZCBzdGFnZXMgdG8gdGhlIGdhbWUsIGRlcGVuZGluZyBvbiB0aGUgdHJlYXRtZW50XG4vLyBhbmQgdGhlIHBsYXllcnMuIFlvdSBjYW4gYWxzbyBnZXQvc2V0IGluaXRpYWwgdmFsdWVzIG9uIHlvdXIgZ2FtZSwgcGxheWVycyxcbi8vIHJvdW5kcyBhbmQgc3RhZ2VzICh3aXRoIGdldC9zZXQgbWV0aG9kcyksIHRoYXQgd2lsbCBiZSBhYmxlIHRvIHVzZSBsYXRlciBpblxuLy8gdGhlIGdhbWUuXG5FbXBpcmljYS5nYW1lSW5pdChnYW1lID0+IHtcbiAgY29uc3Qge1xuICAgIHRyZWF0bWVudDoge1xuICAgICAgcGxheWVyQ291bnQsXG4gICAgICBuZXR3b3JrU3RydWN0dXJlLFxuICAgICAgbnVtVGFza1JvdW5kcyxcbiAgICAgIG51bVN1cnZleVJvdW5kcyxcbiAgICAgIHNldFNpemVCYXNlZE9uUGxheWVyQ291bnQsXG4gICAgICB1c2VySW5hY3Rpdml0eUR1cmF0aW9uLFxuICAgICAgdGFza0R1cmF0aW9uLFxuICAgICAgZGVmYXVsdFNldFNpemUsXG4gICAgICBzdXJ2ZXlEdXJhdGlvbixcbiAgICAgIHJlc3VsdHNEdXJhdGlvbixcbiAgICAgIG1heE51bU92ZXJsYXAsXG4gICAgfSxcbiAgfSA9IGdhbWU7XG5cblxuICBjb25zdCBzeW1ib2xTZXQgPSB0ZXN0VGFuZ3JhbXM7XG4gIGNvbnN0IHNldFNpemUgPSBzZXRTaXplQmFzZWRPblBsYXllckNvdW50ID8gcGxheWVyQ291bnQgKyAxIDogZGVmYXVsdFNldFNpemU7IC8vVE9ETzogY2FuIGNoYW5nZSBkZWZhdWx0IHZhbHVlIGluIHNldHRpbmdzXG4gIGNvbnN0IG51bVJvdW5kc0JlZm9yZVN1cnZleSA9IG51bVRhc2tSb3VuZHMvbnVtU3VydmV5Um91bmRzO1xuXG4gIGxldCBjb2xvcnMgPSBbXCJHcmVlblwiLCBcIlJlZFwiLCBcIlllbGxvd1wiLCBcIkJsdWVcIiwgXCJQdXJwbGVcIiwgXCJXaGl0ZVwiLCBcIkJsYWNrXCIsIFwiQnJvd25cIiwgXCJHcmF5XCIsIFwiUGVhY2hcIiwgXCJDeWFuXCIsIFwiT3JhbmdlXCIgXTtcbiAgbGV0IHN1cnZleU51bSA9IDE7XG4gIGNvbG9ycyA9IF8uc2h1ZmZsZShjb2xvcnMpO1xuXG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIsIGkpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwiYXZhdGFyXCIsIGAvYXZhdGFycy9qZGVudGljb24vJHtwbGF5ZXIuX2lkfWApO1xuICAgIHBsYXllci5zZXQoXCJzY29yZVwiLCAwKTtcblxuICAgIC8vIEdpdmUgZWFjaCBwbGF5ZXIgYSBub2RlSWQgYmFzZWQgb24gdGhlaXIgcG9zaXRpb24gKGluZGV4ZWQgYXQgMSlcbiAgICBwbGF5ZXIuc2V0KFwibm9kZUlkXCIsIGkgKyAxKTtcbiAgICBwbGF5ZXIuc2V0KFwibmFtZVwiLCBwbGF5ZXIuaWQpO1xuICAgIHBsYXllci5zZXQoXCJhbm9ueW1vdXNOYW1lXCIsIGNvbG9yc1tpXSlcbiAgfSk7XG5cbiAgaWYgKGdhbWUucGxheWVycy5sZW5ndGggPCBnYW1lLnRyZWF0bWVudC5wbGF5ZXJDb3VudCkgeyAvLyBpZiBub3QgYSBmdWxsIGdhbWUsIGRlZmF1bHQgdG8gZnVsbHkgY29ubmVjdGVkIGxheWVyXG4gICAgZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgY29uc29sZS5sb2cocC5nZXQoXCJuZWlnaGJvcnNcIikpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBwLnNldChcIm5laWdoYm9yc1wiLCBnZXROZWlnaGJvcnMobmV0d29ya1N0cnVjdHVyZSwgcCkpO1xuICAgICAgY29uc29sZS5sb2cocC5nZXQoXCJuZWlnaGJvcnNcIikpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRm9yIGVhY2ggcm91bmQsIGFkZCBhbGwgdGhlIHN5bWJvbHMsIHJhbmRvbWx5IHNlbGVjdCBhIGNvcnJlY3QgYW5zd2VyIGFuZFxuICAvLyBDb25zdHJhaW50czogTXVzdCBlbnN1cmUgdGhhdCBldmVyeW9uZSBoYXMgb25seSBvbmUgc3ltYm9sIGluIGNvbW1vblxuICBfLnRpbWVzKCBudW1UYXNrUm91bmRzLCBpID0+IHtcbiAgICBjb25zdCByb3VuZCA9IGdhbWUuYWRkUm91bmQoKTtcblxuICAgIGNvbnN0IHtzeW1ib2xzLCB0YXNrTmFtZX0gPSBzeW1ib2xTZXRbaV07XG5cbiAgICBjb25zdCB0YXNrU3RhZ2UgPSByb3VuZC5hZGRTdGFnZSh7XG4gICAgICBuYW1lOiBcIlRhc2tcIixcbiAgICAgIGRpc3BsYXlOYW1lOiB0YXNrTmFtZSxcbiAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiB0YXNrRHVyYXRpb25cbiAgICB9KTtcbiAgICB0YXNrU3RhZ2Uuc2V0KFwidGFza1wiLCBzeW1ib2xTZXRbaV0pO1xuICAgIGxldCBhbnN3ZXIgPSBkaXN0cmlidXRlU3ltYm9sc0ZvclBsYXllcnMoc3ltYm9scywgcGxheWVyQ291bnQsIHRhc2tOYW1lLCBnYW1lKTtcbiAgICB0YXNrU3RhZ2Uuc2V0KFwiYW5zd2VyXCIsIGFuc3dlcik7XG5cbiAgICBjb25zdCByZXN1bHRTdGFnZSA9IHJvdW5kLmFkZFN0YWdlKHtcbiAgICAgIG5hbWU6IFwiUmVzdWx0XCIsXG4gICAgICBkaXNwbGF5TmFtZTogXCJSZXN1bHRcIixcbiAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiByZXN1bHRzRHVyYXRpb25cbiAgICB9KTtcbiAgICBcbiAgICBpZiAoKGkrMSkgJSBudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkgPT09IDApIHsgLy8gQWZ0ZXIgNSB0YXNrIHJvdW5kcywgYWRkIGEgc3VydmV5IHJvdW5kXG4gICAgICBjb25zdCBzdXJ2ZXlSb3VuZCA9IGdhbWUuYWRkUm91bmQoKTtcblxuICAgICAgY29uc3Qgc3VydmV5U3RhZ2VzID0gc3VydmV5Um91bmQuYWRkU3RhZ2Uoe1xuICAgICAgICBuYW1lOiBcIlN1cnZleVwiLFxuICAgICAgICBkaXNwbGF5TmFtZTogXCJTdXJ2ZXkgXCIgKyBzdXJ2ZXlOdW0sXG4gICAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiBzdXJ2ZXlEdXJhdGlvblxuICAgICAgfSlcbiAgICAgIFxuICAgICAgc3VydmV5TnVtKys7XG4gICAgfVxuXG4gIH0pO1xuXG5cblxuICBmdW5jdGlvbiBnZXRTeW1ib2xzRm9yUGxheWVycyhzeW1ib2xTZXQsIGFuc3dlciwgc2V0U2l6ZSwgdGFza05hbWUsIGdhbWUsIG1heE51bU92ZXJsYXApIHtcbiAgICAgIGxldCBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHN5bWJvbFNldC5maWx0ZXIoc3ltYm9sID0+IHN5bWJvbCAhPT0gYW5zd2VyKTtcbiAgICAgIHN5bWJvbHNXaXRob3V0QW5zd2VyID0gXy5zaHVmZmxlKHN5bWJvbHNXaXRob3V0QW5zd2VyKTtcbiAgICAgIGxldCBudW1QbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmxlbmd0aDtcbiAgICAgIGxldCBudW1PdmVybGFwID0gMDtcblxuXG4gICAgICAvLyBDcmVhdGUgYSBkaWN0aW9uYXJ5IHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgdGltZXMgc3ltYm9sIGhhcyBiZWVuIHVzZWRcbiAgICAgIGxldCBzeW1ib2xGcmVxID0ge31cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ltYm9sc1dpdGhvdXRBbnN3ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHN5bWJvbCA9IHN5bWJvbHNXaXRob3V0QW5zd2VyW2ldXG4gICAgICAgIGlmICghc3ltYm9sRnJlcS5oYXNPd25Qcm9wZXJ0eShzeW1ib2wpKSB7XG4gICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdID0gbnVtUGxheWVycyAtIDE7IC8vIFRvdGFsIHRpbWUgYSBzeW1ib2wgY2FuIGJlIHVzZWQgXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgICBsZXQgc3ltYm9sc1BpY2tlZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN5bWJvbHNXaXRob3V0QW5zd2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHN5bWJvbCA9IHN5bWJvbHNXaXRob3V0QW5zd2VyW2ldXG4gICAgICAgICAgaWYgKHN5bWJvbHNQaWNrZWQubGVuZ3RoIDwgc2V0U2l6ZSAtIDEpIHsgLy8gQWRkIHN5bWJvbHMgdW50aWwgc2V0U2l6ZSAtIDEgZm9yIGFuc3dlclxuICAgICAgICAgICAgaWYgKHN5bWJvbEZyZXFbc3ltYm9sXSAtIDEgPT09IDApIHsgLy8gVGhpcyBzeW1ib2wgd2lsbCBvdmVybGFwXG4gICAgICAgICAgICAgICAgaWYgKG51bU92ZXJsYXAgPCBtYXhOdW1PdmVybGFwICkgeyAvLyBPbmx5IGFkZCBpZiBsZXNzIHRoYW4gbWF4IG92ZXJsYXBcbiAgICAgICAgICAgICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdIC09IDE7XG4gICAgICAgICAgICAgICAgICBudW1PdmVybGFwICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goc3ltYm9sKTtcbiAgICAgICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdIC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChhbnN3ZXIpOyAvLyBBZGQgdGhlIGFuc3dlclxuICAgICAgICBmb3IgKHZhciBzeW1ib2xUb1JlbW92ZSBvZiBzeW1ib2xzUGlja2VkKSB7XG4gICAgICAgICAgaWYgKHN5bWJvbEZyZXFbc3ltYm9sVG9SZW1vdmVdID09PSAwKSB7IC8vIElmIHN5bWJvbCBoYXMgYmVlbiBwaWNrZWQgbi0xIHBsYXllcnMgdGltZXMsIHJlbW92ZSBpdCBmcm9tIHRoZSBzZXRcbiAgICAgICAgICAgIHN5bWJvbHNXaXRob3V0QW5zd2VyID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXIuZmlsdGVyKHN5bWJvbCA9PiBzeW1ib2wgIT09IHN5bWJvbFRvUmVtb3ZlKTtcblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN5bWJvbHNQaWNrZWQgPSBfLnNodWZmbGUoc3ltYm9sc1BpY2tlZCk7XG5cbiAgICAgICAgcGxheWVyLnNldCh0YXNrTmFtZSwgc3ltYm9sc1BpY2tlZCk7XG4gICAgICB9KVxuXG5cbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc3RyaWJ1dGVTeW1ib2xzRm9yUGxheWVycyhzeW1ib2xTZXQsIHBsYXllckNvdW50LCB0YXNrTmFtZSwgZ2FtZSkge1xuICAgIC8vIEZpbmQgYSBzdWJzZXQgb2YgTisxIHN5bWJvbHMgdG8gdXNlXG4gICAgLy8gVE9ETzogTWlnaHQgbmVlZCBhIGRpZmZlcmVudCBhbGdvcml0aG0gdG8gc2VsZWN0IHRoZSBzdWJzZXQgb2Ygc3ltYm9sc1xuICAgIGxldCByZWR1Y2VkU3ltYm9sU2V0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcGxheWVyQ291bnQgKzE7IGkrKykge1xuICAgICAgbGV0IHN5bWJvbE51bSA9IF8uc2FtcGxlKHN5bWJvbFNldCk7XG4gICAgICBsZXQgcmVtb3ZlZFN5bWJvbE51bSA9IF8ucmVtb3ZlKHN5bWJvbFNldCwgKG51bSkgPT4gbnVtID09PSBzeW1ib2xOdW0pO1xuICAgICAgcmVkdWNlZFN5bWJvbFNldC5wdXNoKHN5bWJvbE51bSk7XG4gICAgfVxuXG4gICAgbGV0IGZ1bGxTeW1ib2xEaXN0cmlidXRpb24gPSBjcmVhdGVTeW1ib2xTZXREaXN0cmlidXRpb24ocmVkdWNlZFN5bWJvbFNldCk7XG5cbiAgICAvLyBHaXZlIHBsYXllciBhIHNwZWNpZmljIHN5bWJvbCB0aGF0IHRoZWlyIHNldCBvZiBjYXJkcyB3b24ndCBoYXZlXG4gICAgbGV0IGNhcmREaXN0cmlidXRpb25zID0ge31cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBsZXQgY2FyZFNldE51bSA9IF8uc2FtcGxlKHJlZHVjZWRTeW1ib2xTZXQpO1xuICAgICAgbGV0IHJlbW92ZWRDYXJkU2V0TnVtID0gXy5yZW1vdmUocmVkdWNlZFN5bWJvbFNldCwgKG51bSkgPT4gbnVtID09PSBjYXJkU2V0TnVtKTtcbiAgICAgIGNhcmREaXN0cmlidXRpb25zW3BsYXllci5nZXQoXCJub2RlSWRcIildID0gY2FyZFNldE51bTtcbiAgICB9KVxuXG4gICAgLy8gVGhlIGxhc3Qgc3ltYm9sIHJlbWFpbmluZyBpcyB0aGUgYW5zd2VyXG4gICAgbGV0IGFuc3dlciA9IF8uc2FtcGxlKHJlZHVjZWRTeW1ib2xTZXQpO1xuXG4gICAgLy8gRGlzdHJidXRlIHBsYXllcnMgYSBzZXQgb2YgY2FyZHMgdGhhdCBhbGwgaGF2ZSB0aGUgYW5zd2VyLCBidXQgd2l0aG91dCB0aGVpciBzcGVjaWZpYyBzeW1ib2xcbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBsZXQgc3ltYm9sc1BpY2tlZCA9IGZ1bGxTeW1ib2xEaXN0cmlidXRpb25bYW5zd2VyXVtjYXJkRGlzdHJpYnV0aW9uc1twbGF5ZXIuZ2V0KFwibm9kZUlkXCIpXV1cbiAgICAgIHBsYXllci5zZXQodGFza05hbWUsIHN5bWJvbHNQaWNrZWQpO1xuICAgIH0pXG5cbiAgICByZXR1cm4gYW5zd2VyO1xuXG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTeW1ib2xTZXREaXN0cmlidXRpb24oc3ltYm9sU2V0KSB7XG4gICAgLy8gR2l2ZW4gdGhlIHN5bWJvbCBzZXQsIGNyZWF0ZXMgYWxsIGNvbWJpbmF0aW9ucyBvZiBzZXRzIHdpdGggb25lIGNvbW1tb24gYW5zd2VyIGFuZCBvbmUgc3BlY2ZpYyBzeW1ib2wgcmVtb3ZlZFxuICAgIGxldCBmdWxsRGlzdHJpYnV0aW9uID0ge307XG4gICAgc3ltYm9sU2V0LmZvckVhY2goKGFuc3dlcikgPT4ge1xuICAgICAgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xTZXQuZmlsdGVyKHMgPT4gcyAhPT0gYW5zd2VyKTtcbiAgICAgIGxldCBkaXN0cmlidXRpb24gPSB7fTtcbiAgICAgIGxldCBpID0gMDtcbiAgICAgIHN5bWJvbHNXaXRob3V0QW5zd2VyLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgbGV0IHN5bWJvbHNXaXRob3V0U3ltYm9sVG9SZW1vdmUgPSBzeW1ib2xzV2l0aG91dEFuc3dlci5maWx0ZXIocmVtb3ZlID0+IHJlbW92ZSAhPT0gcyk7XG4gICAgICAgIHN5bWJvbHNXaXRob3V0U3ltYm9sVG9SZW1vdmUucHVzaChhbnN3ZXIpO1xuICAgICAgICBkaXN0cmlidXRpb25bc10gPSBfLnNvcnRCeShzeW1ib2xzV2l0aG91dFN5bWJvbFRvUmVtb3ZlKTtcbiAgICAgICAgaSsrO1xuICAgICAgfSlcbiAgICAgIGZ1bGxEaXN0cmlidXRpb25bYW5zd2VyXSA9IGRpc3RyaWJ1dGlvbjtcbiAgICB9KVxuXG4gICAgcmV0dXJuIGZ1bGxEaXN0cmlidXRpb247XG4gIH1cblxuICAvLyBTaHVmZmxpbmcgYXJyYXlzOlxuICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MDUzNjA0NC9zd2FwcGluZy1hbGwtZWxlbWVudHMtb2YtYW4tYXJyYXktZXhjZXB0LWZvci1maXJzdC1hbmQtbGFzdFxuICBmdW5jdGlvbiBzaHVmZmxlKHN5bWJvbFNldCkge1xuICAgIGZvciAoaSA9IHN5bWJvbFNldC5sZW5ndGggLTEgOyBpID4gMDsgaS0tKSB7XG4gICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG5cbiAgICAgIFtzeW1ib2xTZXRbaV0sIHN5bWJvbFNldFtqXV0gPSBbc3ltYm9sU2V0W2pdLCBzeW1ib2xTZXRbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gc3ltYm9sU2V0O1xuICB9XG5cbn0pO1xuIl19
