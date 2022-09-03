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
    player.set("lastActive", Date.now());
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

      game.set("checkForSimilarSymbol", true);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm1vbWVudCIsIlRpbWVTeW5jIiwib25HYW1lU3RhcnQiLCJjb25zb2xlIiwibG9nIiwicGxheWVycyIsImZvckVhY2giLCJwbGF5ZXIiLCJzZXQiLCJEYXRlIiwibm93IiwibmV0d29yayIsImdldCIsImFjdGl2ZUNoYXRzIiwibWFwIiwib3RoZXJOb2RlSWQiLCJwYWlyT2ZQbGF5ZXJzIiwicGFyc2VJbnQiLCJzb3J0IiwicDEiLCJwMiIsIm90aGVyUGxheWVyIiwiZmluZCIsInAiLCJjaGF0S2V5IiwicHVzaCIsImxlbmd0aCIsIm9uUm91bmRTdGFydCIsImFjdGl2ZVBsYXllcnMiLCJmaWx0ZXIiLCJ0cmVhdG1lbnQiLCJlbmRHYW1lSWZQbGF5ZXJJZGxlIiwiZXhpdCIsIm9uU3RhZ2VTdGFydCIsIm5hbWUiLCJkaXNwbGF5TmFtZSIsIm9uU3RhZ2VFbmQiLCJvblJvdW5kRW5kIiwib25HYW1lRW5kIiwib25TZXQiLCJ0YXJnZXQiLCJ0YXJnZXRUeXBlIiwia2V5IiwidmFsdWUiLCJwcmV2VmFsdWUiLCJhbGxTdWJtaXR0ZWQiLCJudW1QbGF5ZXJzU3VibWl0dGVkIiwiY29tcHV0ZVNjb3JlIiwic3VibWl0Iiwic3VjY2VzcyIsInBsYXllckFuc3dlcnMiLCJhbGxBbnN3ZXJzRXF1YWwiLCJhcnIiLCJldmVyeSIsInN1Ym1pc3Npb24iLCJwcmV2U2NvcmUiLCJleHBvcnQiLCJ0ZXN0VGFuZ3JhbXMiLCJhbGxTeW1ib2xzIiwiX2lkIiwidGFza05hbWUiLCJzeW1ib2xzIiwiYW5zd2VyIiwiZ2V0TmVpZ2hib3JzIiwic3RydWN0dXJlIiwibmVpZ2hib3JzIiwic3BsaXQiLCJwbGF5ZXJJbmRleCIsIm4iLCJjb25uZWN0aW9uIiwicmVwbGFjZSIsIlNldCIsImFjdGl2ZU5vZGVzIiwiYWxsTm9kZXMiLCJuZXdOZWlnaGJvcnMiLCJpZCIsInRlc3RTeW1ib2xzIiwiZ2FtZUluaXQiLCJwbGF5ZXJDb3VudCIsIm5ldHdvcmtTdHJ1Y3R1cmUiLCJudW1UYXNrUm91bmRzIiwibnVtU3VydmV5Um91bmRzIiwic2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCIsInVzZXJJbmFjdGl2aXR5RHVyYXRpb24iLCJ0YXNrRHVyYXRpb24iLCJkZWZhdWx0U2V0U2l6ZSIsInN1cnZleUR1cmF0aW9uIiwicmVzdWx0c0R1cmF0aW9uIiwibWF4TnVtT3ZlcmxhcCIsInN5bWJvbFNldCIsInNldFNpemUiLCJudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkiLCJjb2xvcnMiLCJzdXJ2ZXlOdW0iLCJzaHVmZmxlIiwiaSIsIl8iLCJ0aW1lcyIsImFkZFJvdW5kIiwidGFza1N0YWdlIiwiYWRkU3RhZ2UiLCJkdXJhdGlvbkluU2Vjb25kcyIsImdldFN5bWJvbHNGb3JQbGF5ZXJzIiwicmVzdWx0U3RhZ2UiLCJzdXJ2ZXlSb3VuZCIsInN1cnZleVN0YWdlcyIsInN5bWJvbHNXaXRob3V0QW5zd2VyIiwic3ltYm9sIiwibnVtUGxheWVycyIsIm51bU92ZXJsYXAiLCJzeW1ib2xGcmVxIiwiaGFzT3duUHJvcGVydHkiLCJzeW1ib2xzUGlja2VkIiwic3ltYm9sVG9SZW1vdmUiLCJqIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLFFBQUo7QUFBYUMsTUFBTSxDQUFDQyxJQUFQ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RCxNQUFWLEdBQWtCLENBQTNCLEVBQStCcUUsQ0FBQyxHQUFHLENBQW5DLEVBQXNDQSxDQUFDLEVBQXZDLEVBQTJDO0FBQ3pDLFlBQU1tQixDQUFDLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLE1BQUwsTUFBaUJ0QixDQUFDLEdBQUcsQ0FBckIsQ0FBWCxDQUFWO0FBRUEsT0FBQ04sU0FBUyxDQUFDTSxDQUFELENBQVYsRUFBZU4sU0FBUyxDQUFDeUIsQ0FBRCxDQUF4QixJQUErQixDQUFDekIsU0FBUyxDQUFDeUIsQ0FBRCxDQUFWLEVBQWV6QixTQUFTLENBQUNNLENBQUQsQ0FBeEIsQ0FBL0I7QUFDRDs7QUFDRCxXQUFPTixTQUFQO0FBQ0Q7QUFFRixDQXBKRCxFIiwiZmlsZSI6Ii9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRW1waXJpY2EgZnJvbSBcIm1ldGVvci9lbXBpcmljYTpjb3JlXCI7XG5cbi8vIFRoaXMgaXMgd2hlcmUgeW91IGFkZCBib3RzLCBsaWtlIEJvYjpcblxuRW1waXJpY2EuYm90KFwiYm9iXCIsIHtcbiAgLy8gLy8gTk9UIFNVUFBPUlRFRCBDYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBlYWNoIHN0YWdlIChhZnRlciBvblJvdW5kU3RhcnQvb25TdGFnZVN0YXJ0KVxuICAvLyBvblN0YWdlU3RhcnQoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMpIHt9LFxuXG4gIC8vIENhbGxlZCBkdXJpbmcgZWFjaCBzdGFnZSBhdCB0aWNrIGludGVydmFsICh+MXMgYXQgdGhlIG1vbWVudClcbiAgb25TdGFnZVRpY2soYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHNlY29uZHNSZW1haW5pbmcpIHt9XG5cbiAgLy8gLy8gTk9UIFNVUFBPUlRFRCBBIHBsYXllciBoYXMgY2hhbmdlZCBhIHZhbHVlXG4gIC8vIC8vIFRoaXMgbWlnaHQgaGFwcGVuIGEgbG90IVxuICAvLyBvblN0YWdlUGxheWVyQ2hhbmdlKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzLCBwbGF5ZXIpIHt9XG5cbiAgLy8gLy8gTk9UIFNVUFBPUlRFRCBDYWxsZWQgYXQgdGhlIGVuZCBvZiB0aGUgc3RhZ2UgKGFmdGVyIGl0IGZpbmlzaGVkLCBiZWZvcmUgb25TdGFnZUVuZC9vblJvdW5kRW5kIGlzIGNhbGxlZClcbiAgLy8gb25TdGFnZUVuZChib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycykge31cbn0pO1xuIiwiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuXG5pbXBvcnQgeyBnZXRGdWxseUNvbm5lY3RlZExheWVyIH0gZnJvbSBcIi4vdXRpbFwiO1xuaW1wb3J0IG1vbWVudCBmcm9tIFwibW9tZW50XCI7XG5pbXBvcnQgeyBUaW1lU3luYyB9IGZyb20gXCJtZXRlb3IvbWl6emFvOnRpbWVzeW5jXCI7XG5cblxuXG4vLyBvbkdhbWVTdGFydCBpcyB0cmlnZ2VyZWQgb3BuY2UgcGVyIGdhbWUgYmVmb3JlIHRoZSBnYW1lIHN0YXJ0cywgYW5kIGJlZm9yZVxuLy8gdGhlIGZpcnN0IG9uUm91bmRTdGFydC4gSXQgcmVjZWl2ZXMgdGhlIGdhbWUgYW5kIGxpc3Qgb2YgYWxsIHRoZSBwbGF5ZXJzIGluXG4vLyB0aGUgZ2FtZS5cbkVtcGlyaWNhLm9uR2FtZVN0YXJ0KGdhbWUgPT4ge1xuICBjb25zb2xlLmxvZyhcIkdhbWUgc3RhcnRlZFwiKTtcbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5zZXQoXCJpbmFjdGl2ZVwiLCBmYWxzZSk7XG4gICAgcGxheWVyLnNldChcImxhc3RBY3RpdmVcIiwgRGF0ZS5ub3coKSk7XG4gICAgY29uc3QgbmV0d29yayA9IHBsYXllci5nZXQoXCJuZWlnaGJvcnNcIik7XG4gICAgY29uc3QgYWN0aXZlQ2hhdHMgPSBbXTtcbiAgICBuZXR3b3JrLm1hcChvdGhlck5vZGVJZCA9PiB7XG4gICAgICB2YXIgcGFpck9mUGxheWVycyA9IFtwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpLCBwYXJzZUludChvdGhlck5vZGVJZCldO1xuICAgICAgcGFpck9mUGxheWVycy5zb3J0KChwMSxwMikgPT4gcDEgLSBwMik7XG4gICAgICBjb25zdCBvdGhlclBsYXllciA9IGdhbWUucGxheWVycy5maW5kKHAgPT4gcC5nZXQoXCJub2RlSWRcIikgPT09IHBhcnNlSW50KG90aGVyTm9kZUlkKSk7XG4gICAgICAvLyBjb25zdCBvdGhlclBsYXllcklkID0gb3RoZXJQbGF5ZXIuaWQ7XG4gICAgICBjb25zdCBjaGF0S2V5ID0gYCR7cGFpck9mUGxheWVyc1swXX0tJHtwYWlyT2ZQbGF5ZXJzWzFdfWA7XG4gICAgICBhY3RpdmVDaGF0cy5wdXNoKGNoYXRLZXkpO1xuICAgIH0pO1xuICAgIC8vIERlZmF1bHQgYWxsIGNoYXRzIHRvIGJlIG9wZW4gd2hlbiBnYW1lIHN0YXJ0c1xuICAgIHBsYXllci5zZXQoXCJhY3RpdmVDaGF0c1wiLCBhY3RpdmVDaGF0cyk7XG4gICAgY29uc29sZS5sb2cocGxheWVyLmdldChcImFjdGl2ZUNoYXRzXCIpKTtcbiAgfSk7XG4gIGdhbWUuc2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIsIGdhbWUucGxheWVycy5sZW5ndGgpO1xufSk7XG5cbi8vIG9uUm91bmRTdGFydCBpcyB0cmlnZ2VyZWQgYmVmb3JlIGVhY2ggcm91bmQgc3RhcnRzLCBhbmQgYmVmb3JlIG9uU3RhZ2VTdGFydC5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lU3RhcnQsIGFuZCB0aGUgcm91bmQgdGhhdCBpcyBzdGFydGluZy5cbkVtcGlyaWNhLm9uUm91bmRTdGFydCgoZ2FtZSwgcm91bmQpID0+IHtcbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAgIHBsYXllci5zZXQoXCJzeW1ib2xTZWxlY3RlZFwiLCBcIlwiKTtcbiAgfSk7XG4gIHJvdW5kLnNldChcInJlc3VsdFwiLCBmYWxzZSk7XG4gIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgMCk7XG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoYWN0aXZlUGxheWVycy5sZW5ndGggPCBnYW1lLmdldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiKSApIHsgLy8gU29tZW9uZSBsZWZ0IGluIHRoZSBtaWRkbGUgb2YgdGhlIHJvdW5kXG4gICAgaWYgKGdhbWUudHJlYXRtZW50LmVuZEdhbWVJZlBsYXllcklkbGUpIHtcbiAgICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICBwLmV4aXQoXCJzb21lb25lSW5hY3RpdmVcIik7XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpOyAvLyBVcGRhdGVzIHRoZSBuZWlnaGJvcnMgdG8gYmUgZnVsbHkgY29ubmVjdGVkXG4gICAgICBnYW1lLnNldChcImNoZWNrRm9yU2ltaWxhclN5bWJvbFwiLCB0cnVlKTtcbiAgICB9XG4gIFxuICB9XG4gIGdhbWUuc2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIsIGFjdGl2ZVBsYXllcnMubGVuZ3RoKTtcblxuICBjb25zb2xlLmxvZyhcIlJvdW5kIFN0YXJ0ZWRcIik7XG5cbn0pO1xuXG4vLyBvblN0YWdlU3RhcnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSBlYWNoIHN0YWdlIHN0YXJ0cy5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25Sb3VuZFN0YXJ0LCBhbmQgdGhlIHN0YWdlIHRoYXQgaXMgc3RhcnRpbmcuXG5FbXBpcmljYS5vblN0YWdlU3RhcnQoKGdhbWUsIHJvdW5kLCBzdGFnZSkgPT4ge1xuICBjb25zb2xlLmxvZyhcIlN0YWdlIFN0YXJ0ZWRcIilcbiAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG4gIGlmIChzdGFnZS5uYW1lID09PSBcIlRhc2tcIikge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyggYFN5bWJvbHMgOiAke3BsYXllci5nZXQoYCR7c3RhZ2UuZGlzcGxheU5hbWV9YCl9YCk7XG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coYEFuc3dlcjogJHtzdGFnZS5nZXQoXCJhbnN3ZXJcIil9YCk7XG4gIH1cbiAgaWYgKHN0YWdlLm5hbWUgPT09IFwiU3VydmV5XCIpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgcGxheWVyLnNldChcInN1cnZleU51bWJlclwiICwgMSlcbiAgICB9KTtcbiAgfVxuICAvLyBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgcGxheWVyLnNldChcInN1Ym1pdHRlZFwiLCBmYWxzZSk7XG4gIC8vIH0pO1xuICAvLyBzdGFnZS5zZXQoXCJzaG93UmVzdWx0c1wiLCBmYWxzZSk7XG4gIC8vIHN0YWdlLnNldChcInJlc3VsdHNTaG93blwiLCBmYWxzZSk7XG5cbn0pO1xuXG4vLyBvblN0YWdlRW5kIGlzIHRyaWdnZXJlZCBhZnRlciBlYWNoIHN0YWdlLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvblJvdW5kRW5kLCBhbmQgdGhlIHN0YWdlIHRoYXQganVzdCBlbmRlZC5cbkVtcGlyaWNhLm9uU3RhZ2VFbmQoKGdhbWUsIHJvdW5kLCBzdGFnZSkgPT57XG4gIGNvbnNvbGUubG9nKFwiU3RhZ2UgRW5kZWRcIilcbiAgXG59KTtcblxuLy8gb25Sb3VuZEVuZCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgZWFjaCByb3VuZC5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lRW5kLCBhbmQgdGhlIHJvdW5kIHRoYXQganVzdCBlbmRlZC5cbkVtcGlyaWNhLm9uUm91bmRFbmQoKGdhbWUsIHJvdW5kKSA9PiB7XG4gIC8vIGdhbWUucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gIC8vICAgY29uc3QgdmFsdWUgPSBwbGF5ZXIucm91bmQuZ2V0KFwidmFsdWVcIikgfHwgMDtcbiAgLy8gICBjb25zdCBwcmV2U2NvcmUgPSBwbGF5ZXIuZ2V0KFwic2NvcmVcIikgfHwgMDtcbiAgLy8gICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgcHJldlNjb3JlICsgdmFsdWUpO1xuICAvLyB9KTtcblxufSk7XG5cbi8vIG9uR2FtZUVuZCBpcyB0cmlnZ2VyZWQgd2hlbiB0aGUgZ2FtZSBlbmRzLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvbkdhbWVTdGFydC5cbkVtcGlyaWNhLm9uR2FtZUVuZChnYW1lID0+IHt9KTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PiBvblNldCwgb25BcHBlbmQgYW5kIG9uQ2hhbmdlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIG9uU2V0LCBvbkFwcGVuZCBhbmQgb25DaGFuZ2UgYXJlIGNhbGxlZCBvbiBldmVyeSBzaW5nbGUgdXBkYXRlIG1hZGUgYnkgYWxsXG4vLyBwbGF5ZXJzIGluIGVhY2ggZ2FtZSwgc28gdGhleSBjYW4gcmFwaWRseSBiZWNvbWUgcXVpdGUgZXhwZW5zaXZlIGFuZCBoYXZlXG4vLyB0aGUgcG90ZW50aWFsIHRvIHNsb3cgZG93biB0aGUgYXBwLiBVc2Ugd2lzZWx5LlxuLy9cbi8vIEl0IGlzIHZlcnkgdXNlZnVsIHRvIGJlIGFibGUgdG8gcmVhY3QgdG8gZWFjaCB1cGRhdGUgYSB1c2VyIG1ha2VzLiBUcnlcbi8vIG5vbnRoZWxlc3MgdG8gbGltaXQgdGhlIGFtb3VudCBvZiBjb21wdXRhdGlvbnMgYW5kIGRhdGFiYXNlIHNhdmVzICguc2V0KVxuLy8gZG9uZSBpbiB0aGVzZSBjYWxsYmFja3MuIFlvdSBjYW4gYWxzbyB0cnkgdG8gbGltaXQgdGhlIGFtb3VudCBvZiBjYWxscyB0b1xuLy8gc2V0KCkgYW5kIGFwcGVuZCgpIHlvdSBtYWtlIChhdm9pZCBjYWxsaW5nIHRoZW0gb24gYSBjb250aW51b3VzIGRyYWcgb2YgYVxuLy8gc2xpZGVyIGZvciBleGFtcGxlKSBhbmQgaW5zaWRlIHRoZXNlIGNhbGxiYWNrcyB1c2UgdGhlIGBrZXlgIGFyZ3VtZW50IGF0IHRoZVxuLy8gdmVyeSBiZWdpbm5pbmcgb2YgdGhlIGNhbGxiYWNrIHRvIGZpbHRlciBvdXQgd2hpY2gga2V5cyB5b3VyIG5lZWQgdG8gcnVuXG4vLyBsb2dpYyBhZ2FpbnN0LlxuLy9cbi8vIElmIHlvdSBhcmUgbm90IHVzaW5nIHRoZXNlIGNhbGxiYWNrcywgY29tbWVudCB0aGVtIG91dCBzbyB0aGUgc3lzdGVtIGRvZXNcbi8vIG5vdCBjYWxsIHRoZW0gZm9yIG5vdGhpbmcuXG5cbi8vIC8vIG9uU2V0IGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgLnNldCgpIG1ldGhvZFxuLy8gLy8gb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3IgcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25TZXQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gKSA9PiB7XG4vLyAgIC8vIC8vIEV4YW1wbGUgZmlsdGVyaW5nXG4vLyAgIC8vIGlmIChrZXkgIT09IFwidmFsdWVcIikge1xuLy8gICAvLyAgIHJldHVybjtcbi8vICAgLy8gfVxuLy8gfSk7XG5cbkVtcGlyaWNhLm9uU2V0KChcbiAgZ2FtZSxcbiAgcm91bmQsXG4gIHN0YWdlLFxuICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4gIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4gIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbiAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbikgPT4ge1xuICBjb25zdCBwbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzO1xuICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cbiAgLy8gU29tZSBwbGF5ZXIgZGVjaWRlcyB0byByZWNvbnNpZGVyIHRoZWlyIGFuc3dlclxuICBjb25zb2xlLmxvZyhcImtleVwiLCBrZXkpO1xuICBpZiAoa2V5ID09PSBcInN1Ym1pdHRlZFwiKSB7IFxuICAgIC8vIENoZWNrcyBpZiBldmVyeW9uZSBoYXMgc3VibWl0dGVkIHRoZWlyIGFuc3dlciBhbmQgaWYgc28sIHN1Ym1pdCB0aGUgc3RhZ2VcbiAgICBsZXQgYWxsU3VibWl0dGVkID0gdHJ1ZTtcbiAgICBsZXQgbnVtUGxheWVyc1N1Ym1pdHRlZCA9IDA7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIGlmIChwbGF5ZXIuZ2V0KFwic3VibWl0dGVkXCIpKSB7XG4gICAgICAgIG51bVBsYXllcnNTdWJtaXR0ZWQgKz0gMTtcbiAgICAgIH1cbiAgICAgIGFsbFN1Ym1pdHRlZCA9IHBsYXllci5nZXQoXCJzdWJtaXR0ZWRcIikgJiYgYWxsU3VibWl0dGVkO1xuICAgIH0pXG4gICAgcm91bmQuc2V0KFwibnVtUGxheWVyc1N1Ym1pdHRlZFwiLCBudW1QbGF5ZXJzU3VibWl0dGVkKTtcbiAgICBpZiAoYWxsU3VibWl0dGVkKSB7XG4gICAgICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJUYXNrXCIpIHtcbiAgICAgICAgY29tcHV0ZVNjb3JlKGFjdGl2ZVBsYXllcnMsIGdhbWUsIHN0YWdlLCByb3VuZCk7XG4gICAgICB9XG4gICAgICAvLyBOZWVkIHRvIHN1Ym1pdCBmb3Igc3VibWl0IHRoZSBzdGFnZSBmb3IgZXZlcnkgcGxheWVyXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgICAgIH0pXG4gICAgfVxuICAvLyAgIGlmIChzdGFnZS5nZXQoXCJyZXN1bHRzU2hvd25cIikpIHtcbiAgLy8gICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgLy8gICAgIH0pXG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gaWYgKHRhcmdldFR5cGUgPT09IFwic3RhZ2VcIiAmJiBrZXkgPT09IFwicmVzdWx0c1Nob3duXCIpIHtcbiAgLy8gICBpZiAoc3RhZ2UuZ2V0KFwicmVzdWx0c1Nob3duXCIpKSB7XG4gIC8vICAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4gIC8vICAgICB9KVxuICAvLyAgIH1cbiAgfVxuXG4gIC8vIGVsc2UgaWYgKGtleSA9PT0gXCJpbmFjdGl2ZVwiKSB7XG4gICAgLy8gZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgLy8gfVxuXG4gIHJldHVybjtcblxufSk7XG5cbmZ1bmN0aW9uIGNvbXB1dGVTY29yZShhY3RpdmVQbGF5ZXJzLCBnYW1lLCBzdGFnZSwgcm91bmQpIHtcbiAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuICBjb25zb2xlLmxvZyhcIkNPUlJFQ1QgQU5TV0VSOlwiKVxuICBjb25zb2xlLmxvZyhzdGFnZS5nZXQoXCJhbnN3ZXJcIikpO1xuICBjb25zb2xlLmxvZyhcIlBsYXllcnMgZ3Vlc3NlZDpcIilcblxuICBsZXQgcGxheWVyQW5zd2VycyA9IFtdO1xuICBjb25zdCBhbGxBbnN3ZXJzRXF1YWwgPSBhcnIgPT4gYXJyLmV2ZXJ5KCB2ID0+IHYgPT09IGFyclswXSApIC8vRnVuYyB0byBjaGVjayBpZiBhbGwgcGxheWVyIGFuc3dlcnMgYXJlIGVxdWFsXG5cbiAgYWN0aXZlUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgY29uc3Qgc3VibWlzc2lvbiA9IHBsYXllci5nZXQoXCJzeW1ib2xTZWxlY3RlZFwiKTtcbiAgICBjb25zb2xlLmxvZyhzdWJtaXNzaW9uKTtcbiAgICBpZiAoZ2FtZS5nZXQoXCJjaGVja0ZvclNpbWlsYXJTeW1ib2xcIikpIHtcbiAgICAgIHBsYXllckFuc3dlcnMucHVzaChzdWJtaXNzaW9uKTtcbiAgICB9XG4gICAgaWYgKHN1Ym1pc3Npb24gIT09IHN0YWdlLmdldChcImFuc3dlclwiKSkge1xuICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgIH1cbiAgfSlcblxuICBpZiAoZ2FtZS5nZXQoXCJjaGVja0ZvclNpbWlsYXJTeW1ib2xcIikpIHtcbiAgICBpZiAoYWxsQW5zd2Vyc0VxdWFsKHBsYXllckFuc3dlcnMpKSB7XG4gICAgICBzdWNjZXNzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByb3VuZC5zZXQoXCJyZXN1bHRcIiwgc3VjY2Vzcyk7XG4gIGlmIChzdWNjZXNzKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICBjb25zdCBwcmV2U2NvcmUgPSBwbGF5ZXIuZ2V0KFwic2NvcmVcIikgfHwgMDtcbiAgICAgIHBsYXllci5zZXQoXCJzY29yZVwiLCBwcmV2U2NvcmUgKyAxKTtcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKFwiIEFsbCBwbGF5ZXJzIGdvdCBpdCBjb3JyZWN0bHlcIik7XG4gIH0gXG59XG5cbi8vIC8vIG9uQXBwZW5kIGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgYC5hcHBlbmQoKWAgbWV0aG9kXG4vLyAvLyBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvciBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vbkFwcGVuZCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4vLyApID0+IHtcbi8vICAgLy8gTm90ZTogYHZhbHVlYCBpcyB0aGUgc2luZ2xlIGxhc3QgdmFsdWUgKGUuZyAwLjIpLCB3aGlsZSBgcHJldlZhbHVlYCB3aWxsXG4vLyAgIC8vICAgICAgIGJlIGFuIGFycmF5IG9mIHRoZSBwcmV2aXNvdXMgdmFsdWVkIChlLmcuIFswLjMsIDAuNCwgMC42NV0pLlxuLy8gfSk7XG5cblxuLy8gLy8gb25DaGFuZ2UgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSBgLnNldCgpYCBvciB0aGVcbi8vIC8vIGAuYXBwZW5kKClgIG1ldGhvZCBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvclxuLy8gLy8gcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25DaGFuZ2UoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSwgLy8gUHJldmlvdXMgdmFsdWVcbi8vICAgaXNBcHBlbmQgLy8gVHJ1ZSBpZiB0aGUgY2hhbmdlIHdhcyBhbiBhcHBlbmQsIGZhbHNlIGlmIGl0IHdhcyBhIHNldFxuLy8gKSA9PiB7XG4vLyAgIC8vIGBvbkNoYW5nZWAgaXMgdXNlZnVsIHRvIHJ1biBzZXJ2ZXItc2lkZSBsb2dpYyBmb3IgYW55IHVzZXIgaW50ZXJhY3Rpb24uXG4vLyAgIC8vIE5vdGUgdGhlIGV4dHJhIGlzQXBwZW5kIGJvb2xlYW4gdGhhdCB3aWxsIGFsbG93IHRvIGRpZmZlcmVuY2lhdGUgc2V0cyBhbmRcbi8vICAgLy8gYXBwZW5kcy5cbi8vICAgIEdhbWUuc2V0KFwibGFzdENoYW5nZUF0XCIsIG5ldyBEYXRlKCkudG9TdHJpbmcoKSlcbi8vIH0pO1xuXG4vLyAvLyBvblN1Ym1pdCBpcyBjYWxsZWQgd2hlbiB0aGUgcGxheWVyIHN1Ym1pdHMgYSBzdGFnZS5cbi8vIEVtcGlyaWNhLm9uU3VibWl0KChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIgLy8gUGxheWVyIHdobyBzdWJtaXR0ZWRcbi8vICkgPT4ge1xuLy8gfSk7XG4iLCJjb25zdCBhbGxTeW1ib2xzID0gW1widDFcIiwgXCJ0MlwiLCBcInQzXCIsIFwidDRcIiwgXCJ0NVwiLCBcInQ2XCIsIFwidDdcIixcInQ4XCIsXCJ0OVwiLFwidDEwXCIsXCJ0MTFcIixcInQxMlwiXTtcblxuLy8gbiA9IG51bWJlciBvZiBwZW9wbGUgLCBwID0gbnVtYmVyIG9mIHN5bWJvbHNcbi8vIChuLTEpKnAgKyAxXG4vLyBpLmUuIG4gPSAzLCBwID0gMyA6IDdcblxuZXhwb3J0IGNvbnN0IHRlc3RUYW5ncmFtcyA9IFtcbiAge1xuICAgIF9pZDogXCIwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAyXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAzXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDNcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIzXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDRcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI0XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA1XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDVcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI1XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA2XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDZcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI2XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA3XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDdcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI3XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA4XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDhcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI4XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA5XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDlcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI5XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMFwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjExXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMlwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxM1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTNcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDE0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxNFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTVcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0M1wiLFxuICB9LFxuXG5dO1xuXG5cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXROZWlnaGJvcnMoc3RydWN0dXJlLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBsZXQgbmV0d29yayA9IHN0cnVjdHVyZS5zcGxpdChcIixcIik7XG4gICAgY29uc3QgcGxheWVySW5kZXggPSBwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpO1xuXG4gICAgbmV0d29yay5mb3JFYWNoKChuKSA9PiB7XG4gICAgICBjb25zdCBjb25uZWN0aW9uID0gbi5zcGxpdChcIi1cIik7XG5cbiAgICAgIGlmIChwbGF5ZXJJbmRleCA9PT0gcGFyc2VJbnQoY29ubmVjdGlvblswXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goY29ubmVjdGlvblsxXS5yZXBsYWNlKC9cXHMvZywgJycpKTtcbiAgICAgIH0gZWxzZSBpZiAocGxheWVySW5kZXggPT09IHBhcnNlSW50KGNvbm5lY3Rpb25bMV0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGNvbm5lY3Rpb25bMF0ucmVwbGFjZSgvXFxzL2csICcnKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIHJldHVybiBbLi4uIG5ldyBTZXQobmVpZ2hib3JzKV07XG4gIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSkge1xuICAgIGNvbnN0IGFjdGl2ZU5vZGVzID0gW107XG4gICAgY29uc3QgYWxsTm9kZXMgPSBbXTtcbiAgICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuXG4gICAgLy8gYWN0aXZlUGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgLy8gICBhY3RpdmVOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgIC8vIH0pXG5cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgLy8gaWYgKHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0dmVcIikpIHtcbiAgICAgIGlmICghcC5nZXQoXCJpbmFjdHZlXCIpKSB7XG5cbiAgICAgICAgYWN0aXZlTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICAgIH1cbiAgICAgIGFsbE5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgfSlcblxuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAvLyBPbmx5IHNob3cgYWN0aXZlIHBlb3BsZVxuICAgICAgLy8gY29uc3QgbmV3TmVpZ2hib3JzID0gYWN0aXZlTm9kZXMuZmlsdGVyKGlkID0+IHBhcnNlSW50KGlkKSAhPT0gcC5nZXQoXCJub2RlSWRcIikpXG4gICAgICAvLyBwLnNldChcIm5laWdoYm9yc1wiLCBuZXdOZWlnaGJvcnMpO1xuXG4gICAgICAvLyBTaG93IGV2ZXJ5b25lLCBtYXJrIG9mZmxpbmUgcGVvcGxlIGFzIG9mZmxpbmVcbiAgICAgIGNvbnN0IG5ld05laWdoYm9ycyA9IGFsbE5vZGVzLmZpbHRlcihpZCA9PiBwYXJzZUludChpZCkgIT09IHAuZ2V0KFwibm9kZUlkXCIpKVxuICAgICAgcC5zZXQoXCJuZWlnaGJvcnNcIiwgbmV3TmVpZ2hib3JzKTtcbiAgICB9KVxufSIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcbmltcG9ydCBcIi4vYm90cy5qc1wiO1xuaW1wb3J0IFwiLi9jYWxsYmFja3MuanNcIjtcblxuaW1wb3J0IHsgdGVzdFN5bWJvbHMsIHRlc3RUYW5ncmFtcyB9IGZyb20gXCIuL2NvbnN0YW50c1wiOyBcbmltcG9ydCB7IGdldE5laWdoYm9ycywgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcblxuLy8gZ2FtZUluaXQgaXMgd2hlcmUgdGhlIHN0cnVjdHVyZSBvZiBhIGdhbWUgaXMgZGVmaW5lZC5cbi8vIEp1c3QgYmVmb3JlIGV2ZXJ5IGdhbWUgc3RhcnRzLCBvbmNlIGFsbCB0aGUgcGxheWVycyBuZWVkZWQgYXJlIHJlYWR5LCB0aGlzXG4vLyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgdHJlYXRtZW50IGFuZCB0aGUgbGlzdCBvZiBwbGF5ZXJzLlxuLy8gWW91IG11c3QgdGhlbiBhZGQgcm91bmRzIGFuZCBzdGFnZXMgdG8gdGhlIGdhbWUsIGRlcGVuZGluZyBvbiB0aGUgdHJlYXRtZW50XG4vLyBhbmQgdGhlIHBsYXllcnMuIFlvdSBjYW4gYWxzbyBnZXQvc2V0IGluaXRpYWwgdmFsdWVzIG9uIHlvdXIgZ2FtZSwgcGxheWVycyxcbi8vIHJvdW5kcyBhbmQgc3RhZ2VzICh3aXRoIGdldC9zZXQgbWV0aG9kcyksIHRoYXQgd2lsbCBiZSBhYmxlIHRvIHVzZSBsYXRlciBpblxuLy8gdGhlIGdhbWUuXG5FbXBpcmljYS5nYW1lSW5pdChnYW1lID0+IHtcbiAgY29uc3Qge1xuICAgIHRyZWF0bWVudDoge1xuICAgICAgcGxheWVyQ291bnQsXG4gICAgICBuZXR3b3JrU3RydWN0dXJlLFxuICAgICAgbnVtVGFza1JvdW5kcyxcbiAgICAgIG51bVN1cnZleVJvdW5kcyxcbiAgICAgIHNldFNpemVCYXNlZE9uUGxheWVyQ291bnQsXG4gICAgICB1c2VySW5hY3Rpdml0eUR1cmF0aW9uLFxuICAgICAgdGFza0R1cmF0aW9uLFxuICAgICAgZGVmYXVsdFNldFNpemUsXG4gICAgICBzdXJ2ZXlEdXJhdGlvbixcbiAgICAgIHJlc3VsdHNEdXJhdGlvbixcbiAgICAgIG1heE51bU92ZXJsYXAsXG4gICAgfSxcbiAgfSA9IGdhbWU7XG5cblxuICBjb25zdCBzeW1ib2xTZXQgPSB0ZXN0VGFuZ3JhbXM7XG4gIGNvbnN0IHNldFNpemUgPSBzZXRTaXplQmFzZWRPblBsYXllckNvdW50ID8gcGxheWVyQ291bnQgKyAxIDogZGVmYXVsdFNldFNpemU7IC8vVE9ETzogY2FuIGNoYW5nZSBkZWZhdWx0IHZhbHVlIGluIHNldHRpbmdzXG4gIGNvbnN0IG51bVJvdW5kc0JlZm9yZVN1cnZleSA9IG51bVRhc2tSb3VuZHMvbnVtU3VydmV5Um91bmRzO1xuXG4gIGxldCBjb2xvcnMgPSBbXCJHcmVlblwiLCBcIlJlZFwiLCBcIlllbGxvd1wiLCBcIkJsdWVcIiwgXCJQdXJwbGVcIiwgXCJXaGl0ZVwiLCBcIkJsYWNrXCJdXG4gIGxldCBzdXJ2ZXlOdW0gPSAxXG4gIGNvbG9ycyA9IHNodWZmbGUoY29sb3JzKTtcblxuICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyLCBpKSA9PiB7XG4gICAgcGxheWVyLnNldChcImF2YXRhclwiLCBgL2F2YXRhcnMvamRlbnRpY29uLyR7cGxheWVyLl9pZH1gKTtcbiAgICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMCk7XG5cbiAgICAvLyBHaXZlIGVhY2ggcGxheWVyIGEgbm9kZUlkIGJhc2VkIG9uIHRoZWlyIHBvc2l0aW9uIChpbmRleGVkIGF0IDEpXG4gICAgcGxheWVyLnNldChcIm5vZGVJZFwiLCBpICsgMSk7XG4gICAgcGxheWVyLnNldChcIm5hbWVcIiwgcGxheWVyLmlkKTtcbiAgICBwbGF5ZXIuc2V0KFwiYW5vbnltb3VzTmFtZVwiLCBjb2xvcnNbaV0pXG4gIH0pO1xuXG5cbiAgaWYgKGdhbWUucGxheWVycy5sZW5ndGggPCBnYW1lLnRyZWF0bWVudC5wbGF5ZXJDb3VudCkgeyAvLyBpZiBub3QgYSBmdWxsIGdhbWUsIGRlZmF1bHQgdG8gZnVsbHkgY29ubmVjdGVkIGxheWVyXG4gICAgZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgY29uc29sZS5sb2cocC5nZXQoXCJuZWlnaGJvcnNcIikpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBwLnNldChcIm5laWdoYm9yc1wiLCBnZXROZWlnaGJvcnMobmV0d29ya1N0cnVjdHVyZSwgcCkpO1xuICAgICAgY29uc29sZS5sb2cocC5nZXQoXCJuZWlnaGJvcnNcIikpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRm9yIGVhY2ggcm91bmQsIGFkZCBhbGwgdGhlIHN5bWJvbHMsIHJhbmRvbWx5IHNlbGVjdCBhIGNvcnJlY3QgYW5zd2VyIGFuZFxuICAvLyBDb25zdHJhaW50czogTXVzdCBlbnN1cmUgdGhhdCBldmVyeW9uZSBoYXMgb25seSBvbmUgc3ltYm9sIGluIGNvbW1vblxuICBfLnRpbWVzKCBudW1UYXNrUm91bmRzLCBpID0+IHtcbiAgICBjb25zdCByb3VuZCA9IGdhbWUuYWRkUm91bmQoKTtcblxuICAgIGNvbnN0IHtzeW1ib2xzLCB0YXNrTmFtZSwgYW5zd2VyfSA9IHN5bWJvbFNldFtpXTtcblxuICAgIGNvbnN0IHRhc2tTdGFnZSA9IHJvdW5kLmFkZFN0YWdlKHtcbiAgICAgIG5hbWU6IFwiVGFza1wiLFxuICAgICAgZGlzcGxheU5hbWU6IHRhc2tOYW1lLFxuICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICBkdXJhdGlvbkluU2Vjb25kczogdGFza0R1cmF0aW9uXG4gICAgfSk7XG4gICAgdGFza1N0YWdlLnNldChcInRhc2tcIiwgc3ltYm9sU2V0W2ldKTtcbiAgICBnZXRTeW1ib2xzRm9yUGxheWVycyhzeW1ib2xzLCBhbnN3ZXIsIHNldFNpemUsIHRhc2tOYW1lLCBnYW1lLCBtYXhOdW1PdmVybGFwKVxuICAgIHRhc2tTdGFnZS5zZXQoXCJhbnN3ZXJcIiwgc3ltYm9sU2V0W2ldLmFuc3dlcilcblxuICAgIGNvbnN0IHJlc3VsdFN0YWdlID0gcm91bmQuYWRkU3RhZ2Uoe1xuICAgICAgbmFtZTogXCJSZXN1bHRcIixcbiAgICAgIGRpc3BsYXlOYW1lOiBcIlJlc3VsdFwiLFxuICAgICAgZHVyYXRpb25JblNlY29uZHM6IHJlc3VsdHNEdXJhdGlvblxuICAgIH0pO1xuICAgIFxuICAgIGlmICgoaSsxKSAlIG51bVJvdW5kc0JlZm9yZVN1cnZleSA9PT0gMCkgeyAvLyBBZnRlciA1IHRhc2sgcm91bmRzLCBhZGQgYSBzdXJ2ZXkgcm91bmRcbiAgICAgIGNvbnN0IHN1cnZleVJvdW5kID0gZ2FtZS5hZGRSb3VuZCgpO1xuXG4gICAgICBjb25zdCBzdXJ2ZXlTdGFnZXMgPSBzdXJ2ZXlSb3VuZC5hZGRTdGFnZSh7XG4gICAgICAgIG5hbWU6IFwiU3VydmV5XCIsXG4gICAgICAgIGRpc3BsYXlOYW1lOiBcIlN1cnZleSBcIiArIHN1cnZleU51bSxcbiAgICAgICAgZHVyYXRpb25JblNlY29uZHM6IHN1cnZleUR1cmF0aW9uXG4gICAgICB9KVxuICAgICAgXG4gICAgICBzdXJ2ZXlOdW0rKztcbiAgICB9XG5cbiAgfSk7XG5cblxuXG4gIGZ1bmN0aW9uIGdldFN5bWJvbHNGb3JQbGF5ZXJzKHN5bWJvbFNldCwgYW5zd2VyLCBzZXRTaXplLCB0YXNrTmFtZSwgZ2FtZSwgbWF4TnVtT3ZlcmxhcCkge1xuICAgICAgbGV0IHN5bWJvbHNXaXRob3V0QW5zd2VyID0gc3ltYm9sU2V0LmZpbHRlcihzeW1ib2wgPT4gc3ltYm9sICE9PSBhbnN3ZXIpO1xuICAgICAgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzaHVmZmxlKHN5bWJvbHNXaXRob3V0QW5zd2VyKTtcbiAgICAgIGxldCBudW1QbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmxlbmd0aDtcbiAgICAgIGxldCBudW1PdmVybGFwID0gMDtcblxuXG4gICAgICAvLyBDcmVhdGUgYSBkaWN0aW9uYXJ5IHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgdGltZXMgc3ltYm9sIGhhcyBiZWVuIHVzZWRcbiAgICAgIGxldCBzeW1ib2xGcmVxID0ge31cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ltYm9sc1dpdGhvdXRBbnN3ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHN5bWJvbCA9IHN5bWJvbHNXaXRob3V0QW5zd2VyW2ldXG4gICAgICAgIGlmICghc3ltYm9sRnJlcS5oYXNPd25Qcm9wZXJ0eShzeW1ib2wpKSB7XG4gICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdID0gbnVtUGxheWVycyAtIDE7IC8vIFRvdGFsIHRpbWUgYSBzeW1ib2wgY2FuIGJlIHVzZWQgXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgICBsZXQgc3ltYm9sc1BpY2tlZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN5bWJvbHNXaXRob3V0QW5zd2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHN5bWJvbCA9IHN5bWJvbHNXaXRob3V0QW5zd2VyW2ldXG4gICAgICAgICAgaWYgKHN5bWJvbHNQaWNrZWQubGVuZ3RoIDwgc2V0U2l6ZSAtIDEpIHsgLy8gQWRkIHN5bWJvbHMgdW50aWwgc2V0U2l6ZSAtIDEgZm9yIGFuc3dlclxuICAgICAgICAgICAgaWYgKHN5bWJvbEZyZXFbc3ltYm9sXSAtIDEgPT09IDApIHsgLy8gVGhpcyBzeW1ib2wgd2lsbCBvdmVybGFwXG4gICAgICAgICAgICAgICAgaWYgKG51bU92ZXJsYXAgPCBtYXhOdW1PdmVybGFwICkgeyAvLyBPbmx5IGFkZCBpZiBsZXNzIHRoYW4gbWF4IG92ZXJsYXBcbiAgICAgICAgICAgICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdIC09IDE7XG4gICAgICAgICAgICAgICAgICBudW1PdmVybGFwICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goc3ltYm9sKTtcbiAgICAgICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdIC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChhbnN3ZXIpOyAvLyBBZGQgdGhlIGFuc3dlclxuICAgICAgICBmb3IgKHZhciBzeW1ib2xUb1JlbW92ZSBvZiBzeW1ib2xzUGlja2VkKSB7XG4gICAgICAgICAgaWYgKHN5bWJvbEZyZXFbc3ltYm9sVG9SZW1vdmVdID09PSAwKSB7IC8vIElmIHN5bWJvbCBoYXMgYmVlbiBwaWNrZWQgbi0xIHBsYXllcnMgdGltZXMsIHJlbW92ZSBpdCBmcm9tIHRoZSBzZXRcbiAgICAgICAgICAgIHN5bWJvbHNXaXRob3V0QW5zd2VyID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXIuZmlsdGVyKHN5bWJvbCA9PiBzeW1ib2wgIT09IHN5bWJvbFRvUmVtb3ZlKTtcblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN5bWJvbHNQaWNrZWQgPSBzaHVmZmxlKHN5bWJvbHNQaWNrZWQpO1xuXG4gICAgICAgIHBsYXllci5zZXQodGFza05hbWUsIHN5bWJvbHNQaWNrZWQpO1xuICAgICAgfSlcblxuXG4gIH1cblxuICAvLyBTaHVmZmxpbmcgYXJyYXlzOlxuICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MDUzNjA0NC9zd2FwcGluZy1hbGwtZWxlbWVudHMtb2YtYW4tYXJyYXktZXhjZXB0LWZvci1maXJzdC1hbmQtbGFzdFxuICBmdW5jdGlvbiBzaHVmZmxlKHN5bWJvbFNldCkge1xuICAgIGZvciAoaSA9IHN5bWJvbFNldC5sZW5ndGggLTEgOyBpID4gMDsgaS0tKSB7XG4gICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG5cbiAgICAgIFtzeW1ib2xTZXRbaV0sIHN5bWJvbFNldFtqXV0gPSBbc3ltYm9sU2V0W2pdLCBzeW1ib2xTZXRbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gc3ltYm9sU2V0O1xuICB9XG5cbn0pO1xuIl19
