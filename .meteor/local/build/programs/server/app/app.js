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
        displayName: "Survey",
        durationInSeconds: surveyDuration
      });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm9uR2FtZVN0YXJ0IiwiY29uc29sZSIsImxvZyIsInBsYXllcnMiLCJmb3JFYWNoIiwicGxheWVyIiwic2V0IiwibmV0d29yayIsImdldCIsImFjdGl2ZUNoYXRzIiwibWFwIiwib3RoZXJOb2RlSWQiLCJwYWlyT2ZQbGF5ZXJzIiwicGFyc2VJbnQiLCJzb3J0IiwicDEiLCJwMiIsIm90aGVyUGxheWVyIiwiZmluZCIsInAiLCJjaGF0S2V5IiwicHVzaCIsImxlbmd0aCIsIm9uUm91bmRTdGFydCIsImFjdGl2ZVBsYXllcnMiLCJmaWx0ZXIiLCJ0cmVhdG1lbnQiLCJlbmRHYW1lSWZQbGF5ZXJJZGxlIiwiZXhpdCIsIm9uU3RhZ2VTdGFydCIsIm5hbWUiLCJkaXNwbGF5TmFtZSIsIm9uU3RhZ2VFbmQiLCJvblJvdW5kRW5kIiwib25HYW1lRW5kIiwib25TZXQiLCJ0YXJnZXQiLCJ0YXJnZXRUeXBlIiwia2V5IiwidmFsdWUiLCJwcmV2VmFsdWUiLCJhbGxTdWJtaXR0ZWQiLCJudW1QbGF5ZXJzU3VibWl0dGVkIiwiY29tcHV0ZVNjb3JlIiwic3VibWl0Iiwic3VjY2VzcyIsInN1Ym1pc3Npb24iLCJwcmV2U2NvcmUiLCJleHBvcnQiLCJ0ZXN0VGFuZ3JhbXMiLCJmaWxsZXJOYW1lcyIsInNwbGl0IiwiYWxsU3ltYm9scyIsIl9pZCIsInRhc2tOYW1lIiwic3ltYm9scyIsImFuc3dlciIsImdldE5laWdoYm9ycyIsInN0cnVjdHVyZSIsIm5laWdoYm9ycyIsIm4iLCJjb25uZWN0aW9uIiwicGxheWVySW5kZXgiLCJfIiwidW5pcSIsImFjdGl2ZU5vZGVzIiwiYWxsTm9kZXMiLCJuZXdOZWlnaGJvcnMiLCJpZCIsInRlc3RTeW1ib2xzIiwiZ2FtZUluaXQiLCJwbGF5ZXJDb3VudCIsIm5ldHdvcmtTdHJ1Y3R1cmUiLCJudW1UYXNrUm91bmRzIiwibnVtU3VydmV5Um91bmRzIiwic2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCIsInVzZXJJbmFjdGl2aXR5RHVyYXRpb24iLCJ0YXNrRHVyYXRpb24iLCJkZWZhdWx0U2V0U2l6ZSIsInN1cnZleUR1cmF0aW9uIiwicmVzdWx0c0R1cmF0aW9uIiwibWF4TnVtT3ZlcmxhcCIsInN5bWJvbFNldCIsInNldFNpemUiLCJudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkiLCJjb2xvcnMiLCJzaHVmZmxlIiwiaSIsInRpbWVzIiwiYWRkUm91bmQiLCJ0YXNrU3RhZ2UiLCJhZGRTdGFnZSIsImR1cmF0aW9uSW5TZWNvbmRzIiwiZ2V0U3ltYm9sc0ZvclBsYXllcnMiLCJyZXN1bHRTdGFnZSIsInN1cnZleVJvdW5kIiwic3VydmV5U3RhZ2VzIiwic3ltYm9sc1dpdGhvdXRBbnN3ZXIiLCJzeW1ib2wiLCJudW1QbGF5ZXJzIiwibnVtT3ZlcmxhcCIsInN5bWJvbEZyZXEiLCJoYXNPd25Qcm9wZXJ0eSIsInN5bWJvbHNQaWNrZWQiLCJzeW1ib2xUb1JlbW92ZSIsImoiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsUUFBSjtBQUFhQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSixZQUFRLEdBQUNJLENBQVQ7QUFBVzs7QUFBdkIsQ0FBbkMsRUFB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QyxFQUFzQ0EsQ0FBQyxFQUF2QyxFQUEyQztBQUN6QyxZQUFNa0IsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLE1BQWlCckIsQ0FBQyxHQUFHLENBQXJCLENBQVgsQ0FBVjtBQUVBLE9BQUNMLFNBQVMsQ0FBQ0ssQ0FBRCxDQUFWLEVBQWVMLFNBQVMsQ0FBQ3VCLENBQUQsQ0FBeEIsSUFBK0IsQ0FBQ3ZCLFNBQVMsQ0FBQ3VCLENBQUQsQ0FBVixFQUFldkIsU0FBUyxDQUFDSyxDQUFELENBQXhCLENBQS9CO0FBQ0Q7O0FBQ0QsV0FBT0wsU0FBUDtBQUNEO0FBRUYsQ0FqSkQsRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuXG4vLyBUaGlzIGlzIHdoZXJlIHlvdSBhZGQgYm90cywgbGlrZSBCb2I6XG5cbkVtcGlyaWNhLmJvdChcImJvYlwiLCB7XG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaCBzdGFnZSAoYWZ0ZXIgb25Sb3VuZFN0YXJ0L29uU3RhZ2VTdGFydClcbiAgLy8gb25TdGFnZVN0YXJ0KGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzKSB7fSxcblxuICAvLyBDYWxsZWQgZHVyaW5nIGVhY2ggc3RhZ2UgYXQgdGljayBpbnRlcnZhbCAofjFzIGF0IHRoZSBtb21lbnQpXG4gIG9uU3RhZ2VUaWNrKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBzZWNvbmRzUmVtYWluaW5nKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQSBwbGF5ZXIgaGFzIGNoYW5nZWQgYSB2YWx1ZVxuICAvLyAvLyBUaGlzIG1pZ2h0IGhhcHBlbiBhIGxvdCFcbiAgLy8gb25TdGFnZVBsYXllckNoYW5nZShib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycywgcGxheWVyKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBlbmQgb2YgdGhlIHN0YWdlIChhZnRlciBpdCBmaW5pc2hlZCwgYmVmb3JlIG9uU3RhZ2VFbmQvb25Sb3VuZEVuZCBpcyBjYWxsZWQpXG4gIC8vIG9uU3RhZ2VFbmQoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMpIHt9XG59KTtcbiIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcblxuaW1wb3J0IHsgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcblxuXG4vLyBvbkdhbWVTdGFydCBpcyB0cmlnZ2VyZWQgb3BuY2UgcGVyIGdhbWUgYmVmb3JlIHRoZSBnYW1lIHN0YXJ0cywgYW5kIGJlZm9yZVxuLy8gdGhlIGZpcnN0IG9uUm91bmRTdGFydC4gSXQgcmVjZWl2ZXMgdGhlIGdhbWUgYW5kIGxpc3Qgb2YgYWxsIHRoZSBwbGF5ZXJzIGluXG4vLyB0aGUgZ2FtZS5cbkVtcGlyaWNhLm9uR2FtZVN0YXJ0KGdhbWUgPT4ge1xuICBjb25zb2xlLmxvZyhcIkdhbWUgc3RhcnRlZFwiKTtcbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5zZXQoXCJpbmFjdGl2ZVwiLCBmYWxzZSk7XG4gICAgY29uc3QgbmV0d29yayA9IHBsYXllci5nZXQoXCJuZWlnaGJvcnNcIik7XG4gICAgY29uc3QgYWN0aXZlQ2hhdHMgPSBbXTtcbiAgICBuZXR3b3JrLm1hcChvdGhlck5vZGVJZCA9PiB7XG4gICAgICB2YXIgcGFpck9mUGxheWVycyA9IFtwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpLCBwYXJzZUludChvdGhlck5vZGVJZCldO1xuICAgICAgcGFpck9mUGxheWVycy5zb3J0KChwMSxwMikgPT4gcDEgLSBwMik7XG4gICAgICBjb25zdCBvdGhlclBsYXllciA9IGdhbWUucGxheWVycy5maW5kKHAgPT4gcC5nZXQoXCJub2RlSWRcIikgPT09IHBhcnNlSW50KG90aGVyTm9kZUlkKSk7XG4gICAgICAvLyBjb25zdCBvdGhlclBsYXllcklkID0gb3RoZXJQbGF5ZXIuaWQ7XG4gICAgICBjb25zdCBjaGF0S2V5ID0gYCR7cGFpck9mUGxheWVyc1swXX0tJHtwYWlyT2ZQbGF5ZXJzWzFdfWA7XG4gICAgICBhY3RpdmVDaGF0cy5wdXNoKGNoYXRLZXkpO1xuICAgIH0pO1xuICAgIC8vIERlZmF1bHQgYWxsIGNoYXRzIHRvIGJlIG9wZW4gd2hlbiBnYW1lIHN0YXJ0c1xuICAgIHBsYXllci5zZXQoXCJhY3RpdmVDaGF0c1wiLCBhY3RpdmVDaGF0cyk7XG4gICAgY29uc29sZS5sb2cocGxheWVyLmdldChcImFjdGl2ZUNoYXRzXCIpKTtcbiAgfSk7XG4gIGdhbWUuc2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIsIGdhbWUucGxheWVycy5sZW5ndGgpO1xufSk7XG5cbi8vIG9uUm91bmRTdGFydCBpcyB0cmlnZ2VyZWQgYmVmb3JlIGVhY2ggcm91bmQgc3RhcnRzLCBhbmQgYmVmb3JlIG9uU3RhZ2VTdGFydC5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lU3RhcnQsIGFuZCB0aGUgcm91bmQgdGhhdCBpcyBzdGFydGluZy5cbkVtcGlyaWNhLm9uUm91bmRTdGFydCgoZ2FtZSwgcm91bmQpID0+IHtcbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAgIHBsYXllci5zZXQoXCJzeW1ib2xTZWxlY3RlZFwiLCBcIlwiKTtcbiAgfSk7XG4gIHJvdW5kLnNldChcInJlc3VsdFwiLCBmYWxzZSk7XG4gIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgMCk7XG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoYWN0aXZlUGxheWVycy5sZW5ndGggPCBnYW1lLmdldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiKSApIHsgLy8gU29tZW9uZSBsZWZ0IGluIHRoZSBtaWRkbGUgb2YgdGhlIHJvdW5kXG4gICAgaWYgKGdhbWUudHJlYXRtZW50LmVuZEdhbWVJZlBsYXllcklkbGUpIHtcbiAgICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICBwLmV4aXQoXCJzb21lb25lSW5hY3RpdmVcIik7XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpOyAvLyBVcGRhdGVzIHRoZSBuZWlnaGJvcnMgdG8gYmUgZnVsbHkgY29ubmVjdGVkXG4gICAgfVxuICBcbiAgfVxuICBnYW1lLnNldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiLCBhY3RpdmVQbGF5ZXJzLmxlbmd0aCk7XG5cbiAgY29uc29sZS5sb2coXCJSb3VuZCBTdGFydGVkXCIpO1xuXG59KTtcblxuLy8gb25TdGFnZVN0YXJ0IGlzIHRyaWdnZXJlZCBiZWZvcmUgZWFjaCBzdGFnZSBzdGFydHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uUm91bmRTdGFydCwgYW5kIHRoZSBzdGFnZSB0aGF0IGlzIHN0YXJ0aW5nLlxuRW1waXJpY2Eub25TdGFnZVN0YXJ0KChnYW1lLCByb3VuZCwgc3RhZ2UpID0+IHtcbiAgY29uc29sZS5sb2coXCJTdGFnZSBTdGFydGVkXCIpXG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJUYXNrXCIpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgY29uc29sZS5sb2coIGBTeW1ib2xzIDogJHtwbGF5ZXIuZ2V0KGAke3N0YWdlLmRpc3BsYXlOYW1lfWApfWApO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKGBBbnN3ZXI6ICR7c3RhZ2UuZ2V0KFwiYW5zd2VyXCIpfWApO1xuICB9XG4gIGlmIChzdGFnZS5uYW1lID09PSBcIlN1cnZleVwiKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIHBsYXllci5zZXQoXCJzdXJ2ZXlOdW1iZXJcIiAsIDEpXG4gICAgfSk7XG4gIH1cbiAgLy8gZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAvLyB9KTtcbiAgLy8gc3RhZ2Uuc2V0KFwic2hvd1Jlc3VsdHNcIiwgZmFsc2UpO1xuICAvLyBzdGFnZS5zZXQoXCJyZXN1bHRzU2hvd25cIiwgZmFsc2UpO1xuXG59KTtcblxuLy8gb25TdGFnZUVuZCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgZWFjaCBzdGFnZS5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25Sb3VuZEVuZCwgYW5kIHRoZSBzdGFnZSB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblN0YWdlRW5kKChnYW1lLCByb3VuZCwgc3RhZ2UpID0+e1xuICBjb25zb2xlLmxvZyhcIlN0YWdlIEVuZGVkXCIpXG4gIFxufSk7XG5cbi8vIG9uUm91bmRFbmQgaXMgdHJpZ2dlcmVkIGFmdGVyIGVhY2ggcm91bmQuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZUVuZCwgYW5kIHRoZSByb3VuZCB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblJvdW5kRW5kKChnYW1lLCByb3VuZCkgPT4ge1xuICAvLyBnYW1lLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAvLyAgIGNvbnN0IHZhbHVlID0gcGxheWVyLnJvdW5kLmdldChcInZhbHVlXCIpIHx8IDA7XG4gIC8vICAgY29uc3QgcHJldlNjb3JlID0gcGxheWVyLmdldChcInNjb3JlXCIpIHx8IDA7XG4gIC8vICAgcGxheWVyLnNldChcInNjb3JlXCIsIHByZXZTY29yZSArIHZhbHVlKTtcbiAgLy8gfSk7XG5cbn0pO1xuXG4vLyBvbkdhbWVFbmQgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGdhbWUgZW5kcy5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lU3RhcnQuXG5FbXBpcmljYS5vbkdhbWVFbmQoZ2FtZSA9PiB7fSk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT4gb25TZXQsIG9uQXBwZW5kIGFuZCBvbkNoYW5nZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBvblNldCwgb25BcHBlbmQgYW5kIG9uQ2hhbmdlIGFyZSBjYWxsZWQgb24gZXZlcnkgc2luZ2xlIHVwZGF0ZSBtYWRlIGJ5IGFsbFxuLy8gcGxheWVycyBpbiBlYWNoIGdhbWUsIHNvIHRoZXkgY2FuIHJhcGlkbHkgYmVjb21lIHF1aXRlIGV4cGVuc2l2ZSBhbmQgaGF2ZVxuLy8gdGhlIHBvdGVudGlhbCB0byBzbG93IGRvd24gdGhlIGFwcC4gVXNlIHdpc2VseS5cbi8vXG4vLyBJdCBpcyB2ZXJ5IHVzZWZ1bCB0byBiZSBhYmxlIHRvIHJlYWN0IHRvIGVhY2ggdXBkYXRlIGEgdXNlciBtYWtlcy4gVHJ5XG4vLyBub250aGVsZXNzIHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgY29tcHV0YXRpb25zIGFuZCBkYXRhYmFzZSBzYXZlcyAoLnNldClcbi8vIGRvbmUgaW4gdGhlc2UgY2FsbGJhY2tzLiBZb3UgY2FuIGFsc28gdHJ5IHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgY2FsbHMgdG9cbi8vIHNldCgpIGFuZCBhcHBlbmQoKSB5b3UgbWFrZSAoYXZvaWQgY2FsbGluZyB0aGVtIG9uIGEgY29udGludW91cyBkcmFnIG9mIGFcbi8vIHNsaWRlciBmb3IgZXhhbXBsZSkgYW5kIGluc2lkZSB0aGVzZSBjYWxsYmFja3MgdXNlIHRoZSBga2V5YCBhcmd1bWVudCBhdCB0aGVcbi8vIHZlcnkgYmVnaW5uaW5nIG9mIHRoZSBjYWxsYmFjayB0byBmaWx0ZXIgb3V0IHdoaWNoIGtleXMgeW91ciBuZWVkIHRvIHJ1blxuLy8gbG9naWMgYWdhaW5zdC5cbi8vXG4vLyBJZiB5b3UgYXJlIG5vdCB1c2luZyB0aGVzZSBjYWxsYmFja3MsIGNvbW1lbnQgdGhlbSBvdXQgc28gdGhlIHN5c3RlbSBkb2VzXG4vLyBub3QgY2FsbCB0aGVtIGZvciBub3RoaW5nLlxuXG4vLyAvLyBvblNldCBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIC5zZXQoKSBtZXRob2Rcbi8vIC8vIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uU2V0KChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbi8vICkgPT4ge1xuLy8gICAvLyAvLyBFeGFtcGxlIGZpbHRlcmluZ1xuLy8gICAvLyBpZiAoa2V5ICE9PSBcInZhbHVlXCIpIHtcbi8vICAgLy8gICByZXR1cm47XG4vLyAgIC8vIH1cbi8vIH0pO1xuXG5FbXBpcmljYS5vblNldCgoXG4gIGdhbWUsXG4gIHJvdW5kLFxuICBzdGFnZSxcbiAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbiAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4gIHZhbHVlLCAvLyBOZXcgdmFsdWVcbiAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4pID0+IHtcbiAgY29uc3QgcGxheWVycyA9IGdhbWUucGxheWVycztcbiAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG4gIC8vIFNvbWUgcGxheWVyIGRlY2lkZXMgdG8gcmVjb25zaWRlciB0aGVpciBhbnN3ZXJcbiAgY29uc29sZS5sb2coXCJrZXlcIiwga2V5KTtcbiAgaWYgKGtleSA9PT0gXCJzdWJtaXR0ZWRcIikgeyBcbiAgICAvLyBDaGVja3MgaWYgZXZlcnlvbmUgaGFzIHN1Ym1pdHRlZCB0aGVpciBhbnN3ZXIgYW5kIGlmIHNvLCBzdWJtaXQgdGhlIHN0YWdlXG4gICAgbGV0IGFsbFN1Ym1pdHRlZCA9IHRydWU7XG4gICAgbGV0IG51bVBsYXllcnNTdWJtaXR0ZWQgPSAwO1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmdldChcInN1Ym1pdHRlZFwiKSkge1xuICAgICAgICBudW1QbGF5ZXJzU3VibWl0dGVkICs9IDE7XG4gICAgICB9XG4gICAgICBhbGxTdWJtaXR0ZWQgPSBwbGF5ZXIuZ2V0KFwic3VibWl0dGVkXCIpICYmIGFsbFN1Ym1pdHRlZDtcbiAgICB9KVxuICAgIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgbnVtUGxheWVyc1N1Ym1pdHRlZCk7XG4gICAgaWYgKGFsbFN1Ym1pdHRlZCkge1xuICAgICAgY29uc3QgbG9nID0gc3RhZ2UuZ2V0KFwibG9nXCIpO1xuICAgICAgY29tcHV0ZVNjb3JlKGFjdGl2ZVBsYXllcnMsIHN0YWdlLCByb3VuZCk7XG4gICAgICAvLyBOZWVkIHRvIHN1Ym1pdCBmb3Igc3VibWl0IHRoZSBzdGFnZSBmb3IgZXZlcnkgcGxheWVyXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgICAgIH0pXG4gICAgfVxuICAvLyAgIGlmIChzdGFnZS5nZXQoXCJyZXN1bHRzU2hvd25cIikpIHtcbiAgLy8gICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgLy8gICAgIH0pXG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gaWYgKHRhcmdldFR5cGUgPT09IFwic3RhZ2VcIiAmJiBrZXkgPT09IFwicmVzdWx0c1Nob3duXCIpIHtcbiAgLy8gICBpZiAoc3RhZ2UuZ2V0KFwicmVzdWx0c1Nob3duXCIpKSB7XG4gIC8vICAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4gIC8vICAgICB9KVxuICAvLyAgIH1cbiAgfVxuXG4gIC8vIGVsc2UgaWYgKGtleSA9PT0gXCJpbmFjdGl2ZVwiKSB7XG4gICAgLy8gZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgLy8gfVxuXG4gIHJldHVybjtcblxufSk7XG5cbmZ1bmN0aW9uIGNvbXB1dGVTY29yZShhY3RpdmVQbGF5ZXJzLCBzdGFnZSwgcm91bmQpIHtcbiAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuICBjb25zb2xlLmxvZyhcIkNPUlJFQ1QgQU5TV0VSOlwiKVxuICBjb25zb2xlLmxvZyhzdGFnZS5nZXQoXCJhbnN3ZXJcIikpO1xuICBjb25zb2xlLmxvZyhcIlBsYXllcnMgZ3Vlc3NlZDpcIilcblxuICBhY3RpdmVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICBjb25zdCBzdWJtaXNzaW9uID0gcGxheWVyLmdldChcInN5bWJvbFNlbGVjdGVkXCIpO1xuICAgIGNvbnNvbGUubG9nKHN1Ym1pc3Npb24pO1xuICAgIGlmIChzdWJtaXNzaW9uICE9PSBzdGFnZS5nZXQoXCJhbnN3ZXJcIikpIHtcbiAgICAgIHN1Y2Nlc3MgPSBmYWxzZVxuICAgIH1cbiAgfSlcbiAgcm91bmQuc2V0KFwicmVzdWx0XCIsIHN1Y2Nlc3MpO1xuICBpZiAoc3VjY2Vzcykge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgY29uc3QgcHJldlNjb3JlID0gcGxheWVyLmdldChcInNjb3JlXCIpIHx8IDA7XG4gICAgICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgcHJldlNjb3JlICsgMSk7XG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyhcIiBBbGwgcGxheWVycyBnb3QgaXQgY29ycmVjdGx5XCIpO1xuICB9IFxufVxuXG4vLyAvLyBvbkFwcGVuZCBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIGAuYXBwZW5kKClgIG1ldGhvZFxuLy8gLy8gb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3IgcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25BcHBlbmQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gKSA9PiB7XG4vLyAgIC8vIE5vdGU6IGB2YWx1ZWAgaXMgdGhlIHNpbmdsZSBsYXN0IHZhbHVlIChlLmcgMC4yKSwgd2hpbGUgYHByZXZWYWx1ZWAgd2lsbFxuLy8gICAvLyAgICAgICBiZSBhbiBhcnJheSBvZiB0aGUgcHJldmlzb3VzIHZhbHVlZCAoZS5nLiBbMC4zLCAwLjQsIDAuNjVdKS5cbi8vIH0pO1xuXG5cbi8vIC8vIG9uQ2hhbmdlIGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgYC5zZXQoKWAgb3IgdGhlXG4vLyAvLyBgLmFwcGVuZCgpYCBtZXRob2Qgb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3Jcbi8vIC8vIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uQ2hhbmdlKChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUsIC8vIFByZXZpb3VzIHZhbHVlXG4vLyAgIGlzQXBwZW5kIC8vIFRydWUgaWYgdGhlIGNoYW5nZSB3YXMgYW4gYXBwZW5kLCBmYWxzZSBpZiBpdCB3YXMgYSBzZXRcbi8vICkgPT4ge1xuLy8gICAvLyBgb25DaGFuZ2VgIGlzIHVzZWZ1bCB0byBydW4gc2VydmVyLXNpZGUgbG9naWMgZm9yIGFueSB1c2VyIGludGVyYWN0aW9uLlxuLy8gICAvLyBOb3RlIHRoZSBleHRyYSBpc0FwcGVuZCBib29sZWFuIHRoYXQgd2lsbCBhbGxvdyB0byBkaWZmZXJlbmNpYXRlIHNldHMgYW5kXG4vLyAgIC8vIGFwcGVuZHMuXG4vLyAgICBHYW1lLnNldChcImxhc3RDaGFuZ2VBdFwiLCBuZXcgRGF0ZSgpLnRvU3RyaW5nKCkpXG4vLyB9KTtcblxuLy8gLy8gb25TdWJtaXQgaXMgY2FsbGVkIHdoZW4gdGhlIHBsYXllciBzdWJtaXRzIGEgc3RhZ2UuXG4vLyBFbXBpcmljYS5vblN1Ym1pdCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyIC8vIFBsYXllciB3aG8gc3VibWl0dGVkXG4vLyApID0+IHtcbi8vIH0pO1xuIiwiY29uc3QgZmlsbGVyTmFtZXMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCIuc3BsaXQoXCJcIik7XG5jb25zdCBhbGxTeW1ib2xzID0gW1widDFcIiwgXCJ0MlwiLCBcInQzXCIsIFwidDRcIiwgXCJ0NVwiLCBcInQ2XCIsIFwidDdcIixcInQ4XCIsXCJ0OVwiLFwidDEwXCIsXCJ0MTFcIixcInQxMlwiXTtcblxuLy8gbiA9IG51bWJlciBvZiBwZW9wbGUgLCBwID0gbnVtYmVyIG9mIHN5bWJvbHNcbi8vIChuLTEpKnAgKyAxXG4vLyBpLmUuIG4gPSAzLCBwID0gMyA6IDdcblxuZXhwb3J0IGNvbnN0IHRlc3RUYW5ncmFtcyA9IFtcbiAge1xuICAgIF9pZDogXCIwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAyXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAzXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDNcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIzXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDRcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI0XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA1XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDVcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI1XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA2XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDZcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI2XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA3XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDdcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI3XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA4XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDhcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI4XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA5XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDlcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI5XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMFwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjExXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMlwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxM1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTNcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDE0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxNFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTVcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0M1wiLFxuICB9LFxuXG5dO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldE5laWdoYm9ycyhzdHJ1Y3R1cmUsIHBsYXllcikge1xuICAgIGNvbnN0IG5laWdoYm9ycyA9IFtdO1xuICAgIGxldCBuZXR3b3JrID0gc3RydWN0dXJlLnNwbGl0KFwiLFwiKTtcblxuICAgIG5ldHdvcmsuZm9yRWFjaCgobikgPT4ge1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IG4uc3BsaXQoXCItXCIpO1xuICAgICAgY29uc3QgcGxheWVySW5kZXggPSBwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpO1xuICBcbiAgICAgIGlmIChwbGF5ZXJJbmRleCA9PT0gcGFyc2VJbnQoY29ubmVjdGlvblswXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goY29ubmVjdGlvblsxXSk7XG4gICAgICB9IGVsc2UgaWYgKHBsYXllckluZGV4ID09PSBwYXJzZUludChjb25uZWN0aW9uWzFdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChjb25uZWN0aW9uWzBdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgXG4gICAgcmV0dXJuIF8udW5pcShuZWlnaGJvcnMsIHRydWUpO1xuICB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpIHtcbiAgICBjb25zdCBhY3RpdmVOb2RlcyA9IFtdO1xuICAgIGNvbnN0IGFsbE5vZGVzID0gW107XG4gICAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gICAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cblxuICAgIC8vIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgIC8vICAgYWN0aXZlTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICAvLyB9KVxuXG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIC8vIGlmIChwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdHZlXCIpKSB7XG4gICAgICBpZiAoIXAuZ2V0KFwiaW5hY3R2ZVwiKSkge1xuXG4gICAgICAgIGFjdGl2ZU5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgICB9XG4gICAgICBhbGxOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgIH0pXG5cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgLy8gT25seSBzaG93IGFjdGl2ZSBwZW9wbGVcbiAgICAgIC8vIGNvbnN0IG5ld05laWdoYm9ycyA9IGFjdGl2ZU5vZGVzLmZpbHRlcihpZCA9PiBwYXJzZUludChpZCkgIT09IHAuZ2V0KFwibm9kZUlkXCIpKVxuICAgICAgLy8gcC5zZXQoXCJuZWlnaGJvcnNcIiwgbmV3TmVpZ2hib3JzKTtcblxuICAgICAgLy8gU2hvdyBldmVyeW9uZSwgbWFyayBvZmZsaW5lIHBlb3BsZSBhcyBvZmZsaW5lXG4gICAgICBjb25zdCBuZXdOZWlnaGJvcnMgPSBhbGxOb2Rlcy5maWx0ZXIoaWQgPT4gcGFyc2VJbnQoaWQpICE9PSBwLmdldChcIm5vZGVJZFwiKSlcbiAgICAgIHAuc2V0KFwibmVpZ2hib3JzXCIsIG5ld05laWdoYm9ycyk7XG4gICAgfSlcbn0iLCJpbXBvcnQgRW1waXJpY2EgZnJvbSBcIm1ldGVvci9lbXBpcmljYTpjb3JlXCI7XG5pbXBvcnQgXCIuL2JvdHMuanNcIjtcbmltcG9ydCBcIi4vY2FsbGJhY2tzLmpzXCI7XG5cbmltcG9ydCB7IHRlc3RTeW1ib2xzLCB0ZXN0VGFuZ3JhbXMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjsgXG5pbXBvcnQgeyBnZXROZWlnaGJvcnMsIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIgfSBmcm9tIFwiLi91dGlsXCI7XG5cbi8vIGdhbWVJbml0IGlzIHdoZXJlIHRoZSBzdHJ1Y3R1cmUgb2YgYSBnYW1lIGlzIGRlZmluZWQuXG4vLyBKdXN0IGJlZm9yZSBldmVyeSBnYW1lIHN0YXJ0cywgb25jZSBhbGwgdGhlIHBsYXllcnMgbmVlZGVkIGFyZSByZWFkeSwgdGhpc1xuLy8gZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggdGhlIHRyZWF0bWVudCBhbmQgdGhlIGxpc3Qgb2YgcGxheWVycy5cbi8vIFlvdSBtdXN0IHRoZW4gYWRkIHJvdW5kcyBhbmQgc3RhZ2VzIHRvIHRoZSBnYW1lLCBkZXBlbmRpbmcgb24gdGhlIHRyZWF0bWVudFxuLy8gYW5kIHRoZSBwbGF5ZXJzLiBZb3UgY2FuIGFsc28gZ2V0L3NldCBpbml0aWFsIHZhbHVlcyBvbiB5b3VyIGdhbWUsIHBsYXllcnMsXG4vLyByb3VuZHMgYW5kIHN0YWdlcyAod2l0aCBnZXQvc2V0IG1ldGhvZHMpLCB0aGF0IHdpbGwgYmUgYWJsZSB0byB1c2UgbGF0ZXIgaW5cbi8vIHRoZSBnYW1lLlxuRW1waXJpY2EuZ2FtZUluaXQoZ2FtZSA9PiB7XG4gIGNvbnN0IHtcbiAgICB0cmVhdG1lbnQ6IHtcbiAgICAgIHBsYXllckNvdW50LFxuICAgICAgbmV0d29ya1N0cnVjdHVyZSxcbiAgICAgIG51bVRhc2tSb3VuZHMsXG4gICAgICBudW1TdXJ2ZXlSb3VuZHMsXG4gICAgICBzZXRTaXplQmFzZWRPblBsYXllckNvdW50LFxuICAgICAgdXNlckluYWN0aXZpdHlEdXJhdGlvbixcbiAgICAgIHRhc2tEdXJhdGlvbixcbiAgICAgIGRlZmF1bHRTZXRTaXplLFxuICAgICAgc3VydmV5RHVyYXRpb24sXG4gICAgICByZXN1bHRzRHVyYXRpb24sXG4gICAgICBtYXhOdW1PdmVybGFwLFxuICAgIH0sXG4gIH0gPSBnYW1lO1xuXG5cbiAgY29uc3Qgc3ltYm9sU2V0ID0gdGVzdFRhbmdyYW1zO1xuICBjb25zdCBzZXRTaXplID0gc2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCA/IHBsYXllckNvdW50ICsgMSA6IGRlZmF1bHRTZXRTaXplOyAvL1RPRE86IGNhbiBjaGFuZ2UgZGVmYXVsdCB2YWx1ZSBpbiBzZXR0aW5nc1xuICBjb25zdCBudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkgPSBudW1UYXNrUm91bmRzL251bVN1cnZleVJvdW5kcztcblxuICBsZXQgY29sb3JzID0gW1wiR3JlZW5cIiwgXCJSZWRcIiwgXCJZZWxsb3dcIiwgXCJCbHVlXCIsIFwiUHVycGxlXCIsIFwiV2hpdGVcIiwgXCJCbGFja1wiXVxuICBjb2xvcnMgPSBzaHVmZmxlKGNvbG9ycyk7XG5cbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllciwgaSkgPT4ge1xuICAgIHBsYXllci5zZXQoXCJhdmF0YXJcIiwgYC9hdmF0YXJzL2pkZW50aWNvbi8ke3BsYXllci5faWR9YCk7XG4gICAgcGxheWVyLnNldChcInNjb3JlXCIsIDApO1xuXG4gICAgLy8gR2l2ZSBlYWNoIHBsYXllciBhIG5vZGVJZCBiYXNlZCBvbiB0aGVpciBwb3NpdGlvbiAoaW5kZXhlZCBhdCAxKVxuICAgIHBsYXllci5zZXQoXCJub2RlSWRcIiwgaSArIDEpO1xuICAgIHBsYXllci5zZXQoXCJuYW1lXCIsIHBsYXllci5pZCk7XG4gICAgcGxheWVyLnNldChcImFub255bW91c05hbWVcIiwgY29sb3JzW2ldKVxuICB9KTtcblxuXG4gIGlmIChnYW1lLnBsYXllcnMubGVuZ3RoIDwgZ2FtZS50cmVhdG1lbnQucGxheWVyQ291bnQpIHsgLy8gaWYgbm90IGEgZnVsbCBnYW1lLCBkZWZhdWx0IHRvIGZ1bGx5IGNvbm5lY3RlZCBsYXllclxuICAgIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSk7XG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHAuZ2V0KFwibmVpZ2hib3JzXCIpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgcC5zZXQoXCJuZWlnaGJvcnNcIiwgZ2V0TmVpZ2hib3JzKG5ldHdvcmtTdHJ1Y3R1cmUsIHApKTtcbiAgICAgIGNvbnNvbGUubG9nKHAuZ2V0KFwibmVpZ2hib3JzXCIpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEZvciBlYWNoIHJvdW5kLCBhZGQgYWxsIHRoZSBzeW1ib2xzLCByYW5kb21seSBzZWxlY3QgYSBjb3JyZWN0IGFuc3dlciBhbmRcbiAgLy8gQ29uc3RyYWludHM6IE11c3QgZW5zdXJlIHRoYXQgZXZlcnlvbmUgaGFzIG9ubHkgb25lIHN5bWJvbCBpbiBjb21tb25cbiAgXy50aW1lcyggbnVtVGFza1JvdW5kcywgaSA9PiB7XG4gICAgY29uc3Qgcm91bmQgPSBnYW1lLmFkZFJvdW5kKCk7XG5cbiAgICBjb25zdCB7c3ltYm9scywgdGFza05hbWUsIGFuc3dlcn0gPSBzeW1ib2xTZXRbaV07XG5cbiAgICBjb25zdCB0YXNrU3RhZ2UgPSByb3VuZC5hZGRTdGFnZSh7XG4gICAgICBuYW1lOiBcIlRhc2tcIixcbiAgICAgIGRpc3BsYXlOYW1lOiB0YXNrTmFtZSxcbiAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgZHVyYXRpb25JblNlY29uZHM6IHRhc2tEdXJhdGlvblxuICAgIH0pO1xuICAgIHRhc2tTdGFnZS5zZXQoXCJ0YXNrXCIsIHN5bWJvbFNldFtpXSk7XG4gICAgZ2V0U3ltYm9sc0ZvclBsYXllcnMoc3ltYm9scywgYW5zd2VyLCBzZXRTaXplLCB0YXNrTmFtZSwgZ2FtZSwgbWF4TnVtT3ZlcmxhcClcbiAgICB0YXNrU3RhZ2Uuc2V0KFwiYW5zd2VyXCIsIHN5bWJvbFNldFtpXS5hbnN3ZXIpXG5cbiAgICBjb25zdCByZXN1bHRTdGFnZSA9IHJvdW5kLmFkZFN0YWdlKHtcbiAgICAgIG5hbWU6IFwiUmVzdWx0XCIsXG4gICAgICBkaXNwbGF5TmFtZTogXCJSZXN1bHRcIixcbiAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiByZXN1bHRzRHVyYXRpb25cbiAgICB9KTtcbiAgICBcbiAgICBpZiAoKGkrMSkgJSBudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkgPT09IDApIHsgLy8gQWZ0ZXIgNSB0YXNrIHJvdW5kcywgYWRkIGEgc3VydmV5IHJvdW5kXG4gICAgICBjb25zdCBzdXJ2ZXlSb3VuZCA9IGdhbWUuYWRkUm91bmQoKTtcblxuICAgICAgY29uc3Qgc3VydmV5U3RhZ2VzID0gc3VydmV5Um91bmQuYWRkU3RhZ2Uoe1xuICAgICAgICBuYW1lOiBcIlN1cnZleVwiLFxuICAgICAgICBkaXNwbGF5TmFtZTogXCJTdXJ2ZXlcIixcbiAgICAgICAgZHVyYXRpb25JblNlY29uZHM6IHN1cnZleUR1cmF0aW9uXG4gICAgICB9KVxuICAgIH1cblxuICB9KTtcblxuXG5cbiAgZnVuY3Rpb24gZ2V0U3ltYm9sc0ZvclBsYXllcnMoc3ltYm9sU2V0LCBhbnN3ZXIsIHNldFNpemUsIHRhc2tOYW1lLCBnYW1lLCBtYXhOdW1PdmVybGFwKSB7XG4gICAgICBsZXQgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xTZXQuZmlsdGVyKHN5bWJvbCA9PiBzeW1ib2wgIT09IGFuc3dlcik7XG4gICAgICBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHNodWZmbGUoc3ltYm9sc1dpdGhvdXRBbnN3ZXIpO1xuICAgICAgbGV0IG51bVBsYXllcnMgPSBnYW1lLnBsYXllcnMubGVuZ3RoO1xuICAgICAgbGV0IG51bU92ZXJsYXAgPSAwO1xuXG5cbiAgICAgIC8vIENyZWF0ZSBhIGRpY3Rpb25hcnkgdG8ga2VlcCB0cmFjayBvZiBob3cgbWFueSB0aW1lcyBzeW1ib2wgaGFzIGJlZW4gdXNlZFxuICAgICAgbGV0IHN5bWJvbEZyZXEgPSB7fVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzeW1ib2xzV2l0aG91dEFuc3dlci5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgc3ltYm9sID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXJbaV1cbiAgICAgICAgaWYgKCFzeW1ib2xGcmVxLmhhc093blByb3BlcnR5KHN5bWJvbCkpIHtcbiAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gPSBudW1QbGF5ZXJzIC0gMTsgLy8gVG90YWwgdGltZSBhIHN5bWJvbCBjYW4gYmUgdXNlZCBcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIGxldCBzeW1ib2xzUGlja2VkID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ltYm9sc1dpdGhvdXRBbnN3ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgc3ltYm9sID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXJbaV1cbiAgICAgICAgICBpZiAoc3ltYm9sc1BpY2tlZC5sZW5ndGggPCBzZXRTaXplIC0gMSkgeyAvLyBBZGQgc3ltYm9scyB1bnRpbCBzZXRTaXplIC0gMSBmb3IgYW5zd2VyXG4gICAgICAgICAgICBpZiAoc3ltYm9sRnJlcVtzeW1ib2xdIC0gMSA9PT0gMCkgeyAvLyBUaGlzIHN5bWJvbCB3aWxsIG92ZXJsYXBcbiAgICAgICAgICAgICAgICBpZiAobnVtT3ZlcmxhcCA8IG1heE51bU92ZXJsYXAgKSB7IC8vIE9ubHkgYWRkIGlmIGxlc3MgdGhhbiBtYXggb3ZlcmxhcFxuICAgICAgICAgICAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gLT0gMTtcbiAgICAgICAgICAgICAgICAgIG51bU92ZXJsYXAgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKGFuc3dlcik7IC8vIEFkZCB0aGUgYW5zd2VyXG4gICAgICAgIGZvciAodmFyIHN5bWJvbFRvUmVtb3ZlIG9mIHN5bWJvbHNQaWNrZWQpIHtcbiAgICAgICAgICBpZiAoc3ltYm9sRnJlcVtzeW1ib2xUb1JlbW92ZV0gPT09IDApIHsgLy8gSWYgc3ltYm9sIGhhcyBiZWVuIHBpY2tlZCBuLTEgcGxheWVycyB0aW1lcywgcmVtb3ZlIGl0IGZyb20gdGhlIHNldFxuICAgICAgICAgICAgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xzV2l0aG91dEFuc3dlci5maWx0ZXIoc3ltYm9sID0+IHN5bWJvbCAhPT0gc3ltYm9sVG9SZW1vdmUpO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3ltYm9sc1BpY2tlZCA9IHNodWZmbGUoc3ltYm9sc1BpY2tlZCk7XG5cbiAgICAgICAgcGxheWVyLnNldCh0YXNrTmFtZSwgc3ltYm9sc1BpY2tlZCk7XG4gICAgICB9KVxuXG5cbiAgfVxuXG4gIC8vIFNodWZmbGluZyBhcnJheXM6XG4gIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUwNTM2MDQ0L3N3YXBwaW5nLWFsbC1lbGVtZW50cy1vZi1hbi1hcnJheS1leGNlcHQtZm9yLWZpcnN0LWFuZC1sYXN0XG4gIGZ1bmN0aW9uIHNodWZmbGUoc3ltYm9sU2V0KSB7XG4gICAgZm9yIChpID0gc3ltYm9sU2V0Lmxlbmd0aCAtMSA7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcblxuICAgICAgW3N5bWJvbFNldFtpXSwgc3ltYm9sU2V0W2pdXSA9IFtzeW1ib2xTZXRbal0sIHN5bWJvbFNldFtpXV07XG4gICAgfVxuICAgIHJldHVybiBzeW1ib2xTZXQ7XG4gIH1cblxufSk7XG4iXX0=
