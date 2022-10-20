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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm1vbWVudCIsIlRpbWVTeW5jIiwib25HYW1lU3RhcnQiLCJjb25zb2xlIiwibG9nIiwicGxheWVycyIsImZvckVhY2giLCJwbGF5ZXIiLCJzZXQiLCJEYXRlIiwibm93IiwibmV0d29yayIsImdldCIsImFjdGl2ZUNoYXRzIiwibWFwIiwib3RoZXJOb2RlSWQiLCJwYWlyT2ZQbGF5ZXJzIiwicGFyc2VJbnQiLCJzb3J0IiwicDEiLCJwMiIsIm90aGVyUGxheWVyIiwiZmluZCIsInAiLCJjaGF0S2V5IiwicHVzaCIsImxlbmd0aCIsInRyZWF0bWVudCIsIm1heEdhbWVUaW1lIiwiYWRkIiwib25Sb3VuZFN0YXJ0IiwiYWN0aXZlUGxheWVycyIsImZpbHRlciIsImVuZEdhbWVJZlBsYXllcklkbGUiLCJleGl0IiwibWluUGxheWVyQ291bnQiLCJvblN0YWdlU3RhcnQiLCJuYW1lIiwiZGlzcGxheU5hbWUiLCJvblN0YWdlRW5kIiwib25Sb3VuZEVuZCIsIm9uR2FtZUVuZCIsIm9uU2V0IiwidGFyZ2V0IiwidGFyZ2V0VHlwZSIsImtleSIsInZhbHVlIiwicHJldlZhbHVlIiwiYWxsU3VibWl0dGVkIiwibnVtUGxheWVyc1N1Ym1pdHRlZCIsImNvbXB1dGVTY29yZSIsInN1Ym1pdCIsInN1Y2Nlc3MiLCJwbGF5ZXJBbnN3ZXJzIiwiYWxsQW5zd2Vyc0VxdWFsIiwiYXJyIiwiZXZlcnkiLCJzdWJtaXNzaW9uIiwicHJldlNjb3JlIiwiZXhwb3J0IiwidGVzdFRhbmdyYW1zIiwiYWxsU3ltYm9scyIsIl9pZCIsInRhc2tOYW1lIiwic3ltYm9scyIsImFuc3dlciIsImdldE5laWdoYm9ycyIsInN0cnVjdHVyZSIsIm5laWdoYm9ycyIsInNwbGl0IiwicGxheWVySW5kZXgiLCJuIiwiY29ubmVjdGlvbiIsInJlcGxhY2UiLCJTZXQiLCJhY3RpdmVOb2RlcyIsImFsbE5vZGVzIiwibmV3TmVpZ2hib3JzIiwiaWQiLCJ0ZXN0U3ltYm9scyIsImdhbWVJbml0IiwicGxheWVyQ291bnQiLCJuZXR3b3JrU3RydWN0dXJlIiwibnVtVGFza1JvdW5kcyIsIm51bVN1cnZleVJvdW5kcyIsInNldFNpemVCYXNlZE9uUGxheWVyQ291bnQiLCJ1c2VySW5hY3Rpdml0eUR1cmF0aW9uIiwidGFza0R1cmF0aW9uIiwiZGVmYXVsdFNldFNpemUiLCJzdXJ2ZXlEdXJhdGlvbiIsInJlc3VsdHNEdXJhdGlvbiIsIm1heE51bU92ZXJsYXAiLCJzeW1ib2xTZXQiLCJzZXRTaXplIiwibnVtUm91bmRzQmVmb3JlU3VydmV5IiwiY29sb3JzIiwic3VydmV5TnVtIiwic2h1ZmZsZSIsImkiLCJfIiwidGltZXMiLCJhZGRSb3VuZCIsInRhc2tTdGFnZSIsImFkZFN0YWdlIiwiZHVyYXRpb25JblNlY29uZHMiLCJnZXRTeW1ib2xzRm9yUGxheWVycyIsInJlc3VsdFN0YWdlIiwic3VydmV5Um91bmQiLCJzdXJ2ZXlTdGFnZXMiLCJzeW1ib2xzV2l0aG91dEFuc3dlciIsInN5bWJvbCIsIm51bVBsYXllcnMiLCJudW1PdmVybGFwIiwic3ltYm9sRnJlcSIsImhhc093blByb3BlcnR5Iiwic3ltYm9sc1BpY2tlZCIsInN5bWJvbFRvUmVtb3ZlIiwiaiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7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RW1waXJpY2EgZnJvbSBcIm1ldGVvci9lbXBpcmljYTpjb3JlXCI7XG5cbi8vIFRoaXMgaXMgd2hlcmUgeW91IGFkZCBib3RzLCBsaWtlIEJvYjpcblxuRW1waXJpY2EuYm90KFwiYm9iXCIsIHtcbiAgLy8gLy8gTk9UIFNVUFBPUlRFRCBDYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBlYWNoIHN0YWdlIChhZnRlciBvblJvdW5kU3RhcnQvb25TdGFnZVN0YXJ0KVxuICAvLyBvblN0YWdlU3RhcnQoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMpIHt9LFxuXG4gIC8vIENhbGxlZCBkdXJpbmcgZWFjaCBzdGFnZSBhdCB0aWNrIGludGVydmFsICh+MXMgYXQgdGhlIG1vbWVudClcbiAgb25TdGFnZVRpY2soYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHNlY29uZHNSZW1haW5pbmcpIHt9XG5cbiAgLy8gLy8gTk9UIFNVUFBPUlRFRCBBIHBsYXllciBoYXMgY2hhbmdlZCBhIHZhbHVlXG4gIC8vIC8vIFRoaXMgbWlnaHQgaGFwcGVuIGEgbG90IVxuICAvLyBvblN0YWdlUGxheWVyQ2hhbmdlKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzLCBwbGF5ZXIpIHt9XG5cbiAgLy8gLy8gTk9UIFNVUFBPUlRFRCBDYWxsZWQgYXQgdGhlIGVuZCBvZiB0aGUgc3RhZ2UgKGFmdGVyIGl0IGZpbmlzaGVkLCBiZWZvcmUgb25TdGFnZUVuZC9vblJvdW5kRW5kIGlzIGNhbGxlZClcbiAgLy8gb25TdGFnZUVuZChib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycykge31cbn0pO1xuIiwiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuXG5pbXBvcnQgeyBnZXRGdWxseUNvbm5lY3RlZExheWVyIH0gZnJvbSBcIi4vdXRpbFwiO1xuaW1wb3J0IG1vbWVudCBmcm9tIFwibW9tZW50XCI7XG5pbXBvcnQgeyBUaW1lU3luYyB9IGZyb20gXCJtZXRlb3IvbWl6emFvOnRpbWVzeW5jXCI7XG5cblxuXG4vLyBvbkdhbWVTdGFydCBpcyB0cmlnZ2VyZWQgb3BuY2UgcGVyIGdhbWUgYmVmb3JlIHRoZSBnYW1lIHN0YXJ0cywgYW5kIGJlZm9yZVxuLy8gdGhlIGZpcnN0IG9uUm91bmRTdGFydC4gSXQgcmVjZWl2ZXMgdGhlIGdhbWUgYW5kIGxpc3Qgb2YgYWxsIHRoZSBwbGF5ZXJzIGluXG4vLyB0aGUgZ2FtZS5cbkVtcGlyaWNhLm9uR2FtZVN0YXJ0KGdhbWUgPT4ge1xuICBjb25zb2xlLmxvZyhcIkdhbWUgc3RhcnRlZFwiKTtcbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5zZXQoXCJpbmFjdGl2ZVwiLCBmYWxzZSk7XG4gICAgcGxheWVyLnNldChcImluYWN0aXZlV2FybmluZ1VzZWRcIiwgZmFsc2UpO1xuICAgIHBsYXllci5zZXQoXCJsYXN0QWN0aXZlXCIsIG1vbWVudChEYXRlLm5vdygpKSk7XG4gICAgY29uc3QgbmV0d29yayA9IHBsYXllci5nZXQoXCJuZWlnaGJvcnNcIik7XG4gICAgY29uc3QgYWN0aXZlQ2hhdHMgPSBbXTtcbiAgICBuZXR3b3JrLm1hcChvdGhlck5vZGVJZCA9PiB7XG4gICAgICB2YXIgcGFpck9mUGxheWVycyA9IFtwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpLCBwYXJzZUludChvdGhlck5vZGVJZCldO1xuICAgICAgcGFpck9mUGxheWVycy5zb3J0KChwMSxwMikgPT4gcDEgLSBwMik7XG4gICAgICBjb25zdCBvdGhlclBsYXllciA9IGdhbWUucGxheWVycy5maW5kKHAgPT4gcC5nZXQoXCJub2RlSWRcIikgPT09IHBhcnNlSW50KG90aGVyTm9kZUlkKSk7XG4gICAgICAvLyBjb25zdCBvdGhlclBsYXllcklkID0gb3RoZXJQbGF5ZXIuaWQ7XG4gICAgICBjb25zdCBjaGF0S2V5ID0gYCR7cGFpck9mUGxheWVyc1swXX0tJHtwYWlyT2ZQbGF5ZXJzWzFdfWA7XG4gICAgICBhY3RpdmVDaGF0cy5wdXNoKGNoYXRLZXkpO1xuICAgIH0pO1xuICAgIC8vIERlZmF1bHQgYWxsIGNoYXRzIHRvIGJlIG9wZW4gd2hlbiBnYW1lIHN0YXJ0c1xuICAgIHBsYXllci5zZXQoXCJhY3RpdmVDaGF0c1wiLCBhY3RpdmVDaGF0cyk7XG4gIH0pO1xuICBnYW1lLnNldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiLCBnYW1lLnBsYXllcnMubGVuZ3RoKTtcbiAgZ2FtZS5zZXQoXCJnYW1lU3RhcnRUaW1lXCIsIG1vbWVudChEYXRlLm5vdygpKSk7XG4gIGlmIChnYW1lLnRyZWF0bWVudC5tYXhHYW1lVGltZSkge1xuICAgIGdhbWUuc2V0KFwibWF4R2FtZUVuZFRpbWVcIiwgbW9tZW50KERhdGUubm93KCkpLmFkZChnYW1lLnRyZWF0bWVudC5tYXhHYW1lVGltZSwgJ20nKSlcbiAgfVxufSk7XG5cbi8vIG9uUm91bmRTdGFydCBpcyB0cmlnZ2VyZWQgYmVmb3JlIGVhY2ggcm91bmQgc3RhcnRzLCBhbmQgYmVmb3JlIG9uU3RhZ2VTdGFydC5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lU3RhcnQsIGFuZCB0aGUgcm91bmQgdGhhdCBpcyBzdGFydGluZy5cbkVtcGlyaWNhLm9uUm91bmRTdGFydCgoZ2FtZSwgcm91bmQpID0+IHtcbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAgIHBsYXllci5zZXQoXCJzeW1ib2xTZWxlY3RlZFwiLCBcIlwiKTtcbiAgfSk7XG4gIHJvdW5kLnNldChcInJlc3VsdFwiLCBmYWxzZSk7XG4gIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgMCk7XG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoYWN0aXZlUGxheWVycy5sZW5ndGggPCBnYW1lLmdldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiKSApIHsgLy8gU29tZW9uZSBsZWZ0IGluIHRoZSBtaWRkbGUgb2YgdGhlIHJvdW5kXG4gICAgaWYgKGdhbWUudHJlYXRtZW50LmVuZEdhbWVJZlBsYXllcklkbGUpIHtcbiAgICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAvLyBwLmV4aXQoXCJzb21lb25lSW5hY3RpdmVcIik7XG4gICAgICAgIHAuZXhpdChcIm1pblBsYXllckNvdW50Tm90TWFpbnRhaW5lZFwiKTtcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSk7IC8vIFVwZGF0ZXMgdGhlIG5laWdoYm9ycyB0byBiZSBmdWxseSBjb25uZWN0ZWRcbiAgICAgIGdhbWUuc2V0KFwiY2hlY2tGb3JTaW1pbGFyU3ltYm9sXCIsIHRydWUpO1xuICAgIH1cbiAgXG4gIH1cbiAgZ2FtZS5zZXQoXCJwcmV2aW91c051bUFjdGl2ZVBsYXllcnNcIiwgYWN0aXZlUGxheWVycy5sZW5ndGgpO1xuXG4gIGlmIChnYW1lLnRyZWF0bWVudC5taW5QbGF5ZXJDb3VudCAmJiBhY3RpdmVQbGF5ZXJzLmxlbmd0aCA8IGdhbWUudHJlYXRtZW50Lm1pblBsYXllckNvdW50KSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBwLmV4aXQoXCJtaW5QbGF5ZXJDb3VudE5vdE1haW50YWluZWRcIik7XG4gICAgfSlcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwiUm91bmQgU3RhcnRlZFwiKTtcblxufSk7XG5cbi8vIG9uU3RhZ2VTdGFydCBpcyB0cmlnZ2VyZWQgYmVmb3JlIGVhY2ggc3RhZ2Ugc3RhcnRzLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvblJvdW5kU3RhcnQsIGFuZCB0aGUgc3RhZ2UgdGhhdCBpcyBzdGFydGluZy5cbkVtcGlyaWNhLm9uU3RhZ2VTdGFydCgoZ2FtZSwgcm91bmQsIHN0YWdlKSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiU3RhZ2UgU3RhcnRlZFwiKVxuICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cbiAgaWYgKHN0YWdlLm5hbWUgPT09IFwiVGFza1wiKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCBgU3ltYm9scyA6ICR7cGxheWVyLmdldChgJHtzdGFnZS5kaXNwbGF5TmFtZX1gKX1gKTtcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyhgQW5zd2VyOiAke3N0YWdlLmdldChcImFuc3dlclwiKX1gKTtcbiAgfVxuICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJTdXJ2ZXlcIikge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0KFwic3VydmV5TnVtYmVyXCIgLCAxKVxuICAgIH0pO1xuICB9XG4gIC8vIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgLy8gICBwbGF5ZXIuc2V0KFwic3VibWl0dGVkXCIsIGZhbHNlKTtcbiAgLy8gfSk7XG4gIC8vIHN0YWdlLnNldChcInNob3dSZXN1bHRzXCIsIGZhbHNlKTtcbiAgLy8gc3RhZ2Uuc2V0KFwicmVzdWx0c1Nob3duXCIsIGZhbHNlKTtcblxufSk7XG5cbi8vIG9uU3RhZ2VFbmQgaXMgdHJpZ2dlcmVkIGFmdGVyIGVhY2ggc3RhZ2UuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uUm91bmRFbmQsIGFuZCB0aGUgc3RhZ2UgdGhhdCBqdXN0IGVuZGVkLlxuRW1waXJpY2Eub25TdGFnZUVuZCgoZ2FtZSwgcm91bmQsIHN0YWdlKSA9PntcbiAgY29uc29sZS5sb2coXCJTdGFnZSBFbmRlZFwiKVxuICBcbn0pO1xuXG4vLyBvblJvdW5kRW5kIGlzIHRyaWdnZXJlZCBhZnRlciBlYWNoIHJvdW5kLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvbkdhbWVFbmQsIGFuZCB0aGUgcm91bmQgdGhhdCBqdXN0IGVuZGVkLlxuRW1waXJpY2Eub25Sb3VuZEVuZCgoZ2FtZSwgcm91bmQpID0+IHtcbiAgY29uc29sZS5sb2coXCJSb3VuZCBFbmRlZFwiKVxuICAvLyBnYW1lLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAvLyAgIGNvbnN0IHZhbHVlID0gcGxheWVyLnJvdW5kLmdldChcInZhbHVlXCIpIHx8IDA7XG4gIC8vICAgY29uc3QgcHJldlNjb3JlID0gcGxheWVyLmdldChcInNjb3JlXCIpIHx8IDA7XG4gIC8vICAgcGxheWVyLnNldChcInNjb3JlXCIsIHByZXZTY29yZSArIHZhbHVlKTtcbiAgLy8gfSk7XG5cbn0pO1xuXG4vLyBvbkdhbWVFbmQgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGdhbWUgZW5kcy5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lU3RhcnQuXG5FbXBpcmljYS5vbkdhbWVFbmQoZ2FtZSA9PiB7fSk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT4gb25TZXQsIG9uQXBwZW5kIGFuZCBvbkNoYW5nZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBvblNldCwgb25BcHBlbmQgYW5kIG9uQ2hhbmdlIGFyZSBjYWxsZWQgb24gZXZlcnkgc2luZ2xlIHVwZGF0ZSBtYWRlIGJ5IGFsbFxuLy8gcGxheWVycyBpbiBlYWNoIGdhbWUsIHNvIHRoZXkgY2FuIHJhcGlkbHkgYmVjb21lIHF1aXRlIGV4cGVuc2l2ZSBhbmQgaGF2ZVxuLy8gdGhlIHBvdGVudGlhbCB0byBzbG93IGRvd24gdGhlIGFwcC4gVXNlIHdpc2VseS5cbi8vXG4vLyBJdCBpcyB2ZXJ5IHVzZWZ1bCB0byBiZSBhYmxlIHRvIHJlYWN0IHRvIGVhY2ggdXBkYXRlIGEgdXNlciBtYWtlcy4gVHJ5XG4vLyBub250aGVsZXNzIHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgY29tcHV0YXRpb25zIGFuZCBkYXRhYmFzZSBzYXZlcyAoLnNldClcbi8vIGRvbmUgaW4gdGhlc2UgY2FsbGJhY2tzLiBZb3UgY2FuIGFsc28gdHJ5IHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgY2FsbHMgdG9cbi8vIHNldCgpIGFuZCBhcHBlbmQoKSB5b3UgbWFrZSAoYXZvaWQgY2FsbGluZyB0aGVtIG9uIGEgY29udGludW91cyBkcmFnIG9mIGFcbi8vIHNsaWRlciBmb3IgZXhhbXBsZSkgYW5kIGluc2lkZSB0aGVzZSBjYWxsYmFja3MgdXNlIHRoZSBga2V5YCBhcmd1bWVudCBhdCB0aGVcbi8vIHZlcnkgYmVnaW5uaW5nIG9mIHRoZSBjYWxsYmFjayB0byBmaWx0ZXIgb3V0IHdoaWNoIGtleXMgeW91ciBuZWVkIHRvIHJ1blxuLy8gbG9naWMgYWdhaW5zdC5cbi8vXG4vLyBJZiB5b3UgYXJlIG5vdCB1c2luZyB0aGVzZSBjYWxsYmFja3MsIGNvbW1lbnQgdGhlbSBvdXQgc28gdGhlIHN5c3RlbSBkb2VzXG4vLyBub3QgY2FsbCB0aGVtIGZvciBub3RoaW5nLlxuXG4vLyAvLyBvblNldCBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIC5zZXQoKSBtZXRob2Rcbi8vIC8vIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uU2V0KChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbi8vICkgPT4ge1xuLy8gICAvLyAvLyBFeGFtcGxlIGZpbHRlcmluZ1xuLy8gICAvLyBpZiAoa2V5ICE9PSBcInZhbHVlXCIpIHtcbi8vICAgLy8gICByZXR1cm47XG4vLyAgIC8vIH1cbi8vIH0pO1xuXG5FbXBpcmljYS5vblNldCgoXG4gIGdhbWUsXG4gIHJvdW5kLFxuICBzdGFnZSxcbiAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbiAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4gIHZhbHVlLCAvLyBOZXcgdmFsdWVcbiAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4pID0+IHtcbiAgY29uc29sZS5sb2coXCJrZXlcIiwga2V5KTtcbiAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG4gIC8vIFNvbWUgcGxheWVyIGRlY2lkZXMgdG8gcmVjb25zaWRlciB0aGVpciBhbnN3ZXJcbiAgaWYgKGtleSA9PT0gXCJzdWJtaXR0ZWRcIikgeyBcbiAgICAvLyBDaGVja3MgaWYgZXZlcnlvbmUgaGFzIHN1Ym1pdHRlZCB0aGVpciBhbnN3ZXIgYW5kIGlmIHNvLCBzdWJtaXQgdGhlIHN0YWdlXG4gICAgbGV0IGFsbFN1Ym1pdHRlZCA9IHRydWU7XG4gICAgbGV0IG51bVBsYXllcnNTdWJtaXR0ZWQgPSAwO1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmdldChcInN1Ym1pdHRlZFwiKSkge1xuICAgICAgICBudW1QbGF5ZXJzU3VibWl0dGVkICs9IDE7XG4gICAgICB9XG4gICAgICBhbGxTdWJtaXR0ZWQgPSBwbGF5ZXIuZ2V0KFwic3VibWl0dGVkXCIpICYmIGFsbFN1Ym1pdHRlZDtcbiAgICB9KVxuICAgIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgbnVtUGxheWVyc1N1Ym1pdHRlZCk7XG4gICAgaWYgKGFsbFN1Ym1pdHRlZCkge1xuICAgICAgaWYgKHN0YWdlLm5hbWUgPT09IFwiVGFza1wiKSB7XG4gICAgICAgIGNvbXB1dGVTY29yZShhY3RpdmVQbGF5ZXJzLCBnYW1lLCBzdGFnZSwgcm91bmQpO1xuICAgICAgfVxuICAgICAgLy8gTmVlZCB0byBzdWJtaXQgZm9yIHN1Ym1pdCB0aGUgc3RhZ2UgZm9yIGV2ZXJ5IHBsYXllclxuICAgICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4gICAgICB9KVxuICAgIH1cbiAgLy8gICBpZiAoc3RhZ2UuZ2V0KFwicmVzdWx0c1Nob3duXCIpKSB7XG4gIC8vICAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4gIC8vICAgICB9KVxuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIGlmICh0YXJnZXRUeXBlID09PSBcInN0YWdlXCIgJiYga2V5ID09PSBcInJlc3VsdHNTaG93blwiKSB7XG4gIC8vICAgaWYgKHN0YWdlLmdldChcInJlc3VsdHNTaG93blwiKSkge1xuICAvLyAgICAgcGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgLy8gICAgICAgcGxheWVyLnN0YWdlLnN1Ym1pdCgpO1xuICAvLyAgICAgfSlcbiAgLy8gICB9XG4gIH1cblxuICAvLyBlbHNlIGlmIChrZXkgPT09IFwiaW5hY3RpdmVcIikge1xuICAgIC8vIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSk7XG4gIC8vIH1cblxuICByZXR1cm47XG5cbn0pO1xuXG5mdW5jdGlvbiBjb21wdXRlU2NvcmUoYWN0aXZlUGxheWVycywgZ2FtZSwgc3RhZ2UsIHJvdW5kKSB7XG4gIGxldCBzdWNjZXNzID0gdHJ1ZTtcbiAgY29uc29sZS5sb2coXCJDT1JSRUNUIEFOU1dFUjpcIilcbiAgY29uc29sZS5sb2coc3RhZ2UuZ2V0KFwiYW5zd2VyXCIpKTtcbiAgY29uc29sZS5sb2coXCJQbGF5ZXJzIGd1ZXNzZWQ6XCIpXG5cbiAgbGV0IHBsYXllckFuc3dlcnMgPSBbXTtcbiAgY29uc3QgYWxsQW5zd2Vyc0VxdWFsID0gYXJyID0+IGFyci5ldmVyeSggdiA9PiB2ID09PSBhcnJbMF0gKSAvL0Z1bmMgdG8gY2hlY2sgaWYgYWxsIHBsYXllciBhbnN3ZXJzIGFyZSBlcXVhbFxuXG4gIGFjdGl2ZVBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgIGNvbnN0IHN1Ym1pc3Npb24gPSBwbGF5ZXIuZ2V0KFwic3ltYm9sU2VsZWN0ZWRcIik7XG4gICAgY29uc29sZS5sb2coc3VibWlzc2lvbik7XG4gICAgaWYgKGdhbWUuZ2V0KFwiY2hlY2tGb3JTaW1pbGFyU3ltYm9sXCIpKSB7XG4gICAgICBwbGF5ZXJBbnN3ZXJzLnB1c2goc3VibWlzc2lvbik7XG4gICAgfVxuICAgIGlmIChzdWJtaXNzaW9uICE9PSBzdGFnZS5nZXQoXCJhbnN3ZXJcIikpIHtcbiAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICB9XG4gIH0pXG5cbiAgaWYgKGdhbWUuZ2V0KFwiY2hlY2tGb3JTaW1pbGFyU3ltYm9sXCIpKSB7XG4gICAgaWYgKGFsbEFuc3dlcnNFcXVhbChwbGF5ZXJBbnN3ZXJzKSkge1xuICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcm91bmQuc2V0KFwicmVzdWx0XCIsIHN1Y2Nlc3MpO1xuICBpZiAoc3VjY2Vzcykge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgY29uc3QgcHJldlNjb3JlID0gcGxheWVyLmdldChcInNjb3JlXCIpIHx8IDA7XG4gICAgICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgcHJldlNjb3JlICsgMSk7XG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyhcIiBBbGwgcGxheWVycyBnb3QgaXQgY29ycmVjdGx5XCIpO1xuICB9IFxufVxuXG4vLyAvLyBvbkFwcGVuZCBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIGAuYXBwZW5kKClgIG1ldGhvZFxuLy8gLy8gb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3IgcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25BcHBlbmQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gKSA9PiB7XG4vLyAgIC8vIE5vdGU6IGB2YWx1ZWAgaXMgdGhlIHNpbmdsZSBsYXN0IHZhbHVlIChlLmcgMC4yKSwgd2hpbGUgYHByZXZWYWx1ZWAgd2lsbFxuLy8gICAvLyAgICAgICBiZSBhbiBhcnJheSBvZiB0aGUgcHJldmlzb3VzIHZhbHVlZCAoZS5nLiBbMC4zLCAwLjQsIDAuNjVdKS5cbi8vIH0pO1xuXG5cbi8vIC8vIG9uQ2hhbmdlIGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgYC5zZXQoKWAgb3IgdGhlXG4vLyAvLyBgLmFwcGVuZCgpYCBtZXRob2Qgb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3Jcbi8vIC8vIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uQ2hhbmdlKChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUsIC8vIFByZXZpb3VzIHZhbHVlXG4vLyAgIGlzQXBwZW5kIC8vIFRydWUgaWYgdGhlIGNoYW5nZSB3YXMgYW4gYXBwZW5kLCBmYWxzZSBpZiBpdCB3YXMgYSBzZXRcbi8vICkgPT4ge1xuLy8gICAvLyBgb25DaGFuZ2VgIGlzIHVzZWZ1bCB0byBydW4gc2VydmVyLXNpZGUgbG9naWMgZm9yIGFueSB1c2VyIGludGVyYWN0aW9uLlxuLy8gICAvLyBOb3RlIHRoZSBleHRyYSBpc0FwcGVuZCBib29sZWFuIHRoYXQgd2lsbCBhbGxvdyB0byBkaWZmZXJlbmNpYXRlIHNldHMgYW5kXG4vLyAgIC8vIGFwcGVuZHMuXG4vLyAgICBHYW1lLnNldChcImxhc3RDaGFuZ2VBdFwiLCBuZXcgRGF0ZSgpLnRvU3RyaW5nKCkpXG4vLyB9KTtcblxuLy8gLy8gb25TdWJtaXQgaXMgY2FsbGVkIHdoZW4gdGhlIHBsYXllciBzdWJtaXRzIGEgc3RhZ2UuXG4vLyBFbXBpcmljYS5vblN1Ym1pdCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyIC8vIFBsYXllciB3aG8gc3VibWl0dGVkXG4vLyApID0+IHtcbi8vIH0pO1xuIiwiY29uc3QgYWxsU3ltYm9scyA9IFtcInQxXCIsIFwidDJcIiwgXCJ0M1wiLCBcInQ0XCIsIFwidDVcIiwgXCJ0NlwiLCBcInQ3XCIsXCJ0OFwiLFwidDlcIixcInQxMFwiLFwidDExXCIsXCJ0MTJcIl07XG5cbi8vIG4gPSBudW1iZXIgb2YgcGVvcGxlICwgcCA9IG51bWJlciBvZiBzeW1ib2xzXG4vLyAobi0xKSpwICsgMVxuLy8gaS5lLiBuID0gMywgcCA9IDMgOiA3XG5cbmV4cG9ydCBjb25zdCB0ZXN0VGFuZ3JhbXMgPSBbXG4gIHtcbiAgICBfaWQ6IFwiMFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMlwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQyXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMlwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgM1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQzXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiM1wiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgNFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ0XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiNFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgNVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ1XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiNVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgNlwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ2XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiNlwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgN1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ3XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiN1wiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgOFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ4XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiOFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgOVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ5XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiOVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTBcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MTBcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxMFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTFcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MTFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxMVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTJcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MTJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxMlwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTNcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEzXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxNFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQyXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTRcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDE1XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDNcIixcbiAgfSxcblxuXTtcblxuXG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0TmVpZ2hib3JzKHN0cnVjdHVyZSwgcGxheWVyKSB7XG4gICAgY29uc3QgbmVpZ2hib3JzID0gW107XG4gICAgbGV0IG5ldHdvcmsgPSBzdHJ1Y3R1cmUuc3BsaXQoXCIsXCIpO1xuICAgIGNvbnN0IHBsYXllckluZGV4ID0gcGxheWVyLmdldChcIm5vZGVJZFwiKTtcblxuICAgIG5ldHdvcmsuZm9yRWFjaCgobikgPT4ge1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IG4uc3BsaXQoXCItXCIpO1xuXG4gICAgICBpZiAocGxheWVySW5kZXggPT09IHBhcnNlSW50KGNvbm5lY3Rpb25bMF0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGNvbm5lY3Rpb25bMV0ucmVwbGFjZSgvXFxzL2csICcnKSk7XG4gICAgICB9IGVsc2UgaWYgKHBsYXllckluZGV4ID09PSBwYXJzZUludChjb25uZWN0aW9uWzFdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChjb25uZWN0aW9uWzBdLnJlcGxhY2UoL1xccy9nLCAnJykpO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICByZXR1cm4gWy4uLiBuZXcgU2V0KG5laWdoYm9ycyldO1xuICB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpIHtcbiAgICBjb25zdCBhY3RpdmVOb2RlcyA9IFtdO1xuICAgIGNvbnN0IGFsbE5vZGVzID0gW107XG4gICAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gICAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cblxuICAgIC8vIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgIC8vICAgYWN0aXZlTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICAvLyB9KVxuXG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIC8vIGlmIChwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdHZlXCIpKSB7XG4gICAgICBpZiAoIXAuZ2V0KFwiaW5hY3R2ZVwiKSkge1xuXG4gICAgICAgIGFjdGl2ZU5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgICB9XG4gICAgICBhbGxOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgIH0pXG5cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgLy8gT25seSBzaG93IGFjdGl2ZSBwZW9wbGVcbiAgICAgIC8vIGNvbnN0IG5ld05laWdoYm9ycyA9IGFjdGl2ZU5vZGVzLmZpbHRlcihpZCA9PiBwYXJzZUludChpZCkgIT09IHAuZ2V0KFwibm9kZUlkXCIpKVxuICAgICAgLy8gcC5zZXQoXCJuZWlnaGJvcnNcIiwgbmV3TmVpZ2hib3JzKTtcblxuICAgICAgLy8gU2hvdyBldmVyeW9uZSwgbWFyayBvZmZsaW5lIHBlb3BsZSBhcyBvZmZsaW5lXG4gICAgICBjb25zdCBuZXdOZWlnaGJvcnMgPSBhbGxOb2Rlcy5maWx0ZXIoaWQgPT4gcGFyc2VJbnQoaWQpICE9PSBwLmdldChcIm5vZGVJZFwiKSlcbiAgICAgIHAuc2V0KFwibmVpZ2hib3JzXCIsIG5ld05laWdoYm9ycyk7XG4gICAgfSlcbn0iLCJpbXBvcnQgRW1waXJpY2EgZnJvbSBcIm1ldGVvci9lbXBpcmljYTpjb3JlXCI7XG5pbXBvcnQgXCIuL2JvdHMuanNcIjtcbmltcG9ydCBcIi4vY2FsbGJhY2tzLmpzXCI7XG5cbmltcG9ydCB7IHRlc3RTeW1ib2xzLCB0ZXN0VGFuZ3JhbXMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjsgXG5pbXBvcnQgeyBnZXROZWlnaGJvcnMsIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIgfSBmcm9tIFwiLi91dGlsXCI7XG5cbi8vIGdhbWVJbml0IGlzIHdoZXJlIHRoZSBzdHJ1Y3R1cmUgb2YgYSBnYW1lIGlzIGRlZmluZWQuXG4vLyBKdXN0IGJlZm9yZSBldmVyeSBnYW1lIHN0YXJ0cywgb25jZSBhbGwgdGhlIHBsYXllcnMgbmVlZGVkIGFyZSByZWFkeSwgdGhpc1xuLy8gZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggdGhlIHRyZWF0bWVudCBhbmQgdGhlIGxpc3Qgb2YgcGxheWVycy5cbi8vIFlvdSBtdXN0IHRoZW4gYWRkIHJvdW5kcyBhbmQgc3RhZ2VzIHRvIHRoZSBnYW1lLCBkZXBlbmRpbmcgb24gdGhlIHRyZWF0bWVudFxuLy8gYW5kIHRoZSBwbGF5ZXJzLiBZb3UgY2FuIGFsc28gZ2V0L3NldCBpbml0aWFsIHZhbHVlcyBvbiB5b3VyIGdhbWUsIHBsYXllcnMsXG4vLyByb3VuZHMgYW5kIHN0YWdlcyAod2l0aCBnZXQvc2V0IG1ldGhvZHMpLCB0aGF0IHdpbGwgYmUgYWJsZSB0byB1c2UgbGF0ZXIgaW5cbi8vIHRoZSBnYW1lLlxuRW1waXJpY2EuZ2FtZUluaXQoZ2FtZSA9PiB7XG4gIGNvbnN0IHtcbiAgICB0cmVhdG1lbnQ6IHtcbiAgICAgIHBsYXllckNvdW50LFxuICAgICAgbmV0d29ya1N0cnVjdHVyZSxcbiAgICAgIG51bVRhc2tSb3VuZHMsXG4gICAgICBudW1TdXJ2ZXlSb3VuZHMsXG4gICAgICBzZXRTaXplQmFzZWRPblBsYXllckNvdW50LFxuICAgICAgdXNlckluYWN0aXZpdHlEdXJhdGlvbixcbiAgICAgIHRhc2tEdXJhdGlvbixcbiAgICAgIGRlZmF1bHRTZXRTaXplLFxuICAgICAgc3VydmV5RHVyYXRpb24sXG4gICAgICByZXN1bHRzRHVyYXRpb24sXG4gICAgICBtYXhOdW1PdmVybGFwLFxuICAgIH0sXG4gIH0gPSBnYW1lO1xuXG5cbiAgY29uc3Qgc3ltYm9sU2V0ID0gdGVzdFRhbmdyYW1zO1xuICBjb25zdCBzZXRTaXplID0gc2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCA/IHBsYXllckNvdW50ICsgMSA6IGRlZmF1bHRTZXRTaXplOyAvL1RPRE86IGNhbiBjaGFuZ2UgZGVmYXVsdCB2YWx1ZSBpbiBzZXR0aW5nc1xuICBjb25zdCBudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkgPSBudW1UYXNrUm91bmRzL251bVN1cnZleVJvdW5kcztcblxuICBsZXQgY29sb3JzID0gW1wiR3JlZW5cIiwgXCJSZWRcIiwgXCJZZWxsb3dcIiwgXCJCbHVlXCIsIFwiUHVycGxlXCIsIFwiV2hpdGVcIiwgXCJCbGFja1wiXVxuICBsZXQgc3VydmV5TnVtID0gMVxuICBjb2xvcnMgPSBzaHVmZmxlKGNvbG9ycyk7XG5cbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllciwgaSkgPT4ge1xuICAgIHBsYXllci5zZXQoXCJhdmF0YXJcIiwgYC9hdmF0YXJzL2pkZW50aWNvbi8ke3BsYXllci5faWR9YCk7XG4gICAgcGxheWVyLnNldChcInNjb3JlXCIsIDApO1xuXG4gICAgLy8gR2l2ZSBlYWNoIHBsYXllciBhIG5vZGVJZCBiYXNlZCBvbiB0aGVpciBwb3NpdGlvbiAoaW5kZXhlZCBhdCAxKVxuICAgIHBsYXllci5zZXQoXCJub2RlSWRcIiwgaSArIDEpO1xuICAgIHBsYXllci5zZXQoXCJuYW1lXCIsIHBsYXllci5pZCk7XG4gICAgcGxheWVyLnNldChcImFub255bW91c05hbWVcIiwgY29sb3JzW2ldKVxuICB9KTtcblxuICBpZiAoZ2FtZS5wbGF5ZXJzLmxlbmd0aCA8IGdhbWUudHJlYXRtZW50LnBsYXllckNvdW50KSB7IC8vIGlmIG5vdCBhIGZ1bGwgZ2FtZSwgZGVmYXVsdCB0byBmdWxseSBjb25uZWN0ZWQgbGF5ZXJcbiAgICBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpO1xuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhwLmdldChcIm5laWdoYm9yc1wiKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIHAuc2V0KFwibmVpZ2hib3JzXCIsIGdldE5laWdoYm9ycyhuZXR3b3JrU3RydWN0dXJlLCBwKSk7XG4gICAgICBjb25zb2xlLmxvZyhwLmdldChcIm5laWdoYm9yc1wiKSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBGb3IgZWFjaCByb3VuZCwgYWRkIGFsbCB0aGUgc3ltYm9scywgcmFuZG9tbHkgc2VsZWN0IGEgY29ycmVjdCBhbnN3ZXIgYW5kXG4gIC8vIENvbnN0cmFpbnRzOiBNdXN0IGVuc3VyZSB0aGF0IGV2ZXJ5b25lIGhhcyBvbmx5IG9uZSBzeW1ib2wgaW4gY29tbW9uXG4gIF8udGltZXMoIG51bVRhc2tSb3VuZHMsIGkgPT4ge1xuICAgIGNvbnN0IHJvdW5kID0gZ2FtZS5hZGRSb3VuZCgpO1xuXG4gICAgY29uc3Qge3N5bWJvbHMsIHRhc2tOYW1lLCBhbnN3ZXJ9ID0gc3ltYm9sU2V0W2ldO1xuXG4gICAgY29uc3QgdGFza1N0YWdlID0gcm91bmQuYWRkU3RhZ2Uoe1xuICAgICAgbmFtZTogXCJUYXNrXCIsXG4gICAgICBkaXNwbGF5TmFtZTogdGFza05hbWUsXG4gICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiB0YXNrRHVyYXRpb25cbiAgICB9KTtcbiAgICB0YXNrU3RhZ2Uuc2V0KFwidGFza1wiLCBzeW1ib2xTZXRbaV0pO1xuICAgIGdldFN5bWJvbHNGb3JQbGF5ZXJzKHN5bWJvbHMsIGFuc3dlciwgc2V0U2l6ZSwgdGFza05hbWUsIGdhbWUsIG1heE51bU92ZXJsYXApXG4gICAgdGFza1N0YWdlLnNldChcImFuc3dlclwiLCBzeW1ib2xTZXRbaV0uYW5zd2VyKVxuXG4gICAgY29uc3QgcmVzdWx0U3RhZ2UgPSByb3VuZC5hZGRTdGFnZSh7XG4gICAgICBuYW1lOiBcIlJlc3VsdFwiLFxuICAgICAgZGlzcGxheU5hbWU6IFwiUmVzdWx0XCIsXG4gICAgICBkdXJhdGlvbkluU2Vjb25kczogcmVzdWx0c0R1cmF0aW9uXG4gICAgfSk7XG4gICAgXG4gICAgaWYgKChpKzEpICUgbnVtUm91bmRzQmVmb3JlU3VydmV5ID09PSAwKSB7IC8vIEFmdGVyIDUgdGFzayByb3VuZHMsIGFkZCBhIHN1cnZleSByb3VuZFxuICAgICAgY29uc3Qgc3VydmV5Um91bmQgPSBnYW1lLmFkZFJvdW5kKCk7XG5cbiAgICAgIGNvbnN0IHN1cnZleVN0YWdlcyA9IHN1cnZleVJvdW5kLmFkZFN0YWdlKHtcbiAgICAgICAgbmFtZTogXCJTdXJ2ZXlcIixcbiAgICAgICAgZGlzcGxheU5hbWU6IFwiU3VydmV5IFwiICsgc3VydmV5TnVtLFxuICAgICAgICBkdXJhdGlvbkluU2Vjb25kczogc3VydmV5RHVyYXRpb25cbiAgICAgIH0pXG4gICAgICBcbiAgICAgIHN1cnZleU51bSsrO1xuICAgIH1cblxuICB9KTtcblxuXG5cbiAgZnVuY3Rpb24gZ2V0U3ltYm9sc0ZvclBsYXllcnMoc3ltYm9sU2V0LCBhbnN3ZXIsIHNldFNpemUsIHRhc2tOYW1lLCBnYW1lLCBtYXhOdW1PdmVybGFwKSB7XG4gICAgICBsZXQgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xTZXQuZmlsdGVyKHN5bWJvbCA9PiBzeW1ib2wgIT09IGFuc3dlcik7XG4gICAgICBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHNodWZmbGUoc3ltYm9sc1dpdGhvdXRBbnN3ZXIpO1xuICAgICAgbGV0IG51bVBsYXllcnMgPSBnYW1lLnBsYXllcnMubGVuZ3RoO1xuICAgICAgbGV0IG51bU92ZXJsYXAgPSAwO1xuXG5cbiAgICAgIC8vIENyZWF0ZSBhIGRpY3Rpb25hcnkgdG8ga2VlcCB0cmFjayBvZiBob3cgbWFueSB0aW1lcyBzeW1ib2wgaGFzIGJlZW4gdXNlZFxuICAgICAgbGV0IHN5bWJvbEZyZXEgPSB7fVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzeW1ib2xzV2l0aG91dEFuc3dlci5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgc3ltYm9sID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXJbaV1cbiAgICAgICAgaWYgKCFzeW1ib2xGcmVxLmhhc093blByb3BlcnR5KHN5bWJvbCkpIHtcbiAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gPSBudW1QbGF5ZXJzIC0gMTsgLy8gVG90YWwgdGltZSBhIHN5bWJvbCBjYW4gYmUgdXNlZCBcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIGxldCBzeW1ib2xzUGlja2VkID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ltYm9sc1dpdGhvdXRBbnN3ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgc3ltYm9sID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXJbaV1cbiAgICAgICAgICBpZiAoc3ltYm9sc1BpY2tlZC5sZW5ndGggPCBzZXRTaXplIC0gMSkgeyAvLyBBZGQgc3ltYm9scyB1bnRpbCBzZXRTaXplIC0gMSBmb3IgYW5zd2VyXG4gICAgICAgICAgICBpZiAoc3ltYm9sRnJlcVtzeW1ib2xdIC0gMSA9PT0gMCkgeyAvLyBUaGlzIHN5bWJvbCB3aWxsIG92ZXJsYXBcbiAgICAgICAgICAgICAgICBpZiAobnVtT3ZlcmxhcCA8IG1heE51bU92ZXJsYXAgKSB7IC8vIE9ubHkgYWRkIGlmIGxlc3MgdGhhbiBtYXggb3ZlcmxhcFxuICAgICAgICAgICAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gLT0gMTtcbiAgICAgICAgICAgICAgICAgIG51bU92ZXJsYXAgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKGFuc3dlcik7IC8vIEFkZCB0aGUgYW5zd2VyXG4gICAgICAgIGZvciAodmFyIHN5bWJvbFRvUmVtb3ZlIG9mIHN5bWJvbHNQaWNrZWQpIHtcbiAgICAgICAgICBpZiAoc3ltYm9sRnJlcVtzeW1ib2xUb1JlbW92ZV0gPT09IDApIHsgLy8gSWYgc3ltYm9sIGhhcyBiZWVuIHBpY2tlZCBuLTEgcGxheWVycyB0aW1lcywgcmVtb3ZlIGl0IGZyb20gdGhlIHNldFxuICAgICAgICAgICAgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xzV2l0aG91dEFuc3dlci5maWx0ZXIoc3ltYm9sID0+IHN5bWJvbCAhPT0gc3ltYm9sVG9SZW1vdmUpO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3ltYm9sc1BpY2tlZCA9IHNodWZmbGUoc3ltYm9sc1BpY2tlZCk7XG5cbiAgICAgICAgcGxheWVyLnNldCh0YXNrTmFtZSwgc3ltYm9sc1BpY2tlZCk7XG4gICAgICB9KVxuXG5cbiAgfVxuXG4gIC8vIFNodWZmbGluZyBhcnJheXM6XG4gIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUwNTM2MDQ0L3N3YXBwaW5nLWFsbC1lbGVtZW50cy1vZi1hbi1hcnJheS1leGNlcHQtZm9yLWZpcnN0LWFuZC1sYXN0XG4gIGZ1bmN0aW9uIHNodWZmbGUoc3ltYm9sU2V0KSB7XG4gICAgZm9yIChpID0gc3ltYm9sU2V0Lmxlbmd0aCAtMSA7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcblxuICAgICAgW3N5bWJvbFNldFtpXSwgc3ltYm9sU2V0W2pdXSA9IFtzeW1ib2xTZXRbal0sIHN5bWJvbFNldFtpXV07XG4gICAgfVxuICAgIHJldHVybiBzeW1ib2xTZXQ7XG4gIH1cblxufSk7XG4iXX0=
