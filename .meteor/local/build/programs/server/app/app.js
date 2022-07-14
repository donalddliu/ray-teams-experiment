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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm9uR2FtZVN0YXJ0IiwiY29uc29sZSIsImxvZyIsInBsYXllcnMiLCJmb3JFYWNoIiwicGxheWVyIiwic2V0IiwibmV0d29yayIsImdldCIsImFjdGl2ZUNoYXRzIiwibWFwIiwib3RoZXJOb2RlSWQiLCJwYWlyT2ZQbGF5ZXJzIiwicGFyc2VJbnQiLCJzb3J0IiwicDEiLCJwMiIsIm90aGVyUGxheWVyIiwiZmluZCIsInAiLCJjaGF0S2V5IiwicHVzaCIsImxlbmd0aCIsIm9uUm91bmRTdGFydCIsImFjdGl2ZVBsYXllcnMiLCJmaWx0ZXIiLCJ0cmVhdG1lbnQiLCJlbmRHYW1lSWZQbGF5ZXJJZGxlIiwiZXhpdCIsIm9uU3RhZ2VTdGFydCIsIm5hbWUiLCJkaXNwbGF5TmFtZSIsIm9uU3RhZ2VFbmQiLCJvblJvdW5kRW5kIiwib25HYW1lRW5kIiwib25TZXQiLCJ0YXJnZXQiLCJ0YXJnZXRUeXBlIiwia2V5IiwidmFsdWUiLCJwcmV2VmFsdWUiLCJhbGxTdWJtaXR0ZWQiLCJudW1QbGF5ZXJzU3VibWl0dGVkIiwiY29tcHV0ZVNjb3JlIiwic3VibWl0Iiwic3VjY2VzcyIsInN1Ym1pc3Npb24iLCJwcmV2U2NvcmUiLCJleHBvcnQiLCJ0ZXN0VGFuZ3JhbXMiLCJhbGxTeW1ib2xzIiwiX2lkIiwidGFza05hbWUiLCJzeW1ib2xzIiwiYW5zd2VyIiwiZ2V0TmVpZ2hib3JzIiwic3RydWN0dXJlIiwibmVpZ2hib3JzIiwic3BsaXQiLCJwbGF5ZXJJbmRleCIsIm4iLCJjb25uZWN0aW9uIiwicmVwbGFjZSIsIlNldCIsImFjdGl2ZU5vZGVzIiwiYWxsTm9kZXMiLCJuZXdOZWlnaGJvcnMiLCJpZCIsInRlc3RTeW1ib2xzIiwiZ2FtZUluaXQiLCJwbGF5ZXJDb3VudCIsIm5ldHdvcmtTdHJ1Y3R1cmUiLCJudW1UYXNrUm91bmRzIiwibnVtU3VydmV5Um91bmRzIiwic2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCIsInVzZXJJbmFjdGl2aXR5RHVyYXRpb24iLCJ0YXNrRHVyYXRpb24iLCJkZWZhdWx0U2V0U2l6ZSIsInN1cnZleUR1cmF0aW9uIiwicmVzdWx0c0R1cmF0aW9uIiwibWF4TnVtT3ZlcmxhcCIsInN5bWJvbFNldCIsInNldFNpemUiLCJudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkiLCJjb2xvcnMiLCJzaHVmZmxlIiwiaSIsIl8iLCJ0aW1lcyIsImFkZFJvdW5kIiwidGFza1N0YWdlIiwiYWRkU3RhZ2UiLCJkdXJhdGlvbkluU2Vjb25kcyIsImdldFN5bWJvbHNGb3JQbGF5ZXJzIiwicmVzdWx0U3RhZ2UiLCJzdXJ2ZXlSb3VuZCIsInN1cnZleVN0YWdlcyIsInN5bWJvbHNXaXRob3V0QW5zd2VyIiwic3ltYm9sIiwibnVtUGxheWVycyIsIm51bU92ZXJsYXAiLCJzeW1ib2xGcmVxIiwiaGFzT3duUHJvcGVydHkiLCJzeW1ib2xzUGlja2VkIiwic3ltYm9sVG9SZW1vdmUiLCJqIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLFFBQUo7QUFBYUMsTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0osWUFBUSxHQUFDSSxDQUFUO0FBQVc7O0FBQXZCLENBQW5DLEVBQTRELENB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QmdFLENBQUMsR0FBRyxDQUFuQyxFQUFzQ0EsQ0FBQyxFQUF2QyxFQUEyQztBQUN6QyxZQUFNbUIsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLE1BQWlCdEIsQ0FBQyxHQUFHLENBQXJCLENBQVgsQ0FBVjtBQUVBLE9BQUNMLFNBQVMsQ0FBQ0ssQ0FBRCxDQUFWLEVBQWVMLFNBQVMsQ0FBQ3dCLENBQUQsQ0FBeEIsSUFBK0IsQ0FBQ3hCLFNBQVMsQ0FBQ3dCLENBQUQsQ0FBVixFQUFleEIsU0FBUyxDQUFDSyxDQUFELENBQXhCLENBQS9CO0FBQ0Q7O0FBQ0QsV0FBT0wsU0FBUDtBQUNEO0FBRUYsQ0FqSkQsRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuXG4vLyBUaGlzIGlzIHdoZXJlIHlvdSBhZGQgYm90cywgbGlrZSBCb2I6XG5cbkVtcGlyaWNhLmJvdChcImJvYlwiLCB7XG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaCBzdGFnZSAoYWZ0ZXIgb25Sb3VuZFN0YXJ0L29uU3RhZ2VTdGFydClcbiAgLy8gb25TdGFnZVN0YXJ0KGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzKSB7fSxcblxuICAvLyBDYWxsZWQgZHVyaW5nIGVhY2ggc3RhZ2UgYXQgdGljayBpbnRlcnZhbCAofjFzIGF0IHRoZSBtb21lbnQpXG4gIG9uU3RhZ2VUaWNrKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBzZWNvbmRzUmVtYWluaW5nKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQSBwbGF5ZXIgaGFzIGNoYW5nZWQgYSB2YWx1ZVxuICAvLyAvLyBUaGlzIG1pZ2h0IGhhcHBlbiBhIGxvdCFcbiAgLy8gb25TdGFnZVBsYXllckNoYW5nZShib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycywgcGxheWVyKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBlbmQgb2YgdGhlIHN0YWdlIChhZnRlciBpdCBmaW5pc2hlZCwgYmVmb3JlIG9uU3RhZ2VFbmQvb25Sb3VuZEVuZCBpcyBjYWxsZWQpXG4gIC8vIG9uU3RhZ2VFbmQoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMpIHt9XG59KTtcbiIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcblxuaW1wb3J0IHsgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcblxuLy8gb25HYW1lU3RhcnQgaXMgdHJpZ2dlcmVkIG9wbmNlIHBlciBnYW1lIGJlZm9yZSB0aGUgZ2FtZSBzdGFydHMsIGFuZCBiZWZvcmVcbi8vIHRoZSBmaXJzdCBvblJvdW5kU3RhcnQuIEl0IHJlY2VpdmVzIHRoZSBnYW1lIGFuZCBsaXN0IG9mIGFsbCB0aGUgcGxheWVycyBpblxuLy8gdGhlIGdhbWUuXG5FbXBpcmljYS5vbkdhbWVTdGFydChnYW1lID0+IHtcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0ZWRcIik7XG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwiaW5hY3RpdmVcIiwgZmFsc2UpO1xuICAgIGNvbnN0IG5ldHdvcmsgPSBwbGF5ZXIuZ2V0KFwibmVpZ2hib3JzXCIpO1xuICAgIGNvbnN0IGFjdGl2ZUNoYXRzID0gW107XG4gICAgbmV0d29yay5tYXAob3RoZXJOb2RlSWQgPT4ge1xuICAgICAgdmFyIHBhaXJPZlBsYXllcnMgPSBbcGxheWVyLmdldChcIm5vZGVJZFwiKSwgcGFyc2VJbnQob3RoZXJOb2RlSWQpXTtcbiAgICAgIHBhaXJPZlBsYXllcnMuc29ydCgocDEscDIpID0+IHAxIC0gcDIpO1xuICAgICAgY29uc3Qgb3RoZXJQbGF5ZXIgPSBnYW1lLnBsYXllcnMuZmluZChwID0+IHAuZ2V0KFwibm9kZUlkXCIpID09PSBwYXJzZUludChvdGhlck5vZGVJZCkpO1xuICAgICAgLy8gY29uc3Qgb3RoZXJQbGF5ZXJJZCA9IG90aGVyUGxheWVyLmlkO1xuICAgICAgY29uc3QgY2hhdEtleSA9IGAke3BhaXJPZlBsYXllcnNbMF19LSR7cGFpck9mUGxheWVyc1sxXX1gO1xuICAgICAgYWN0aXZlQ2hhdHMucHVzaChjaGF0S2V5KTtcbiAgICB9KTtcbiAgICAvLyBEZWZhdWx0IGFsbCBjaGF0cyB0byBiZSBvcGVuIHdoZW4gZ2FtZSBzdGFydHNcbiAgICBwbGF5ZXIuc2V0KFwiYWN0aXZlQ2hhdHNcIiwgYWN0aXZlQ2hhdHMpO1xuICAgIGNvbnNvbGUubG9nKHBsYXllci5nZXQoXCJhY3RpdmVDaGF0c1wiKSk7XG4gIH0pO1xuICBnYW1lLnNldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiLCBnYW1lLnBsYXllcnMubGVuZ3RoKTtcbn0pO1xuXG4vLyBvblJvdW5kU3RhcnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSBlYWNoIHJvdW5kIHN0YXJ0cywgYW5kIGJlZm9yZSBvblN0YWdlU3RhcnQuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZVN0YXJ0LCBhbmQgdGhlIHJvdW5kIHRoYXQgaXMgc3RhcnRpbmcuXG5FbXBpcmljYS5vblJvdW5kU3RhcnQoKGdhbWUsIHJvdW5kKSA9PiB7XG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwic3VibWl0dGVkXCIsIGZhbHNlKTtcbiAgICBwbGF5ZXIuc2V0KFwic3ltYm9sU2VsZWN0ZWRcIiwgXCJcIik7XG4gIH0pO1xuICByb3VuZC5zZXQoXCJyZXN1bHRcIiwgZmFsc2UpO1xuICByb3VuZC5zZXQoXCJudW1QbGF5ZXJzU3VibWl0dGVkXCIsIDApO1xuICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cbiAgaWYgKGFjdGl2ZVBsYXllcnMubGVuZ3RoIDwgZ2FtZS5nZXQoXCJwcmV2aW91c051bUFjdGl2ZVBsYXllcnNcIikgKSB7IC8vIFNvbWVvbmUgbGVmdCBpbiB0aGUgbWlkZGxlIG9mIHRoZSByb3VuZFxuICAgIGlmIChnYW1lLnRyZWF0bWVudC5lbmRHYW1lSWZQbGF5ZXJJZGxlKSB7XG4gICAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgcC5leGl0KFwic29tZW9uZUluYWN0aXZlXCIpO1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTsgLy8gVXBkYXRlcyB0aGUgbmVpZ2hib3JzIHRvIGJlIGZ1bGx5IGNvbm5lY3RlZFxuICAgIH1cbiAgXG4gIH1cbiAgZ2FtZS5zZXQoXCJwcmV2aW91c051bUFjdGl2ZVBsYXllcnNcIiwgYWN0aXZlUGxheWVycy5sZW5ndGgpO1xuXG4gIGNvbnNvbGUubG9nKFwiUm91bmQgU3RhcnRlZFwiKTtcblxufSk7XG5cbi8vIG9uU3RhZ2VTdGFydCBpcyB0cmlnZ2VyZWQgYmVmb3JlIGVhY2ggc3RhZ2Ugc3RhcnRzLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvblJvdW5kU3RhcnQsIGFuZCB0aGUgc3RhZ2UgdGhhdCBpcyBzdGFydGluZy5cbkVtcGlyaWNhLm9uU3RhZ2VTdGFydCgoZ2FtZSwgcm91bmQsIHN0YWdlKSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiU3RhZ2UgU3RhcnRlZFwiKVxuICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cbiAgaWYgKHN0YWdlLm5hbWUgPT09IFwiVGFza1wiKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCBgU3ltYm9scyA6ICR7cGxheWVyLmdldChgJHtzdGFnZS5kaXNwbGF5TmFtZX1gKX1gKTtcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyhgQW5zd2VyOiAke3N0YWdlLmdldChcImFuc3dlclwiKX1gKTtcbiAgfVxuICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJTdXJ2ZXlcIikge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBwbGF5ZXIuc2V0KFwic3VydmV5TnVtYmVyXCIgLCAxKVxuICAgIH0pO1xuICB9XG4gIC8vIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgLy8gICBwbGF5ZXIuc2V0KFwic3VibWl0dGVkXCIsIGZhbHNlKTtcbiAgLy8gfSk7XG4gIC8vIHN0YWdlLnNldChcInNob3dSZXN1bHRzXCIsIGZhbHNlKTtcbiAgLy8gc3RhZ2Uuc2V0KFwicmVzdWx0c1Nob3duXCIsIGZhbHNlKTtcblxufSk7XG5cbi8vIG9uU3RhZ2VFbmQgaXMgdHJpZ2dlcmVkIGFmdGVyIGVhY2ggc3RhZ2UuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uUm91bmRFbmQsIGFuZCB0aGUgc3RhZ2UgdGhhdCBqdXN0IGVuZGVkLlxuRW1waXJpY2Eub25TdGFnZUVuZCgoZ2FtZSwgcm91bmQsIHN0YWdlKSA9PntcbiAgY29uc29sZS5sb2coXCJTdGFnZSBFbmRlZFwiKVxuICBcbn0pO1xuXG4vLyBvblJvdW5kRW5kIGlzIHRyaWdnZXJlZCBhZnRlciBlYWNoIHJvdW5kLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvbkdhbWVFbmQsIGFuZCB0aGUgcm91bmQgdGhhdCBqdXN0IGVuZGVkLlxuRW1waXJpY2Eub25Sb3VuZEVuZCgoZ2FtZSwgcm91bmQpID0+IHtcbiAgLy8gZ2FtZS5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgLy8gICBjb25zdCB2YWx1ZSA9IHBsYXllci5yb3VuZC5nZXQoXCJ2YWx1ZVwiKSB8fCAwO1xuICAvLyAgIGNvbnN0IHByZXZTY29yZSA9IHBsYXllci5nZXQoXCJzY29yZVwiKSB8fCAwO1xuICAvLyAgIHBsYXllci5zZXQoXCJzY29yZVwiLCBwcmV2U2NvcmUgKyB2YWx1ZSk7XG4gIC8vIH0pO1xuXG59KTtcblxuLy8gb25HYW1lRW5kIGlzIHRyaWdnZXJlZCB3aGVuIHRoZSBnYW1lIGVuZHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZVN0YXJ0LlxuRW1waXJpY2Eub25HYW1lRW5kKGdhbWUgPT4ge30pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID0+IG9uU2V0LCBvbkFwcGVuZCBhbmQgb25DaGFuZ2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gb25TZXQsIG9uQXBwZW5kIGFuZCBvbkNoYW5nZSBhcmUgY2FsbGVkIG9uIGV2ZXJ5IHNpbmdsZSB1cGRhdGUgbWFkZSBieSBhbGxcbi8vIHBsYXllcnMgaW4gZWFjaCBnYW1lLCBzbyB0aGV5IGNhbiByYXBpZGx5IGJlY29tZSBxdWl0ZSBleHBlbnNpdmUgYW5kIGhhdmVcbi8vIHRoZSBwb3RlbnRpYWwgdG8gc2xvdyBkb3duIHRoZSBhcHAuIFVzZSB3aXNlbHkuXG4vL1xuLy8gSXQgaXMgdmVyeSB1c2VmdWwgdG8gYmUgYWJsZSB0byByZWFjdCB0byBlYWNoIHVwZGF0ZSBhIHVzZXIgbWFrZXMuIFRyeVxuLy8gbm9udGhlbGVzcyB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGNvbXB1dGF0aW9ucyBhbmQgZGF0YWJhc2Ugc2F2ZXMgKC5zZXQpXG4vLyBkb25lIGluIHRoZXNlIGNhbGxiYWNrcy4gWW91IGNhbiBhbHNvIHRyeSB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGNhbGxzIHRvXG4vLyBzZXQoKSBhbmQgYXBwZW5kKCkgeW91IG1ha2UgKGF2b2lkIGNhbGxpbmcgdGhlbSBvbiBhIGNvbnRpbnVvdXMgZHJhZyBvZiBhXG4vLyBzbGlkZXIgZm9yIGV4YW1wbGUpIGFuZCBpbnNpZGUgdGhlc2UgY2FsbGJhY2tzIHVzZSB0aGUgYGtleWAgYXJndW1lbnQgYXQgdGhlXG4vLyB2ZXJ5IGJlZ2lubmluZyBvZiB0aGUgY2FsbGJhY2sgdG8gZmlsdGVyIG91dCB3aGljaCBrZXlzIHlvdXIgbmVlZCB0byBydW5cbi8vIGxvZ2ljIGFnYWluc3QuXG4vL1xuLy8gSWYgeW91IGFyZSBub3QgdXNpbmcgdGhlc2UgY2FsbGJhY2tzLCBjb21tZW50IHRoZW0gb3V0IHNvIHRoZSBzeXN0ZW0gZG9lc1xuLy8gbm90IGNhbGwgdGhlbSBmb3Igbm90aGluZy5cblxuLy8gLy8gb25TZXQgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSAuc2V0KCkgbWV0aG9kXG4vLyAvLyBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvciBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vblNldCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4vLyApID0+IHtcbi8vICAgLy8gLy8gRXhhbXBsZSBmaWx0ZXJpbmdcbi8vICAgLy8gaWYgKGtleSAhPT0gXCJ2YWx1ZVwiKSB7XG4vLyAgIC8vICAgcmV0dXJuO1xuLy8gICAvLyB9XG4vLyB9KTtcblxuRW1waXJpY2Eub25TZXQoKFxuICBnYW1lLFxuICByb3VuZCxcbiAgc3RhZ2UsXG4gIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2VcbiAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4gIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbiAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4gIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuKSA9PiB7XG4gIGNvbnN0IHBsYXllcnMgPSBnYW1lLnBsYXllcnM7XG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICAvLyBTb21lIHBsYXllciBkZWNpZGVzIHRvIHJlY29uc2lkZXIgdGhlaXIgYW5zd2VyXG4gIGNvbnNvbGUubG9nKFwia2V5XCIsIGtleSk7XG4gIGlmIChrZXkgPT09IFwic3VibWl0dGVkXCIpIHsgXG4gICAgLy8gQ2hlY2tzIGlmIGV2ZXJ5b25lIGhhcyBzdWJtaXR0ZWQgdGhlaXIgYW5zd2VyIGFuZCBpZiBzbywgc3VibWl0IHRoZSBzdGFnZVxuICAgIGxldCBhbGxTdWJtaXR0ZWQgPSB0cnVlO1xuICAgIGxldCBudW1QbGF5ZXJzU3VibWl0dGVkID0gMDtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgaWYgKHBsYXllci5nZXQoXCJzdWJtaXR0ZWRcIikpIHtcbiAgICAgICAgbnVtUGxheWVyc1N1Ym1pdHRlZCArPSAxO1xuICAgICAgfVxuICAgICAgYWxsU3VibWl0dGVkID0gcGxheWVyLmdldChcInN1Ym1pdHRlZFwiKSAmJiBhbGxTdWJtaXR0ZWQ7XG4gICAgfSlcbiAgICByb3VuZC5zZXQoXCJudW1QbGF5ZXJzU3VibWl0dGVkXCIsIG51bVBsYXllcnNTdWJtaXR0ZWQpO1xuICAgIGlmIChhbGxTdWJtaXR0ZWQpIHtcbiAgICAgIGNvbnN0IGxvZyA9IHN0YWdlLmdldChcImxvZ1wiKTtcbiAgICAgIGNvbXB1dGVTY29yZShhY3RpdmVQbGF5ZXJzLCBzdGFnZSwgcm91bmQpO1xuICAgICAgLy8gTmVlZCB0byBzdWJtaXQgZm9yIHN1Ym1pdCB0aGUgc3RhZ2UgZm9yIGV2ZXJ5IHBsYXllclxuICAgICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4gICAgICB9KVxuICAgIH1cbiAgLy8gICBpZiAoc3RhZ2UuZ2V0KFwicmVzdWx0c1Nob3duXCIpKSB7XG4gIC8vICAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4gIC8vICAgICB9KVxuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIGlmICh0YXJnZXRUeXBlID09PSBcInN0YWdlXCIgJiYga2V5ID09PSBcInJlc3VsdHNTaG93blwiKSB7XG4gIC8vICAgaWYgKHN0YWdlLmdldChcInJlc3VsdHNTaG93blwiKSkge1xuICAvLyAgICAgcGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgLy8gICAgICAgcGxheWVyLnN0YWdlLnN1Ym1pdCgpO1xuICAvLyAgICAgfSlcbiAgLy8gICB9XG4gIH1cblxuICAvLyBlbHNlIGlmIChrZXkgPT09IFwiaW5hY3RpdmVcIikge1xuICAgIC8vIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSk7XG4gIC8vIH1cblxuICByZXR1cm47XG5cbn0pO1xuXG5mdW5jdGlvbiBjb21wdXRlU2NvcmUoYWN0aXZlUGxheWVycywgc3RhZ2UsIHJvdW5kKSB7XG4gIGxldCBzdWNjZXNzID0gdHJ1ZTtcbiAgY29uc29sZS5sb2coXCJDT1JSRUNUIEFOU1dFUjpcIilcbiAgY29uc29sZS5sb2coc3RhZ2UuZ2V0KFwiYW5zd2VyXCIpKTtcbiAgY29uc29sZS5sb2coXCJQbGF5ZXJzIGd1ZXNzZWQ6XCIpXG5cbiAgYWN0aXZlUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgY29uc3Qgc3VibWlzc2lvbiA9IHBsYXllci5nZXQoXCJzeW1ib2xTZWxlY3RlZFwiKTtcbiAgICBjb25zb2xlLmxvZyhzdWJtaXNzaW9uKTtcbiAgICBpZiAoc3VibWlzc2lvbiAhPT0gc3RhZ2UuZ2V0KFwiYW5zd2VyXCIpKSB7XG4gICAgICBzdWNjZXNzID0gZmFsc2VcbiAgICB9XG4gIH0pXG4gIHJvdW5kLnNldChcInJlc3VsdFwiLCBzdWNjZXNzKTtcbiAgaWYgKHN1Y2Nlc3MpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgIGNvbnN0IHByZXZTY29yZSA9IHBsYXllci5nZXQoXCJzY29yZVwiKSB8fCAwO1xuICAgICAgcGxheWVyLnNldChcInNjb3JlXCIsIHByZXZTY29yZSArIDEpO1xuICAgIH0pXG4gICAgY29uc29sZS5sb2coXCIgQWxsIHBsYXllcnMgZ290IGl0IGNvcnJlY3RseVwiKTtcbiAgfSBcbn1cblxuLy8gLy8gb25BcHBlbmQgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSBgLmFwcGVuZCgpYCBtZXRob2Rcbi8vIC8vIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uQXBwZW5kKChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbi8vICkgPT4ge1xuLy8gICAvLyBOb3RlOiBgdmFsdWVgIGlzIHRoZSBzaW5nbGUgbGFzdCB2YWx1ZSAoZS5nIDAuMiksIHdoaWxlIGBwcmV2VmFsdWVgIHdpbGxcbi8vICAgLy8gICAgICAgYmUgYW4gYXJyYXkgb2YgdGhlIHByZXZpc291cyB2YWx1ZWQgKGUuZy4gWzAuMywgMC40LCAwLjY1XSkuXG4vLyB9KTtcblxuXG4vLyAvLyBvbkNoYW5nZSBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIGAuc2V0KClgIG9yIHRoZVxuLy8gLy8gYC5hcHBlbmQoKWAgbWV0aG9kIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yXG4vLyAvLyBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vbkNoYW5nZSgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlLCAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gICBpc0FwcGVuZCAvLyBUcnVlIGlmIHRoZSBjaGFuZ2Ugd2FzIGFuIGFwcGVuZCwgZmFsc2UgaWYgaXQgd2FzIGEgc2V0XG4vLyApID0+IHtcbi8vICAgLy8gYG9uQ2hhbmdlYCBpcyB1c2VmdWwgdG8gcnVuIHNlcnZlci1zaWRlIGxvZ2ljIGZvciBhbnkgdXNlciBpbnRlcmFjdGlvbi5cbi8vICAgLy8gTm90ZSB0aGUgZXh0cmEgaXNBcHBlbmQgYm9vbGVhbiB0aGF0IHdpbGwgYWxsb3cgdG8gZGlmZmVyZW5jaWF0ZSBzZXRzIGFuZFxuLy8gICAvLyBhcHBlbmRzLlxuLy8gICAgR2FtZS5zZXQoXCJsYXN0Q2hhbmdlQXRcIiwgbmV3IERhdGUoKS50b1N0cmluZygpKVxuLy8gfSk7XG5cbi8vIC8vIG9uU3VibWl0IGlzIGNhbGxlZCB3aGVuIHRoZSBwbGF5ZXIgc3VibWl0cyBhIHN0YWdlLlxuLy8gRW1waXJpY2Eub25TdWJtaXQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciAvLyBQbGF5ZXIgd2hvIHN1Ym1pdHRlZFxuLy8gKSA9PiB7XG4vLyB9KTtcbiIsImNvbnN0IGFsbFN5bWJvbHMgPSBbXCJ0MVwiLCBcInQyXCIsIFwidDNcIiwgXCJ0NFwiLCBcInQ1XCIsIFwidDZcIiwgXCJ0N1wiLFwidDhcIixcInQ5XCIsXCJ0MTBcIixcInQxMVwiLFwidDEyXCJdO1xuXG4vLyBuID0gbnVtYmVyIG9mIHBlb3BsZSAsIHAgPSBudW1iZXIgb2Ygc3ltYm9sc1xuLy8gKG4tMSkqcCArIDFcbi8vIGkuZS4gbiA9IDMsIHAgPSAzIDogN1xuXG5leHBvcnQgY29uc3QgdGVzdFRhbmdyYW1zID0gW1xuICB7XG4gICAgX2lkOiBcIjBcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDFcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjFcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDJcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjJcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDNcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0M1wiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjNcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDRcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0NFwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjRcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDVcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0NVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjVcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDZcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0NlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjZcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDdcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0N1wiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjdcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDhcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0OFwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjhcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDlcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0OVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjlcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDEwXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDEwXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTBcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDExXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDExXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTFcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDEyXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDEyXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTJcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDEzXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxM1wiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTRcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjE0XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxNVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQzXCIsXG4gIH0sXG5cbl07XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0TmVpZ2hib3JzKHN0cnVjdHVyZSwgcGxheWVyKSB7XG4gICAgY29uc3QgbmVpZ2hib3JzID0gW107XG4gICAgbGV0IG5ldHdvcmsgPSBzdHJ1Y3R1cmUuc3BsaXQoXCIsXCIpO1xuICAgIGNvbnN0IHBsYXllckluZGV4ID0gcGxheWVyLmdldChcIm5vZGVJZFwiKTtcblxuICAgIG5ldHdvcmsuZm9yRWFjaCgobikgPT4ge1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IG4uc3BsaXQoXCItXCIpO1xuXG4gICAgICBpZiAocGxheWVySW5kZXggPT09IHBhcnNlSW50KGNvbm5lY3Rpb25bMF0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGNvbm5lY3Rpb25bMV0ucmVwbGFjZSgvXFxzL2csICcnKSk7XG4gICAgICB9IGVsc2UgaWYgKHBsYXllckluZGV4ID09PSBwYXJzZUludChjb25uZWN0aW9uWzFdKSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaChjb25uZWN0aW9uWzBdLnJlcGxhY2UoL1xccy9nLCAnJykpO1xuICAgICAgfVxuICAgIH0pO1xuICBcbiAgICByZXR1cm4gWy4uLiBuZXcgU2V0KG5laWdoYm9ycyldO1xuICB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpIHtcbiAgICBjb25zdCBhY3RpdmVOb2RlcyA9IFtdO1xuICAgIGNvbnN0IGFsbE5vZGVzID0gW107XG4gICAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gICAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cblxuICAgIC8vIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgIC8vICAgYWN0aXZlTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICAvLyB9KVxuXG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIC8vIGlmIChwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdHZlXCIpKSB7XG4gICAgICBpZiAoIXAuZ2V0KFwiaW5hY3R2ZVwiKSkge1xuXG4gICAgICAgIGFjdGl2ZU5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgICB9XG4gICAgICBhbGxOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgIH0pXG5cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgLy8gT25seSBzaG93IGFjdGl2ZSBwZW9wbGVcbiAgICAgIC8vIGNvbnN0IG5ld05laWdoYm9ycyA9IGFjdGl2ZU5vZGVzLmZpbHRlcihpZCA9PiBwYXJzZUludChpZCkgIT09IHAuZ2V0KFwibm9kZUlkXCIpKVxuICAgICAgLy8gcC5zZXQoXCJuZWlnaGJvcnNcIiwgbmV3TmVpZ2hib3JzKTtcblxuICAgICAgLy8gU2hvdyBldmVyeW9uZSwgbWFyayBvZmZsaW5lIHBlb3BsZSBhcyBvZmZsaW5lXG4gICAgICBjb25zdCBuZXdOZWlnaGJvcnMgPSBhbGxOb2Rlcy5maWx0ZXIoaWQgPT4gcGFyc2VJbnQoaWQpICE9PSBwLmdldChcIm5vZGVJZFwiKSlcbiAgICAgIHAuc2V0KFwibmVpZ2hib3JzXCIsIG5ld05laWdoYm9ycyk7XG4gICAgfSlcbn0iLCJpbXBvcnQgRW1waXJpY2EgZnJvbSBcIm1ldGVvci9lbXBpcmljYTpjb3JlXCI7XG5pbXBvcnQgXCIuL2JvdHMuanNcIjtcbmltcG9ydCBcIi4vY2FsbGJhY2tzLmpzXCI7XG5cbmltcG9ydCB7IHRlc3RTeW1ib2xzLCB0ZXN0VGFuZ3JhbXMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjsgXG5pbXBvcnQgeyBnZXROZWlnaGJvcnMsIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIgfSBmcm9tIFwiLi91dGlsXCI7XG5cbi8vIGdhbWVJbml0IGlzIHdoZXJlIHRoZSBzdHJ1Y3R1cmUgb2YgYSBnYW1lIGlzIGRlZmluZWQuXG4vLyBKdXN0IGJlZm9yZSBldmVyeSBnYW1lIHN0YXJ0cywgb25jZSBhbGwgdGhlIHBsYXllcnMgbmVlZGVkIGFyZSByZWFkeSwgdGhpc1xuLy8gZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggdGhlIHRyZWF0bWVudCBhbmQgdGhlIGxpc3Qgb2YgcGxheWVycy5cbi8vIFlvdSBtdXN0IHRoZW4gYWRkIHJvdW5kcyBhbmQgc3RhZ2VzIHRvIHRoZSBnYW1lLCBkZXBlbmRpbmcgb24gdGhlIHRyZWF0bWVudFxuLy8gYW5kIHRoZSBwbGF5ZXJzLiBZb3UgY2FuIGFsc28gZ2V0L3NldCBpbml0aWFsIHZhbHVlcyBvbiB5b3VyIGdhbWUsIHBsYXllcnMsXG4vLyByb3VuZHMgYW5kIHN0YWdlcyAod2l0aCBnZXQvc2V0IG1ldGhvZHMpLCB0aGF0IHdpbGwgYmUgYWJsZSB0byB1c2UgbGF0ZXIgaW5cbi8vIHRoZSBnYW1lLlxuRW1waXJpY2EuZ2FtZUluaXQoZ2FtZSA9PiB7XG4gIGNvbnN0IHtcbiAgICB0cmVhdG1lbnQ6IHtcbiAgICAgIHBsYXllckNvdW50LFxuICAgICAgbmV0d29ya1N0cnVjdHVyZSxcbiAgICAgIG51bVRhc2tSb3VuZHMsXG4gICAgICBudW1TdXJ2ZXlSb3VuZHMsXG4gICAgICBzZXRTaXplQmFzZWRPblBsYXllckNvdW50LFxuICAgICAgdXNlckluYWN0aXZpdHlEdXJhdGlvbixcbiAgICAgIHRhc2tEdXJhdGlvbixcbiAgICAgIGRlZmF1bHRTZXRTaXplLFxuICAgICAgc3VydmV5RHVyYXRpb24sXG4gICAgICByZXN1bHRzRHVyYXRpb24sXG4gICAgICBtYXhOdW1PdmVybGFwLFxuICAgIH0sXG4gIH0gPSBnYW1lO1xuXG5cbiAgY29uc3Qgc3ltYm9sU2V0ID0gdGVzdFRhbmdyYW1zO1xuICBjb25zdCBzZXRTaXplID0gc2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCA/IHBsYXllckNvdW50ICsgMSA6IGRlZmF1bHRTZXRTaXplOyAvL1RPRE86IGNhbiBjaGFuZ2UgZGVmYXVsdCB2YWx1ZSBpbiBzZXR0aW5nc1xuICBjb25zdCBudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkgPSBudW1UYXNrUm91bmRzL251bVN1cnZleVJvdW5kcztcblxuICBsZXQgY29sb3JzID0gW1wiR3JlZW5cIiwgXCJSZWRcIiwgXCJZZWxsb3dcIiwgXCJCbHVlXCIsIFwiUHVycGxlXCIsIFwiV2hpdGVcIiwgXCJCbGFja1wiXVxuICBjb2xvcnMgPSBzaHVmZmxlKGNvbG9ycyk7XG5cbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllciwgaSkgPT4ge1xuICAgIHBsYXllci5zZXQoXCJhdmF0YXJcIiwgYC9hdmF0YXJzL2pkZW50aWNvbi8ke3BsYXllci5faWR9YCk7XG4gICAgcGxheWVyLnNldChcInNjb3JlXCIsIDApO1xuXG4gICAgLy8gR2l2ZSBlYWNoIHBsYXllciBhIG5vZGVJZCBiYXNlZCBvbiB0aGVpciBwb3NpdGlvbiAoaW5kZXhlZCBhdCAxKVxuICAgIHBsYXllci5zZXQoXCJub2RlSWRcIiwgaSArIDEpO1xuICAgIHBsYXllci5zZXQoXCJuYW1lXCIsIHBsYXllci5pZCk7XG4gICAgcGxheWVyLnNldChcImFub255bW91c05hbWVcIiwgY29sb3JzW2ldKVxuICB9KTtcblxuXG4gIGlmIChnYW1lLnBsYXllcnMubGVuZ3RoIDwgZ2FtZS50cmVhdG1lbnQucGxheWVyQ291bnQpIHsgLy8gaWYgbm90IGEgZnVsbCBnYW1lLCBkZWZhdWx0IHRvIGZ1bGx5IGNvbm5lY3RlZCBsYXllclxuICAgIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSk7XG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHAuZ2V0KFwibmVpZ2hib3JzXCIpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgcC5zZXQoXCJuZWlnaGJvcnNcIiwgZ2V0TmVpZ2hib3JzKG5ldHdvcmtTdHJ1Y3R1cmUsIHApKTtcbiAgICAgIGNvbnNvbGUubG9nKHAuZ2V0KFwibmVpZ2hib3JzXCIpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEZvciBlYWNoIHJvdW5kLCBhZGQgYWxsIHRoZSBzeW1ib2xzLCByYW5kb21seSBzZWxlY3QgYSBjb3JyZWN0IGFuc3dlciBhbmRcbiAgLy8gQ29uc3RyYWludHM6IE11c3QgZW5zdXJlIHRoYXQgZXZlcnlvbmUgaGFzIG9ubHkgb25lIHN5bWJvbCBpbiBjb21tb25cbiAgXy50aW1lcyggbnVtVGFza1JvdW5kcywgaSA9PiB7XG4gICAgY29uc3Qgcm91bmQgPSBnYW1lLmFkZFJvdW5kKCk7XG5cbiAgICBjb25zdCB7c3ltYm9scywgdGFza05hbWUsIGFuc3dlcn0gPSBzeW1ib2xTZXRbaV07XG5cbiAgICBjb25zdCB0YXNrU3RhZ2UgPSByb3VuZC5hZGRTdGFnZSh7XG4gICAgICBuYW1lOiBcIlRhc2tcIixcbiAgICAgIGRpc3BsYXlOYW1lOiB0YXNrTmFtZSxcbiAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgZHVyYXRpb25JblNlY29uZHM6IHRhc2tEdXJhdGlvblxuICAgIH0pO1xuICAgIHRhc2tTdGFnZS5zZXQoXCJ0YXNrXCIsIHN5bWJvbFNldFtpXSk7XG4gICAgZ2V0U3ltYm9sc0ZvclBsYXllcnMoc3ltYm9scywgYW5zd2VyLCBzZXRTaXplLCB0YXNrTmFtZSwgZ2FtZSwgbWF4TnVtT3ZlcmxhcClcbiAgICB0YXNrU3RhZ2Uuc2V0KFwiYW5zd2VyXCIsIHN5bWJvbFNldFtpXS5hbnN3ZXIpXG5cbiAgICBjb25zdCByZXN1bHRTdGFnZSA9IHJvdW5kLmFkZFN0YWdlKHtcbiAgICAgIG5hbWU6IFwiUmVzdWx0XCIsXG4gICAgICBkaXNwbGF5TmFtZTogXCJSZXN1bHRcIixcbiAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiByZXN1bHRzRHVyYXRpb25cbiAgICB9KTtcbiAgICBcbiAgICBpZiAoKGkrMSkgJSBudW1Sb3VuZHNCZWZvcmVTdXJ2ZXkgPT09IDApIHsgLy8gQWZ0ZXIgNSB0YXNrIHJvdW5kcywgYWRkIGEgc3VydmV5IHJvdW5kXG4gICAgICBjb25zdCBzdXJ2ZXlSb3VuZCA9IGdhbWUuYWRkUm91bmQoKTtcblxuICAgICAgY29uc3Qgc3VydmV5U3RhZ2VzID0gc3VydmV5Um91bmQuYWRkU3RhZ2Uoe1xuICAgICAgICBuYW1lOiBcIlN1cnZleVwiLFxuICAgICAgICBkaXNwbGF5TmFtZTogXCJTdXJ2ZXlcIixcbiAgICAgICAgZHVyYXRpb25JblNlY29uZHM6IHN1cnZleUR1cmF0aW9uXG4gICAgICB9KVxuICAgIH1cblxuICB9KTtcblxuXG5cbiAgZnVuY3Rpb24gZ2V0U3ltYm9sc0ZvclBsYXllcnMoc3ltYm9sU2V0LCBhbnN3ZXIsIHNldFNpemUsIHRhc2tOYW1lLCBnYW1lLCBtYXhOdW1PdmVybGFwKSB7XG4gICAgICBsZXQgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xTZXQuZmlsdGVyKHN5bWJvbCA9PiBzeW1ib2wgIT09IGFuc3dlcik7XG4gICAgICBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHNodWZmbGUoc3ltYm9sc1dpdGhvdXRBbnN3ZXIpO1xuICAgICAgbGV0IG51bVBsYXllcnMgPSBnYW1lLnBsYXllcnMubGVuZ3RoO1xuICAgICAgbGV0IG51bU92ZXJsYXAgPSAwO1xuXG5cbiAgICAgIC8vIENyZWF0ZSBhIGRpY3Rpb25hcnkgdG8ga2VlcCB0cmFjayBvZiBob3cgbWFueSB0aW1lcyBzeW1ib2wgaGFzIGJlZW4gdXNlZFxuICAgICAgbGV0IHN5bWJvbEZyZXEgPSB7fVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzeW1ib2xzV2l0aG91dEFuc3dlci5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgc3ltYm9sID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXJbaV1cbiAgICAgICAgaWYgKCFzeW1ib2xGcmVxLmhhc093blByb3BlcnR5KHN5bWJvbCkpIHtcbiAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gPSBudW1QbGF5ZXJzIC0gMTsgLy8gVG90YWwgdGltZSBhIHN5bWJvbCBjYW4gYmUgdXNlZCBcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIGxldCBzeW1ib2xzUGlja2VkID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ltYm9sc1dpdGhvdXRBbnN3ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgc3ltYm9sID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXJbaV1cbiAgICAgICAgICBpZiAoc3ltYm9sc1BpY2tlZC5sZW5ndGggPCBzZXRTaXplIC0gMSkgeyAvLyBBZGQgc3ltYm9scyB1bnRpbCBzZXRTaXplIC0gMSBmb3IgYW5zd2VyXG4gICAgICAgICAgICBpZiAoc3ltYm9sRnJlcVtzeW1ib2xdIC0gMSA9PT0gMCkgeyAvLyBUaGlzIHN5bWJvbCB3aWxsIG92ZXJsYXBcbiAgICAgICAgICAgICAgICBpZiAobnVtT3ZlcmxhcCA8IG1heE51bU92ZXJsYXAgKSB7IC8vIE9ubHkgYWRkIGlmIGxlc3MgdGhhbiBtYXggb3ZlcmxhcFxuICAgICAgICAgICAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gLT0gMTtcbiAgICAgICAgICAgICAgICAgIG51bU92ZXJsYXAgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgICBzeW1ib2xGcmVxW3N5bWJvbF0gLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKGFuc3dlcik7IC8vIEFkZCB0aGUgYW5zd2VyXG4gICAgICAgIGZvciAodmFyIHN5bWJvbFRvUmVtb3ZlIG9mIHN5bWJvbHNQaWNrZWQpIHtcbiAgICAgICAgICBpZiAoc3ltYm9sRnJlcVtzeW1ib2xUb1JlbW92ZV0gPT09IDApIHsgLy8gSWYgc3ltYm9sIGhhcyBiZWVuIHBpY2tlZCBuLTEgcGxheWVycyB0aW1lcywgcmVtb3ZlIGl0IGZyb20gdGhlIHNldFxuICAgICAgICAgICAgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xzV2l0aG91dEFuc3dlci5maWx0ZXIoc3ltYm9sID0+IHN5bWJvbCAhPT0gc3ltYm9sVG9SZW1vdmUpO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3ltYm9sc1BpY2tlZCA9IHNodWZmbGUoc3ltYm9sc1BpY2tlZCk7XG5cbiAgICAgICAgcGxheWVyLnNldCh0YXNrTmFtZSwgc3ltYm9sc1BpY2tlZCk7XG4gICAgICB9KVxuXG5cbiAgfVxuXG4gIC8vIFNodWZmbGluZyBhcnJheXM6XG4gIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUwNTM2MDQ0L3N3YXBwaW5nLWFsbC1lbGVtZW50cy1vZi1hbi1hcnJheS1leGNlcHQtZm9yLWZpcnN0LWFuZC1sYXN0XG4gIGZ1bmN0aW9uIHNodWZmbGUoc3ltYm9sU2V0KSB7XG4gICAgZm9yIChpID0gc3ltYm9sU2V0Lmxlbmd0aCAtMSA7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcblxuICAgICAgW3N5bWJvbFNldFtpXSwgc3ltYm9sU2V0W2pdXSA9IFtzeW1ib2xTZXRbal0sIHN5bWJvbFNldFtpXV07XG4gICAgfVxuICAgIHJldHVybiBzeW1ib2xTZXQ7XG4gIH1cblxufSk7XG4iXX0=
