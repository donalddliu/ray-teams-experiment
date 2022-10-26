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
  let colors = ["Green", "Red", "Yellow", "Blue", "Purple", "White", "Black"];
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm1vbWVudCIsIlRpbWVTeW5jIiwib25HYW1lU3RhcnQiLCJjb25zb2xlIiwibG9nIiwicGxheWVycyIsImZvckVhY2giLCJwbGF5ZXIiLCJzZXQiLCJEYXRlIiwibm93IiwibmV0d29yayIsImdldCIsImFjdGl2ZUNoYXRzIiwibWFwIiwib3RoZXJOb2RlSWQiLCJwYWlyT2ZQbGF5ZXJzIiwicGFyc2VJbnQiLCJzb3J0IiwicDEiLCJwMiIsIm90aGVyUGxheWVyIiwiZmluZCIsInAiLCJjaGF0S2V5IiwicHVzaCIsImxlbmd0aCIsInRyZWF0bWVudCIsIm1heEdhbWVUaW1lIiwiYWRkIiwib25Sb3VuZFN0YXJ0IiwiYWN0aXZlUGxheWVycyIsImZpbHRlciIsImVuZEdhbWVJZlBsYXllcklkbGUiLCJleGl0IiwibWluUGxheWVyQ291bnQiLCJvblN0YWdlU3RhcnQiLCJuYW1lIiwiZGlzcGxheU5hbWUiLCJvblN0YWdlRW5kIiwib25Sb3VuZEVuZCIsIm9uR2FtZUVuZCIsImNvbXB1dGVTY29yZSIsInN1Y2Nlc3MiLCJwbGF5ZXJBbnN3ZXJzIiwiYWxsQW5zd2Vyc0VxdWFsIiwiYXJyIiwiZXZlcnkiLCJzdWJtaXNzaW9uIiwicHJldlNjb3JlIiwiZXhwb3J0IiwidGVzdFRhbmdyYW1zIiwiYWxsU3ltYm9scyIsIl9pZCIsInRhc2tOYW1lIiwic3ltYm9scyIsImFuc3dlciIsImdldE5laWdoYm9ycyIsInN0cnVjdHVyZSIsIm5laWdoYm9ycyIsInNwbGl0IiwicGxheWVySW5kZXgiLCJuIiwiY29ubmVjdGlvbiIsInJlcGxhY2UiLCJTZXQiLCJhY3RpdmVOb2RlcyIsImFsbE5vZGVzIiwibmV3TmVpZ2hib3JzIiwiaWQiLCJfIiwidGVzdFN5bWJvbHMiLCJnYW1lSW5pdCIsInBsYXllckNvdW50IiwibmV0d29ya1N0cnVjdHVyZSIsIm51bVRhc2tSb3VuZHMiLCJudW1TdXJ2ZXlSb3VuZHMiLCJzZXRTaXplQmFzZWRPblBsYXllckNvdW50IiwidXNlckluYWN0aXZpdHlEdXJhdGlvbiIsInRhc2tEdXJhdGlvbiIsImRlZmF1bHRTZXRTaXplIiwic3VydmV5RHVyYXRpb24iLCJyZXN1bHRzRHVyYXRpb24iLCJtYXhOdW1PdmVybGFwIiwic3ltYm9sU2V0Iiwic2V0U2l6ZSIsIm51bVJvdW5kc0JlZm9yZVN1cnZleSIsImNvbG9ycyIsInN1cnZleU51bSIsInNodWZmbGUiLCJpIiwidGltZXMiLCJhZGRSb3VuZCIsInRhc2tTdGFnZSIsImFkZFN0YWdlIiwiZHVyYXRpb25JblNlY29uZHMiLCJnZXRTeW1ib2xzRm9yUGxheWVycyIsInJlc3VsdFN0YWdlIiwic3VydmV5Um91bmQiLCJzdXJ2ZXlTdGFnZXMiLCJzeW1ib2xzV2l0aG91dEFuc3dlciIsInN5bWJvbCIsIm51bVBsYXllcnMiLCJudW1PdmVybGFwIiwic3ltYm9sRnJlcSIsImhhc093blByb3BlcnR5Iiwic3ltYm9sc1BpY2tlZCIsInN5bWJvbFRvUmVtb3ZlIiwiaiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxRQUFKO0FBQWFDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNKLFlBQVEsR0FBQ0ksQ0FB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LFNBQVMsQ0FBQ3dCLENBQUQsQ0FBeEIsSUFBK0IsQ0FBQ3hCLFNBQVMsQ0FBQ3dCLENBQUQsQ0FBVixFQUFleEIsU0FBUyxDQUFDTSxDQUFELENBQXhCLENBQS9CO0FBQ0Q7O0FBQ0QsV0FBT04sU0FBUDtBQUNEO0FBRUYsQ0FuSkQsRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuXG4vLyBUaGlzIGlzIHdoZXJlIHlvdSBhZGQgYm90cywgbGlrZSBCb2I6XG5cbkVtcGlyaWNhLmJvdChcImJvYlwiLCB7XG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaCBzdGFnZSAoYWZ0ZXIgb25Sb3VuZFN0YXJ0L29uU3RhZ2VTdGFydClcbiAgLy8gb25TdGFnZVN0YXJ0KGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzKSB7fSxcblxuICAvLyBDYWxsZWQgZHVyaW5nIGVhY2ggc3RhZ2UgYXQgdGljayBpbnRlcnZhbCAofjFzIGF0IHRoZSBtb21lbnQpXG4gIG9uU3RhZ2VUaWNrKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBzZWNvbmRzUmVtYWluaW5nKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQSBwbGF5ZXIgaGFzIGNoYW5nZWQgYSB2YWx1ZVxuICAvLyAvLyBUaGlzIG1pZ2h0IGhhcHBlbiBhIGxvdCFcbiAgLy8gb25TdGFnZVBsYXllckNoYW5nZShib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycywgcGxheWVyKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBlbmQgb2YgdGhlIHN0YWdlIChhZnRlciBpdCBmaW5pc2hlZCwgYmVmb3JlIG9uU3RhZ2VFbmQvb25Sb3VuZEVuZCBpcyBjYWxsZWQpXG4gIC8vIG9uU3RhZ2VFbmQoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMpIHt9XG59KTtcbiIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcblxuaW1wb3J0IHsgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0IHsgVGltZVN5bmMgfSBmcm9tIFwibWV0ZW9yL21penphbzp0aW1lc3luY1wiO1xuXG5cblxuLy8gb25HYW1lU3RhcnQgaXMgdHJpZ2dlcmVkIG9wbmNlIHBlciBnYW1lIGJlZm9yZSB0aGUgZ2FtZSBzdGFydHMsIGFuZCBiZWZvcmVcbi8vIHRoZSBmaXJzdCBvblJvdW5kU3RhcnQuIEl0IHJlY2VpdmVzIHRoZSBnYW1lIGFuZCBsaXN0IG9mIGFsbCB0aGUgcGxheWVycyBpblxuLy8gdGhlIGdhbWUuXG5FbXBpcmljYS5vbkdhbWVTdGFydChnYW1lID0+IHtcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0ZWRcIik7XG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwiaW5hY3RpdmVcIiwgZmFsc2UpO1xuICAgIHBsYXllci5zZXQoXCJpbmFjdGl2ZVdhcm5pbmdVc2VkXCIsIGZhbHNlKTtcbiAgICBwbGF5ZXIuc2V0KFwibGFzdEFjdGl2ZVwiLCBtb21lbnQoRGF0ZS5ub3coKSkpO1xuICAgIGNvbnN0IG5ldHdvcmsgPSBwbGF5ZXIuZ2V0KFwibmVpZ2hib3JzXCIpO1xuICAgIGNvbnN0IGFjdGl2ZUNoYXRzID0gW107XG4gICAgbmV0d29yay5tYXAob3RoZXJOb2RlSWQgPT4ge1xuICAgICAgdmFyIHBhaXJPZlBsYXllcnMgPSBbcGxheWVyLmdldChcIm5vZGVJZFwiKSwgcGFyc2VJbnQob3RoZXJOb2RlSWQpXTtcbiAgICAgIHBhaXJPZlBsYXllcnMuc29ydCgocDEscDIpID0+IHAxIC0gcDIpO1xuICAgICAgY29uc3Qgb3RoZXJQbGF5ZXIgPSBnYW1lLnBsYXllcnMuZmluZChwID0+IHAuZ2V0KFwibm9kZUlkXCIpID09PSBwYXJzZUludChvdGhlck5vZGVJZCkpO1xuICAgICAgLy8gY29uc3Qgb3RoZXJQbGF5ZXJJZCA9IG90aGVyUGxheWVyLmlkO1xuICAgICAgY29uc3QgY2hhdEtleSA9IGAke3BhaXJPZlBsYXllcnNbMF19LSR7cGFpck9mUGxheWVyc1sxXX1gO1xuICAgICAgYWN0aXZlQ2hhdHMucHVzaChjaGF0S2V5KTtcbiAgICB9KTtcbiAgICAvLyBEZWZhdWx0IGFsbCBjaGF0cyB0byBiZSBvcGVuIHdoZW4gZ2FtZSBzdGFydHNcbiAgICBwbGF5ZXIuc2V0KFwiYWN0aXZlQ2hhdHNcIiwgYWN0aXZlQ2hhdHMpO1xuICB9KTtcbiAgZ2FtZS5zZXQoXCJwcmV2aW91c051bUFjdGl2ZVBsYXllcnNcIiwgZ2FtZS5wbGF5ZXJzLmxlbmd0aCk7XG4gIGdhbWUuc2V0KFwiZ2FtZVN0YXJ0VGltZVwiLCBtb21lbnQoRGF0ZS5ub3coKSkpO1xuICBpZiAoZ2FtZS50cmVhdG1lbnQubWF4R2FtZVRpbWUpIHtcbiAgICBnYW1lLnNldChcIm1heEdhbWVFbmRUaW1lXCIsIG1vbWVudChEYXRlLm5vdygpKS5hZGQoZ2FtZS50cmVhdG1lbnQubWF4R2FtZVRpbWUsICdtJykpXG4gIH1cbn0pO1xuXG4vLyBvblJvdW5kU3RhcnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSBlYWNoIHJvdW5kIHN0YXJ0cywgYW5kIGJlZm9yZSBvblN0YWdlU3RhcnQuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZVN0YXJ0LCBhbmQgdGhlIHJvdW5kIHRoYXQgaXMgc3RhcnRpbmcuXG5FbXBpcmljYS5vblJvdW5kU3RhcnQoKGdhbWUsIHJvdW5kKSA9PiB7XG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwic3VibWl0dGVkXCIsIGZhbHNlKTtcbiAgICBwbGF5ZXIuc2V0KFwic3ltYm9sU2VsZWN0ZWRcIiwgXCJcIik7XG4gIH0pO1xuICByb3VuZC5zZXQoXCJyZXN1bHRcIiwgZmFsc2UpO1xuICByb3VuZC5zZXQoXCJudW1QbGF5ZXJzU3VibWl0dGVkXCIsIDApO1xuICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cbiAgaWYgKGFjdGl2ZVBsYXllcnMubGVuZ3RoIDwgZ2FtZS5nZXQoXCJwcmV2aW91c051bUFjdGl2ZVBsYXllcnNcIikgKSB7IC8vIFNvbWVvbmUgbGVmdCBpbiB0aGUgbWlkZGxlIG9mIHRoZSByb3VuZFxuICAgIGlmIChnYW1lLnRyZWF0bWVudC5lbmRHYW1lSWZQbGF5ZXJJZGxlKSB7XG4gICAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgLy8gcC5leGl0KFwic29tZW9uZUluYWN0aXZlXCIpO1xuICAgICAgICBwLmV4aXQoXCJtaW5QbGF5ZXJDb3VudE5vdE1haW50YWluZWRcIik7XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpOyAvLyBVcGRhdGVzIHRoZSBuZWlnaGJvcnMgdG8gYmUgZnVsbHkgY29ubmVjdGVkXG4gICAgICBnYW1lLnNldChcImNoZWNrRm9yU2ltaWxhclN5bWJvbFwiLCB0cnVlKTtcbiAgICB9XG4gIFxuICB9XG4gIGdhbWUuc2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIsIGFjdGl2ZVBsYXllcnMubGVuZ3RoKTtcblxuICBpZiAoZ2FtZS50cmVhdG1lbnQubWluUGxheWVyQ291bnQgJiYgYWN0aXZlUGxheWVycy5sZW5ndGggPCBnYW1lLnRyZWF0bWVudC5taW5QbGF5ZXJDb3VudCkge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgcC5leGl0KFwibWluUGxheWVyQ291bnROb3RNYWludGFpbmVkXCIpO1xuICAgIH0pXG4gIH1cblxuICBjb25zb2xlLmxvZyhcIlJvdW5kIFN0YXJ0ZWRcIik7XG5cbn0pO1xuXG4vLyBvblN0YWdlU3RhcnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSBlYWNoIHN0YWdlIHN0YXJ0cy5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25Sb3VuZFN0YXJ0LCBhbmQgdGhlIHN0YWdlIHRoYXQgaXMgc3RhcnRpbmcuXG5FbXBpcmljYS5vblN0YWdlU3RhcnQoKGdhbWUsIHJvdW5kLCBzdGFnZSkgPT4ge1xuICBjb25zb2xlLmxvZyhcIlN0YWdlIFN0YXJ0ZWRcIilcbiAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG4gIGlmIChzdGFnZS5uYW1lID09PSBcIlRhc2tcIikge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyggYFN5bWJvbHMgOiAke3BsYXllci5nZXQoYCR7c3RhZ2UuZGlzcGxheU5hbWV9YCl9YCk7XG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coYEFuc3dlcjogJHtzdGFnZS5nZXQoXCJhbnN3ZXJcIil9YCk7XG4gIH1cbiAgaWYgKHN0YWdlLm5hbWUgPT09IFwiU3VydmV5XCIpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgcGxheWVyLnNldChcInN1cnZleU51bWJlclwiICwgMSlcbiAgICB9KTtcbiAgfVxuICAvLyBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgcGxheWVyLnNldChcInN1Ym1pdHRlZFwiLCBmYWxzZSk7XG4gIC8vIH0pO1xuICAvLyBzdGFnZS5zZXQoXCJzaG93UmVzdWx0c1wiLCBmYWxzZSk7XG4gIC8vIHN0YWdlLnNldChcInJlc3VsdHNTaG93blwiLCBmYWxzZSk7XG5cbn0pO1xuXG4vLyBvblN0YWdlRW5kIGlzIHRyaWdnZXJlZCBhZnRlciBlYWNoIHN0YWdlLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvblJvdW5kRW5kLCBhbmQgdGhlIHN0YWdlIHRoYXQganVzdCBlbmRlZC5cbkVtcGlyaWNhLm9uU3RhZ2VFbmQoKGdhbWUsIHJvdW5kLCBzdGFnZSkgPT57XG4gIGNvbnNvbGUubG9nKFwiU3RhZ2UgRW5kZWRcIilcbiAgXG59KTtcblxuLy8gb25Sb3VuZEVuZCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgZWFjaCByb3VuZC5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lRW5kLCBhbmQgdGhlIHJvdW5kIHRoYXQganVzdCBlbmRlZC5cbkVtcGlyaWNhLm9uUm91bmRFbmQoKGdhbWUsIHJvdW5kKSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiUm91bmQgRW5kZWRcIilcbiAgLy8gZ2FtZS5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgLy8gICBjb25zdCB2YWx1ZSA9IHBsYXllci5yb3VuZC5nZXQoXCJ2YWx1ZVwiKSB8fCAwO1xuICAvLyAgIGNvbnN0IHByZXZTY29yZSA9IHBsYXllci5nZXQoXCJzY29yZVwiKSB8fCAwO1xuICAvLyAgIHBsYXllci5zZXQoXCJzY29yZVwiLCBwcmV2U2NvcmUgKyB2YWx1ZSk7XG4gIC8vIH0pO1xuXG59KTtcblxuLy8gb25HYW1lRW5kIGlzIHRyaWdnZXJlZCB3aGVuIHRoZSBnYW1lIGVuZHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZVN0YXJ0LlxuRW1waXJpY2Eub25HYW1lRW5kKGdhbWUgPT4ge30pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID0+IG9uU2V0LCBvbkFwcGVuZCBhbmQgb25DaGFuZ2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gb25TZXQsIG9uQXBwZW5kIGFuZCBvbkNoYW5nZSBhcmUgY2FsbGVkIG9uIGV2ZXJ5IHNpbmdsZSB1cGRhdGUgbWFkZSBieSBhbGxcbi8vIHBsYXllcnMgaW4gZWFjaCBnYW1lLCBzbyB0aGV5IGNhbiByYXBpZGx5IGJlY29tZSBxdWl0ZSBleHBlbnNpdmUgYW5kIGhhdmVcbi8vIHRoZSBwb3RlbnRpYWwgdG8gc2xvdyBkb3duIHRoZSBhcHAuIFVzZSB3aXNlbHkuXG4vL1xuLy8gSXQgaXMgdmVyeSB1c2VmdWwgdG8gYmUgYWJsZSB0byByZWFjdCB0byBlYWNoIHVwZGF0ZSBhIHVzZXIgbWFrZXMuIFRyeVxuLy8gbm9udGhlbGVzcyB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGNvbXB1dGF0aW9ucyBhbmQgZGF0YWJhc2Ugc2F2ZXMgKC5zZXQpXG4vLyBkb25lIGluIHRoZXNlIGNhbGxiYWNrcy4gWW91IGNhbiBhbHNvIHRyeSB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGNhbGxzIHRvXG4vLyBzZXQoKSBhbmQgYXBwZW5kKCkgeW91IG1ha2UgKGF2b2lkIGNhbGxpbmcgdGhlbSBvbiBhIGNvbnRpbnVvdXMgZHJhZyBvZiBhXG4vLyBzbGlkZXIgZm9yIGV4YW1wbGUpIGFuZCBpbnNpZGUgdGhlc2UgY2FsbGJhY2tzIHVzZSB0aGUgYGtleWAgYXJndW1lbnQgYXQgdGhlXG4vLyB2ZXJ5IGJlZ2lubmluZyBvZiB0aGUgY2FsbGJhY2sgdG8gZmlsdGVyIG91dCB3aGljaCBrZXlzIHlvdXIgbmVlZCB0byBydW5cbi8vIGxvZ2ljIGFnYWluc3QuXG4vL1xuLy8gSWYgeW91IGFyZSBub3QgdXNpbmcgdGhlc2UgY2FsbGJhY2tzLCBjb21tZW50IHRoZW0gb3V0IHNvIHRoZSBzeXN0ZW0gZG9lc1xuLy8gbm90IGNhbGwgdGhlbSBmb3Igbm90aGluZy5cblxuLy8gLy8gb25TZXQgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSAuc2V0KCkgbWV0aG9kXG4vLyAvLyBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvciBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vblNldCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4vLyApID0+IHtcbi8vICAgLy8gLy8gRXhhbXBsZSBmaWx0ZXJpbmdcbi8vICAgLy8gaWYgKGtleSAhPT0gXCJ2YWx1ZVwiKSB7XG4vLyAgIC8vICAgcmV0dXJuO1xuLy8gICAvLyB9XG4vLyB9KTtcblxuLy8gRW1waXJpY2Eub25TZXQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gKSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKFwia2V5XCIsIGtleSk7XG4vLyAgIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuLy8gICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuLy8gICAvLyBTb21lIHBsYXllciBkZWNpZGVzIHRvIHJlY29uc2lkZXIgdGhlaXIgYW5zd2VyXG4vLyAgIGlmIChrZXkgPT09IFwic3VibWl0dGVkXCIpIHsgXG4vLyAgICAgLy8gQ2hlY2tzIGlmIGV2ZXJ5b25lIGhhcyBzdWJtaXR0ZWQgdGhlaXIgYW5zd2VyIGFuZCBpZiBzbywgc3VibWl0IHRoZSBzdGFnZVxuLy8gICAgIGxldCBhbGxTdWJtaXR0ZWQgPSB0cnVlO1xuLy8gICAgIGxldCBudW1QbGF5ZXJzU3VibWl0dGVkID0gMDtcbi8vICAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuLy8gICAgICAgaWYgKHBsYXllci5nZXQoXCJzdWJtaXR0ZWRcIikpIHtcbi8vICAgICAgICAgbnVtUGxheWVyc1N1Ym1pdHRlZCArPSAxO1xuLy8gICAgICAgfVxuLy8gICAgICAgYWxsU3VibWl0dGVkID0gcGxheWVyLmdldChcInN1Ym1pdHRlZFwiKSAmJiBhbGxTdWJtaXR0ZWQ7XG4vLyAgICAgfSlcbi8vICAgICByb3VuZC5zZXQoXCJudW1QbGF5ZXJzU3VibWl0dGVkXCIsIG51bVBsYXllcnNTdWJtaXR0ZWQpO1xuLy8gICAgIGlmIChhbGxTdWJtaXR0ZWQpIHtcbi8vICAgICAgIGlmIChzdGFnZS5uYW1lID09PSBcIlRhc2tcIikge1xuLy8gICAgICAgICBjb21wdXRlU2NvcmUoYWN0aXZlUGxheWVycywgZ2FtZSwgc3RhZ2UsIHJvdW5kKTtcbi8vICAgICAgIH1cbi8vICAgICAgIC8vIE5lZWQgdG8gc3VibWl0IGZvciBzdWJtaXQgdGhlIHN0YWdlIGZvciBldmVyeSBwbGF5ZXJcbi8vICAgICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbi8vICAgICAgICAgcGxheWVyLnN0YWdlLnN1Ym1pdCgpO1xuLy8gICAgICAgfSlcbi8vICAgICB9XG4vLyAgIC8vICAgaWYgKHN0YWdlLmdldChcInJlc3VsdHNTaG93blwiKSkge1xuLy8gICAvLyAgICAgcGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbi8vICAgLy8gICAgICAgcGxheWVyLnN0YWdlLnN1Ym1pdCgpO1xuLy8gICAvLyAgICAgfSlcbi8vICAgLy8gICB9XG4vLyAgIC8vIH1cblxuLy8gICAvLyBpZiAodGFyZ2V0VHlwZSA9PT0gXCJzdGFnZVwiICYmIGtleSA9PT0gXCJyZXN1bHRzU2hvd25cIikge1xuLy8gICAvLyAgIGlmIChzdGFnZS5nZXQoXCJyZXN1bHRzU2hvd25cIikpIHtcbi8vICAgLy8gICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4vLyAgIC8vICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbi8vICAgLy8gICAgIH0pXG4vLyAgIC8vICAgfVxuLy8gICB9XG5cbi8vICAgLy8gZWxzZSBpZiAoa2V5ID09PSBcImluYWN0aXZlXCIpIHtcbi8vICAgICAvLyBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpO1xuLy8gICAvLyB9XG5cbi8vICAgcmV0dXJuO1xuXG4vLyB9KTtcblxuZnVuY3Rpb24gY29tcHV0ZVNjb3JlKGFjdGl2ZVBsYXllcnMsIGdhbWUsIHN0YWdlLCByb3VuZCkge1xuICBsZXQgc3VjY2VzcyA9IHRydWU7XG4gIGNvbnNvbGUubG9nKFwiQ09SUkVDVCBBTlNXRVI6XCIpXG4gIGNvbnNvbGUubG9nKHN0YWdlLmdldChcImFuc3dlclwiKSk7XG4gIGNvbnNvbGUubG9nKFwiUGxheWVycyBndWVzc2VkOlwiKVxuXG4gIGxldCBwbGF5ZXJBbnN3ZXJzID0gW107XG4gIGNvbnN0IGFsbEFuc3dlcnNFcXVhbCA9IGFyciA9PiBhcnIuZXZlcnkoIHYgPT4gdiA9PT0gYXJyWzBdICkgLy9GdW5jIHRvIGNoZWNrIGlmIGFsbCBwbGF5ZXIgYW5zd2VycyBhcmUgZXF1YWxcblxuICBhY3RpdmVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICBjb25zdCBzdWJtaXNzaW9uID0gcGxheWVyLmdldChcInN5bWJvbFNlbGVjdGVkXCIpO1xuICAgIGNvbnNvbGUubG9nKHN1Ym1pc3Npb24pO1xuICAgIGlmIChnYW1lLmdldChcImNoZWNrRm9yU2ltaWxhclN5bWJvbFwiKSkge1xuICAgICAgcGxheWVyQW5zd2Vycy5wdXNoKHN1Ym1pc3Npb24pO1xuICAgIH1cbiAgICBpZiAoc3VibWlzc2lvbiAhPT0gc3RhZ2UuZ2V0KFwiYW5zd2VyXCIpKSB7XG4gICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgfVxuICB9KVxuXG4gIGlmIChnYW1lLmdldChcImNoZWNrRm9yU2ltaWxhclN5bWJvbFwiKSkge1xuICAgIGlmIChhbGxBbnN3ZXJzRXF1YWwocGxheWVyQW5zd2VycykpIHtcbiAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJvdW5kLnNldChcInJlc3VsdFwiLCBzdWNjZXNzKTtcbiAgaWYgKHN1Y2Nlc3MpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgIGNvbnN0IHByZXZTY29yZSA9IHBsYXllci5nZXQoXCJzY29yZVwiKSB8fCAwO1xuICAgICAgcGxheWVyLnNldChcInNjb3JlXCIsIHByZXZTY29yZSArIDEpO1xuICAgIH0pXG4gICAgY29uc29sZS5sb2coXCIgQWxsIHBsYXllcnMgZ290IGl0IGNvcnJlY3RseVwiKTtcbiAgfSBcbn1cblxuLy8gLy8gb25BcHBlbmQgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSBgLmFwcGVuZCgpYCBtZXRob2Rcbi8vIC8vIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uQXBwZW5kKChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbi8vICkgPT4ge1xuLy8gICAvLyBOb3RlOiBgdmFsdWVgIGlzIHRoZSBzaW5nbGUgbGFzdCB2YWx1ZSAoZS5nIDAuMiksIHdoaWxlIGBwcmV2VmFsdWVgIHdpbGxcbi8vICAgLy8gICAgICAgYmUgYW4gYXJyYXkgb2YgdGhlIHByZXZpc291cyB2YWx1ZWQgKGUuZy4gWzAuMywgMC40LCAwLjY1XSkuXG4vLyB9KTtcblxuXG4vLyAvLyBvbkNoYW5nZSBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIGAuc2V0KClgIG9yIHRoZVxuLy8gLy8gYC5hcHBlbmQoKWAgbWV0aG9kIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yXG4vLyAvLyBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vbkNoYW5nZSgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlLCAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gICBpc0FwcGVuZCAvLyBUcnVlIGlmIHRoZSBjaGFuZ2Ugd2FzIGFuIGFwcGVuZCwgZmFsc2UgaWYgaXQgd2FzIGEgc2V0XG4vLyApID0+IHtcbi8vICAgLy8gYG9uQ2hhbmdlYCBpcyB1c2VmdWwgdG8gcnVuIHNlcnZlci1zaWRlIGxvZ2ljIGZvciBhbnkgdXNlciBpbnRlcmFjdGlvbi5cbi8vICAgLy8gTm90ZSB0aGUgZXh0cmEgaXNBcHBlbmQgYm9vbGVhbiB0aGF0IHdpbGwgYWxsb3cgdG8gZGlmZmVyZW5jaWF0ZSBzZXRzIGFuZFxuLy8gICAvLyBhcHBlbmRzLlxuLy8gICAgR2FtZS5zZXQoXCJsYXN0Q2hhbmdlQXRcIiwgbmV3IERhdGUoKS50b1N0cmluZygpKVxuLy8gfSk7XG5cbi8vIC8vIG9uU3VibWl0IGlzIGNhbGxlZCB3aGVuIHRoZSBwbGF5ZXIgc3VibWl0cyBhIHN0YWdlLlxuLy8gRW1waXJpY2Eub25TdWJtaXQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciAvLyBQbGF5ZXIgd2hvIHN1Ym1pdHRlZFxuLy8gKSA9PiB7XG4vLyB9KTtcbiIsImNvbnN0IGFsbFN5bWJvbHMgPSBbXCJ0MVwiLCBcInQyXCIsIFwidDNcIiwgXCJ0NFwiLCBcInQ1XCIsIFwidDZcIiwgXCJ0N1wiLFwidDhcIixcInQ5XCIsXCJ0MTBcIixcInQxMVwiLFwidDEyXCJdO1xuXG4vLyBuID0gbnVtYmVyIG9mIHBlb3BsZSAsIHAgPSBudW1iZXIgb2Ygc3ltYm9sc1xuLy8gKG4tMSkqcCArIDFcbi8vIGkuZS4gbiA9IDMsIHAgPSAzIDogN1xuXG5leHBvcnQgY29uc3QgdGVzdFRhbmdyYW1zID0gW1xuICB7XG4gICAgX2lkOiBcIjBcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDFcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjFcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDJcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjJcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDNcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0M1wiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjNcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDRcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0NFwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjRcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDVcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0NVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjVcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDZcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0NlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjZcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDdcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0N1wiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjdcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDhcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0OFwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjhcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDlcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0OVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjlcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDEwXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDEwXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTBcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDExXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDExXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTFcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDEyXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDEyXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTJcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDEzXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxM1wiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTRcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjE0XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxNVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQzXCIsXG4gIH0sXG5cbl07XG5cblxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldE5laWdoYm9ycyhzdHJ1Y3R1cmUsIHBsYXllcikge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGxldCBuZXR3b3JrID0gc3RydWN0dXJlLnNwbGl0KFwiLFwiKTtcbiAgICBjb25zdCBwbGF5ZXJJbmRleCA9IHBsYXllci5nZXQoXCJub2RlSWRcIik7XG5cbiAgICBuZXR3b3JrLmZvckVhY2goKG4pID0+IHtcbiAgICAgIGNvbnN0IGNvbm5lY3Rpb24gPSBuLnNwbGl0KFwiLVwiKTtcblxuICAgICAgaWYgKHBsYXllckluZGV4ID09PSBwYXJzZUludChjb25uZWN0aW9uWzBdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChjb25uZWN0aW9uWzFdLnJlcGxhY2UoL1xccy9nLCAnJykpO1xuICAgICAgfSBlbHNlIGlmIChwbGF5ZXJJbmRleCA9PT0gcGFyc2VJbnQoY29ubmVjdGlvblsxXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goY29ubmVjdGlvblswXS5yZXBsYWNlKC9cXHMvZywgJycpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgXG4gICAgcmV0dXJuIFsuLi4gbmV3IFNldChuZWlnaGJvcnMpXTtcbiAgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKSB7XG4gICAgY29uc3QgYWN0aXZlTm9kZXMgPSBbXTtcbiAgICBjb25zdCBhbGxOb2RlcyA9IFtdO1xuICAgIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICAgIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG5cbiAgICAvLyBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAvLyAgIGFjdGl2ZU5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgLy8gfSlcblxuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAvLyBpZiAocC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3R2ZVwiKSkge1xuICAgICAgaWYgKCFwLmdldChcImluYWN0dmVcIikpIHtcblxuICAgICAgICBhY3RpdmVOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgICAgfVxuICAgICAgYWxsTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICB9KVxuXG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIC8vIE9ubHkgc2hvdyBhY3RpdmUgcGVvcGxlXG4gICAgICAvLyBjb25zdCBuZXdOZWlnaGJvcnMgPSBhY3RpdmVOb2Rlcy5maWx0ZXIoaWQgPT4gcGFyc2VJbnQoaWQpICE9PSBwLmdldChcIm5vZGVJZFwiKSlcbiAgICAgIC8vIHAuc2V0KFwibmVpZ2hib3JzXCIsIG5ld05laWdoYm9ycyk7XG5cbiAgICAgIC8vIFNob3cgZXZlcnlvbmUsIG1hcmsgb2ZmbGluZSBwZW9wbGUgYXMgb2ZmbGluZVxuICAgICAgY29uc3QgbmV3TmVpZ2hib3JzID0gYWxsTm9kZXMuZmlsdGVyKGlkID0+IHBhcnNlSW50KGlkKSAhPT0gcC5nZXQoXCJub2RlSWRcIikpXG4gICAgICBwLnNldChcIm5laWdoYm9yc1wiLCBuZXdOZWlnaGJvcnMpO1xuICAgIH0pXG59IiwiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuaW1wb3J0IFwiLi9ib3RzLmpzXCI7XG5pbXBvcnQgXCIuL2NhbGxiYWNrcy5qc1wiO1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgeyB0ZXN0U3ltYm9scywgdGVzdFRhbmdyYW1zIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7IFxuaW1wb3J0IHsgZ2V0TmVpZ2hib3JzLCBnZXRGdWxseUNvbm5lY3RlZExheWVyIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG4vLyBnYW1lSW5pdCBpcyB3aGVyZSB0aGUgc3RydWN0dXJlIG9mIGEgZ2FtZSBpcyBkZWZpbmVkLlxuLy8gSnVzdCBiZWZvcmUgZXZlcnkgZ2FtZSBzdGFydHMsIG9uY2UgYWxsIHRoZSBwbGF5ZXJzIG5lZWRlZCBhcmUgcmVhZHksIHRoaXNcbi8vIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIHRoZSB0cmVhdG1lbnQgYW5kIHRoZSBsaXN0IG9mIHBsYXllcnMuXG4vLyBZb3UgbXVzdCB0aGVuIGFkZCByb3VuZHMgYW5kIHN0YWdlcyB0byB0aGUgZ2FtZSwgZGVwZW5kaW5nIG9uIHRoZSB0cmVhdG1lbnRcbi8vIGFuZCB0aGUgcGxheWVycy4gWW91IGNhbiBhbHNvIGdldC9zZXQgaW5pdGlhbCB2YWx1ZXMgb24geW91ciBnYW1lLCBwbGF5ZXJzLFxuLy8gcm91bmRzIGFuZCBzdGFnZXMgKHdpdGggZ2V0L3NldCBtZXRob2RzKSwgdGhhdCB3aWxsIGJlIGFibGUgdG8gdXNlIGxhdGVyIGluXG4vLyB0aGUgZ2FtZS5cbkVtcGlyaWNhLmdhbWVJbml0KGdhbWUgPT4ge1xuICBjb25zdCB7XG4gICAgdHJlYXRtZW50OiB7XG4gICAgICBwbGF5ZXJDb3VudCxcbiAgICAgIG5ldHdvcmtTdHJ1Y3R1cmUsXG4gICAgICBudW1UYXNrUm91bmRzLFxuICAgICAgbnVtU3VydmV5Um91bmRzLFxuICAgICAgc2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCxcbiAgICAgIHVzZXJJbmFjdGl2aXR5RHVyYXRpb24sXG4gICAgICB0YXNrRHVyYXRpb24sXG4gICAgICBkZWZhdWx0U2V0U2l6ZSxcbiAgICAgIHN1cnZleUR1cmF0aW9uLFxuICAgICAgcmVzdWx0c0R1cmF0aW9uLFxuICAgICAgbWF4TnVtT3ZlcmxhcCxcbiAgICB9LFxuICB9ID0gZ2FtZTtcblxuXG4gIGNvbnN0IHN5bWJvbFNldCA9IHRlc3RUYW5ncmFtcztcbiAgY29uc3Qgc2V0U2l6ZSA9IHNldFNpemVCYXNlZE9uUGxheWVyQ291bnQgPyBwbGF5ZXJDb3VudCArIDEgOiBkZWZhdWx0U2V0U2l6ZTsgLy9UT0RPOiBjYW4gY2hhbmdlIGRlZmF1bHQgdmFsdWUgaW4gc2V0dGluZ3NcbiAgY29uc3QgbnVtUm91bmRzQmVmb3JlU3VydmV5ID0gbnVtVGFza1JvdW5kcy9udW1TdXJ2ZXlSb3VuZHM7XG5cbiAgbGV0IGNvbG9ycyA9IFtcIkdyZWVuXCIsIFwiUmVkXCIsIFwiWWVsbG93XCIsIFwiQmx1ZVwiLCBcIlB1cnBsZVwiLCBcIldoaXRlXCIsIFwiQmxhY2tcIl1cbiAgbGV0IHN1cnZleU51bSA9IDFcbiAgY29sb3JzID0gXy5zaHVmZmxlKGNvbG9ycyk7XG5cbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllciwgaSkgPT4ge1xuICAgIHBsYXllci5zZXQoXCJhdmF0YXJcIiwgYC9hdmF0YXJzL2pkZW50aWNvbi8ke3BsYXllci5faWR9YCk7XG4gICAgcGxheWVyLnNldChcInNjb3JlXCIsIDApO1xuXG4gICAgLy8gR2l2ZSBlYWNoIHBsYXllciBhIG5vZGVJZCBiYXNlZCBvbiB0aGVpciBwb3NpdGlvbiAoaW5kZXhlZCBhdCAxKVxuICAgIHBsYXllci5zZXQoXCJub2RlSWRcIiwgaSArIDEpO1xuICAgIHBsYXllci5zZXQoXCJuYW1lXCIsIHBsYXllci5pZCk7XG4gICAgcGxheWVyLnNldChcImFub255bW91c05hbWVcIiwgY29sb3JzW2ldKVxuICB9KTtcblxuICBpZiAoZ2FtZS5wbGF5ZXJzLmxlbmd0aCA8IGdhbWUudHJlYXRtZW50LnBsYXllckNvdW50KSB7IC8vIGlmIG5vdCBhIGZ1bGwgZ2FtZSwgZGVmYXVsdCB0byBmdWxseSBjb25uZWN0ZWQgbGF5ZXJcbiAgICBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpO1xuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhwLmdldChcIm5laWdoYm9yc1wiKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIHAuc2V0KFwibmVpZ2hib3JzXCIsIGdldE5laWdoYm9ycyhuZXR3b3JrU3RydWN0dXJlLCBwKSk7XG4gICAgICBjb25zb2xlLmxvZyhwLmdldChcIm5laWdoYm9yc1wiKSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBGb3IgZWFjaCByb3VuZCwgYWRkIGFsbCB0aGUgc3ltYm9scywgcmFuZG9tbHkgc2VsZWN0IGEgY29ycmVjdCBhbnN3ZXIgYW5kXG4gIC8vIENvbnN0cmFpbnRzOiBNdXN0IGVuc3VyZSB0aGF0IGV2ZXJ5b25lIGhhcyBvbmx5IG9uZSBzeW1ib2wgaW4gY29tbW9uXG4gIF8udGltZXMoIG51bVRhc2tSb3VuZHMsIGkgPT4ge1xuICAgIGNvbnN0IHJvdW5kID0gZ2FtZS5hZGRSb3VuZCgpO1xuXG4gICAgY29uc3Qge3N5bWJvbHMsIHRhc2tOYW1lLCBhbnN3ZXJ9ID0gc3ltYm9sU2V0W2ldO1xuXG4gICAgY29uc3QgdGFza1N0YWdlID0gcm91bmQuYWRkU3RhZ2Uoe1xuICAgICAgbmFtZTogXCJUYXNrXCIsXG4gICAgICBkaXNwbGF5TmFtZTogdGFza05hbWUsXG4gICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiB0YXNrRHVyYXRpb25cbiAgICB9KTtcbiAgICB0YXNrU3RhZ2Uuc2V0KFwidGFza1wiLCBzeW1ib2xTZXRbaV0pO1xuICAgIGdldFN5bWJvbHNGb3JQbGF5ZXJzKHN5bWJvbHMsIGFuc3dlciwgc2V0U2l6ZSwgdGFza05hbWUsIGdhbWUsIG1heE51bU92ZXJsYXApXG4gICAgdGFza1N0YWdlLnNldChcImFuc3dlclwiLCBzeW1ib2xTZXRbaV0uYW5zd2VyKVxuXG4gICAgY29uc3QgcmVzdWx0U3RhZ2UgPSByb3VuZC5hZGRTdGFnZSh7XG4gICAgICBuYW1lOiBcIlJlc3VsdFwiLFxuICAgICAgZGlzcGxheU5hbWU6IFwiUmVzdWx0XCIsXG4gICAgICBkdXJhdGlvbkluU2Vjb25kczogcmVzdWx0c0R1cmF0aW9uXG4gICAgfSk7XG4gICAgXG4gICAgaWYgKChpKzEpICUgbnVtUm91bmRzQmVmb3JlU3VydmV5ID09PSAwKSB7IC8vIEFmdGVyIDUgdGFzayByb3VuZHMsIGFkZCBhIHN1cnZleSByb3VuZFxuICAgICAgY29uc3Qgc3VydmV5Um91bmQgPSBnYW1lLmFkZFJvdW5kKCk7XG5cbiAgICAgIGNvbnN0IHN1cnZleVN0YWdlcyA9IHN1cnZleVJvdW5kLmFkZFN0YWdlKHtcbiAgICAgICAgbmFtZTogXCJTdXJ2ZXlcIixcbiAgICAgICAgZGlzcGxheU5hbWU6IFwiU3VydmV5IFwiICsgc3VydmV5TnVtLFxuICAgICAgICBkdXJhdGlvbkluU2Vjb25kczogc3VydmV5RHVyYXRpb25cbiAgICAgIH0pXG4gICAgICBcbiAgICAgIHN1cnZleU51bSsrO1xuICAgIH1cblxuICB9KTtcblxuXG5cbiAgZnVuY3Rpb24gZ2V0U3ltYm9sc0ZvclBsYXllcnMoc3ltYm9sU2V0LCBhbnN3ZXIsIHNldFNpemUsIHRhc2tOYW1lLCBnYW1lLCBtYXhOdW1PdmVybGFwKSB7XG4gICAgICBsZXQgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xTZXQuZmlsdGVyKHN5bWJvbCA9PiBzeW1ib2wgIT09IGFuc3dlcik7XG4gICAgICBzeW1ib2xzV2l0aG91dEFuc3dlciA9IF8uc2h1ZmZsZShzeW1ib2xzV2l0aG91dEFuc3dlcik7XG4gICAgICBsZXQgbnVtUGxheWVycyA9IGdhbWUucGxheWVycy5sZW5ndGg7XG4gICAgICBsZXQgbnVtT3ZlcmxhcCA9IDA7XG5cblxuICAgICAgLy8gQ3JlYXRlIGEgZGljdGlvbmFyeSB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IHRpbWVzIHN5bWJvbCBoYXMgYmVlbiB1c2VkXG4gICAgICBsZXQgc3ltYm9sRnJlcSA9IHt9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN5bWJvbHNXaXRob3V0QW5zd2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBzeW1ib2wgPSBzeW1ib2xzV2l0aG91dEFuc3dlcltpXVxuICAgICAgICBpZiAoIXN5bWJvbEZyZXEuaGFzT3duUHJvcGVydHkoc3ltYm9sKSkge1xuICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSA9IG51bVBsYXllcnMgLSAxOyAvLyBUb3RhbCB0aW1lIGEgc3ltYm9sIGNhbiBiZSB1c2VkIFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgICAgbGV0IHN5bWJvbHNQaWNrZWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzeW1ib2xzV2l0aG91dEFuc3dlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBzeW1ib2wgPSBzeW1ib2xzV2l0aG91dEFuc3dlcltpXVxuICAgICAgICAgIGlmIChzeW1ib2xzUGlja2VkLmxlbmd0aCA8IHNldFNpemUgLSAxKSB7IC8vIEFkZCBzeW1ib2xzIHVudGlsIHNldFNpemUgLSAxIGZvciBhbnN3ZXJcbiAgICAgICAgICAgIGlmIChzeW1ib2xGcmVxW3N5bWJvbF0gLSAxID09PSAwKSB7IC8vIFRoaXMgc3ltYm9sIHdpbGwgb3ZlcmxhcFxuICAgICAgICAgICAgICAgIGlmIChudW1PdmVybGFwIDwgbWF4TnVtT3ZlcmxhcCApIHsgLy8gT25seSBhZGQgaWYgbGVzcyB0aGFuIG1heCBvdmVybGFwXG4gICAgICAgICAgICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goc3ltYm9sKTtcbiAgICAgICAgICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSAtPSAxO1xuICAgICAgICAgICAgICAgICAgbnVtT3ZlcmxhcCArPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goYW5zd2VyKTsgLy8gQWRkIHRoZSBhbnN3ZXJcbiAgICAgICAgZm9yICh2YXIgc3ltYm9sVG9SZW1vdmUgb2Ygc3ltYm9sc1BpY2tlZCkge1xuICAgICAgICAgIGlmIChzeW1ib2xGcmVxW3N5bWJvbFRvUmVtb3ZlXSA9PT0gMCkgeyAvLyBJZiBzeW1ib2wgaGFzIGJlZW4gcGlja2VkIG4tMSBwbGF5ZXJzIHRpbWVzLCByZW1vdmUgaXQgZnJvbSB0aGUgc2V0XG4gICAgICAgICAgICBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHN5bWJvbHNXaXRob3V0QW5zd2VyLmZpbHRlcihzeW1ib2wgPT4gc3ltYm9sICE9PSBzeW1ib2xUb1JlbW92ZSk7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzeW1ib2xzUGlja2VkID0gXy5zaHVmZmxlKHN5bWJvbHNQaWNrZWQpO1xuXG4gICAgICAgIHBsYXllci5zZXQodGFza05hbWUsIHN5bWJvbHNQaWNrZWQpO1xuICAgICAgfSlcblxuXG4gIH1cblxuICAvLyBTaHVmZmxpbmcgYXJyYXlzOlxuICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MDUzNjA0NC9zd2FwcGluZy1hbGwtZWxlbWVudHMtb2YtYW4tYXJyYXktZXhjZXB0LWZvci1maXJzdC1hbmQtbGFzdFxuICBmdW5jdGlvbiBzaHVmZmxlKHN5bWJvbFNldCkge1xuICAgIGZvciAoaSA9IHN5bWJvbFNldC5sZW5ndGggLTEgOyBpID4gMDsgaS0tKSB7XG4gICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG5cbiAgICAgIFtzeW1ib2xTZXRbaV0sIHN5bWJvbFNldFtqXV0gPSBbc3ltYm9sU2V0W2pdLCBzeW1ib2xTZXRbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gc3ltYm9sU2V0O1xuICB9XG5cbn0pO1xuIl19
