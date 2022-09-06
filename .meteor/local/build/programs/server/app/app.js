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
    console.log(player.get("activeChats"));
  });
  game.set("previousNumActivePlayers", game.players.length);
  game.set("gameStartTime", moment(Date.now()));
  game.set("gameEndTime", moment(Date.now()).add(2, 'm'));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm1vbWVudCIsIlRpbWVTeW5jIiwib25HYW1lU3RhcnQiLCJjb25zb2xlIiwibG9nIiwicGxheWVycyIsImZvckVhY2giLCJwbGF5ZXIiLCJzZXQiLCJEYXRlIiwibm93IiwibmV0d29yayIsImdldCIsImFjdGl2ZUNoYXRzIiwibWFwIiwib3RoZXJOb2RlSWQiLCJwYWlyT2ZQbGF5ZXJzIiwicGFyc2VJbnQiLCJzb3J0IiwicDEiLCJwMiIsIm90aGVyUGxheWVyIiwiZmluZCIsInAiLCJjaGF0S2V5IiwicHVzaCIsImxlbmd0aCIsImFkZCIsIm9uUm91bmRTdGFydCIsImFjdGl2ZVBsYXllcnMiLCJmaWx0ZXIiLCJ0cmVhdG1lbnQiLCJlbmRHYW1lSWZQbGF5ZXJJZGxlIiwiZXhpdCIsIm9uU3RhZ2VTdGFydCIsIm5hbWUiLCJkaXNwbGF5TmFtZSIsIm9uU3RhZ2VFbmQiLCJvblJvdW5kRW5kIiwib25HYW1lRW5kIiwib25TZXQiLCJ0YXJnZXQiLCJ0YXJnZXRUeXBlIiwia2V5IiwidmFsdWUiLCJwcmV2VmFsdWUiLCJhbGxTdWJtaXR0ZWQiLCJudW1QbGF5ZXJzU3VibWl0dGVkIiwiY29tcHV0ZVNjb3JlIiwic3VibWl0Iiwic3VjY2VzcyIsInBsYXllckFuc3dlcnMiLCJhbGxBbnN3ZXJzRXF1YWwiLCJhcnIiLCJldmVyeSIsInN1Ym1pc3Npb24iLCJwcmV2U2NvcmUiLCJleHBvcnQiLCJ0ZXN0VGFuZ3JhbXMiLCJhbGxTeW1ib2xzIiwiX2lkIiwidGFza05hbWUiLCJzeW1ib2xzIiwiYW5zd2VyIiwiZ2V0TmVpZ2hib3JzIiwic3RydWN0dXJlIiwibmVpZ2hib3JzIiwic3BsaXQiLCJwbGF5ZXJJbmRleCIsIm4iLCJjb25uZWN0aW9uIiwicmVwbGFjZSIsIlNldCIsImFjdGl2ZU5vZGVzIiwiYWxsTm9kZXMiLCJuZXdOZWlnaGJvcnMiLCJpZCIsInRlc3RTeW1ib2xzIiwiZ2FtZUluaXQiLCJwbGF5ZXJDb3VudCIsIm5ldHdvcmtTdHJ1Y3R1cmUiLCJudW1UYXNrUm91bmRzIiwibnVtU3VydmV5Um91bmRzIiwic2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCIsInVzZXJJbmFjdGl2aXR5RHVyYXRpb24iLCJ0YXNrRHVyYXRpb24iLCJkZWZhdWx0U2V0U2l6ZSIsInN1cnZleUR1cmF0aW9uIiwicmVzdWx0c0R1cmF0aW9uIiwibWF4TnVtT3ZlcmxhcCIsInN5bWJvbFNldCIsInNldFNpemUiLCJudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkiLCJjb2xvcnMiLCJzdXJ2ZXlOdW0iLCJzaHVmZmxlIiwiaSIsIl8iLCJ0aW1lcyIsImFkZFJvdW5kIiwidGFza1N0YWdlIiwiYWRkU3RhZ2UiLCJkdXJhdGlvbkluU2Vjb25kcyIsImdldFN5bWJvbHNGb3JQbGF5ZXJzIiwicmVzdWx0U3RhZ2UiLCJzdXJ2ZXlSb3VuZCIsInN1cnZleVN0YWdlcyIsInN5bWJvbHNXaXRob3V0QW5zd2VyIiwic3ltYm9sIiwibnVtUGxheWVycyIsIm51bU92ZXJsYXAiLCJzeW1ib2xGcmVxIiwiaGFzT3duUHJvcGVydHkiLCJzeW1ib2xzUGlja2VkIiwic3ltYm9sVG9SZW1vdmUiLCJqIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLFFBQUo7QUFBYUMsTUFBTSxDQUFD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QUFqRCxDQUF2QjtBQUVEO0FBQ0Y7O0FBRURELG1CQUFhLEdBQUdsQixPQUFPLENBQUNrQixhQUFELENBQXZCO0FBRUExRyxZQUFNLENBQUNDLEdBQVAsQ0FBV3FELFFBQVgsRUFBcUJvRCxhQUFyQjtBQUNELEtBNUJEO0FBK0JILEdBdkl1QixDQXlJeEI7QUFDQTs7O0FBQ0EsV0FBU2xCLE9BQVQsQ0FBaUJMLFNBQWpCLEVBQTRCO0FBQzFCLFNBQUtNLENBQUMsR0FBR04sU0FBUyxDQUFDaEUsTUFBVixHQUFrQixDQUEzQixFQUErQnNFLENBQUMsR0FBRyxDQUFuQyxFQUFzQ0EsQ0FBQyxFQUF2QyxFQUEyQztBQUN6QyxZQUFNbUIsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLE1BQWlCdEIsQ0FBQyxHQUFHLENBQXJCLENBQVgsQ0FBVjtBQUVBLE9BQUNOLFNBQVMsQ0FBQ00sQ0FBRCxDQUFWLEVBQWVOLFNBQVMsQ0FBQ3lCLENBQUQsQ0FBeEIsSUFBK0IsQ0FBQ3pCLFNBQVMsQ0FBQ3lCLENBQUQsQ0FBVixFQUFlekIsU0FBUyxDQUFDTSxDQUFELENBQXhCLENBQS9CO0FBQ0Q7O0FBQ0QsV0FBT04sU0FBUDtBQUNEO0FBRUYsQ0FwSkQsRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuXG4vLyBUaGlzIGlzIHdoZXJlIHlvdSBhZGQgYm90cywgbGlrZSBCb2I6XG5cbkVtcGlyaWNhLmJvdChcImJvYlwiLCB7XG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaCBzdGFnZSAoYWZ0ZXIgb25Sb3VuZFN0YXJ0L29uU3RhZ2VTdGFydClcbiAgLy8gb25TdGFnZVN0YXJ0KGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzKSB7fSxcblxuICAvLyBDYWxsZWQgZHVyaW5nIGVhY2ggc3RhZ2UgYXQgdGljayBpbnRlcnZhbCAofjFzIGF0IHRoZSBtb21lbnQpXG4gIG9uU3RhZ2VUaWNrKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBzZWNvbmRzUmVtYWluaW5nKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQSBwbGF5ZXIgaGFzIGNoYW5nZWQgYSB2YWx1ZVxuICAvLyAvLyBUaGlzIG1pZ2h0IGhhcHBlbiBhIGxvdCFcbiAgLy8gb25TdGFnZVBsYXllckNoYW5nZShib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycywgcGxheWVyKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBlbmQgb2YgdGhlIHN0YWdlIChhZnRlciBpdCBmaW5pc2hlZCwgYmVmb3JlIG9uU3RhZ2VFbmQvb25Sb3VuZEVuZCBpcyBjYWxsZWQpXG4gIC8vIG9uU3RhZ2VFbmQoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMpIHt9XG59KTtcbiIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcblxuaW1wb3J0IHsgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0IHsgVGltZVN5bmMgfSBmcm9tIFwibWV0ZW9yL21penphbzp0aW1lc3luY1wiO1xuXG5cblxuLy8gb25HYW1lU3RhcnQgaXMgdHJpZ2dlcmVkIG9wbmNlIHBlciBnYW1lIGJlZm9yZSB0aGUgZ2FtZSBzdGFydHMsIGFuZCBiZWZvcmVcbi8vIHRoZSBmaXJzdCBvblJvdW5kU3RhcnQuIEl0IHJlY2VpdmVzIHRoZSBnYW1lIGFuZCBsaXN0IG9mIGFsbCB0aGUgcGxheWVycyBpblxuLy8gdGhlIGdhbWUuXG5FbXBpcmljYS5vbkdhbWVTdGFydChnYW1lID0+IHtcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0ZWRcIik7XG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwiaW5hY3RpdmVcIiwgZmFsc2UpO1xuICAgIHBsYXllci5zZXQoXCJsYXN0QWN0aXZlXCIsIG1vbWVudChEYXRlLm5vdygpKSk7XG4gICAgY29uc3QgbmV0d29yayA9IHBsYXllci5nZXQoXCJuZWlnaGJvcnNcIik7XG4gICAgY29uc3QgYWN0aXZlQ2hhdHMgPSBbXTtcbiAgICBuZXR3b3JrLm1hcChvdGhlck5vZGVJZCA9PiB7XG4gICAgICB2YXIgcGFpck9mUGxheWVycyA9IFtwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpLCBwYXJzZUludChvdGhlck5vZGVJZCldO1xuICAgICAgcGFpck9mUGxheWVycy5zb3J0KChwMSxwMikgPT4gcDEgLSBwMik7XG4gICAgICBjb25zdCBvdGhlclBsYXllciA9IGdhbWUucGxheWVycy5maW5kKHAgPT4gcC5nZXQoXCJub2RlSWRcIikgPT09IHBhcnNlSW50KG90aGVyTm9kZUlkKSk7XG4gICAgICAvLyBjb25zdCBvdGhlclBsYXllcklkID0gb3RoZXJQbGF5ZXIuaWQ7XG4gICAgICBjb25zdCBjaGF0S2V5ID0gYCR7cGFpck9mUGxheWVyc1swXX0tJHtwYWlyT2ZQbGF5ZXJzWzFdfWA7XG4gICAgICBhY3RpdmVDaGF0cy5wdXNoKGNoYXRLZXkpO1xuICAgIH0pO1xuICAgIC8vIERlZmF1bHQgYWxsIGNoYXRzIHRvIGJlIG9wZW4gd2hlbiBnYW1lIHN0YXJ0c1xuICAgIHBsYXllci5zZXQoXCJhY3RpdmVDaGF0c1wiLCBhY3RpdmVDaGF0cyk7XG4gICAgY29uc29sZS5sb2cocGxheWVyLmdldChcImFjdGl2ZUNoYXRzXCIpKTtcbiAgfSk7XG4gIGdhbWUuc2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIsIGdhbWUucGxheWVycy5sZW5ndGgpO1xuICBnYW1lLnNldChcImdhbWVTdGFydFRpbWVcIiwgbW9tZW50KERhdGUubm93KCkpKTtcbiAgZ2FtZS5zZXQoXCJnYW1lRW5kVGltZVwiLCBtb21lbnQoRGF0ZS5ub3coKSkuYWRkKDIsICdtJykpXG59KTtcblxuLy8gb25Sb3VuZFN0YXJ0IGlzIHRyaWdnZXJlZCBiZWZvcmUgZWFjaCByb3VuZCBzdGFydHMsIGFuZCBiZWZvcmUgb25TdGFnZVN0YXJ0LlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvbkdhbWVTdGFydCwgYW5kIHRoZSByb3VuZCB0aGF0IGlzIHN0YXJ0aW5nLlxuRW1waXJpY2Eub25Sb3VuZFN0YXJ0KChnYW1lLCByb3VuZCkgPT4ge1xuICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgcGxheWVyLnNldChcInN1Ym1pdHRlZFwiLCBmYWxzZSk7XG4gICAgcGxheWVyLnNldChcInN5bWJvbFNlbGVjdGVkXCIsIFwiXCIpO1xuICB9KTtcbiAgcm91bmQuc2V0KFwicmVzdWx0XCIsIGZhbHNlKTtcbiAgcm91bmQuc2V0KFwibnVtUGxheWVyc1N1Ym1pdHRlZFwiLCAwKTtcbiAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG4gIGlmIChhY3RpdmVQbGF5ZXJzLmxlbmd0aCA8IGdhbWUuZ2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIpICkgeyAvLyBTb21lb25lIGxlZnQgaW4gdGhlIG1pZGRsZSBvZiB0aGUgcm91bmRcbiAgICBpZiAoZ2FtZS50cmVhdG1lbnQuZW5kR2FtZUlmUGxheWVySWRsZSkge1xuICAgICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgIHAuZXhpdChcInNvbWVvbmVJbmFjdGl2ZVwiKTtcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSk7IC8vIFVwZGF0ZXMgdGhlIG5laWdoYm9ycyB0byBiZSBmdWxseSBjb25uZWN0ZWRcbiAgICAgIGdhbWUuc2V0KFwiY2hlY2tGb3JTaW1pbGFyU3ltYm9sXCIsIHRydWUpO1xuICAgIH1cbiAgXG4gIH1cbiAgZ2FtZS5zZXQoXCJwcmV2aW91c051bUFjdGl2ZVBsYXllcnNcIiwgYWN0aXZlUGxheWVycy5sZW5ndGgpO1xuXG4gIGNvbnNvbGUubG9nKFwiUm91bmQgU3RhcnRlZFwiKTtcblxufSk7XG5cbi8vIG9uU3RhZ2VTdGFydCBpcyB0cmlnZ2VyZWQgYmVmb3JlIGVhY2ggc3RhZ2Ugc3RhcnRzLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvblJvdW5kU3RhcnQsIGFuZCB0aGUgc3RhZ2UgdGhhdCBpcyBzdGFydGluZy5cbkVtcGlyaWNhLm9uU3RhZ2VTdGFydCgoZ2FtZSwgcm91bmQsIHN0YWdlKSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiU3RhZ2UgU3RhcnRlZFwiKVxuICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cbiAgaWYgKHN0YWdlLm5hbWUgPT09IFwiVGFza1wiKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCBgU3ltYm9scyA6ICR7cGxheWVyLmdldChgJHtzdGFnZS5kaXNwbGF5TmFtZX1gKX1gKTtcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyhgQW5zd2VyOiAke3N0YWdlLmdldChcImFuc3dlclwiKX1gKTtcbiAgfVxuICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJTdXJ2ZXlcIikge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0KFwic3VydmV5TnVtYmVyXCIgLCAxKVxuICAgIH0pO1xuICB9XG4gIC8vIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgLy8gICBwbGF5ZXIuc2V0KFwic3VibWl0dGVkXCIsIGZhbHNlKTtcbiAgLy8gfSk7XG4gIC8vIHN0YWdlLnNldChcInNob3dSZXN1bHRzXCIsIGZhbHNlKTtcbiAgLy8gc3RhZ2Uuc2V0KFwicmVzdWx0c1Nob3duXCIsIGZhbHNlKTtcblxufSk7XG5cbi8vIG9uU3RhZ2VFbmQgaXMgdHJpZ2dlcmVkIGFmdGVyIGVhY2ggc3RhZ2UuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uUm91bmRFbmQsIGFuZCB0aGUgc3RhZ2UgdGhhdCBqdXN0IGVuZGVkLlxuRW1waXJpY2Eub25TdGFnZUVuZCgoZ2FtZSwgcm91bmQsIHN0YWdlKSA9PntcbiAgY29uc29sZS5sb2coXCJTdGFnZSBFbmRlZFwiKVxuICBcbn0pO1xuXG4vLyBvblJvdW5kRW5kIGlzIHRyaWdnZXJlZCBhZnRlciBlYWNoIHJvdW5kLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvbkdhbWVFbmQsIGFuZCB0aGUgcm91bmQgdGhhdCBqdXN0IGVuZGVkLlxuRW1waXJpY2Eub25Sb3VuZEVuZCgoZ2FtZSwgcm91bmQpID0+IHtcbiAgLy8gZ2FtZS5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgLy8gICBjb25zdCB2YWx1ZSA9IHBsYXllci5yb3VuZC5nZXQoXCJ2YWx1ZVwiKSB8fCAwO1xuICAvLyAgIGNvbnN0IHByZXZTY29yZSA9IHBsYXllci5nZXQoXCJzY29yZVwiKSB8fCAwO1xuICAvLyAgIHBsYXllci5zZXQoXCJzY29yZVwiLCBwcmV2U2NvcmUgKyB2YWx1ZSk7XG4gIC8vIH0pO1xuXG59KTtcblxuLy8gb25HYW1lRW5kIGlzIHRyaWdnZXJlZCB3aGVuIHRoZSBnYW1lIGVuZHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZVN0YXJ0LlxuRW1waXJpY2Eub25HYW1lRW5kKGdhbWUgPT4ge30pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID0+IG9uU2V0LCBvbkFwcGVuZCBhbmQgb25DaGFuZ2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gb25TZXQsIG9uQXBwZW5kIGFuZCBvbkNoYW5nZSBhcmUgY2FsbGVkIG9uIGV2ZXJ5IHNpbmdsZSB1cGRhdGUgbWFkZSBieSBhbGxcbi8vIHBsYXllcnMgaW4gZWFjaCBnYW1lLCBzbyB0aGV5IGNhbiByYXBpZGx5IGJlY29tZSBxdWl0ZSBleHBlbnNpdmUgYW5kIGhhdmVcbi8vIHRoZSBwb3RlbnRpYWwgdG8gc2xvdyBkb3duIHRoZSBhcHAuIFVzZSB3aXNlbHkuXG4vL1xuLy8gSXQgaXMgdmVyeSB1c2VmdWwgdG8gYmUgYWJsZSB0byByZWFjdCB0byBlYWNoIHVwZGF0ZSBhIHVzZXIgbWFrZXMuIFRyeVxuLy8gbm9udGhlbGVzcyB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGNvbXB1dGF0aW9ucyBhbmQgZGF0YWJhc2Ugc2F2ZXMgKC5zZXQpXG4vLyBkb25lIGluIHRoZXNlIGNhbGxiYWNrcy4gWW91IGNhbiBhbHNvIHRyeSB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGNhbGxzIHRvXG4vLyBzZXQoKSBhbmQgYXBwZW5kKCkgeW91IG1ha2UgKGF2b2lkIGNhbGxpbmcgdGhlbSBvbiBhIGNvbnRpbnVvdXMgZHJhZyBvZiBhXG4vLyBzbGlkZXIgZm9yIGV4YW1wbGUpIGFuZCBpbnNpZGUgdGhlc2UgY2FsbGJhY2tzIHVzZSB0aGUgYGtleWAgYXJndW1lbnQgYXQgdGhlXG4vLyB2ZXJ5IGJlZ2lubmluZyBvZiB0aGUgY2FsbGJhY2sgdG8gZmlsdGVyIG91dCB3aGljaCBrZXlzIHlvdXIgbmVlZCB0byBydW5cbi8vIGxvZ2ljIGFnYWluc3QuXG4vL1xuLy8gSWYgeW91IGFyZSBub3QgdXNpbmcgdGhlc2UgY2FsbGJhY2tzLCBjb21tZW50IHRoZW0gb3V0IHNvIHRoZSBzeXN0ZW0gZG9lc1xuLy8gbm90IGNhbGwgdGhlbSBmb3Igbm90aGluZy5cblxuLy8gLy8gb25TZXQgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSAuc2V0KCkgbWV0aG9kXG4vLyAvLyBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvciBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vblNldCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4vLyApID0+IHtcbi8vICAgLy8gLy8gRXhhbXBsZSBmaWx0ZXJpbmdcbi8vICAgLy8gaWYgKGtleSAhPT0gXCJ2YWx1ZVwiKSB7XG4vLyAgIC8vICAgcmV0dXJuO1xuLy8gICAvLyB9XG4vLyB9KTtcblxuRW1waXJpY2Eub25TZXQoKFxuICBnYW1lLFxuICByb3VuZCxcbiAgc3RhZ2UsXG4gIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2VcbiAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4gIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbiAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4gIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuKSA9PiB7XG4gIGNvbnN0IHBsYXllcnMgPSBnYW1lLnBsYXllcnM7XG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICAvLyBTb21lIHBsYXllciBkZWNpZGVzIHRvIHJlY29uc2lkZXIgdGhlaXIgYW5zd2VyXG4gIGNvbnNvbGUubG9nKFwia2V5XCIsIGtleSk7XG4gIGlmIChrZXkgPT09IFwic3VibWl0dGVkXCIpIHsgXG4gICAgLy8gQ2hlY2tzIGlmIGV2ZXJ5b25lIGhhcyBzdWJtaXR0ZWQgdGhlaXIgYW5zd2VyIGFuZCBpZiBzbywgc3VibWl0IHRoZSBzdGFnZVxuICAgIGxldCBhbGxTdWJtaXR0ZWQgPSB0cnVlO1xuICAgIGxldCBudW1QbGF5ZXJzU3VibWl0dGVkID0gMDtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgaWYgKHBsYXllci5nZXQoXCJzdWJtaXR0ZWRcIikpIHtcbiAgICAgICAgbnVtUGxheWVyc1N1Ym1pdHRlZCArPSAxO1xuICAgICAgfVxuICAgICAgYWxsU3VibWl0dGVkID0gcGxheWVyLmdldChcInN1Ym1pdHRlZFwiKSAmJiBhbGxTdWJtaXR0ZWQ7XG4gICAgfSlcbiAgICByb3VuZC5zZXQoXCJudW1QbGF5ZXJzU3VibWl0dGVkXCIsIG51bVBsYXllcnNTdWJtaXR0ZWQpO1xuICAgIGlmIChhbGxTdWJtaXR0ZWQpIHtcbiAgICAgIGlmIChzdGFnZS5uYW1lID09PSBcIlRhc2tcIikge1xuICAgICAgICBjb21wdXRlU2NvcmUoYWN0aXZlUGxheWVycywgZ2FtZSwgc3RhZ2UsIHJvdW5kKTtcbiAgICAgIH1cbiAgICAgIC8vIE5lZWQgdG8gc3VibWl0IGZvciBzdWJtaXQgdGhlIHN0YWdlIGZvciBldmVyeSBwbGF5ZXJcbiAgICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgICAgcGxheWVyLnN0YWdlLnN1Ym1pdCgpO1xuICAgICAgfSlcbiAgICB9XG4gIC8vICAgaWYgKHN0YWdlLmdldChcInJlc3VsdHNTaG93blwiKSkge1xuICAvLyAgICAgcGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgLy8gICAgICAgcGxheWVyLnN0YWdlLnN1Ym1pdCgpO1xuICAvLyAgICAgfSlcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvLyBpZiAodGFyZ2V0VHlwZSA9PT0gXCJzdGFnZVwiICYmIGtleSA9PT0gXCJyZXN1bHRzU2hvd25cIikge1xuICAvLyAgIGlmIChzdGFnZS5nZXQoXCJyZXN1bHRzU2hvd25cIikpIHtcbiAgLy8gICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgLy8gICAgIH0pXG4gIC8vICAgfVxuICB9XG5cbiAgLy8gZWxzZSBpZiAoa2V5ID09PSBcImluYWN0aXZlXCIpIHtcbiAgICAvLyBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpO1xuICAvLyB9XG5cbiAgcmV0dXJuO1xuXG59KTtcblxuZnVuY3Rpb24gY29tcHV0ZVNjb3JlKGFjdGl2ZVBsYXllcnMsIGdhbWUsIHN0YWdlLCByb3VuZCkge1xuICBsZXQgc3VjY2VzcyA9IHRydWU7XG4gIGNvbnNvbGUubG9nKFwiQ09SUkVDVCBBTlNXRVI6XCIpXG4gIGNvbnNvbGUubG9nKHN0YWdlLmdldChcImFuc3dlclwiKSk7XG4gIGNvbnNvbGUubG9nKFwiUGxheWVycyBndWVzc2VkOlwiKVxuXG4gIGxldCBwbGF5ZXJBbnN3ZXJzID0gW107XG4gIGNvbnN0IGFsbEFuc3dlcnNFcXVhbCA9IGFyciA9PiBhcnIuZXZlcnkoIHYgPT4gdiA9PT0gYXJyWzBdICkgLy9GdW5jIHRvIGNoZWNrIGlmIGFsbCBwbGF5ZXIgYW5zd2VycyBhcmUgZXF1YWxcblxuICBhY3RpdmVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICBjb25zdCBzdWJtaXNzaW9uID0gcGxheWVyLmdldChcInN5bWJvbFNlbGVjdGVkXCIpO1xuICAgIGNvbnNvbGUubG9nKHN1Ym1pc3Npb24pO1xuICAgIGlmIChnYW1lLmdldChcImNoZWNrRm9yU2ltaWxhclN5bWJvbFwiKSkge1xuICAgICAgcGxheWVyQW5zd2Vycy5wdXNoKHN1Ym1pc3Npb24pO1xuICAgIH1cbiAgICBpZiAoc3VibWlzc2lvbiAhPT0gc3RhZ2UuZ2V0KFwiYW5zd2VyXCIpKSB7XG4gICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgfVxuICB9KVxuXG4gIGlmIChnYW1lLmdldChcImNoZWNrRm9yU2ltaWxhclN5bWJvbFwiKSkge1xuICAgIGlmIChhbGxBbnN3ZXJzRXF1YWwocGxheWVyQW5zd2VycykpIHtcbiAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJvdW5kLnNldChcInJlc3VsdFwiLCBzdWNjZXNzKTtcbiAgaWYgKHN1Y2Nlc3MpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgIGNvbnN0IHByZXZTY29yZSA9IHBsYXllci5nZXQoXCJzY29yZVwiKSB8fCAwO1xuICAgICAgcGxheWVyLnNldChcInNjb3JlXCIsIHByZXZTY29yZSArIDEpO1xuICAgIH0pXG4gICAgY29uc29sZS5sb2coXCIgQWxsIHBsYXllcnMgZ290IGl0IGNvcnJlY3RseVwiKTtcbiAgfSBcbn1cblxuLy8gLy8gb25BcHBlbmQgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSBgLmFwcGVuZCgpYCBtZXRob2Rcbi8vIC8vIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uQXBwZW5kKChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbi8vICkgPT4ge1xuLy8gICAvLyBOb3RlOiBgdmFsdWVgIGlzIHRoZSBzaW5nbGUgbGFzdCB2YWx1ZSAoZS5nIDAuMiksIHdoaWxlIGBwcmV2VmFsdWVgIHdpbGxcbi8vICAgLy8gICAgICAgYmUgYW4gYXJyYXkgb2YgdGhlIHByZXZpc291cyB2YWx1ZWQgKGUuZy4gWzAuMywgMC40LCAwLjY1XSkuXG4vLyB9KTtcblxuXG4vLyAvLyBvbkNoYW5nZSBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIGAuc2V0KClgIG9yIHRoZVxuLy8gLy8gYC5hcHBlbmQoKWAgbWV0aG9kIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yXG4vLyAvLyBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vbkNoYW5nZSgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlLCAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gICBpc0FwcGVuZCAvLyBUcnVlIGlmIHRoZSBjaGFuZ2Ugd2FzIGFuIGFwcGVuZCwgZmFsc2UgaWYgaXQgd2FzIGEgc2V0XG4vLyApID0+IHtcbi8vICAgLy8gYG9uQ2hhbmdlYCBpcyB1c2VmdWwgdG8gcnVuIHNlcnZlci1zaWRlIGxvZ2ljIGZvciBhbnkgdXNlciBpbnRlcmFjdGlvbi5cbi8vICAgLy8gTm90ZSB0aGUgZXh0cmEgaXNBcHBlbmQgYm9vbGVhbiB0aGF0IHdpbGwgYWxsb3cgdG8gZGlmZmVyZW5jaWF0ZSBzZXRzIGFuZFxuLy8gICAvLyBhcHBlbmRzLlxuLy8gICAgR2FtZS5zZXQoXCJsYXN0Q2hhbmdlQXRcIiwgbmV3IERhdGUoKS50b1N0cmluZygpKVxuLy8gfSk7XG5cbi8vIC8vIG9uU3VibWl0IGlzIGNhbGxlZCB3aGVuIHRoZSBwbGF5ZXIgc3VibWl0cyBhIHN0YWdlLlxuLy8gRW1waXJpY2Eub25TdWJtaXQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciAvLyBQbGF5ZXIgd2hvIHN1Ym1pdHRlZFxuLy8gKSA9PiB7XG4vLyB9KTtcbiIsImNvbnN0IGFsbFN5bWJvbHMgPSBbXCJ0MVwiLCBcInQyXCIsIFwidDNcIiwgXCJ0NFwiLCBcInQ1XCIsIFwidDZcIiwgXCJ0N1wiLFwidDhcIixcInQ5XCIsXCJ0MTBcIixcInQxMVwiLFwidDEyXCJdO1xuXG4vLyBuID0gbnVtYmVyIG9mIHBlb3BsZSAsIHAgPSBudW1iZXIgb2Ygc3ltYm9sc1xuLy8gKG4tMSkqcCArIDFcbi8vIGkuZS4gbiA9IDMsIHAgPSAzIDogN1xuXG5leHBvcnQgY29uc3QgdGVzdFRhbmdyYW1zID0gW1xuICB7XG4gICAgX2lkOiBcIjBcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDFcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjFcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDJcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjJcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDNcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0M1wiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjNcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDRcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0NFwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjRcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDVcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0NVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjVcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDZcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0NlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjZcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDdcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0N1wiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjdcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDhcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0OFwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjhcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDlcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0OVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjlcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDEwXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDEwXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTBcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDExXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDExXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTFcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDEyXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDEyXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTJcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDEzXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxM1wiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTRcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjE0XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxNVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQzXCIsXG4gIH0sXG5cbl07XG5cblxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldE5laWdoYm9ycyhzdHJ1Y3R1cmUsIHBsYXllcikge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGxldCBuZXR3b3JrID0gc3RydWN0dXJlLnNwbGl0KFwiLFwiKTtcbiAgICBjb25zdCBwbGF5ZXJJbmRleCA9IHBsYXllci5nZXQoXCJub2RlSWRcIik7XG5cbiAgICBuZXR3b3JrLmZvckVhY2goKG4pID0+IHtcbiAgICAgIGNvbnN0IGNvbm5lY3Rpb24gPSBuLnNwbGl0KFwiLVwiKTtcblxuICAgICAgaWYgKHBsYXllckluZGV4ID09PSBwYXJzZUludChjb25uZWN0aW9uWzBdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChjb25uZWN0aW9uWzFdLnJlcGxhY2UoL1xccy9nLCAnJykpO1xuICAgICAgfSBlbHNlIGlmIChwbGF5ZXJJbmRleCA9PT0gcGFyc2VJbnQoY29ubmVjdGlvblsxXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goY29ubmVjdGlvblswXS5yZXBsYWNlKC9cXHMvZywgJycpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgXG4gICAgcmV0dXJuIFsuLi4gbmV3IFNldChuZWlnaGJvcnMpXTtcbiAgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKSB7XG4gICAgY29uc3QgYWN0aXZlTm9kZXMgPSBbXTtcbiAgICBjb25zdCBhbGxOb2RlcyA9IFtdO1xuICAgIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICAgIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG5cbiAgICAvLyBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAvLyAgIGFjdGl2ZU5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgLy8gfSlcblxuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAvLyBpZiAocC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3R2ZVwiKSkge1xuICAgICAgaWYgKCFwLmdldChcImluYWN0dmVcIikpIHtcblxuICAgICAgICBhY3RpdmVOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgICAgfVxuICAgICAgYWxsTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICB9KVxuXG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIC8vIE9ubHkgc2hvdyBhY3RpdmUgcGVvcGxlXG4gICAgICAvLyBjb25zdCBuZXdOZWlnaGJvcnMgPSBhY3RpdmVOb2Rlcy5maWx0ZXIoaWQgPT4gcGFyc2VJbnQoaWQpICE9PSBwLmdldChcIm5vZGVJZFwiKSlcbiAgICAgIC8vIHAuc2V0KFwibmVpZ2hib3JzXCIsIG5ld05laWdoYm9ycyk7XG5cbiAgICAgIC8vIFNob3cgZXZlcnlvbmUsIG1hcmsgb2ZmbGluZSBwZW9wbGUgYXMgb2ZmbGluZVxuICAgICAgY29uc3QgbmV3TmVpZ2hib3JzID0gYWxsTm9kZXMuZmlsdGVyKGlkID0+IHBhcnNlSW50KGlkKSAhPT0gcC5nZXQoXCJub2RlSWRcIikpXG4gICAgICBwLnNldChcIm5laWdoYm9yc1wiLCBuZXdOZWlnaGJvcnMpO1xuICAgIH0pXG59IiwiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuaW1wb3J0IFwiLi9ib3RzLmpzXCI7XG5pbXBvcnQgXCIuL2NhbGxiYWNrcy5qc1wiO1xuXG5pbXBvcnQgeyB0ZXN0U3ltYm9scywgdGVzdFRhbmdyYW1zIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7IFxuaW1wb3J0IHsgZ2V0TmVpZ2hib3JzLCBnZXRGdWxseUNvbm5lY3RlZExheWVyIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG4vLyBnYW1lSW5pdCBpcyB3aGVyZSB0aGUgc3RydWN0dXJlIG9mIGEgZ2FtZSBpcyBkZWZpbmVkLlxuLy8gSnVzdCBiZWZvcmUgZXZlcnkgZ2FtZSBzdGFydHMsIG9uY2UgYWxsIHRoZSBwbGF5ZXJzIG5lZWRlZCBhcmUgcmVhZHksIHRoaXNcbi8vIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIHRoZSB0cmVhdG1lbnQgYW5kIHRoZSBsaXN0IG9mIHBsYXllcnMuXG4vLyBZb3UgbXVzdCB0aGVuIGFkZCByb3VuZHMgYW5kIHN0YWdlcyB0byB0aGUgZ2FtZSwgZGVwZW5kaW5nIG9uIHRoZSB0cmVhdG1lbnRcbi8vIGFuZCB0aGUgcGxheWVycy4gWW91IGNhbiBhbHNvIGdldC9zZXQgaW5pdGlhbCB2YWx1ZXMgb24geW91ciBnYW1lLCBwbGF5ZXJzLFxuLy8gcm91bmRzIGFuZCBzdGFnZXMgKHdpdGggZ2V0L3NldCBtZXRob2RzKSwgdGhhdCB3aWxsIGJlIGFibGUgdG8gdXNlIGxhdGVyIGluXG4vLyB0aGUgZ2FtZS5cbkVtcGlyaWNhLmdhbWVJbml0KGdhbWUgPT4ge1xuICBjb25zdCB7XG4gICAgdHJlYXRtZW50OiB7XG4gICAgICBwbGF5ZXJDb3VudCxcbiAgICAgIG5ldHdvcmtTdHJ1Y3R1cmUsXG4gICAgICBudW1UYXNrUm91bmRzLFxuICAgICAgbnVtU3VydmV5Um91bmRzLFxuICAgICAgc2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCxcbiAgICAgIHVzZXJJbmFjdGl2aXR5RHVyYXRpb24sXG4gICAgICB0YXNrRHVyYXRpb24sXG4gICAgICBkZWZhdWx0U2V0U2l6ZSxcbiAgICAgIHN1cnZleUR1cmF0aW9uLFxuICAgICAgcmVzdWx0c0R1cmF0aW9uLFxuICAgICAgbWF4TnVtT3ZlcmxhcCxcbiAgICB9LFxuICB9ID0gZ2FtZTtcblxuXG4gIGNvbnN0IHN5bWJvbFNldCA9IHRlc3RUYW5ncmFtcztcbiAgY29uc3Qgc2V0U2l6ZSA9IHNldFNpemVCYXNlZE9uUGxheWVyQ291bnQgPyBwbGF5ZXJDb3VudCArIDEgOiBkZWZhdWx0U2V0U2l6ZTsgLy9UT0RPOiBjYW4gY2hhbmdlIGRlZmF1bHQgdmFsdWUgaW4gc2V0dGluZ3NcbiAgY29uc3QgbnVtUm91bmRzQmVmb3JlU3VydmV5ID0gbnVtVGFza1JvdW5kcy9udW1TdXJ2ZXlSb3VuZHM7XG5cbiAgbGV0IGNvbG9ycyA9IFtcIkdyZWVuXCIsIFwiUmVkXCIsIFwiWWVsbG93XCIsIFwiQmx1ZVwiLCBcIlB1cnBsZVwiLCBcIldoaXRlXCIsIFwiQmxhY2tcIl1cbiAgbGV0IHN1cnZleU51bSA9IDFcbiAgY29sb3JzID0gc2h1ZmZsZShjb2xvcnMpO1xuXG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIsIGkpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwiYXZhdGFyXCIsIGAvYXZhdGFycy9qZGVudGljb24vJHtwbGF5ZXIuX2lkfWApO1xuICAgIHBsYXllci5zZXQoXCJzY29yZVwiLCAwKTtcblxuICAgIC8vIEdpdmUgZWFjaCBwbGF5ZXIgYSBub2RlSWQgYmFzZWQgb24gdGhlaXIgcG9zaXRpb24gKGluZGV4ZWQgYXQgMSlcbiAgICBwbGF5ZXIuc2V0KFwibm9kZUlkXCIsIGkgKyAxKTtcbiAgICBwbGF5ZXIuc2V0KFwibmFtZVwiLCBwbGF5ZXIuaWQpO1xuICAgIHBsYXllci5zZXQoXCJhbm9ueW1vdXNOYW1lXCIsIGNvbG9yc1tpXSlcbiAgfSk7XG5cblxuICBpZiAoZ2FtZS5wbGF5ZXJzLmxlbmd0aCA8IGdhbWUudHJlYXRtZW50LnBsYXllckNvdW50KSB7IC8vIGlmIG5vdCBhIGZ1bGwgZ2FtZSwgZGVmYXVsdCB0byBmdWxseSBjb25uZWN0ZWQgbGF5ZXJcbiAgICBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpO1xuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhwLmdldChcIm5laWdoYm9yc1wiKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIHAuc2V0KFwibmVpZ2hib3JzXCIsIGdldE5laWdoYm9ycyhuZXR3b3JrU3RydWN0dXJlLCBwKSk7XG4gICAgICBjb25zb2xlLmxvZyhwLmdldChcIm5laWdoYm9yc1wiKSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBGb3IgZWFjaCByb3VuZCwgYWRkIGFsbCB0aGUgc3ltYm9scywgcmFuZG9tbHkgc2VsZWN0IGEgY29ycmVjdCBhbnN3ZXIgYW5kXG4gIC8vIENvbnN0cmFpbnRzOiBNdXN0IGVuc3VyZSB0aGF0IGV2ZXJ5b25lIGhhcyBvbmx5IG9uZSBzeW1ib2wgaW4gY29tbW9uXG4gIF8udGltZXMoIG51bVRhc2tSb3VuZHMsIGkgPT4ge1xuICAgIGNvbnN0IHJvdW5kID0gZ2FtZS5hZGRSb3VuZCgpO1xuXG4gICAgY29uc3Qge3N5bWJvbHMsIHRhc2tOYW1lLCBhbnN3ZXJ9ID0gc3ltYm9sU2V0W2ldO1xuXG4gICAgY29uc3QgdGFza1N0YWdlID0gcm91bmQuYWRkU3RhZ2Uoe1xuICAgICAgbmFtZTogXCJUYXNrXCIsXG4gICAgICBkaXNwbGF5TmFtZTogdGFza05hbWUsXG4gICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiB0YXNrRHVyYXRpb25cbiAgICB9KTtcbiAgICB0YXNrU3RhZ2Uuc2V0KFwidGFza1wiLCBzeW1ib2xTZXRbaV0pO1xuICAgIGdldFN5bWJvbHNGb3JQbGF5ZXJzKHN5bWJvbHMsIGFuc3dlciwgc2V0U2l6ZSwgdGFza05hbWUsIGdhbWUsIG1heE51bU92ZXJsYXApXG4gICAgdGFza1N0YWdlLnNldChcImFuc3dlclwiLCBzeW1ib2xTZXRbaV0uYW5zd2VyKVxuXG4gICAgY29uc3QgcmVzdWx0U3RhZ2UgPSByb3VuZC5hZGRTdGFnZSh7XG4gICAgICBuYW1lOiBcIlJlc3VsdFwiLFxuICAgICAgZGlzcGxheU5hbWU6IFwiUmVzdWx0XCIsXG4gICAgICBkdXJhdGlvbkluU2Vjb25kczogcmVzdWx0c0R1cmF0aW9uXG4gICAgfSk7XG4gICAgXG4gICAgaWYgKChpKzEpICUgbnVtUm91bmRzQmVmb3JlU3VydmV5ID09PSAwKSB7IC8vIEFmdGVyIDUgdGFzayByb3VuZHMsIGFkZCBhIHN1cnZleSByb3VuZFxuICAgICAgY29uc3Qgc3VydmV5Um91bmQgPSBnYW1lLmFkZFJvdW5kKCk7XG5cbiAgICAgIGNvbnN0IHN1cnZleVN0YWdlcyA9IHN1cnZleVJvdW5kLmFkZFN0YWdlKHtcbiAgICAgICAgbmFtZTogXCJTdXJ2ZXlcIixcbiAgICAgICAgZGlzcGxheU5hbWU6IFwiU3VydmV5IFwiICsgc3VydmV5TnVtLFxuICAgICAgICBkdXJhdGlvbkluU2Vjb25kczogc3VydmV5RHVyYXRpb25cbiAgICAgIH0pXG4gICAgICBcbiAgICAgIHN1cnZleU51bSsrO1xuICAgIH1cblxuICB9KTtcblxuXG5cbiAgZnVuY3Rpb24gZ2V0U3ltYm9sc0ZvclBsYXllcnMoc3ltYm9sU2V0LCBhbnN3ZXIsIHNldFNpemUsIHRhc2tOYW1lLCBnYW1lLCBtYXhOdW1PdmVybGFwKSB7XG4gICAgICBsZXQgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xTZXQuZmlsdGVyKHN5bWJvbCA9PiBzeW1ib2wgIT09IGFuc3dlcik7XG4gICAgICBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHNodWZmbGUoc3ltYm9sc1dpdGhvdXRBbnN3ZXIpO1xuICAgICAgbGV0IG51bVBsYXllcnMgPSBnYW1lLnBsYXllcnMubGVuZ3RoO1xuICAgICAgbGV0IG51bU92ZXJsYXAgPSAwO1xuXG5cbiAgICAgIC8vIENyZWF0ZSBhIGRpY3Rpb25hcnkgdG8ga2VlcCB0cmFjayBvZiBob3cgbWFueSB0aW1lcyBzeW1ib2wgaGFzIGJlZW4gdXNlZFxuICAgICAgbGV0IHN5bWJvbEZyZXEgPSB7fVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzeW1ib2xzV2l0aG91dEFuc3dlci5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgc3ltYm9sID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXJbaV1cbiAgICAgICAgaWYgKCFzeW1ib2xGcmVxLmhhc093blByb3BlcnR5KHN5bWJvbCkpIHtcbiAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gPSBudW1QbGF5ZXJzIC0gMTsgLy8gVG90YWwgdGltZSBhIHN5bWJvbCBjYW4gYmUgdXNlZCBcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIGxldCBzeW1ib2xzUGlja2VkID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ltYm9sc1dpdGhvdXRBbnN3ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgc3ltYm9sID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXJbaV1cbiAgICAgICAgICBpZiAoc3ltYm9sc1BpY2tlZC5sZW5ndGggPCBzZXRTaXplIC0gMSkgeyAvLyBBZGQgc3ltYm9scyB1bnRpbCBzZXRTaXplIC0gMSBmb3IgYW5zd2VyXG4gICAgICAgICAgICBpZiAoc3ltYm9sRnJlcVtzeW1ib2xdIC0gMSA9PT0gMCkgeyAvLyBUaGlzIHN5bWJvbCB3aWxsIG92ZXJsYXBcbiAgICAgICAgICAgICAgICBpZiAobnVtT3ZlcmxhcCA8IG1heE51bU92ZXJsYXAgKSB7IC8vIE9ubHkgYWRkIGlmIGxlc3MgdGhhbiBtYXggb3ZlcmxhcFxuICAgICAgICAgICAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gLT0gMTtcbiAgICAgICAgICAgICAgICAgIG51bU92ZXJsYXAgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKGFuc3dlcik7IC8vIEFkZCB0aGUgYW5zd2VyXG4gICAgICAgIGZvciAodmFyIHN5bWJvbFRvUmVtb3ZlIG9mIHN5bWJvbHNQaWNrZWQpIHtcbiAgICAgICAgICBpZiAoc3ltYm9sRnJlcVtzeW1ib2xUb1JlbW92ZV0gPT09IDApIHsgLy8gSWYgc3ltYm9sIGhhcyBiZWVuIHBpY2tlZCBuLTEgcGxheWVycyB0aW1lcywgcmVtb3ZlIGl0IGZyb20gdGhlIHNldFxuICAgICAgICAgICAgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xzV2l0aG91dEFuc3dlci5maWx0ZXIoc3ltYm9sID0+IHN5bWJvbCAhPT0gc3ltYm9sVG9SZW1vdmUpO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3ltYm9sc1BpY2tlZCA9IHNodWZmbGUoc3ltYm9sc1BpY2tlZCk7XG5cbiAgICAgICAgcGxheWVyLnNldCh0YXNrTmFtZSwgc3ltYm9sc1BpY2tlZCk7XG4gICAgICB9KVxuXG5cbiAgfVxuXG4gIC8vIFNodWZmbGluZyBhcnJheXM6XG4gIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUwNTM2MDQ0L3N3YXBwaW5nLWFsbC1lbGVtZW50cy1vZi1hbi1hcnJheS1leGNlcHQtZm9yLWZpcnN0LWFuZC1sYXN0XG4gIGZ1bmN0aW9uIHNodWZmbGUoc3ltYm9sU2V0KSB7XG4gICAgZm9yIChpID0gc3ltYm9sU2V0Lmxlbmd0aCAtMSA7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcblxuICAgICAgW3N5bWJvbFNldFtpXSwgc3ltYm9sU2V0W2pdXSA9IFtzeW1ib2xTZXRbal0sIHN5bWJvbFNldFtpXV07XG4gICAgfVxuICAgIHJldHVybiBzeW1ib2xTZXQ7XG4gIH1cblxufSk7XG4iXX0=
