var require = meteorInstall({"server":{"bots.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// server/bots.js                                                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"callbacks.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// server/callbacks.js                                                                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      const otherPlayer = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId)); // const otherPlayerId = otherPlayer.id;

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
//   console.log("key", key);
//   const players = game.players;
//   // const activePlayers = game.players.filter(p => p.online === true && !p.get("inactive"));
//   const activePlayers = game.players.filter(p => !p.get("inactive"));
//   // Some player decides to reconsider their answer
//   if (key === "submitted") { 
//     // Checks if everyone has submitted their answer and if so, submit the stage
//     let allSubmitted = true;
//     let numPlayersSubmitted = 0;
//     activePlayers.forEach((player) => {
//       if (player.get("submitted")) {
//         numPlayersSubmitted += 1;
//       }
//       allSubmitted = player.get("submitted") && allSubmitted;
//     })
//     round.set("numPlayersSubmitted", numPlayersSubmitted);
//     if (allSubmitted) {
//       if (stage.name === "Task") {
//         computeScore(activePlayers, game, stage, round);
//       }
//       // Need to submit for submit the stage for every player
//       game.players.forEach((player) => {
//         player.stage.submit();
//       })
//     }
//   //   if (stage.get("resultsShown")) {
//   //     players.forEach((player) => {
//   //       player.stage.submit();
//   //     })
//   //   }
//   // }
//   // if (targetType === "stage" && key === "resultsShown") {
//   //   if (stage.get("resultsShown")) {
//   //     players.forEach((player) => {
//   //       player.stage.submit();
//   //     })
//   //   }
//   }
//   // else if (key === "inactive") {
//     // getFullyConnectedLayer(game);
//   // }
//   return;
// });

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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// server/constants.js                                                                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"util.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// server/util.js                                                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// server/main.js                                                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  let colors = ["Green", "Red", "Yellow", "Blue", "Purple", "White", "Black"];
  let surveyNum = 1;
  colors = shuffle(colors);
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
        displayName: "Survey " + surveyNum,
        durationInSeconds: surveyDuration
      });
      surveyNum++;
    }
  });

  function getSymbolsForPlayers(symbolSet, answer, setSize, taskName, game, maxNumOverlap) {
    let symbolsWithoutAnswer = symbolSet.filter(symbol => symbol !== answer);
    symbolsWithoutAnswer = shuffle(symbolsWithoutAnswer);
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".mjs"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm1vbWVudCIsIlRpbWVTeW5jIiwib25HYW1lU3RhcnQiLCJjb25zb2xlIiwibG9nIiwicGxheWVycyIsImZvckVhY2giLCJwbGF5ZXIiLCJzZXQiLCJEYXRlIiwibm93IiwibmV0d29yayIsImdldCIsImFjdGl2ZUNoYXRzIiwibWFwIiwib3RoZXJOb2RlSWQiLCJwYWlyT2ZQbGF5ZXJzIiwicGFyc2VJbnQiLCJzb3J0IiwicDEiLCJwMiIsIm90aGVyUGxheWVyIiwiZmluZCIsInAiLCJjaGF0S2V5IiwicHVzaCIsImxlbmd0aCIsInRyZWF0bWVudCIsIm1heEdhbWVUaW1lIiwiYWRkIiwib25Sb3VuZFN0YXJ0IiwiYWN0aXZlUGxheWVycyIsImZpbHRlciIsImVuZEdhbWVJZlBsYXllcklkbGUiLCJleGl0IiwibWluUGxheWVyQ291bnQiLCJvblN0YWdlU3RhcnQiLCJuYW1lIiwiZGlzcGxheU5hbWUiLCJvblN0YWdlRW5kIiwib25Sb3VuZEVuZCIsIm9uR2FtZUVuZCIsImNvbXB1dGVTY29yZSIsInN1Y2Nlc3MiLCJwbGF5ZXJBbnN3ZXJzIiwiYWxsQW5zd2Vyc0VxdWFsIiwiYXJyIiwiZXZlcnkiLCJzdWJtaXNzaW9uIiwicHJldlNjb3JlIiwiZXhwb3J0IiwidGVzdFRhbmdyYW1zIiwiYWxsU3ltYm9scyIsIl9pZCIsInRhc2tOYW1lIiwic3ltYm9scyIsImFuc3dlciIsImdldE5laWdoYm9ycyIsInN0cnVjdHVyZSIsIm5laWdoYm9ycyIsInNwbGl0IiwicGxheWVySW5kZXgiLCJuIiwiY29ubmVjdGlvbiIsInJlcGxhY2UiLCJTZXQiLCJhY3RpdmVOb2RlcyIsImFsbE5vZGVzIiwibmV3TmVpZ2hib3JzIiwiaWQiLCJ0ZXN0U3ltYm9scyIsImdhbWVJbml0IiwicGxheWVyQ291bnQiLCJuZXR3b3JrU3RydWN0dXJlIiwibnVtVGFza1JvdW5kcyIsIm51bVN1cnZleVJvdW5kcyIsInNldFNpemVCYXNlZE9uUGxheWVyQ291bnQiLCJ1c2VySW5hY3Rpdml0eUR1cmF0aW9uIiwidGFza0R1cmF0aW9uIiwiZGVmYXVsdFNldFNpemUiLCJzdXJ2ZXlEdXJhdGlvbiIsInJlc3VsdHNEdXJhdGlvbiIsIm1heE51bU92ZXJsYXAiLCJzeW1ib2xTZXQiLCJzZXRTaXplIiwibnVtUm91bmRzQmVmb3JlU3VydmV5IiwiY29sb3JzIiwic3VydmV5TnVtIiwic2h1ZmZsZSIsImkiLCJfIiwidGltZXMiLCJhZGRSb3VuZCIsInRhc2tTdGFnZSIsImFkZFN0YWdlIiwiZHVyYXRpb25JblNlY29uZHMiLCJnZXRTeW1ib2xzRm9yUGxheWVycyIsInJlc3VsdFN0YWdlIiwic3VydmV5Um91bmQiLCJzdXJ2ZXlTdGFnZXMiLCJzeW1ib2xzV2l0aG91dEFuc3dlciIsInN5bWJvbCIsIm51bVBsYXllcnMiLCJudW1PdmVybGFwIiwic3ltYm9sRnJlcSIsImhhc093blByb3BlcnR5Iiwic3ltYm9sc1BpY2tlZCIsInN5bWJvbFRvUmVtb3ZlIiwiaiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxRQUFKO0FBQWFDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNKLFlBQVEsR0FBQ0ksQ0FBVDtBQUFXOztBQUF2QixDQUFuQyxFQUE0RCxDQUE1RDtBQUViO0FBRUFKLFFBQVEsQ0FBQ0ssR0FBVCxDQUFhLEtBQWIsRUFBb0I7QUFDbEI7QUFDQTtBQUVBO0FBQ0FDLGFBQVcsQ0FBQ0QsR0FBRCxFQUFNRSxJQUFOLEVBQVlDLEtBQVosRUFBbUJDLEtBQW5CLEVBQTBCQyxnQkFBMUIsRUFBNEMsQ0FBRSxDQUx2QyxDQU9sQjtBQUNBO0FBQ0E7QUFFQTtBQUNBOzs7QUFaa0IsQ0FBcEIsRTs7Ozs7Ozs7Ozs7QUNKQSxJQUFJVixRQUFKO0FBQWFDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNKLFlBQVEsR0FBQ0ksQ0FBVDtBQUFXOztBQUF2QixDQUFuQyxFQUE0RCxDQUE1RDtBQUErRCxJQUFJTyxzQkFBSjtBQUEyQlYsTUFBTSxDQUFDQyxJQUFQLENBQVksUUFBWixFQUFxQjtBQUFDUyx3QkFBc0IsQ0FBQ1AsQ0FBRCxFQUFHO0FBQUNPLDBCQUFzQixHQUFDUCxDQUF2QjtBQUF5Qjs7QUFBcEQsQ0FBckIsRUFBMkUsQ0FBM0U7QUFBOEUsSUFBSVEsTUFBSjtBQUFXWCxNQUFNLENBQUNDLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNRLFVBQU0sR0FBQ1IsQ0FBUDtBQUFTOztBQUFyQixDQUFyQixFQUE0QyxDQUE1QztBQUErQyxJQUFJUyxRQUFKO0FBQWFaLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHdCQUFaLEVBQXFDO0FBQUNXLFVBQVEsQ0FBQ1QsQ0FBRCxFQUFHO0FBQUNTLFlBQVEsR0FBQ1QsQ0FBVDtBQUFXOztBQUF4QixDQUFyQyxFQUErRCxDQUEvRDtBQVE1UDtBQUNBO0FBQ0E7QUFDQUosUUFBUSxDQUFDYyxXQUFULENBQXFCUCxJQUFJLElBQUk7QUFDM0JRLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLGNBQVo7QUFDQVQsTUFBSSxDQUFDVSxPQUFMLENBQWFDLE9BQWIsQ0FBc0JDLE1BQUQsSUFBWTtBQUMvQkEsVUFBTSxDQUFDQyxHQUFQLENBQVcsVUFBWCxFQUF1QixLQUF2QjtBQUNBRCxVQUFNLENBQUNDLEdBQVAsQ0FBVyxxQkFBWCxFQUFrQyxLQUFsQztBQUNBRCxVQUFNLENBQUNDLEdBQVAsQ0FBVyxZQUFYLEVBQXlCUixNQUFNLENBQUNTLElBQUksQ0FBQ0MsR0FBTCxFQUFELENBQS9CO0FBQ0EsVUFBTUMsT0FBTyxHQUFHSixNQUFNLENBQUNLLEdBQVAsQ0FBVyxXQUFYLENBQWhCO0FBQ0EsVUFBTUMsV0FBVyxHQUFHLEVBQXBCO0FBQ0FGLFdBQU8sQ0FBQ0csR0FBUixDQUFZQyxXQUFXLElBQUk7QUFDekIsVUFBSUMsYUFBYSxHQUFHLENBQUNULE1BQU0sQ0FBQ0ssR0FBUCxDQUFXLFFBQVgsQ0FBRCxFQUF1QkssUUFBUSxDQUFDRixXQUFELENBQS9CLENBQXBCO0FBQ0FDLG1CQUFhLENBQUNFLElBQWQsQ0FBbUIsQ0FBQ0MsRUFBRCxFQUFJQyxFQUFKLEtBQVdELEVBQUUsR0FBR0MsRUFBbkM7QUFDQSxZQUFNQyxXQUFXLEdBQUcxQixJQUFJLENBQUNVLE9BQUwsQ0FBYWlCLElBQWIsQ0FBa0JDLENBQUMsSUFBSUEsQ0FBQyxDQUFDWCxHQUFGLENBQU0sUUFBTixNQUFvQkssUUFBUSxDQUFDRixXQUFELENBQW5ELENBQXBCLENBSHlCLENBSXpCOztBQUNBLFlBQU1TLE9BQU8sYUFBTVIsYUFBYSxDQUFDLENBQUQsQ0FBbkIsY0FBMEJBLGFBQWEsQ0FBQyxDQUFELENBQXZDLENBQWI7QUFDQUgsaUJBQVcsQ0FBQ1ksSUFBWixDQUFpQkQsT0FBakI7QUFDRCxLQVBELEVBTitCLENBYy9COztBQUNBakIsVUFBTSxDQUFDQyxHQUFQLENBQVcsYUFBWCxFQUEwQkssV0FBMUI7QUFDRCxHQWhCRDtBQWlCQWxCLE1BQUksQ0FBQ2EsR0FBTCxDQUFTLDBCQUFULEVBQXFDYixJQUFJLENBQUNVLE9BQUwsQ0FBYXFCLE1BQWxEO0FBQ0EvQixNQUFJLENBQUNhLEdBQUwsQ0FBUyxlQUFULEVBQTBCUixNQUFNLENBQUNTLElBQUksQ0FBQ0MsR0FBTCxFQUFELENBQWhDOztBQUNBLE1BQUlmLElBQUksQ0FBQ2dDLFNBQUwsQ0FBZUMsV0FBbkIsRUFBZ0M7QUFDOUJqQyxRQUFJLENBQUNhLEdBQUwsQ0FBUyxnQkFBVCxFQUEyQlIsTUFBTSxDQUFDUyxJQUFJLENBQUNDLEdBQUwsRUFBRCxDQUFOLENBQW1CbUIsR0FBbkIsQ0FBdUJsQyxJQUFJLENBQUNnQyxTQUFMLENBQWVDLFdBQXRDLEVBQW1ELEdBQW5ELENBQTNCO0FBQ0Q7QUFDRixDQXhCRCxFLENBMEJBO0FBQ0E7O0FBQ0F4QyxRQUFRLENBQUMwQyxZQUFULENBQXNCLENBQUNuQyxJQUFELEVBQU9DLEtBQVAsS0FBaUI7QUFDckNELE1BQUksQ0FBQ1UsT0FBTCxDQUFhQyxPQUFiLENBQXNCQyxNQUFELElBQVk7QUFDL0JBLFVBQU0sQ0FBQ0MsR0FBUCxDQUFXLFdBQVgsRUFBd0IsS0FBeEI7QUFDQUQsVUFBTSxDQUFDQyxHQUFQLENBQVcsZ0JBQVgsRUFBNkIsRUFBN0I7QUFDRCxHQUhEO0FBSUFaLE9BQUssQ0FBQ1ksR0FBTixDQUFVLFFBQVYsRUFBb0IsS0FBcEI7QUFDQVosT0FBSyxDQUFDWSxHQUFOLENBQVUscUJBQVYsRUFBaUMsQ0FBakMsRUFOcUMsQ0FPckM7O0FBQ0EsUUFBTXVCLGFBQWEsR0FBR3BDLElBQUksQ0FBQ1UsT0FBTCxDQUFhMkIsTUFBYixDQUFvQlQsQ0FBQyxJQUFJLENBQUNBLENBQUMsQ0FBQ1gsR0FBRixDQUFNLFVBQU4sQ0FBMUIsQ0FBdEI7O0FBRUEsTUFBSW1CLGFBQWEsQ0FBQ0wsTUFBZCxHQUF1Qi9CLElBQUksQ0FBQ2lCLEdBQUwsQ0FBUywwQkFBVCxDQUEzQixFQUFrRTtBQUFFO0FBQ2xFLFFBQUlqQixJQUFJLENBQUNnQyxTQUFMLENBQWVNLG1CQUFuQixFQUF3QztBQUN0Q0YsbUJBQWEsQ0FBQ3pCLE9BQWQsQ0FBdUJpQixDQUFELElBQU87QUFDM0I7QUFDQUEsU0FBQyxDQUFDVyxJQUFGLENBQU8sNkJBQVA7QUFDRCxPQUhEO0FBSUQsS0FMRCxNQUtPO0FBQ0xuQyw0QkFBc0IsQ0FBQ0osSUFBRCxDQUF0QixDQURLLENBQ3lCOztBQUM5QkEsVUFBSSxDQUFDYSxHQUFMLENBQVMsdUJBQVQsRUFBa0MsSUFBbEM7QUFDRDtBQUVGOztBQUNEYixNQUFJLENBQUNhLEdBQUwsQ0FBUywwQkFBVCxFQUFxQ3VCLGFBQWEsQ0FBQ0wsTUFBbkQ7O0FBRUEsTUFBSS9CLElBQUksQ0FBQ2dDLFNBQUwsQ0FBZVEsY0FBZixJQUFpQ0osYUFBYSxDQUFDTCxNQUFkLEdBQXVCL0IsSUFBSSxDQUFDZ0MsU0FBTCxDQUFlUSxjQUEzRSxFQUEyRjtBQUN6RkosaUJBQWEsQ0FBQ3pCLE9BQWQsQ0FBdUJpQixDQUFELElBQU87QUFDM0JBLE9BQUMsQ0FBQ1csSUFBRixDQUFPLDZCQUFQO0FBQ0QsS0FGRDtBQUdEOztBQUVEL0IsU0FBTyxDQUFDQyxHQUFSLENBQVksZUFBWjtBQUVELENBaENELEUsQ0FrQ0E7QUFDQTs7QUFDQWhCLFFBQVEsQ0FBQ2dELFlBQVQsQ0FBc0IsQ0FBQ3pDLElBQUQsRUFBT0MsS0FBUCxFQUFjQyxLQUFkLEtBQXdCO0FBQzVDTSxTQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaLEVBRDRDLENBRTVDOztBQUNBLFFBQU0yQixhQUFhLEdBQUdwQyxJQUFJLENBQUNVLE9BQUwsQ0FBYTJCLE1BQWIsQ0FBb0JULENBQUMsSUFBSSxDQUFDQSxDQUFDLENBQUNYLEdBQUYsQ0FBTSxVQUFOLENBQTFCLENBQXRCOztBQUVBLE1BQUlmLEtBQUssQ0FBQ3dDLElBQU4sS0FBZSxNQUFuQixFQUEyQjtBQUN6Qk4saUJBQWEsQ0FBQ3pCLE9BQWQsQ0FBdUJDLE1BQUQsSUFBWTtBQUNoQ0osYUFBTyxDQUFDQyxHQUFSLHFCQUEwQkcsTUFBTSxDQUFDSyxHQUFQLFdBQWNmLEtBQUssQ0FBQ3lDLFdBQXBCLEVBQTFCO0FBQ0QsS0FGRDtBQUdBbkMsV0FBTyxDQUFDQyxHQUFSLG1CQUF1QlAsS0FBSyxDQUFDZSxHQUFOLENBQVUsUUFBVixDQUF2QjtBQUNEOztBQUNELE1BQUlmLEtBQUssQ0FBQ3dDLElBQU4sS0FBZSxRQUFuQixFQUE2QjtBQUMzQk4saUJBQWEsQ0FBQ3pCLE9BQWQsQ0FBdUJDLE1BQUQsSUFBWTtBQUNoQ0EsWUFBTSxDQUFDQyxHQUFQLENBQVcsY0FBWCxFQUE0QixDQUE1QjtBQUNELEtBRkQ7QUFHRCxHQWYyQyxDQWdCNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFRCxDQXRCRCxFLENBd0JBO0FBQ0E7O0FBQ0FwQixRQUFRLENBQUNtRCxVQUFULENBQW9CLENBQUM1QyxJQUFELEVBQU9DLEtBQVAsRUFBY0MsS0FBZCxLQUF1QjtBQUN6Q00sU0FBTyxDQUFDQyxHQUFSLENBQVksYUFBWjtBQUVELENBSEQsRSxDQUtBO0FBQ0E7O0FBQ0FoQixRQUFRLENBQUNvRCxVQUFULENBQW9CLENBQUM3QyxJQUFELEVBQU9DLEtBQVAsS0FBaUI7QUFDbkNPLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLGFBQVosRUFEbUMsQ0FFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVELENBUkQsRSxDQVVBO0FBQ0E7O0FBQ0FoQixRQUFRLENBQUNxRCxTQUFULENBQW1COUMsSUFBSSxJQUFJLENBQUUsQ0FBN0IsRSxDQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7O0FBRUEsU0FBUytDLFlBQVQsQ0FBc0JYLGFBQXRCLEVBQXFDcEMsSUFBckMsRUFBMkNFLEtBQTNDLEVBQWtERCxLQUFsRCxFQUF5RDtBQUN2RCxNQUFJK0MsT0FBTyxHQUFHLElBQWQ7QUFDQXhDLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLGlCQUFaO0FBQ0FELFNBQU8sQ0FBQ0MsR0FBUixDQUFZUCxLQUFLLENBQUNlLEdBQU4sQ0FBVSxRQUFWLENBQVo7QUFDQVQsU0FBTyxDQUFDQyxHQUFSLENBQVksa0JBQVo7QUFFQSxNQUFJd0MsYUFBYSxHQUFHLEVBQXBCOztBQUNBLFFBQU1DLGVBQWUsR0FBR0MsR0FBRyxJQUFJQSxHQUFHLENBQUNDLEtBQUosQ0FBV3ZELENBQUMsSUFBSUEsQ0FBQyxLQUFLc0QsR0FBRyxDQUFDLENBQUQsQ0FBekIsQ0FBL0IsQ0FQdUQsQ0FPTzs7O0FBRTlEZixlQUFhLENBQUN6QixPQUFkLENBQXNCQyxNQUFNLElBQUk7QUFDOUIsVUFBTXlDLFVBQVUsR0FBR3pDLE1BQU0sQ0FBQ0ssR0FBUCxDQUFXLGdCQUFYLENBQW5CO0FBQ0FULFdBQU8sQ0FBQ0MsR0FBUixDQUFZNEMsVUFBWjs7QUFDQSxRQUFJckQsSUFBSSxDQUFDaUIsR0FBTCxDQUFTLHVCQUFULENBQUosRUFBdUM7QUFDckNnQyxtQkFBYSxDQUFDbkIsSUFBZCxDQUFtQnVCLFVBQW5CO0FBQ0Q7O0FBQ0QsUUFBSUEsVUFBVSxLQUFLbkQsS0FBSyxDQUFDZSxHQUFOLENBQVUsUUFBVixDQUFuQixFQUF3QztBQUN0QytCLGFBQU8sR0FBRyxLQUFWO0FBQ0Q7QUFDRixHQVREOztBQVdBLE1BQUloRCxJQUFJLENBQUNpQixHQUFMLENBQVMsdUJBQVQsQ0FBSixFQUF1QztBQUNyQyxRQUFJaUMsZUFBZSxDQUFDRCxhQUFELENBQW5CLEVBQW9DO0FBQ2xDRCxhQUFPLEdBQUcsSUFBVjtBQUNEO0FBQ0Y7O0FBRUQvQyxPQUFLLENBQUNZLEdBQU4sQ0FBVSxRQUFWLEVBQW9CbUMsT0FBcEI7O0FBQ0EsTUFBSUEsT0FBSixFQUFhO0FBQ1haLGlCQUFhLENBQUN6QixPQUFkLENBQXNCQyxNQUFNLElBQUk7QUFDOUIsWUFBTTBDLFNBQVMsR0FBRzFDLE1BQU0sQ0FBQ0ssR0FBUCxDQUFXLE9BQVgsS0FBdUIsQ0FBekM7QUFDQUwsWUFBTSxDQUFDQyxHQUFQLENBQVcsT0FBWCxFQUFvQnlDLFNBQVMsR0FBRyxDQUFoQztBQUNELEtBSEQ7QUFJQTlDLFdBQU8sQ0FBQ0MsR0FBUixDQUFZLCtCQUFaO0FBQ0Q7QUFDRixDLENBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNOzs7Ozs7Ozs7OztBQzlTQWYsTUFBTSxDQUFDNkQsTUFBUCxDQUFjO0FBQUNDLGNBQVksRUFBQyxNQUFJQTtBQUFsQixDQUFkO0FBQUEsTUFBTUMsVUFBVSxHQUFHLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CLEVBQXFDLElBQXJDLEVBQTBDLElBQTFDLEVBQStDLElBQS9DLEVBQW9ELEtBQXBELEVBQTBELEtBQTFELEVBQWdFLEtBQWhFLENBQW5CLEMsQ0FFQTtBQUNBO0FBQ0E7O0FBRU8sTUFBTUQsWUFBWSxHQUFHLENBQzFCO0FBQ0VFLEtBQUcsRUFBRSxHQURQO0FBRUVDLFVBQVEsRUFBRSxRQUZaO0FBR0VDLFNBQU8sRUFBRUgsVUFIWDtBQUlFSSxRQUFNLEVBQUU7QUFKVixDQUQwQixFQU8xQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FQMEIsRUFhMUI7QUFDRUgsS0FBRyxFQUFFLEdBRFA7QUFFRUMsVUFBUSxFQUFFLFFBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBYjBCLEVBbUIxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FuQjBCLEVBeUIxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0F6QjBCLEVBK0IxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0EvQjBCLEVBcUMxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FyQzBCLEVBMkMxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0EzQzBCLEVBaUQxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FqRDBCLEVBdUQxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0F2RDBCLEVBNkQxQjtBQUNFSCxLQUFHLEVBQUUsSUFEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0E3RDBCLEVBbUUxQjtBQUNFSCxLQUFHLEVBQUUsSUFEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FuRTBCLEVBeUUxQjtBQUNFSCxLQUFHLEVBQUUsSUFEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0F6RTBCLEVBK0UxQjtBQUNFSCxLQUFHLEVBQUUsSUFEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0EvRTBCLEVBcUYxQjtBQUNFSCxLQUFHLEVBQUUsSUFEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FyRjBCLENBQXJCLEM7Ozs7Ozs7Ozs7O0FDTlBuRSxNQUFNLENBQUM2RCxNQUFQLENBQWM7QUFBQ08sY0FBWSxFQUFDLE1BQUlBLFlBQWxCO0FBQStCMUQsd0JBQXNCLEVBQUMsTUFBSUE7QUFBMUQsQ0FBZDs7QUFBTyxTQUFTMEQsWUFBVCxDQUFzQkMsU0FBdEIsRUFBaUNuRCxNQUFqQyxFQUF5QztBQUM1QyxRQUFNb0QsU0FBUyxHQUFHLEVBQWxCO0FBQ0EsTUFBSWhELE9BQU8sR0FBRytDLFNBQVMsQ0FBQ0UsS0FBVixDQUFnQixHQUFoQixDQUFkO0FBQ0EsUUFBTUMsV0FBVyxHQUFHdEQsTUFBTSxDQUFDSyxHQUFQLENBQVcsUUFBWCxDQUFwQjtBQUVBRCxTQUFPLENBQUNMLE9BQVIsQ0FBaUJ3RCxDQUFELElBQU87QUFDckIsVUFBTUMsVUFBVSxHQUFHRCxDQUFDLENBQUNGLEtBQUYsQ0FBUSxHQUFSLENBQW5COztBQUVBLFFBQUlDLFdBQVcsS0FBSzVDLFFBQVEsQ0FBQzhDLFVBQVUsQ0FBQyxDQUFELENBQVgsQ0FBNUIsRUFBNkM7QUFDM0NKLGVBQVMsQ0FBQ2xDLElBQVYsQ0FBZXNDLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0MsT0FBZCxDQUFzQixLQUF0QixFQUE2QixFQUE3QixDQUFmO0FBQ0QsS0FGRCxNQUVPLElBQUlILFdBQVcsS0FBSzVDLFFBQVEsQ0FBQzhDLFVBQVUsQ0FBQyxDQUFELENBQVgsQ0FBNUIsRUFBNkM7QUFDbERKLGVBQVMsQ0FBQ2xDLElBQVYsQ0FBZXNDLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0MsT0FBZCxDQUFzQixLQUF0QixFQUE2QixFQUE3QixDQUFmO0FBQ0Q7QUFDRixHQVJEO0FBVUEsU0FBTyxDQUFDLEdBQUksSUFBSUMsR0FBSixDQUFRTixTQUFSLENBQUwsQ0FBUDtBQUNEOztBQUVJLFNBQVM1RCxzQkFBVCxDQUFnQ0osSUFBaEMsRUFBc0M7QUFDekMsUUFBTXVFLFdBQVcsR0FBRyxFQUFwQjtBQUNBLFFBQU1DLFFBQVEsR0FBRyxFQUFqQixDQUZ5QyxDQUd6Qzs7QUFDQSxRQUFNcEMsYUFBYSxHQUFHcEMsSUFBSSxDQUFDVSxPQUFMLENBQWEyQixNQUFiLENBQW9CVCxDQUFDLElBQUksQ0FBQ0EsQ0FBQyxDQUFDWCxHQUFGLENBQU0sVUFBTixDQUExQixDQUF0QixDQUp5QyxDQU96QztBQUNBO0FBQ0E7O0FBRUFqQixNQUFJLENBQUNVLE9BQUwsQ0FBYUMsT0FBYixDQUFzQmlCLENBQUQsSUFBTztBQUMxQjtBQUNBLFFBQUksQ0FBQ0EsQ0FBQyxDQUFDWCxHQUFGLENBQU0sU0FBTixDQUFMLEVBQXVCO0FBRXJCc0QsaUJBQVcsQ0FBQ3pDLElBQVosV0FBb0JGLENBQUMsQ0FBQ1gsR0FBRixDQUFNLFFBQU4sQ0FBcEI7QUFDRDs7QUFDRHVELFlBQVEsQ0FBQzFDLElBQVQsV0FBaUJGLENBQUMsQ0FBQ1gsR0FBRixDQUFNLFFBQU4sQ0FBakI7QUFDRCxHQVBEO0FBU0FqQixNQUFJLENBQUNVLE9BQUwsQ0FBYUMsT0FBYixDQUFzQmlCLENBQUQsSUFBTztBQUMxQjtBQUNBO0FBQ0E7QUFFQTtBQUNBLFVBQU02QyxZQUFZLEdBQUdELFFBQVEsQ0FBQ25DLE1BQVQsQ0FBZ0JxQyxFQUFFLElBQUlwRCxRQUFRLENBQUNvRCxFQUFELENBQVIsS0FBaUI5QyxDQUFDLENBQUNYLEdBQUYsQ0FBTSxRQUFOLENBQXZDLENBQXJCO0FBQ0FXLEtBQUMsQ0FBQ2YsR0FBRixDQUFNLFdBQU4sRUFBbUI0RCxZQUFuQjtBQUNELEdBUkQ7QUFTSCxDOzs7Ozs7Ozs7OztBQy9DRCxJQUFJaEYsUUFBSjtBQUFhQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSixZQUFRLEdBQUNJLENBQVQ7QUFBVzs7QUFBdkIsQ0FBbkMsRUFBNEQsQ0FBNUQ7QUFBK0RILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFdBQVo7QUFBeUJELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdCQUFaO0FBQThCLElBQUlnRixXQUFKLEVBQWdCbkIsWUFBaEI7QUFBNkI5RCxNQUFNLENBQUNDLElBQVAsQ0FBWSxhQUFaLEVBQTBCO0FBQUNnRixhQUFXLENBQUM5RSxDQUFELEVBQUc7QUFBQzhFLGVBQVcsR0FBQzlFLENBQVo7QUFBYyxHQUE5Qjs7QUFBK0IyRCxjQUFZLENBQUMzRCxDQUFELEVBQUc7QUFBQzJELGdCQUFZLEdBQUMzRCxDQUFiO0FBQWU7O0FBQTlELENBQTFCLEVBQTBGLENBQTFGO0FBQTZGLElBQUlpRSxZQUFKLEVBQWlCMUQsc0JBQWpCO0FBQXdDVixNQUFNLENBQUNDLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNtRSxjQUFZLENBQUNqRSxDQUFELEVBQUc7QUFBQ2lFLGdCQUFZLEdBQUNqRSxDQUFiO0FBQWUsR0FBaEM7O0FBQWlDTyx3QkFBc0IsQ0FBQ1AsQ0FBRCxFQUFHO0FBQUNPLDBCQUFzQixHQUFDUCxDQUF2QjtBQUF5Qjs7QUFBcEYsQ0FBckIsRUFBMkcsQ0FBM0c7QUFPclM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUosUUFBUSxDQUFDbUYsUUFBVCxDQUFrQjVFLElBQUksSUFBSTtBQUN4QixRQUFNO0FBQ0pnQyxhQUFTLEVBQUU7QUFDVDZDLGlCQURTO0FBRVRDLHNCQUZTO0FBR1RDLG1CQUhTO0FBSVRDLHFCQUpTO0FBS1RDLCtCQUxTO0FBTVRDLDRCQU5TO0FBT1RDLGtCQVBTO0FBUVRDLG9CQVJTO0FBU1RDLG9CQVRTO0FBVVRDLHFCQVZTO0FBV1RDO0FBWFM7QUFEUCxNQWNGdkYsSUFkSjtBQWlCQSxRQUFNd0YsU0FBUyxHQUFHaEMsWUFBbEI7QUFDQSxRQUFNaUMsT0FBTyxHQUFHUix5QkFBeUIsR0FBR0osV0FBVyxHQUFHLENBQWpCLEdBQXFCTyxjQUE5RCxDQW5Cd0IsQ0FtQnNEOztBQUM5RSxRQUFNTSxxQkFBcUIsR0FBR1gsYUFBYSxHQUFDQyxlQUE1QztBQUVBLE1BQUlXLE1BQU0sR0FBRyxDQUFDLE9BQUQsRUFBVSxLQUFWLEVBQWlCLFFBQWpCLEVBQTJCLE1BQTNCLEVBQW1DLFFBQW5DLEVBQTZDLE9BQTdDLEVBQXNELE9BQXRELENBQWI7QUFDQSxNQUFJQyxTQUFTLEdBQUcsQ0FBaEI7QUFDQUQsUUFBTSxHQUFHRSxPQUFPLENBQUNGLE1BQUQsQ0FBaEI7QUFFQTNGLE1BQUksQ0FBQ1UsT0FBTCxDQUFhQyxPQUFiLENBQXFCLENBQUNDLE1BQUQsRUFBU2tGLENBQVQsS0FBZTtBQUNsQ2xGLFVBQU0sQ0FBQ0MsR0FBUCxDQUFXLFFBQVgsK0JBQTJDRCxNQUFNLENBQUM4QyxHQUFsRDtBQUNBOUMsVUFBTSxDQUFDQyxHQUFQLENBQVcsT0FBWCxFQUFvQixDQUFwQixFQUZrQyxDQUlsQzs7QUFDQUQsVUFBTSxDQUFDQyxHQUFQLENBQVcsUUFBWCxFQUFxQmlGLENBQUMsR0FBRyxDQUF6QjtBQUNBbEYsVUFBTSxDQUFDQyxHQUFQLENBQVcsTUFBWCxFQUFtQkQsTUFBTSxDQUFDOEQsRUFBMUI7QUFDQTlELFVBQU0sQ0FBQ0MsR0FBUCxDQUFXLGVBQVgsRUFBNEI4RSxNQUFNLENBQUNHLENBQUQsQ0FBbEM7QUFDRCxHQVJEOztBQVVBLE1BQUk5RixJQUFJLENBQUNVLE9BQUwsQ0FBYXFCLE1BQWIsR0FBc0IvQixJQUFJLENBQUNnQyxTQUFMLENBQWU2QyxXQUF6QyxFQUFzRDtBQUFFO0FBQ3REekUsMEJBQXNCLENBQUNKLElBQUQsQ0FBdEI7QUFDQUEsUUFBSSxDQUFDVSxPQUFMLENBQWFDLE9BQWIsQ0FBc0JpQixDQUFELElBQU87QUFDMUJwQixhQUFPLENBQUNDLEdBQVIsQ0FBWW1CLENBQUMsQ0FBQ1gsR0FBRixDQUFNLFdBQU4sQ0FBWjtBQUNELEtBRkQ7QUFHRCxHQUxELE1BS087QUFDTGpCLFFBQUksQ0FBQ1UsT0FBTCxDQUFhQyxPQUFiLENBQXNCaUIsQ0FBRCxJQUFPO0FBQzFCQSxPQUFDLENBQUNmLEdBQUYsQ0FBTSxXQUFOLEVBQW1CaUQsWUFBWSxDQUFDZ0IsZ0JBQUQsRUFBbUJsRCxDQUFuQixDQUEvQjtBQUNBcEIsYUFBTyxDQUFDQyxHQUFSLENBQVltQixDQUFDLENBQUNYLEdBQUYsQ0FBTSxXQUFOLENBQVo7QUFDRCxLQUhEO0FBSUQsR0E5Q3VCLENBZ0R4QjtBQUNBOzs7QUFDQThFLEdBQUMsQ0FBQ0MsS0FBRixDQUFTakIsYUFBVCxFQUF3QmUsQ0FBQyxJQUFJO0FBQzNCLFVBQU03RixLQUFLLEdBQUdELElBQUksQ0FBQ2lHLFFBQUwsRUFBZDtBQUVBLFVBQU07QUFBQ3JDLGFBQUQ7QUFBVUQsY0FBVjtBQUFvQkU7QUFBcEIsUUFBOEIyQixTQUFTLENBQUNNLENBQUQsQ0FBN0M7QUFFQSxVQUFNSSxTQUFTLEdBQUdqRyxLQUFLLENBQUNrRyxRQUFOLENBQWU7QUFDL0J6RCxVQUFJLEVBQUUsTUFEeUI7QUFFL0JDLGlCQUFXLEVBQUVnQixRQUZrQjtBQUcvQkUsWUFBTSxFQUFFQSxNQUh1QjtBQUkvQnVDLHVCQUFpQixFQUFFakI7QUFKWSxLQUFmLENBQWxCO0FBTUFlLGFBQVMsQ0FBQ3JGLEdBQVYsQ0FBYyxNQUFkLEVBQXNCMkUsU0FBUyxDQUFDTSxDQUFELENBQS9CO0FBQ0FPLHdCQUFvQixDQUFDekMsT0FBRCxFQUFVQyxNQUFWLEVBQWtCNEIsT0FBbEIsRUFBMkI5QixRQUEzQixFQUFxQzNELElBQXJDLEVBQTJDdUYsYUFBM0MsQ0FBcEI7QUFDQVcsYUFBUyxDQUFDckYsR0FBVixDQUFjLFFBQWQsRUFBd0IyRSxTQUFTLENBQUNNLENBQUQsQ0FBVCxDQUFhakMsTUFBckM7QUFFQSxVQUFNeUMsV0FBVyxHQUFHckcsS0FBSyxDQUFDa0csUUFBTixDQUFlO0FBQ2pDekQsVUFBSSxFQUFFLFFBRDJCO0FBRWpDQyxpQkFBVyxFQUFFLFFBRm9CO0FBR2pDeUQsdUJBQWlCLEVBQUVkO0FBSGMsS0FBZixDQUFwQjs7QUFNQSxRQUFJLENBQUNRLENBQUMsR0FBQyxDQUFILElBQVFKLHFCQUFSLEtBQWtDLENBQXRDLEVBQXlDO0FBQUU7QUFDekMsWUFBTWEsV0FBVyxHQUFHdkcsSUFBSSxDQUFDaUcsUUFBTCxFQUFwQjtBQUVBLFlBQU1PLFlBQVksR0FBR0QsV0FBVyxDQUFDSixRQUFaLENBQXFCO0FBQ3hDekQsWUFBSSxFQUFFLFFBRGtDO0FBRXhDQyxtQkFBVyxFQUFFLFlBQVlpRCxTQUZlO0FBR3hDUSx5QkFBaUIsRUFBRWY7QUFIcUIsT0FBckIsQ0FBckI7QUFNQU8sZUFBUztBQUNWO0FBRUYsR0FqQ0Q7O0FBcUNBLFdBQVNTLG9CQUFULENBQThCYixTQUE5QixFQUF5QzNCLE1BQXpDLEVBQWlENEIsT0FBakQsRUFBMEQ5QixRQUExRCxFQUFvRTNELElBQXBFLEVBQTBFdUYsYUFBMUUsRUFBeUY7QUFDckYsUUFBSWtCLG9CQUFvQixHQUFHakIsU0FBUyxDQUFDbkQsTUFBVixDQUFpQnFFLE1BQU0sSUFBSUEsTUFBTSxLQUFLN0MsTUFBdEMsQ0FBM0I7QUFDQTRDLHdCQUFvQixHQUFHWixPQUFPLENBQUNZLG9CQUFELENBQTlCO0FBQ0EsUUFBSUUsVUFBVSxHQUFHM0csSUFBSSxDQUFDVSxPQUFMLENBQWFxQixNQUE5QjtBQUNBLFFBQUk2RSxVQUFVLEdBQUcsQ0FBakIsQ0FKcUYsQ0FPckY7O0FBQ0EsUUFBSUMsVUFBVSxHQUFHLEVBQWpCOztBQUNBLFNBQUssSUFBSWYsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1csb0JBQW9CLENBQUMxRSxNQUF6QyxFQUFpRCtELENBQUMsRUFBbEQsRUFBc0Q7QUFDcEQsVUFBSVksTUFBTSxHQUFHRCxvQkFBb0IsQ0FBQ1gsQ0FBRCxDQUFqQzs7QUFDQSxVQUFJLENBQUNlLFVBQVUsQ0FBQ0MsY0FBWCxDQUEwQkosTUFBMUIsQ0FBTCxFQUF3QztBQUN0Q0csa0JBQVUsQ0FBQ0gsTUFBRCxDQUFWLEdBQXFCQyxVQUFVLEdBQUcsQ0FBbEMsQ0FEc0MsQ0FDRDtBQUN0QztBQUNGOztBQUVEM0csUUFBSSxDQUFDVSxPQUFMLENBQWFDLE9BQWIsQ0FBc0JDLE1BQUQsSUFBWTtBQUMvQixVQUFJbUcsYUFBYSxHQUFHLEVBQXBCOztBQUNBLFdBQUssSUFBSWpCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdXLG9CQUFvQixDQUFDMUUsTUFBekMsRUFBaUQrRCxDQUFDLEVBQWxELEVBQXNEO0FBQ3BELFlBQUlZLE1BQU0sR0FBR0Qsb0JBQW9CLENBQUNYLENBQUQsQ0FBakM7O0FBQ0EsWUFBSWlCLGFBQWEsQ0FBQ2hGLE1BQWQsR0FBdUIwRCxPQUFPLEdBQUcsQ0FBckMsRUFBd0M7QUFBRTtBQUN4QyxjQUFJb0IsVUFBVSxDQUFDSCxNQUFELENBQVYsR0FBcUIsQ0FBckIsS0FBMkIsQ0FBL0IsRUFBa0M7QUFBRTtBQUNoQyxnQkFBSUUsVUFBVSxHQUFHckIsYUFBakIsRUFBaUM7QUFBRTtBQUNqQ3dCLDJCQUFhLENBQUNqRixJQUFkLENBQW1CNEUsTUFBbkI7QUFDQUcsd0JBQVUsQ0FBQ0gsTUFBRCxDQUFWLElBQXNCLENBQXRCO0FBQ0FFLHdCQUFVLElBQUksQ0FBZDtBQUNEO0FBQ0osV0FORCxNQU1PO0FBQ0xHLHlCQUFhLENBQUNqRixJQUFkLENBQW1CNEUsTUFBbkI7QUFDQUcsc0JBQVUsQ0FBQ0gsTUFBRCxDQUFWLElBQXNCLENBQXRCO0FBQ0Q7QUFDRjtBQUNGOztBQUNESyxtQkFBYSxDQUFDakYsSUFBZCxDQUFtQitCLE1BQW5CLEVBakIrQixDQWlCSDs7QUFDNUIsV0FBSyxJQUFJbUQsY0FBVCxJQUEyQkQsYUFBM0IsRUFBMEM7QUFDeEMsWUFBSUYsVUFBVSxDQUFDRyxjQUFELENBQVYsS0FBK0IsQ0FBbkMsRUFBc0M7QUFBRTtBQUN0Q1AsOEJBQW9CLEdBQUdBLG9CQUFvQixDQUFDcEUsTUFBckIsQ0FBNEJxRSxNQUFNLElBQUlBLE1BQU0sS0FBS00sY0FBakQsQ0FBdkI7QUFFRDtBQUNGOztBQUVERCxtQkFBYSxHQUFHbEIsT0FBTyxDQUFDa0IsYUFBRCxDQUF2QjtBQUVBbkcsWUFBTSxDQUFDQyxHQUFQLENBQVc4QyxRQUFYLEVBQXFCb0QsYUFBckI7QUFDRCxLQTVCRDtBQStCSCxHQXRJdUIsQ0F3SXhCO0FBQ0E7OztBQUNBLFdBQVNsQixPQUFULENBQWlCTCxTQUFqQixFQUE0QjtBQUMxQixTQUFLTSxDQUFDLEdBQUdOLFNBQVMsQ0FBQ3pELE1BQVYsR0FBa0IsQ0FBM0IsRUFBK0IrRCxDQUFDLEdBQUcsQ0FBbkMsRUFBc0NBLENBQUMsRUFBdkMsRUFBMkM7QUFDekMsWUFBTW1CLENBQUMsR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsTUFBTCxNQUFpQnRCLENBQUMsR0FBRyxDQUFyQixDQUFYLENBQVY7QUFFQSxPQUFDTixTQUFTLENBQUNNLENBQUQsQ0FBVixFQUFlTixTQUFTLENBQUN5QixDQUFELENBQXhCLElBQStCLENBQUN6QixTQUFTLENBQUN5QixDQUFELENBQVYsRUFBZXpCLFNBQVMsQ0FBQ00sQ0FBRCxDQUF4QixDQUEvQjtBQUNEOztBQUNELFdBQU9OLFNBQVA7QUFDRDtBQUVGLENBbkpELEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcblxuLy8gVGhpcyBpcyB3aGVyZSB5b3UgYWRkIGJvdHMsIGxpa2UgQm9iOlxuXG5FbXBpcmljYS5ib3QoXCJib2JcIiwge1xuICAvLyAvLyBOT1QgU1VQUE9SVEVEIENhbGxlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGVhY2ggc3RhZ2UgKGFmdGVyIG9uUm91bmRTdGFydC9vblN0YWdlU3RhcnQpXG4gIC8vIG9uU3RhZ2VTdGFydChib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycykge30sXG5cbiAgLy8gQ2FsbGVkIGR1cmluZyBlYWNoIHN0YWdlIGF0IHRpY2sgaW50ZXJ2YWwgKH4xcyBhdCB0aGUgbW9tZW50KVxuICBvblN0YWdlVGljayhib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgc2Vjb25kc1JlbWFpbmluZykge31cblxuICAvLyAvLyBOT1QgU1VQUE9SVEVEIEEgcGxheWVyIGhhcyBjaGFuZ2VkIGEgdmFsdWVcbiAgLy8gLy8gVGhpcyBtaWdodCBoYXBwZW4gYSBsb3QhXG4gIC8vIG9uU3RhZ2VQbGF5ZXJDaGFuZ2UoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMsIHBsYXllcikge31cblxuICAvLyAvLyBOT1QgU1VQUE9SVEVEIENhbGxlZCBhdCB0aGUgZW5kIG9mIHRoZSBzdGFnZSAoYWZ0ZXIgaXQgZmluaXNoZWQsIGJlZm9yZSBvblN0YWdlRW5kL29uUm91bmRFbmQgaXMgY2FsbGVkKVxuICAvLyBvblN0YWdlRW5kKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzKSB7fVxufSk7XG4iLCJpbXBvcnQgRW1waXJpY2EgZnJvbSBcIm1ldGVvci9lbXBpcmljYTpjb3JlXCI7XG5cbmltcG9ydCB7IGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIgfSBmcm9tIFwiLi91dGlsXCI7XG5pbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcbmltcG9ydCB7IFRpbWVTeW5jIH0gZnJvbSBcIm1ldGVvci9taXp6YW86dGltZXN5bmNcIjtcblxuXG5cbi8vIG9uR2FtZVN0YXJ0IGlzIHRyaWdnZXJlZCBvcG5jZSBwZXIgZ2FtZSBiZWZvcmUgdGhlIGdhbWUgc3RhcnRzLCBhbmQgYmVmb3JlXG4vLyB0aGUgZmlyc3Qgb25Sb3VuZFN0YXJ0LiBJdCByZWNlaXZlcyB0aGUgZ2FtZSBhbmQgbGlzdCBvZiBhbGwgdGhlIHBsYXllcnMgaW5cbi8vIHRoZSBnYW1lLlxuRW1waXJpY2Eub25HYW1lU3RhcnQoZ2FtZSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiR2FtZSBzdGFydGVkXCIpO1xuICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgcGxheWVyLnNldChcImluYWN0aXZlXCIsIGZhbHNlKTtcbiAgICBwbGF5ZXIuc2V0KFwiaW5hY3RpdmVXYXJuaW5nVXNlZFwiLCBmYWxzZSk7XG4gICAgcGxheWVyLnNldChcImxhc3RBY3RpdmVcIiwgbW9tZW50KERhdGUubm93KCkpKTtcbiAgICBjb25zdCBuZXR3b3JrID0gcGxheWVyLmdldChcIm5laWdoYm9yc1wiKTtcbiAgICBjb25zdCBhY3RpdmVDaGF0cyA9IFtdO1xuICAgIG5ldHdvcmsubWFwKG90aGVyTm9kZUlkID0+IHtcbiAgICAgIHZhciBwYWlyT2ZQbGF5ZXJzID0gW3BsYXllci5nZXQoXCJub2RlSWRcIiksIHBhcnNlSW50KG90aGVyTm9kZUlkKV07XG4gICAgICBwYWlyT2ZQbGF5ZXJzLnNvcnQoKHAxLHAyKSA9PiBwMSAtIHAyKTtcbiAgICAgIGNvbnN0IG90aGVyUGxheWVyID0gZ2FtZS5wbGF5ZXJzLmZpbmQocCA9PiBwLmdldChcIm5vZGVJZFwiKSA9PT0gcGFyc2VJbnQob3RoZXJOb2RlSWQpKTtcbiAgICAgIC8vIGNvbnN0IG90aGVyUGxheWVySWQgPSBvdGhlclBsYXllci5pZDtcbiAgICAgIGNvbnN0IGNoYXRLZXkgPSBgJHtwYWlyT2ZQbGF5ZXJzWzBdfS0ke3BhaXJPZlBsYXllcnNbMV19YDtcbiAgICAgIGFjdGl2ZUNoYXRzLnB1c2goY2hhdEtleSk7XG4gICAgfSk7XG4gICAgLy8gRGVmYXVsdCBhbGwgY2hhdHMgdG8gYmUgb3BlbiB3aGVuIGdhbWUgc3RhcnRzXG4gICAgcGxheWVyLnNldChcImFjdGl2ZUNoYXRzXCIsIGFjdGl2ZUNoYXRzKTtcbiAgfSk7XG4gIGdhbWUuc2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIsIGdhbWUucGxheWVycy5sZW5ndGgpO1xuICBnYW1lLnNldChcImdhbWVTdGFydFRpbWVcIiwgbW9tZW50KERhdGUubm93KCkpKTtcbiAgaWYgKGdhbWUudHJlYXRtZW50Lm1heEdhbWVUaW1lKSB7XG4gICAgZ2FtZS5zZXQoXCJtYXhHYW1lRW5kVGltZVwiLCBtb21lbnQoRGF0ZS5ub3coKSkuYWRkKGdhbWUudHJlYXRtZW50Lm1heEdhbWVUaW1lLCAnbScpKVxuICB9XG59KTtcblxuLy8gb25Sb3VuZFN0YXJ0IGlzIHRyaWdnZXJlZCBiZWZvcmUgZWFjaCByb3VuZCBzdGFydHMsIGFuZCBiZWZvcmUgb25TdGFnZVN0YXJ0LlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvbkdhbWVTdGFydCwgYW5kIHRoZSByb3VuZCB0aGF0IGlzIHN0YXJ0aW5nLlxuRW1waXJpY2Eub25Sb3VuZFN0YXJ0KChnYW1lLCByb3VuZCkgPT4ge1xuICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgcGxheWVyLnNldChcInN1Ym1pdHRlZFwiLCBmYWxzZSk7XG4gICAgcGxheWVyLnNldChcInN5bWJvbFNlbGVjdGVkXCIsIFwiXCIpO1xuICB9KTtcbiAgcm91bmQuc2V0KFwicmVzdWx0XCIsIGZhbHNlKTtcbiAgcm91bmQuc2V0KFwibnVtUGxheWVyc1N1Ym1pdHRlZFwiLCAwKTtcbiAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG4gIGlmIChhY3RpdmVQbGF5ZXJzLmxlbmd0aCA8IGdhbWUuZ2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIpICkgeyAvLyBTb21lb25lIGxlZnQgaW4gdGhlIG1pZGRsZSBvZiB0aGUgcm91bmRcbiAgICBpZiAoZ2FtZS50cmVhdG1lbnQuZW5kR2FtZUlmUGxheWVySWRsZSkge1xuICAgICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgIC8vIHAuZXhpdChcInNvbWVvbmVJbmFjdGl2ZVwiKTtcbiAgICAgICAgcC5leGl0KFwibWluUGxheWVyQ291bnROb3RNYWludGFpbmVkXCIpO1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTsgLy8gVXBkYXRlcyB0aGUgbmVpZ2hib3JzIHRvIGJlIGZ1bGx5IGNvbm5lY3RlZFxuICAgICAgZ2FtZS5zZXQoXCJjaGVja0ZvclNpbWlsYXJTeW1ib2xcIiwgdHJ1ZSk7XG4gICAgfVxuICBcbiAgfVxuICBnYW1lLnNldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiLCBhY3RpdmVQbGF5ZXJzLmxlbmd0aCk7XG5cbiAgaWYgKGdhbWUudHJlYXRtZW50Lm1pblBsYXllckNvdW50ICYmIGFjdGl2ZVBsYXllcnMubGVuZ3RoIDwgZ2FtZS50cmVhdG1lbnQubWluUGxheWVyQ291bnQpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIHAuZXhpdChcIm1pblBsYXllckNvdW50Tm90TWFpbnRhaW5lZFwiKTtcbiAgICB9KVxuICB9XG5cbiAgY29uc29sZS5sb2coXCJSb3VuZCBTdGFydGVkXCIpO1xuXG59KTtcblxuLy8gb25TdGFnZVN0YXJ0IGlzIHRyaWdnZXJlZCBiZWZvcmUgZWFjaCBzdGFnZSBzdGFydHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uUm91bmRTdGFydCwgYW5kIHRoZSBzdGFnZSB0aGF0IGlzIHN0YXJ0aW5nLlxuRW1waXJpY2Eub25TdGFnZVN0YXJ0KChnYW1lLCByb3VuZCwgc3RhZ2UpID0+IHtcbiAgY29uc29sZS5sb2coXCJTdGFnZSBTdGFydGVkXCIpXG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJUYXNrXCIpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgY29uc29sZS5sb2coIGBTeW1ib2xzIDogJHtwbGF5ZXIuZ2V0KGAke3N0YWdlLmRpc3BsYXlOYW1lfWApfWApO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKGBBbnN3ZXI6ICR7c3RhZ2UuZ2V0KFwiYW5zd2VyXCIpfWApO1xuICB9XG4gIGlmIChzdGFnZS5uYW1lID09PSBcIlN1cnZleVwiKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIHBsYXllci5zZXQoXCJzdXJ2ZXlOdW1iZXJcIiAsIDEpXG4gICAgfSk7XG4gIH1cbiAgLy8gZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAvLyB9KTtcbiAgLy8gc3RhZ2Uuc2V0KFwic2hvd1Jlc3VsdHNcIiwgZmFsc2UpO1xuICAvLyBzdGFnZS5zZXQoXCJyZXN1bHRzU2hvd25cIiwgZmFsc2UpO1xuXG59KTtcblxuLy8gb25TdGFnZUVuZCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgZWFjaCBzdGFnZS5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25Sb3VuZEVuZCwgYW5kIHRoZSBzdGFnZSB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblN0YWdlRW5kKChnYW1lLCByb3VuZCwgc3RhZ2UpID0+e1xuICBjb25zb2xlLmxvZyhcIlN0YWdlIEVuZGVkXCIpXG4gIFxufSk7XG5cbi8vIG9uUm91bmRFbmQgaXMgdHJpZ2dlcmVkIGFmdGVyIGVhY2ggcm91bmQuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZUVuZCwgYW5kIHRoZSByb3VuZCB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblJvdW5kRW5kKChnYW1lLCByb3VuZCkgPT4ge1xuICBjb25zb2xlLmxvZyhcIlJvdW5kIEVuZGVkXCIpXG4gIC8vIGdhbWUucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gIC8vICAgY29uc3QgdmFsdWUgPSBwbGF5ZXIucm91bmQuZ2V0KFwidmFsdWVcIikgfHwgMDtcbiAgLy8gICBjb25zdCBwcmV2U2NvcmUgPSBwbGF5ZXIuZ2V0KFwic2NvcmVcIikgfHwgMDtcbiAgLy8gICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgcHJldlNjb3JlICsgdmFsdWUpO1xuICAvLyB9KTtcblxufSk7XG5cbi8vIG9uR2FtZUVuZCBpcyB0cmlnZ2VyZWQgd2hlbiB0aGUgZ2FtZSBlbmRzLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvbkdhbWVTdGFydC5cbkVtcGlyaWNhLm9uR2FtZUVuZChnYW1lID0+IHt9KTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PiBvblNldCwgb25BcHBlbmQgYW5kIG9uQ2hhbmdlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIG9uU2V0LCBvbkFwcGVuZCBhbmQgb25DaGFuZ2UgYXJlIGNhbGxlZCBvbiBldmVyeSBzaW5nbGUgdXBkYXRlIG1hZGUgYnkgYWxsXG4vLyBwbGF5ZXJzIGluIGVhY2ggZ2FtZSwgc28gdGhleSBjYW4gcmFwaWRseSBiZWNvbWUgcXVpdGUgZXhwZW5zaXZlIGFuZCBoYXZlXG4vLyB0aGUgcG90ZW50aWFsIHRvIHNsb3cgZG93biB0aGUgYXBwLiBVc2Ugd2lzZWx5LlxuLy9cbi8vIEl0IGlzIHZlcnkgdXNlZnVsIHRvIGJlIGFibGUgdG8gcmVhY3QgdG8gZWFjaCB1cGRhdGUgYSB1c2VyIG1ha2VzLiBUcnlcbi8vIG5vbnRoZWxlc3MgdG8gbGltaXQgdGhlIGFtb3VudCBvZiBjb21wdXRhdGlvbnMgYW5kIGRhdGFiYXNlIHNhdmVzICguc2V0KVxuLy8gZG9uZSBpbiB0aGVzZSBjYWxsYmFja3MuIFlvdSBjYW4gYWxzbyB0cnkgdG8gbGltaXQgdGhlIGFtb3VudCBvZiBjYWxscyB0b1xuLy8gc2V0KCkgYW5kIGFwcGVuZCgpIHlvdSBtYWtlIChhdm9pZCBjYWxsaW5nIHRoZW0gb24gYSBjb250aW51b3VzIGRyYWcgb2YgYVxuLy8gc2xpZGVyIGZvciBleGFtcGxlKSBhbmQgaW5zaWRlIHRoZXNlIGNhbGxiYWNrcyB1c2UgdGhlIGBrZXlgIGFyZ3VtZW50IGF0IHRoZVxuLy8gdmVyeSBiZWdpbm5pbmcgb2YgdGhlIGNhbGxiYWNrIHRvIGZpbHRlciBvdXQgd2hpY2gga2V5cyB5b3VyIG5lZWQgdG8gcnVuXG4vLyBsb2dpYyBhZ2FpbnN0LlxuLy9cbi8vIElmIHlvdSBhcmUgbm90IHVzaW5nIHRoZXNlIGNhbGxiYWNrcywgY29tbWVudCB0aGVtIG91dCBzbyB0aGUgc3lzdGVtIGRvZXNcbi8vIG5vdCBjYWxsIHRoZW0gZm9yIG5vdGhpbmcuXG5cbi8vIC8vIG9uU2V0IGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgLnNldCgpIG1ldGhvZFxuLy8gLy8gb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3IgcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25TZXQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gKSA9PiB7XG4vLyAgIC8vIC8vIEV4YW1wbGUgZmlsdGVyaW5nXG4vLyAgIC8vIGlmIChrZXkgIT09IFwidmFsdWVcIikge1xuLy8gICAvLyAgIHJldHVybjtcbi8vICAgLy8gfVxuLy8gfSk7XG5cbi8vIEVtcGlyaWNhLm9uU2V0KChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbi8vICkgPT4ge1xuLy8gICBjb25zb2xlLmxvZyhcImtleVwiLCBrZXkpO1xuLy8gICBjb25zdCBwbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzO1xuLy8gICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbi8vICAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cbi8vICAgLy8gU29tZSBwbGF5ZXIgZGVjaWRlcyB0byByZWNvbnNpZGVyIHRoZWlyIGFuc3dlclxuLy8gICBpZiAoa2V5ID09PSBcInN1Ym1pdHRlZFwiKSB7IFxuLy8gICAgIC8vIENoZWNrcyBpZiBldmVyeW9uZSBoYXMgc3VibWl0dGVkIHRoZWlyIGFuc3dlciBhbmQgaWYgc28sIHN1Ym1pdCB0aGUgc3RhZ2Vcbi8vICAgICBsZXQgYWxsU3VibWl0dGVkID0gdHJ1ZTtcbi8vICAgICBsZXQgbnVtUGxheWVyc1N1Ym1pdHRlZCA9IDA7XG4vLyAgICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbi8vICAgICAgIGlmIChwbGF5ZXIuZ2V0KFwic3VibWl0dGVkXCIpKSB7XG4vLyAgICAgICAgIG51bVBsYXllcnNTdWJtaXR0ZWQgKz0gMTtcbi8vICAgICAgIH1cbi8vICAgICAgIGFsbFN1Ym1pdHRlZCA9IHBsYXllci5nZXQoXCJzdWJtaXR0ZWRcIikgJiYgYWxsU3VibWl0dGVkO1xuLy8gICAgIH0pXG4vLyAgICAgcm91bmQuc2V0KFwibnVtUGxheWVyc1N1Ym1pdHRlZFwiLCBudW1QbGF5ZXJzU3VibWl0dGVkKTtcbi8vICAgICBpZiAoYWxsU3VibWl0dGVkKSB7XG4vLyAgICAgICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJUYXNrXCIpIHtcbi8vICAgICAgICAgY29tcHV0ZVNjb3JlKGFjdGl2ZVBsYXllcnMsIGdhbWUsIHN0YWdlLCByb3VuZCk7XG4vLyAgICAgICB9XG4vLyAgICAgICAvLyBOZWVkIHRvIHN1Ym1pdCBmb3Igc3VibWl0IHRoZSBzdGFnZSBmb3IgZXZlcnkgcGxheWVyXG4vLyAgICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4vLyAgICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbi8vICAgICAgIH0pXG4vLyAgICAgfVxuLy8gICAvLyAgIGlmIChzdGFnZS5nZXQoXCJyZXN1bHRzU2hvd25cIikpIHtcbi8vICAgLy8gICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4vLyAgIC8vICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbi8vICAgLy8gICAgIH0pXG4vLyAgIC8vICAgfVxuLy8gICAvLyB9XG5cbi8vICAgLy8gaWYgKHRhcmdldFR5cGUgPT09IFwic3RhZ2VcIiAmJiBrZXkgPT09IFwicmVzdWx0c1Nob3duXCIpIHtcbi8vICAgLy8gICBpZiAoc3RhZ2UuZ2V0KFwicmVzdWx0c1Nob3duXCIpKSB7XG4vLyAgIC8vICAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuLy8gICAvLyAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4vLyAgIC8vICAgICB9KVxuLy8gICAvLyAgIH1cbi8vICAgfVxuXG4vLyAgIC8vIGVsc2UgaWYgKGtleSA9PT0gXCJpbmFjdGl2ZVwiKSB7XG4vLyAgICAgLy8gZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbi8vICAgLy8gfVxuXG4vLyAgIHJldHVybjtcblxuLy8gfSk7XG5cbmZ1bmN0aW9uIGNvbXB1dGVTY29yZShhY3RpdmVQbGF5ZXJzLCBnYW1lLCBzdGFnZSwgcm91bmQpIHtcbiAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuICBjb25zb2xlLmxvZyhcIkNPUlJFQ1QgQU5TV0VSOlwiKVxuICBjb25zb2xlLmxvZyhzdGFnZS5nZXQoXCJhbnN3ZXJcIikpO1xuICBjb25zb2xlLmxvZyhcIlBsYXllcnMgZ3Vlc3NlZDpcIilcblxuICBsZXQgcGxheWVyQW5zd2VycyA9IFtdO1xuICBjb25zdCBhbGxBbnN3ZXJzRXF1YWwgPSBhcnIgPT4gYXJyLmV2ZXJ5KCB2ID0+IHYgPT09IGFyclswXSApIC8vRnVuYyB0byBjaGVjayBpZiBhbGwgcGxheWVyIGFuc3dlcnMgYXJlIGVxdWFsXG5cbiAgYWN0aXZlUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgY29uc3Qgc3VibWlzc2lvbiA9IHBsYXllci5nZXQoXCJzeW1ib2xTZWxlY3RlZFwiKTtcbiAgICBjb25zb2xlLmxvZyhzdWJtaXNzaW9uKTtcbiAgICBpZiAoZ2FtZS5nZXQoXCJjaGVja0ZvclNpbWlsYXJTeW1ib2xcIikpIHtcbiAgICAgIHBsYXllckFuc3dlcnMucHVzaChzdWJtaXNzaW9uKTtcbiAgICB9XG4gICAgaWYgKHN1Ym1pc3Npb24gIT09IHN0YWdlLmdldChcImFuc3dlclwiKSkge1xuICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgIH1cbiAgfSlcblxuICBpZiAoZ2FtZS5nZXQoXCJjaGVja0ZvclNpbWlsYXJTeW1ib2xcIikpIHtcbiAgICBpZiAoYWxsQW5zd2Vyc0VxdWFsKHBsYXllckFuc3dlcnMpKSB7XG4gICAgICBzdWNjZXNzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByb3VuZC5zZXQoXCJyZXN1bHRcIiwgc3VjY2Vzcyk7XG4gIGlmIChzdWNjZXNzKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICBjb25zdCBwcmV2U2NvcmUgPSBwbGF5ZXIuZ2V0KFwic2NvcmVcIikgfHwgMDtcbiAgICAgIHBsYXllci5zZXQoXCJzY29yZVwiLCBwcmV2U2NvcmUgKyAxKTtcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKFwiIEFsbCBwbGF5ZXJzIGdvdCBpdCBjb3JyZWN0bHlcIik7XG4gIH0gXG59XG5cbi8vIC8vIG9uQXBwZW5kIGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgYC5hcHBlbmQoKWAgbWV0aG9kXG4vLyAvLyBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvciBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vbkFwcGVuZCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4vLyApID0+IHtcbi8vICAgLy8gTm90ZTogYHZhbHVlYCBpcyB0aGUgc2luZ2xlIGxhc3QgdmFsdWUgKGUuZyAwLjIpLCB3aGlsZSBgcHJldlZhbHVlYCB3aWxsXG4vLyAgIC8vICAgICAgIGJlIGFuIGFycmF5IG9mIHRoZSBwcmV2aXNvdXMgdmFsdWVkIChlLmcuIFswLjMsIDAuNCwgMC42NV0pLlxuLy8gfSk7XG5cblxuLy8gLy8gb25DaGFuZ2UgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSBgLnNldCgpYCBvciB0aGVcbi8vIC8vIGAuYXBwZW5kKClgIG1ldGhvZCBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvclxuLy8gLy8gcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25DaGFuZ2UoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSwgLy8gUHJldmlvdXMgdmFsdWVcbi8vICAgaXNBcHBlbmQgLy8gVHJ1ZSBpZiB0aGUgY2hhbmdlIHdhcyBhbiBhcHBlbmQsIGZhbHNlIGlmIGl0IHdhcyBhIHNldFxuLy8gKSA9PiB7XG4vLyAgIC8vIGBvbkNoYW5nZWAgaXMgdXNlZnVsIHRvIHJ1biBzZXJ2ZXItc2lkZSBsb2dpYyBmb3IgYW55IHVzZXIgaW50ZXJhY3Rpb24uXG4vLyAgIC8vIE5vdGUgdGhlIGV4dHJhIGlzQXBwZW5kIGJvb2xlYW4gdGhhdCB3aWxsIGFsbG93IHRvIGRpZmZlcmVuY2lhdGUgc2V0cyBhbmRcbi8vICAgLy8gYXBwZW5kcy5cbi8vICAgIEdhbWUuc2V0KFwibGFzdENoYW5nZUF0XCIsIG5ldyBEYXRlKCkudG9TdHJpbmcoKSlcbi8vIH0pO1xuXG4vLyAvLyBvblN1Ym1pdCBpcyBjYWxsZWQgd2hlbiB0aGUgcGxheWVyIHN1Ym1pdHMgYSBzdGFnZS5cbi8vIEVtcGlyaWNhLm9uU3VibWl0KChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIgLy8gUGxheWVyIHdobyBzdWJtaXR0ZWRcbi8vICkgPT4ge1xuLy8gfSk7XG4iLCJjb25zdCBhbGxTeW1ib2xzID0gW1widDFcIiwgXCJ0MlwiLCBcInQzXCIsIFwidDRcIiwgXCJ0NVwiLCBcInQ2XCIsIFwidDdcIixcInQ4XCIsXCJ0OVwiLFwidDEwXCIsXCJ0MTFcIixcInQxMlwiXTtcblxuLy8gbiA9IG51bWJlciBvZiBwZW9wbGUgLCBwID0gbnVtYmVyIG9mIHN5bWJvbHNcbi8vIChuLTEpKnAgKyAxXG4vLyBpLmUuIG4gPSAzLCBwID0gMyA6IDdcblxuZXhwb3J0IGNvbnN0IHRlc3RUYW5ncmFtcyA9IFtcbiAge1xuICAgIF9pZDogXCIwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAyXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAzXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDNcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIzXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDRcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI0XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA1XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDVcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI1XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA2XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDZcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI2XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA3XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDdcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI3XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA4XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDhcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI4XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA5XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDlcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI5XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMFwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjExXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMlwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxM1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTNcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDE0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxNFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTVcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0M1wiLFxuICB9LFxuXG5dO1xuXG5cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXROZWlnaGJvcnMoc3RydWN0dXJlLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBsZXQgbmV0d29yayA9IHN0cnVjdHVyZS5zcGxpdChcIixcIik7XG4gICAgY29uc3QgcGxheWVySW5kZXggPSBwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpO1xuXG4gICAgbmV0d29yay5mb3JFYWNoKChuKSA9PiB7XG4gICAgICBjb25zdCBjb25uZWN0aW9uID0gbi5zcGxpdChcIi1cIik7XG5cbiAgICAgIGlmIChwbGF5ZXJJbmRleCA9PT0gcGFyc2VJbnQoY29ubmVjdGlvblswXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goY29ubmVjdGlvblsxXS5yZXBsYWNlKC9cXHMvZywgJycpKTtcbiAgICAgIH0gZWxzZSBpZiAocGxheWVySW5kZXggPT09IHBhcnNlSW50KGNvbm5lY3Rpb25bMV0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGNvbm5lY3Rpb25bMF0ucmVwbGFjZSgvXFxzL2csICcnKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIHJldHVybiBbLi4uIG5ldyBTZXQobmVpZ2hib3JzKV07XG4gIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSkge1xuICAgIGNvbnN0IGFjdGl2ZU5vZGVzID0gW107XG4gICAgY29uc3QgYWxsTm9kZXMgPSBbXTtcbiAgICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuXG4gICAgLy8gYWN0aXZlUGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgLy8gICBhY3RpdmVOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgIC8vIH0pXG5cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgLy8gaWYgKHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0dmVcIikpIHtcbiAgICAgIGlmICghcC5nZXQoXCJpbmFjdHZlXCIpKSB7XG5cbiAgICAgICAgYWN0aXZlTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICAgIH1cbiAgICAgIGFsbE5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgfSlcblxuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAvLyBPbmx5IHNob3cgYWN0aXZlIHBlb3BsZVxuICAgICAgLy8gY29uc3QgbmV3TmVpZ2hib3JzID0gYWN0aXZlTm9kZXMuZmlsdGVyKGlkID0+IHBhcnNlSW50KGlkKSAhPT0gcC5nZXQoXCJub2RlSWRcIikpXG4gICAgICAvLyBwLnNldChcIm5laWdoYm9yc1wiLCBuZXdOZWlnaGJvcnMpO1xuXG4gICAgICAvLyBTaG93IGV2ZXJ5b25lLCBtYXJrIG9mZmxpbmUgcGVvcGxlIGFzIG9mZmxpbmVcbiAgICAgIGNvbnN0IG5ld05laWdoYm9ycyA9IGFsbE5vZGVzLmZpbHRlcihpZCA9PiBwYXJzZUludChpZCkgIT09IHAuZ2V0KFwibm9kZUlkXCIpKVxuICAgICAgcC5zZXQoXCJuZWlnaGJvcnNcIiwgbmV3TmVpZ2hib3JzKTtcbiAgICB9KVxufSIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcbmltcG9ydCBcIi4vYm90cy5qc1wiO1xuaW1wb3J0IFwiLi9jYWxsYmFja3MuanNcIjtcblxuaW1wb3J0IHsgdGVzdFN5bWJvbHMsIHRlc3RUYW5ncmFtcyB9IGZyb20gXCIuL2NvbnN0YW50c1wiOyBcbmltcG9ydCB7IGdldE5laWdoYm9ycywgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcblxuLy8gZ2FtZUluaXQgaXMgd2hlcmUgdGhlIHN0cnVjdHVyZSBvZiBhIGdhbWUgaXMgZGVmaW5lZC5cbi8vIEp1c3QgYmVmb3JlIGV2ZXJ5IGdhbWUgc3RhcnRzLCBvbmNlIGFsbCB0aGUgcGxheWVycyBuZWVkZWQgYXJlIHJlYWR5LCB0aGlzXG4vLyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgdHJlYXRtZW50IGFuZCB0aGUgbGlzdCBvZiBwbGF5ZXJzLlxuLy8gWW91IG11c3QgdGhlbiBhZGQgcm91bmRzIGFuZCBzdGFnZXMgdG8gdGhlIGdhbWUsIGRlcGVuZGluZyBvbiB0aGUgdHJlYXRtZW50XG4vLyBhbmQgdGhlIHBsYXllcnMuIFlvdSBjYW4gYWxzbyBnZXQvc2V0IGluaXRpYWwgdmFsdWVzIG9uIHlvdXIgZ2FtZSwgcGxheWVycyxcbi8vIHJvdW5kcyBhbmQgc3RhZ2VzICh3aXRoIGdldC9zZXQgbWV0aG9kcyksIHRoYXQgd2lsbCBiZSBhYmxlIHRvIHVzZSBsYXRlciBpblxuLy8gdGhlIGdhbWUuXG5FbXBpcmljYS5nYW1lSW5pdChnYW1lID0+IHtcbiAgY29uc3Qge1xuICAgIHRyZWF0bWVudDoge1xuICAgICAgcGxheWVyQ291bnQsXG4gICAgICBuZXR3b3JrU3RydWN0dXJlLFxuICAgICAgbnVtVGFza1JvdW5kcyxcbiAgICAgIG51bVN1cnZleVJvdW5kcyxcbiAgICAgIHNldFNpemVCYXNlZE9uUGxheWVyQ291bnQsXG4gICAgICB1c2VySW5hY3Rpdml0eUR1cmF0aW9uLFxuICAgICAgdGFza0R1cmF0aW9uLFxuICAgICAgZGVmYXVsdFNldFNpemUsXG4gICAgICBzdXJ2ZXlEdXJhdGlvbixcbiAgICAgIHJlc3VsdHNEdXJhdGlvbixcbiAgICAgIG1heE51bU92ZXJsYXAsXG4gICAgfSxcbiAgfSA9IGdhbWU7XG5cblxuICBjb25zdCBzeW1ib2xTZXQgPSB0ZXN0VGFuZ3JhbXM7XG4gIGNvbnN0IHNldFNpemUgPSBzZXRTaXplQmFzZWRPblBsYXllckNvdW50ID8gcGxheWVyQ291bnQgKyAxIDogZGVmYXVsdFNldFNpemU7IC8vVE9ETzogY2FuIGNoYW5nZSBkZWZhdWx0IHZhbHVlIGluIHNldHRpbmdzXG4gIGNvbnN0IG51bVJvdW5kc0JlZm9yZVN1cnZleSA9IG51bVRhc2tSb3VuZHMvbnVtU3VydmV5Um91bmRzO1xuXG4gIGxldCBjb2xvcnMgPSBbXCJHcmVlblwiLCBcIlJlZFwiLCBcIlllbGxvd1wiLCBcIkJsdWVcIiwgXCJQdXJwbGVcIiwgXCJXaGl0ZVwiLCBcIkJsYWNrXCJdXG4gIGxldCBzdXJ2ZXlOdW0gPSAxXG4gIGNvbG9ycyA9IHNodWZmbGUoY29sb3JzKTtcblxuICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyLCBpKSA9PiB7XG4gICAgcGxheWVyLnNldChcImF2YXRhclwiLCBgL2F2YXRhcnMvamRlbnRpY29uLyR7cGxheWVyLl9pZH1gKTtcbiAgICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMCk7XG5cbiAgICAvLyBHaXZlIGVhY2ggcGxheWVyIGEgbm9kZUlkIGJhc2VkIG9uIHRoZWlyIHBvc2l0aW9uIChpbmRleGVkIGF0IDEpXG4gICAgcGxheWVyLnNldChcIm5vZGVJZFwiLCBpICsgMSk7XG4gICAgcGxheWVyLnNldChcIm5hbWVcIiwgcGxheWVyLmlkKTtcbiAgICBwbGF5ZXIuc2V0KFwiYW5vbnltb3VzTmFtZVwiLCBjb2xvcnNbaV0pXG4gIH0pO1xuXG4gIGlmIChnYW1lLnBsYXllcnMubGVuZ3RoIDwgZ2FtZS50cmVhdG1lbnQucGxheWVyQ291bnQpIHsgLy8gaWYgbm90IGEgZnVsbCBnYW1lLCBkZWZhdWx0IHRvIGZ1bGx5IGNvbm5lY3RlZCBsYXllclxuICAgIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSk7XG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHAuZ2V0KFwibmVpZ2hib3JzXCIpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgcC5zZXQoXCJuZWlnaGJvcnNcIiwgZ2V0TmVpZ2hib3JzKG5ldHdvcmtTdHJ1Y3R1cmUsIHApKTtcbiAgICAgIGNvbnNvbGUubG9nKHAuZ2V0KFwibmVpZ2hib3JzXCIpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEZvciBlYWNoIHJvdW5kLCBhZGQgYWxsIHRoZSBzeW1ib2xzLCByYW5kb21seSBzZWxlY3QgYSBjb3JyZWN0IGFuc3dlciBhbmRcbiAgLy8gQ29uc3RyYWludHM6IE11c3QgZW5zdXJlIHRoYXQgZXZlcnlvbmUgaGFzIG9ubHkgb25lIHN5bWJvbCBpbiBjb21tb25cbiAgXy50aW1lcyggbnVtVGFza1JvdW5kcywgaSA9PiB7XG4gICAgY29uc3Qgcm91bmQgPSBnYW1lLmFkZFJvdW5kKCk7XG5cbiAgICBjb25zdCB7c3ltYm9scywgdGFza05hbWUsIGFuc3dlcn0gPSBzeW1ib2xTZXRbaV07XG5cbiAgICBjb25zdCB0YXNrU3RhZ2UgPSByb3VuZC5hZGRTdGFnZSh7XG4gICAgICBuYW1lOiBcIlRhc2tcIixcbiAgICAgIGRpc3BsYXlOYW1lOiB0YXNrTmFtZSxcbiAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgZHVyYXRpb25JblNlY29uZHM6IHRhc2tEdXJhdGlvblxuICAgIH0pO1xuICAgIHRhc2tTdGFnZS5zZXQoXCJ0YXNrXCIsIHN5bWJvbFNldFtpXSk7XG4gICAgZ2V0U3ltYm9sc0ZvclBsYXllcnMoc3ltYm9scywgYW5zd2VyLCBzZXRTaXplLCB0YXNrTmFtZSwgZ2FtZSwgbWF4TnVtT3ZlcmxhcClcbiAgICB0YXNrU3RhZ2Uuc2V0KFwiYW5zd2VyXCIsIHN5bWJvbFNldFtpXS5hbnN3ZXIpXG5cbiAgICBjb25zdCByZXN1bHRTdGFnZSA9IHJvdW5kLmFkZFN0YWdlKHtcbiAgICAgIG5hbWU6IFwiUmVzdWx0XCIsXG4gICAgICBkaXNwbGF5TmFtZTogXCJSZXN1bHRcIixcbiAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiByZXN1bHRzRHVyYXRpb25cbiAgICB9KTtcbiAgICBcbiAgICBpZiAoKGkrMSkgJSBudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkgPT09IDApIHsgLy8gQWZ0ZXIgNSB0YXNrIHJvdW5kcywgYWRkIGEgc3VydmV5IHJvdW5kXG4gICAgICBjb25zdCBzdXJ2ZXlSb3VuZCA9IGdhbWUuYWRkUm91bmQoKTtcblxuICAgICAgY29uc3Qgc3VydmV5U3RhZ2VzID0gc3VydmV5Um91bmQuYWRkU3RhZ2Uoe1xuICAgICAgICBuYW1lOiBcIlN1cnZleVwiLFxuICAgICAgICBkaXNwbGF5TmFtZTogXCJTdXJ2ZXkgXCIgKyBzdXJ2ZXlOdW0sXG4gICAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiBzdXJ2ZXlEdXJhdGlvblxuICAgICAgfSlcbiAgICAgIFxuICAgICAgc3VydmV5TnVtKys7XG4gICAgfVxuXG4gIH0pO1xuXG5cblxuICBmdW5jdGlvbiBnZXRTeW1ib2xzRm9yUGxheWVycyhzeW1ib2xTZXQsIGFuc3dlciwgc2V0U2l6ZSwgdGFza05hbWUsIGdhbWUsIG1heE51bU92ZXJsYXApIHtcbiAgICAgIGxldCBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHN5bWJvbFNldC5maWx0ZXIoc3ltYm9sID0+IHN5bWJvbCAhPT0gYW5zd2VyKTtcbiAgICAgIHN5bWJvbHNXaXRob3V0QW5zd2VyID0gc2h1ZmZsZShzeW1ib2xzV2l0aG91dEFuc3dlcik7XG4gICAgICBsZXQgbnVtUGxheWVycyA9IGdhbWUucGxheWVycy5sZW5ndGg7XG4gICAgICBsZXQgbnVtT3ZlcmxhcCA9IDA7XG5cblxuICAgICAgLy8gQ3JlYXRlIGEgZGljdGlvbmFyeSB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IHRpbWVzIHN5bWJvbCBoYXMgYmVlbiB1c2VkXG4gICAgICBsZXQgc3ltYm9sRnJlcSA9IHt9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN5bWJvbHNXaXRob3V0QW5zd2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBzeW1ib2wgPSBzeW1ib2xzV2l0aG91dEFuc3dlcltpXVxuICAgICAgICBpZiAoIXN5bWJvbEZyZXEuaGFzT3duUHJvcGVydHkoc3ltYm9sKSkge1xuICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSA9IG51bVBsYXllcnMgLSAxOyAvLyBUb3RhbCB0aW1lIGEgc3ltYm9sIGNhbiBiZSB1c2VkIFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgICAgbGV0IHN5bWJvbHNQaWNrZWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzeW1ib2xzV2l0aG91dEFuc3dlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBzeW1ib2wgPSBzeW1ib2xzV2l0aG91dEFuc3dlcltpXVxuICAgICAgICAgIGlmIChzeW1ib2xzUGlja2VkLmxlbmd0aCA8IHNldFNpemUgLSAxKSB7IC8vIEFkZCBzeW1ib2xzIHVudGlsIHNldFNpemUgLSAxIGZvciBhbnN3ZXJcbiAgICAgICAgICAgIGlmIChzeW1ib2xGcmVxW3N5bWJvbF0gLSAxID09PSAwKSB7IC8vIFRoaXMgc3ltYm9sIHdpbGwgb3ZlcmxhcFxuICAgICAgICAgICAgICAgIGlmIChudW1PdmVybGFwIDwgbWF4TnVtT3ZlcmxhcCApIHsgLy8gT25seSBhZGQgaWYgbGVzcyB0aGFuIG1heCBvdmVybGFwXG4gICAgICAgICAgICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goc3ltYm9sKTtcbiAgICAgICAgICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSAtPSAxO1xuICAgICAgICAgICAgICAgICAgbnVtT3ZlcmxhcCArPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goYW5zd2VyKTsgLy8gQWRkIHRoZSBhbnN3ZXJcbiAgICAgICAgZm9yICh2YXIgc3ltYm9sVG9SZW1vdmUgb2Ygc3ltYm9sc1BpY2tlZCkge1xuICAgICAgICAgIGlmIChzeW1ib2xGcmVxW3N5bWJvbFRvUmVtb3ZlXSA9PT0gMCkgeyAvLyBJZiBzeW1ib2wgaGFzIGJlZW4gcGlja2VkIG4tMSBwbGF5ZXJzIHRpbWVzLCByZW1vdmUgaXQgZnJvbSB0aGUgc2V0XG4gICAgICAgICAgICBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHN5bWJvbHNXaXRob3V0QW5zd2VyLmZpbHRlcihzeW1ib2wgPT4gc3ltYm9sICE9PSBzeW1ib2xUb1JlbW92ZSk7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzeW1ib2xzUGlja2VkID0gc2h1ZmZsZShzeW1ib2xzUGlja2VkKTtcblxuICAgICAgICBwbGF5ZXIuc2V0KHRhc2tOYW1lLCBzeW1ib2xzUGlja2VkKTtcbiAgICAgIH0pXG5cblxuICB9XG5cbiAgLy8gU2h1ZmZsaW5nIGFycmF5czpcbiAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTA1MzYwNDQvc3dhcHBpbmctYWxsLWVsZW1lbnRzLW9mLWFuLWFycmF5LWV4Y2VwdC1mb3ItZmlyc3QtYW5kLWxhc3RcbiAgZnVuY3Rpb24gc2h1ZmZsZShzeW1ib2xTZXQpIHtcbiAgICBmb3IgKGkgPSBzeW1ib2xTZXQubGVuZ3RoIC0xIDsgaSA+IDA7IGktLSkge1xuICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuXG4gICAgICBbc3ltYm9sU2V0W2ldLCBzeW1ib2xTZXRbal1dID0gW3N5bWJvbFNldFtqXSwgc3ltYm9sU2V0W2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHN5bWJvbFNldDtcbiAgfVxuXG59KTtcbiJdfQ==
