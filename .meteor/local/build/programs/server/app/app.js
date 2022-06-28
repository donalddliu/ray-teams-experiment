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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm9uR2FtZVN0YXJ0IiwiY29uc29sZSIsImxvZyIsInBsYXllcnMiLCJmb3JFYWNoIiwicGxheWVyIiwic2V0IiwibmV0d29yayIsImdldCIsImFjdGl2ZUNoYXRzIiwibWFwIiwib3RoZXJOb2RlSWQiLCJwYWlyT2ZQbGF5ZXJzIiwicGFyc2VJbnQiLCJzb3J0IiwicDEiLCJwMiIsIm90aGVyUGxheWVyIiwiZmluZCIsInAiLCJjaGF0S2V5IiwicHVzaCIsImxlbmd0aCIsIm9uUm91bmRTdGFydCIsImFjdGl2ZVBsYXllcnMiLCJmaWx0ZXIiLCJ0cmVhdG1lbnQiLCJlbmRHYW1lSWZQbGF5ZXJJZGxlIiwiZXhpdCIsIm9uU3RhZ2VTdGFydCIsIm5hbWUiLCJkaXNwbGF5TmFtZSIsIm9uU3RhZ2VFbmQiLCJvblJvdW5kRW5kIiwib25HYW1lRW5kIiwib25TZXQiLCJ0YXJnZXQiLCJ0YXJnZXRUeXBlIiwia2V5IiwidmFsdWUiLCJwcmV2VmFsdWUiLCJhbGxTdWJtaXR0ZWQiLCJudW1QbGF5ZXJzU3VibWl0dGVkIiwiY29tcHV0ZVNjb3JlIiwic3VibWl0Iiwic3VjY2VzcyIsInN1Ym1pc3Npb24iLCJwcmV2U2NvcmUiLCJleHBvcnQiLCJ0ZXN0VGFuZ3JhbXMiLCJhbGxTeW1ib2xzIiwiX2lkIiwidGFza05hbWUiLCJzeW1ib2xzIiwiYW5zd2VyIiwiZ2V0TmVpZ2hib3JzIiwic3RydWN0dXJlIiwibmVpZ2hib3JzIiwic3BsaXQiLCJuIiwiY29ubmVjdGlvbiIsInBsYXllckluZGV4IiwiXyIsInVuaXEiLCJhY3RpdmVOb2RlcyIsImFsbE5vZGVzIiwibmV3TmVpZ2hib3JzIiwiaWQiLCJ0ZXN0U3ltYm9scyIsImdhbWVJbml0IiwicGxheWVyQ291bnQiLCJuZXR3b3JrU3RydWN0dXJlIiwibnVtVGFza1JvdW5kcyIsIm51bVN1cnZleVJvdW5kcyIsInNldFNpemVCYXNlZE9uUGxheWVyQ291bnQiLCJ1c2VySW5hY3Rpdml0eUR1cmF0aW9uIiwidGFza0R1cmF0aW9uIiwiZGVmYXVsdFNldFNpemUiLCJzdXJ2ZXlEdXJhdGlvbiIsInJlc3VsdHNEdXJhdGlvbiIsIm1heE51bU92ZXJsYXAiLCJzeW1ib2xTZXQiLCJzZXRTaXplIiwibnVtUm91bmRzQmVmb3JlU3VydmV5IiwiY29sb3JzIiwic2h1ZmZsZSIsImkiLCJ0aW1lcyIsImFkZFJvdW5kIiwidGFza1N0YWdlIiwiYWRkU3RhZ2UiLCJkdXJhdGlvbkluU2Vjb25kcyIsImdldFN5bWJvbHNGb3JQbGF5ZXJzIiwicmVzdWx0U3RhZ2UiLCJzdXJ2ZXlSb3VuZCIsInN1cnZleVN0YWdlcyIsInN5bWJvbHNXaXRob3V0QW5zd2VyIiwic3ltYm9sIiwibnVtUGxheWVycyIsIm51bU92ZXJsYXAiLCJzeW1ib2xGcmVxIiwiaGFzT3duUHJvcGVydHkiLCJzeW1ib2xzUGlja2VkIiwic3ltYm9sVG9SZW1vdmUiLCJqIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLFFBQUo7QUFBYUMsTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0osWUFBUSxHQUFDSSxDQUFUO0FBQVc7O0FBQXZCLENBQW5DLEVBQTRELENBQTVEO0FBRWI7QUFFQUosUUFBUSxDQUFDSyxHQUFULENBQWEsS0FBYixFQUFvQjtBQUNsQjtBQUNBO0FBRUE7QUFDQUMsYUFBVyxDQUFDRCxHQUFELEVBQU1FLElBQU4sRUFBWUMsS0FBWixFQUFtQkMsS0FBbkIsRUFBMEJDLGdCQUExQixFQUE0QyxDQUFFLENBTHZDLENBT2xCO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7OztBQVprQixDQUFwQixFOzs7Ozs7Ozs7OztBQ0pBLElBQUlWLFFBQUo7QUFBYUMsTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0osWUFBUSxHQUFDSSxDQUFUO0FBQVc7O0FBQXZCLENBQW5DLEVBQTRELENBQTVEO0FBQStELElBQUlPLHNCQUFKO0FBQTJCVixNQUFNLENBQUNDLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNTLHdCQUFzQixDQUFDUCxDQUFELEVBQUc7QUFBQ08sMEJBQXNCLEdBQUNQLENBQXZCO0FBQXlCOztBQUFwRCxDQUFyQixFQUEyRSxDQUEzRTtBQUt2RztBQUNBO0FBQ0E7QUFDQUosUUFBUSxDQUFDWSxXQUFULENBQXFCTCxJQUFJLElBQUk7QUFDM0JNLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLGNBQVo7QUFDQVAsTUFBSSxDQUFDUSxPQUFMLENBQWFDLE9BQWIsQ0FBc0JDLE1BQUQsSUFBWTtBQUMvQkEsVUFBTSxDQUFDQyxHQUFQLENBQVcsVUFBWCxFQUF1QixLQUF2QjtBQUNBLFVBQU1DLE9BQU8sR0FBR0YsTUFBTSxDQUFDRyxHQUFQLENBQVcsV0FBWCxDQUFoQjtBQUNBLFVBQU1DLFdBQVcsR0FBRyxFQUFwQjtBQUNBRixXQUFPLENBQUNHLEdBQVIsQ0FBWUMsV0FBVyxJQUFJO0FBQ3pCLFVBQUlDLGFBQWEsR0FBRyxDQUFDUCxNQUFNLENBQUNHLEdBQVAsQ0FBVyxRQUFYLENBQUQsRUFBdUJLLFFBQVEsQ0FBQ0YsV0FBRCxDQUEvQixDQUFwQjtBQUNBQyxtQkFBYSxDQUFDRSxJQUFkLENBQW1CLENBQUNDLEVBQUQsRUFBSUMsRUFBSixLQUFXRCxFQUFFLEdBQUdDLEVBQW5DO0FBQ0EsWUFBTUMsV0FBVyxHQUFHdEIsSUFBSSxDQUFDUSxPQUFMLENBQWFlLElBQWIsQ0FBa0JDLENBQUMsSUFBSUEsQ0FBQyxDQUFDWCxHQUFGLENBQU0sUUFBTixNQUFvQkssUUFBUSxDQUFDRixXQUFELENBQW5ELENBQXBCLENBSHlCLENBSXpCOztBQUNBLFlBQU1TLE9BQU8sYUFBTVIsYUFBYSxDQUFDLENBQUQsQ0FBbkIsY0FBMEJBLGFBQWEsQ0FBQyxDQUFELENBQXZDLENBQWI7QUFDQUgsaUJBQVcsQ0FBQ1ksSUFBWixDQUFpQkQsT0FBakI7QUFDRCxLQVBELEVBSitCLENBWS9COztBQUNBZixVQUFNLENBQUNDLEdBQVAsQ0FBVyxhQUFYLEVBQTBCRyxXQUExQjtBQUNBUixXQUFPLENBQUNDLEdBQVIsQ0FBWUcsTUFBTSxDQUFDRyxHQUFQLENBQVcsYUFBWCxDQUFaO0FBQ0QsR0FmRDtBQWdCQWIsTUFBSSxDQUFDVyxHQUFMLENBQVMsMEJBQVQsRUFBcUNYLElBQUksQ0FBQ1EsT0FBTCxDQUFhbUIsTUFBbEQ7QUFDRCxDQW5CRCxFLENBcUJBO0FBQ0E7O0FBQ0FsQyxRQUFRLENBQUNtQyxZQUFULENBQXNCLENBQUM1QixJQUFELEVBQU9DLEtBQVAsS0FBaUI7QUFDckNELE1BQUksQ0FBQ1EsT0FBTCxDQUFhQyxPQUFiLENBQXNCQyxNQUFELElBQVk7QUFDL0JBLFVBQU0sQ0FBQ0MsR0FBUCxDQUFXLFdBQVgsRUFBd0IsS0FBeEI7QUFDQUQsVUFBTSxDQUFDQyxHQUFQLENBQVcsZ0JBQVgsRUFBNkIsRUFBN0I7QUFDRCxHQUhEO0FBSUFWLE9BQUssQ0FBQ1UsR0FBTixDQUFVLFFBQVYsRUFBb0IsS0FBcEI7QUFDQVYsT0FBSyxDQUFDVSxHQUFOLENBQVUscUJBQVYsRUFBaUMsQ0FBakMsRUFOcUMsQ0FPckM7O0FBQ0EsUUFBTWtCLGFBQWEsR0FBRzdCLElBQUksQ0FBQ1EsT0FBTCxDQUFhc0IsTUFBYixDQUFvQk4sQ0FBQyxJQUFJLENBQUNBLENBQUMsQ0FBQ1gsR0FBRixDQUFNLFVBQU4sQ0FBMUIsQ0FBdEI7O0FBRUEsTUFBSWdCLGFBQWEsQ0FBQ0YsTUFBZCxHQUF1QjNCLElBQUksQ0FBQ2EsR0FBTCxDQUFTLDBCQUFULENBQTNCLEVBQWtFO0FBQUU7QUFDbEUsUUFBSWIsSUFBSSxDQUFDK0IsU0FBTCxDQUFlQyxtQkFBbkIsRUFBd0M7QUFDdENILG1CQUFhLENBQUNwQixPQUFkLENBQXVCZSxDQUFELElBQU87QUFDM0JBLFNBQUMsQ0FBQ1MsSUFBRixDQUFPLGlCQUFQO0FBQ0QsT0FGRDtBQUdELEtBSkQsTUFJTztBQUNMN0IsNEJBQXNCLENBQUNKLElBQUQsQ0FBdEIsQ0FESyxDQUN5QjtBQUMvQjtBQUVGOztBQUNEQSxNQUFJLENBQUNXLEdBQUwsQ0FBUywwQkFBVCxFQUFxQ2tCLGFBQWEsQ0FBQ0YsTUFBbkQ7QUFFQXJCLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLGVBQVo7QUFFRCxDQXhCRCxFLENBMEJBO0FBQ0E7O0FBQ0FkLFFBQVEsQ0FBQ3lDLFlBQVQsQ0FBc0IsQ0FBQ2xDLElBQUQsRUFBT0MsS0FBUCxFQUFjQyxLQUFkLEtBQXdCO0FBQzVDSSxTQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaLEVBRDRDLENBRTVDOztBQUNBLFFBQU1zQixhQUFhLEdBQUc3QixJQUFJLENBQUNRLE9BQUwsQ0FBYXNCLE1BQWIsQ0FBb0JOLENBQUMsSUFBSSxDQUFDQSxDQUFDLENBQUNYLEdBQUYsQ0FBTSxVQUFOLENBQTFCLENBQXRCOztBQUVBLE1BQUlYLEtBQUssQ0FBQ2lDLElBQU4sS0FBZSxNQUFuQixFQUEyQjtBQUN6Qk4saUJBQWEsQ0FBQ3BCLE9BQWQsQ0FBdUJDLE1BQUQsSUFBWTtBQUNoQ0osYUFBTyxDQUFDQyxHQUFSLHFCQUEwQkcsTUFBTSxDQUFDRyxHQUFQLFdBQWNYLEtBQUssQ0FBQ2tDLFdBQXBCLEVBQTFCO0FBQ0QsS0FGRDtBQUdBOUIsV0FBTyxDQUFDQyxHQUFSLG1CQUF1QkwsS0FBSyxDQUFDVyxHQUFOLENBQVUsUUFBVixDQUF2QjtBQUNEOztBQUNELE1BQUlYLEtBQUssQ0FBQ2lDLElBQU4sS0FBZSxRQUFuQixFQUE2QjtBQUMzQk4saUJBQWEsQ0FBQ3BCLE9BQWQsQ0FBdUJDLE1BQUQsSUFBWTtBQUNoQ0EsWUFBTSxDQUFDQyxHQUFQLENBQVcsY0FBWCxFQUE0QixDQUE1QjtBQUNELEtBRkQ7QUFHRCxHQWYyQyxDQWdCNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFRCxDQXRCRCxFLENBd0JBO0FBQ0E7O0FBQ0FsQixRQUFRLENBQUM0QyxVQUFULENBQW9CLENBQUNyQyxJQUFELEVBQU9DLEtBQVAsRUFBY0MsS0FBZCxLQUF1QjtBQUN6Q0ksU0FBTyxDQUFDQyxHQUFSLENBQVksYUFBWjtBQUVELENBSEQsRSxDQUtBO0FBQ0E7O0FBQ0FkLFFBQVEsQ0FBQzZDLFVBQVQsQ0FBb0IsQ0FBQ3RDLElBQUQsRUFBT0MsS0FBUCxLQUFpQixDQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUQsQ0FQRCxFLENBU0E7QUFDQTs7QUFDQVIsUUFBUSxDQUFDOEMsU0FBVCxDQUFtQnZDLElBQUksSUFBSSxDQUFFLENBQTdCLEUsQ0FFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBUCxRQUFRLENBQUMrQyxLQUFULENBQWUsQ0FDYnhDLElBRGEsRUFFYkMsS0FGYSxFQUdiQyxLQUhhLEVBSWJRLE1BSmEsRUFJTDtBQUNSK0IsTUFMYSxFQUtMO0FBQ1JDLFVBTmEsRUFNRDtBQUNaQyxHQVBhLEVBT1I7QUFDTEMsS0FSYSxFQVFOO0FBQ1BDLFNBVGEsQ0FTSDtBQVRHLEtBVVY7QUFDSCxRQUFNckMsT0FBTyxHQUFHUixJQUFJLENBQUNRLE9BQXJCLENBREcsQ0FFSDs7QUFDQSxRQUFNcUIsYUFBYSxHQUFHN0IsSUFBSSxDQUFDUSxPQUFMLENBQWFzQixNQUFiLENBQW9CTixDQUFDLElBQUksQ0FBQ0EsQ0FBQyxDQUFDWCxHQUFGLENBQU0sVUFBTixDQUExQixDQUF0QixDQUhHLENBS0g7O0FBQ0FQLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLEtBQVosRUFBbUJvQyxHQUFuQjs7QUFDQSxNQUFJQSxHQUFHLEtBQUssV0FBWixFQUF5QjtBQUN2QjtBQUNBLFFBQUlHLFlBQVksR0FBRyxJQUFuQjtBQUNBLFFBQUlDLG1CQUFtQixHQUFHLENBQTFCO0FBQ0FsQixpQkFBYSxDQUFDcEIsT0FBZCxDQUF1QkMsTUFBRCxJQUFZO0FBQ2hDLFVBQUlBLE1BQU0sQ0FBQ0csR0FBUCxDQUFXLFdBQVgsQ0FBSixFQUE2QjtBQUMzQmtDLDJCQUFtQixJQUFJLENBQXZCO0FBQ0Q7O0FBQ0RELGtCQUFZLEdBQUdwQyxNQUFNLENBQUNHLEdBQVAsQ0FBVyxXQUFYLEtBQTJCaUMsWUFBMUM7QUFDRCxLQUxEO0FBTUE3QyxTQUFLLENBQUNVLEdBQU4sQ0FBVSxxQkFBVixFQUFpQ29DLG1CQUFqQzs7QUFDQSxRQUFJRCxZQUFKLEVBQWtCO0FBQ2hCLFlBQU12QyxHQUFHLEdBQUdMLEtBQUssQ0FBQ1csR0FBTixDQUFVLEtBQVYsQ0FBWjtBQUNBbUMsa0JBQVksQ0FBQ25CLGFBQUQsRUFBZ0IzQixLQUFoQixFQUF1QkQsS0FBdkIsQ0FBWixDQUZnQixDQUdoQjs7QUFDQUQsVUFBSSxDQUFDUSxPQUFMLENBQWFDLE9BQWIsQ0FBc0JDLE1BQUQsSUFBWTtBQUMvQkEsY0FBTSxDQUFDUixLQUFQLENBQWErQyxNQUFiO0FBQ0QsT0FGRDtBQUdELEtBbEJzQixDQW1CekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNDLEdBdkNFLENBeUNIO0FBQ0U7QUFDRjs7O0FBRUE7QUFFRCxDQXpERDs7QUEyREEsU0FBU0QsWUFBVCxDQUFzQm5CLGFBQXRCLEVBQXFDM0IsS0FBckMsRUFBNENELEtBQTVDLEVBQW1EO0FBQ2pELE1BQUlpRCxPQUFPLEdBQUcsSUFBZDtBQUNBNUMsU0FBTyxDQUFDQyxHQUFSLENBQVksaUJBQVo7QUFDQUQsU0FBTyxDQUFDQyxHQUFSLENBQVlMLEtBQUssQ0FBQ1csR0FBTixDQUFVLFFBQVYsQ0FBWjtBQUNBUCxTQUFPLENBQUNDLEdBQVIsQ0FBWSxrQkFBWjtBQUVBc0IsZUFBYSxDQUFDcEIsT0FBZCxDQUFzQkMsTUFBTSxJQUFJO0FBQzlCLFVBQU15QyxVQUFVLEdBQUd6QyxNQUFNLENBQUNHLEdBQVAsQ0FBVyxnQkFBWCxDQUFuQjtBQUNBUCxXQUFPLENBQUNDLEdBQVIsQ0FBWTRDLFVBQVo7O0FBQ0EsUUFBSUEsVUFBVSxLQUFLakQsS0FBSyxDQUFDVyxHQUFOLENBQVUsUUFBVixDQUFuQixFQUF3QztBQUN0Q3FDLGFBQU8sR0FBRyxLQUFWO0FBQ0Q7QUFDRixHQU5EO0FBT0FqRCxPQUFLLENBQUNVLEdBQU4sQ0FBVSxRQUFWLEVBQW9CdUMsT0FBcEI7O0FBQ0EsTUFBSUEsT0FBSixFQUFhO0FBQ1hyQixpQkFBYSxDQUFDcEIsT0FBZCxDQUFzQkMsTUFBTSxJQUFJO0FBQzlCLFlBQU0wQyxTQUFTLEdBQUcxQyxNQUFNLENBQUNHLEdBQVAsQ0FBVyxPQUFYLEtBQXVCLENBQXpDO0FBQ0FILFlBQU0sQ0FBQ0MsR0FBUCxDQUFXLE9BQVgsRUFBb0J5QyxTQUFTLEdBQUcsQ0FBaEM7QUFDRCxLQUhEO0FBSUE5QyxXQUFPLENBQUNDLEdBQVIsQ0FBWSwrQkFBWjtBQUNEO0FBQ0YsQyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTTs7Ozs7Ozs7Ozs7QUMvUUFiLE1BQU0sQ0FBQzJELE1BQVAsQ0FBYztBQUFDQyxjQUFZLEVBQUMsTUFBSUE7QUFBbEIsQ0FBZDtBQUFBLE1BQU1DLFVBQVUsR0FBRyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQixJQUEvQixFQUFxQyxJQUFyQyxFQUEwQyxJQUExQyxFQUErQyxJQUEvQyxFQUFvRCxLQUFwRCxFQUEwRCxLQUExRCxFQUFnRSxLQUFoRSxDQUFuQixDLENBRUE7QUFDQTtBQUNBOztBQUVPLE1BQU1ELFlBQVksR0FBRyxDQUMxQjtBQUNFRSxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FEMEIsRUFPMUI7QUFDRUgsS0FBRyxFQUFFLEdBRFA7QUFFRUMsVUFBUSxFQUFFLFFBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBUDBCLEVBYTFCO0FBQ0VILEtBQUcsRUFBRSxHQURQO0FBRUVDLFVBQVEsRUFBRSxRQUZaO0FBR0VDLFNBQU8sRUFBRUgsVUFIWDtBQUlFSSxRQUFNLEVBQUU7QUFKVixDQWIwQixFQW1CMUI7QUFDRUgsS0FBRyxFQUFFLEdBRFA7QUFFRUMsVUFBUSxFQUFFLFFBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBbkIwQixFQXlCMUI7QUFDRUgsS0FBRyxFQUFFLEdBRFA7QUFFRUMsVUFBUSxFQUFFLFFBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBekIwQixFQStCMUI7QUFDRUgsS0FBRyxFQUFFLEdBRFA7QUFFRUMsVUFBUSxFQUFFLFFBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBL0IwQixFQXFDMUI7QUFDRUgsS0FBRyxFQUFFLEdBRFA7QUFFRUMsVUFBUSxFQUFFLFFBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBckMwQixFQTJDMUI7QUFDRUgsS0FBRyxFQUFFLEdBRFA7QUFFRUMsVUFBUSxFQUFFLFFBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBM0MwQixFQWlEMUI7QUFDRUgsS0FBRyxFQUFFLEdBRFA7QUFFRUMsVUFBUSxFQUFFLFFBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBakQwQixFQXVEMUI7QUFDRUgsS0FBRyxFQUFFLEdBRFA7QUFFRUMsVUFBUSxFQUFFLFNBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBdkQwQixFQTZEMUI7QUFDRUgsS0FBRyxFQUFFLElBRFA7QUFFRUMsVUFBUSxFQUFFLFNBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBN0QwQixFQW1FMUI7QUFDRUgsS0FBRyxFQUFFLElBRFA7QUFFRUMsVUFBUSxFQUFFLFNBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBbkUwQixFQXlFMUI7QUFDRUgsS0FBRyxFQUFFLElBRFA7QUFFRUMsVUFBUSxFQUFFLFNBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBekUwQixFQStFMUI7QUFDRUgsS0FBRyxFQUFFLElBRFA7QUFFRUMsVUFBUSxFQUFFLFNBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBL0UwQixFQXFGMUI7QUFDRUgsS0FBRyxFQUFFLElBRFA7QUFFRUMsVUFBUSxFQUFFLFNBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBckYwQixDQUFyQixDOzs7Ozs7Ozs7OztBQ05QakUsTUFBTSxDQUFDMkQsTUFBUCxDQUFjO0FBQUNPLGNBQVksRUFBQyxNQUFJQSxZQUFsQjtBQUErQnhELHdCQUFzQixFQUFDLE1BQUlBO0FBQTFELENBQWQ7O0FBQU8sU0FBU3dELFlBQVQsQ0FBc0JDLFNBQXRCLEVBQWlDbkQsTUFBakMsRUFBeUM7QUFDNUMsUUFBTW9ELFNBQVMsR0FBRyxFQUFsQjtBQUNBLE1BQUlsRCxPQUFPLEdBQUdpRCxTQUFTLENBQUNFLEtBQVYsQ0FBZ0IsR0FBaEIsQ0FBZDtBQUVBbkQsU0FBTyxDQUFDSCxPQUFSLENBQWlCdUQsQ0FBRCxJQUFPO0FBQ3JCLFVBQU1DLFVBQVUsR0FBR0QsQ0FBQyxDQUFDRCxLQUFGLENBQVEsR0FBUixDQUFuQjtBQUNBLFVBQU1HLFdBQVcsR0FBR3hELE1BQU0sQ0FBQ0csR0FBUCxDQUFXLFFBQVgsQ0FBcEI7O0FBRUEsUUFBSXFELFdBQVcsS0FBS2hELFFBQVEsQ0FBQytDLFVBQVUsQ0FBQyxDQUFELENBQVgsQ0FBNUIsRUFBNkM7QUFDM0NILGVBQVMsQ0FBQ3BDLElBQVYsQ0FBZXVDLFVBQVUsQ0FBQyxDQUFELENBQXpCO0FBQ0QsS0FGRCxNQUVPLElBQUlDLFdBQVcsS0FBS2hELFFBQVEsQ0FBQytDLFVBQVUsQ0FBQyxDQUFELENBQVgsQ0FBNUIsRUFBNkM7QUFDbERILGVBQVMsQ0FBQ3BDLElBQVYsQ0FBZXVDLFVBQVUsQ0FBQyxDQUFELENBQXpCO0FBQ0Q7QUFDRixHQVREO0FBV0EsU0FBT0UsQ0FBQyxDQUFDQyxJQUFGLENBQU9OLFNBQVAsRUFBa0IsSUFBbEIsQ0FBUDtBQUNEOztBQUVJLFNBQVMxRCxzQkFBVCxDQUFnQ0osSUFBaEMsRUFBc0M7QUFDekMsUUFBTXFFLFdBQVcsR0FBRyxFQUFwQjtBQUNBLFFBQU1DLFFBQVEsR0FBRyxFQUFqQixDQUZ5QyxDQUd6Qzs7QUFDQSxRQUFNekMsYUFBYSxHQUFHN0IsSUFBSSxDQUFDUSxPQUFMLENBQWFzQixNQUFiLENBQW9CTixDQUFDLElBQUksQ0FBQ0EsQ0FBQyxDQUFDWCxHQUFGLENBQU0sVUFBTixDQUExQixDQUF0QixDQUp5QyxDQU96QztBQUNBO0FBQ0E7O0FBRUFiLE1BQUksQ0FBQ1EsT0FBTCxDQUFhQyxPQUFiLENBQXNCZSxDQUFELElBQU87QUFDMUI7QUFDQSxRQUFJLENBQUNBLENBQUMsQ0FBQ1gsR0FBRixDQUFNLFNBQU4sQ0FBTCxFQUF1QjtBQUVyQndELGlCQUFXLENBQUMzQyxJQUFaLFdBQW9CRixDQUFDLENBQUNYLEdBQUYsQ0FBTSxRQUFOLENBQXBCO0FBQ0Q7O0FBQ0R5RCxZQUFRLENBQUM1QyxJQUFULFdBQWlCRixDQUFDLENBQUNYLEdBQUYsQ0FBTSxRQUFOLENBQWpCO0FBQ0QsR0FQRDtBQVNBYixNQUFJLENBQUNRLE9BQUwsQ0FBYUMsT0FBYixDQUFzQmUsQ0FBRCxJQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUVBO0FBQ0EsVUFBTStDLFlBQVksR0FBR0QsUUFBUSxDQUFDeEMsTUFBVCxDQUFnQjBDLEVBQUUsSUFBSXRELFFBQVEsQ0FBQ3NELEVBQUQsQ0FBUixLQUFpQmhELENBQUMsQ0FBQ1gsR0FBRixDQUFNLFFBQU4sQ0FBdkMsQ0FBckI7QUFDQVcsS0FBQyxDQUFDYixHQUFGLENBQU0sV0FBTixFQUFtQjRELFlBQW5CO0FBQ0QsR0FSRDtBQVNILEM7Ozs7Ozs7Ozs7O0FDL0NELElBQUk5RSxRQUFKO0FBQWFDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNKLFlBQVEsR0FBQ0ksQ0FBVDtBQUFXOztBQUF2QixDQUFuQyxFQUE0RCxDQUE1RDtBQUErREgsTUFBTSxDQUFDQyxJQUFQLENBQVksV0FBWjtBQUF5QkQsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0JBQVo7QUFBOEIsSUFBSThFLFdBQUosRUFBZ0JuQixZQUFoQjtBQUE2QjVELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGFBQVosRUFBMEI7QUFBQzhFLGFBQVcsQ0FBQzVFLENBQUQsRUFBRztBQUFDNEUsZUFBVyxHQUFDNUUsQ0FBWjtBQUFjLEdBQTlCOztBQUErQnlELGNBQVksQ0FBQ3pELENBQUQsRUFBRztBQUFDeUQsZ0JBQVksR0FBQ3pELENBQWI7QUFBZTs7QUFBOUQsQ0FBMUIsRUFBMEYsQ0FBMUY7QUFBNkYsSUFBSStELFlBQUosRUFBaUJ4RCxzQkFBakI7QUFBd0NWLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFFBQVosRUFBcUI7QUFBQ2lFLGNBQVksQ0FBQy9ELENBQUQsRUFBRztBQUFDK0QsZ0JBQVksR0FBQy9ELENBQWI7QUFBZSxHQUFoQzs7QUFBaUNPLHdCQUFzQixDQUFDUCxDQUFELEVBQUc7QUFBQ08sMEJBQXNCLEdBQUNQLENBQXZCO0FBQXlCOztBQUFwRixDQUFyQixFQUEyRyxDQUEzRztBQU9yUztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBSixRQUFRLENBQUNpRixRQUFULENBQWtCMUUsSUFBSSxJQUFJO0FBQ3hCLFFBQU07QUFDSitCLGFBQVMsRUFBRTtBQUNUNEMsaUJBRFM7QUFFVEMsc0JBRlM7QUFHVEMsbUJBSFM7QUFJVEMscUJBSlM7QUFLVEMsK0JBTFM7QUFNVEMsNEJBTlM7QUFPVEMsa0JBUFM7QUFRVEMsb0JBUlM7QUFTVEMsb0JBVFM7QUFVVEMscUJBVlM7QUFXVEM7QUFYUztBQURQLE1BY0ZyRixJQWRKO0FBaUJBLFFBQU1zRixTQUFTLEdBQUdoQyxZQUFsQjtBQUNBLFFBQU1pQyxPQUFPLEdBQUdSLHlCQUF5QixHQUFHSixXQUFXLEdBQUcsQ0FBakIsR0FBcUJPLGNBQTlELENBbkJ3QixDQW1Cc0Q7O0FBQzlFLFFBQU1NLHFCQUFxQixHQUFHWCxhQUFhLEdBQUNDLGVBQTVDO0FBRUEsTUFBSVcsTUFBTSxHQUFHLENBQUMsT0FBRCxFQUFVLEtBQVYsRUFBaUIsUUFBakIsRUFBMkIsTUFBM0IsRUFBbUMsUUFBbkMsRUFBNkMsT0FBN0MsRUFBc0QsT0FBdEQsQ0FBYjtBQUNBQSxRQUFNLEdBQUdDLE9BQU8sQ0FBQ0QsTUFBRCxDQUFoQjtBQUVBekYsTUFBSSxDQUFDUSxPQUFMLENBQWFDLE9BQWIsQ0FBcUIsQ0FBQ0MsTUFBRCxFQUFTaUYsQ0FBVCxLQUFlO0FBQ2xDakYsVUFBTSxDQUFDQyxHQUFQLENBQVcsUUFBWCwrQkFBMkNELE1BQU0sQ0FBQzhDLEdBQWxEO0FBQ0E5QyxVQUFNLENBQUNDLEdBQVAsQ0FBVyxPQUFYLEVBQW9CLENBQXBCLEVBRmtDLENBSWxDOztBQUNBRCxVQUFNLENBQUNDLEdBQVAsQ0FBVyxRQUFYLEVBQXFCZ0YsQ0FBQyxHQUFHLENBQXpCO0FBQ0FqRixVQUFNLENBQUNDLEdBQVAsQ0FBVyxNQUFYLEVBQW1CRCxNQUFNLENBQUM4RCxFQUExQjtBQUNBOUQsVUFBTSxDQUFDQyxHQUFQLENBQVcsZUFBWCxFQUE0QjhFLE1BQU0sQ0FBQ0UsQ0FBRCxDQUFsQztBQUNELEdBUkQ7O0FBV0EsTUFBSTNGLElBQUksQ0FBQ1EsT0FBTCxDQUFhbUIsTUFBYixHQUFzQjNCLElBQUksQ0FBQytCLFNBQUwsQ0FBZTRDLFdBQXpDLEVBQXNEO0FBQUU7QUFDdER2RSwwQkFBc0IsQ0FBQ0osSUFBRCxDQUF0QjtBQUNBQSxRQUFJLENBQUNRLE9BQUwsQ0FBYUMsT0FBYixDQUFzQmUsQ0FBRCxJQUFPO0FBQzFCbEIsYUFBTyxDQUFDQyxHQUFSLENBQVlpQixDQUFDLENBQUNYLEdBQUYsQ0FBTSxXQUFOLENBQVo7QUFDRCxLQUZEO0FBR0QsR0FMRCxNQUtPO0FBQ0xiLFFBQUksQ0FBQ1EsT0FBTCxDQUFhQyxPQUFiLENBQXNCZSxDQUFELElBQU87QUFDMUJBLE9BQUMsQ0FBQ2IsR0FBRixDQUFNLFdBQU4sRUFBbUJpRCxZQUFZLENBQUNnQixnQkFBRCxFQUFtQnBELENBQW5CLENBQS9CO0FBQ0FsQixhQUFPLENBQUNDLEdBQVIsQ0FBWWlCLENBQUMsQ0FBQ1gsR0FBRixDQUFNLFdBQU4sQ0FBWjtBQUNELEtBSEQ7QUFJRCxHQTlDdUIsQ0FnRHhCO0FBQ0E7OztBQUNBc0QsR0FBQyxDQUFDeUIsS0FBRixDQUFTZixhQUFULEVBQXdCYyxDQUFDLElBQUk7QUFDM0IsVUFBTTFGLEtBQUssR0FBR0QsSUFBSSxDQUFDNkYsUUFBTCxFQUFkO0FBRUEsVUFBTTtBQUFDbkMsYUFBRDtBQUFVRCxjQUFWO0FBQW9CRTtBQUFwQixRQUE4QjJCLFNBQVMsQ0FBQ0ssQ0FBRCxDQUE3QztBQUVBLFVBQU1HLFNBQVMsR0FBRzdGLEtBQUssQ0FBQzhGLFFBQU4sQ0FBZTtBQUMvQjVELFVBQUksRUFBRSxNQUR5QjtBQUUvQkMsaUJBQVcsRUFBRXFCLFFBRmtCO0FBRy9CRSxZQUFNLEVBQUVBLE1BSHVCO0FBSS9CcUMsdUJBQWlCLEVBQUVmO0FBSlksS0FBZixDQUFsQjtBQU1BYSxhQUFTLENBQUNuRixHQUFWLENBQWMsTUFBZCxFQUFzQjJFLFNBQVMsQ0FBQ0ssQ0FBRCxDQUEvQjtBQUNBTSx3QkFBb0IsQ0FBQ3ZDLE9BQUQsRUFBVUMsTUFBVixFQUFrQjRCLE9BQWxCLEVBQTJCOUIsUUFBM0IsRUFBcUN6RCxJQUFyQyxFQUEyQ3FGLGFBQTNDLENBQXBCO0FBQ0FTLGFBQVMsQ0FBQ25GLEdBQVYsQ0FBYyxRQUFkLEVBQXdCMkUsU0FBUyxDQUFDSyxDQUFELENBQVQsQ0FBYWhDLE1BQXJDO0FBRUEsVUFBTXVDLFdBQVcsR0FBR2pHLEtBQUssQ0FBQzhGLFFBQU4sQ0FBZTtBQUNqQzVELFVBQUksRUFBRSxRQUQyQjtBQUVqQ0MsaUJBQVcsRUFBRSxRQUZvQjtBQUdqQzRELHVCQUFpQixFQUFFWjtBQUhjLEtBQWYsQ0FBcEI7O0FBTUEsUUFBSSxDQUFDTyxDQUFDLEdBQUMsQ0FBSCxJQUFRSCxxQkFBUixLQUFrQyxDQUF0QyxFQUF5QztBQUFFO0FBQ3pDLFlBQU1XLFdBQVcsR0FBR25HLElBQUksQ0FBQzZGLFFBQUwsRUFBcEI7QUFFQSxZQUFNTyxZQUFZLEdBQUdELFdBQVcsQ0FBQ0osUUFBWixDQUFxQjtBQUN4QzVELFlBQUksRUFBRSxRQURrQztBQUV4Q0MsbUJBQVcsRUFBRSxRQUYyQjtBQUd4QzRELHlCQUFpQixFQUFFYjtBQUhxQixPQUFyQixDQUFyQjtBQUtEO0FBRUYsR0EvQkQ7O0FBbUNBLFdBQVNjLG9CQUFULENBQThCWCxTQUE5QixFQUF5QzNCLE1BQXpDLEVBQWlENEIsT0FBakQsRUFBMEQ5QixRQUExRCxFQUFvRXpELElBQXBFLEVBQTBFcUYsYUFBMUUsRUFBeUY7QUFDckYsUUFBSWdCLG9CQUFvQixHQUFHZixTQUFTLENBQUN4RCxNQUFWLENBQWlCd0UsTUFBTSxJQUFJQSxNQUFNLEtBQUszQyxNQUF0QyxDQUEzQjtBQUNBMEMsd0JBQW9CLEdBQUdYLE9BQU8sQ0FBQ1csb0JBQUQsQ0FBOUI7QUFDQSxRQUFJRSxVQUFVLEdBQUd2RyxJQUFJLENBQUNRLE9BQUwsQ0FBYW1CLE1BQTlCO0FBQ0EsUUFBSTZFLFVBQVUsR0FBRyxDQUFqQixDQUpxRixDQU9yRjs7QUFDQSxRQUFJQyxVQUFVLEdBQUcsRUFBakI7O0FBQ0EsU0FBSyxJQUFJZCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHVSxvQkFBb0IsQ0FBQzFFLE1BQXpDLEVBQWlEZ0UsQ0FBQyxFQUFsRCxFQUFzRDtBQUNwRCxVQUFJVyxNQUFNLEdBQUdELG9CQUFvQixDQUFDVixDQUFELENBQWpDOztBQUNBLFVBQUksQ0FBQ2MsVUFBVSxDQUFDQyxjQUFYLENBQTBCSixNQUExQixDQUFMLEVBQXdDO0FBQ3RDRyxrQkFBVSxDQUFDSCxNQUFELENBQVYsR0FBcUJDLFVBQVUsR0FBRyxDQUFsQyxDQURzQyxDQUNEO0FBQ3RDO0FBQ0Y7O0FBRUR2RyxRQUFJLENBQUNRLE9BQUwsQ0FBYUMsT0FBYixDQUFzQkMsTUFBRCxJQUFZO0FBQy9CLFVBQUlpRyxhQUFhLEdBQUcsRUFBcEI7O0FBQ0EsV0FBSyxJQUFJaEIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1Usb0JBQW9CLENBQUMxRSxNQUF6QyxFQUFpRGdFLENBQUMsRUFBbEQsRUFBc0Q7QUFDcEQsWUFBSVcsTUFBTSxHQUFHRCxvQkFBb0IsQ0FBQ1YsQ0FBRCxDQUFqQzs7QUFDQSxZQUFJZ0IsYUFBYSxDQUFDaEYsTUFBZCxHQUF1QjRELE9BQU8sR0FBRyxDQUFyQyxFQUF3QztBQUFFO0FBQ3hDLGNBQUlrQixVQUFVLENBQUNILE1BQUQsQ0FBVixHQUFxQixDQUFyQixLQUEyQixDQUEvQixFQUFrQztBQUFFO0FBQ2hDLGdCQUFJRSxVQUFVLEdBQUduQixhQUFqQixFQUFpQztBQUFFO0FBQ2pDc0IsMkJBQWEsQ0FBQ2pGLElBQWQsQ0FBbUI0RSxNQUFuQjtBQUNBRyx3QkFBVSxDQUFDSCxNQUFELENBQVYsSUFBc0IsQ0FBdEI7QUFDQUUsd0JBQVUsSUFBSSxDQUFkO0FBQ0Q7QUFDSixXQU5ELE1BTU87QUFDTEcseUJBQWEsQ0FBQ2pGLElBQWQsQ0FBbUI0RSxNQUFuQjtBQUNBRyxzQkFBVSxDQUFDSCxNQUFELENBQVYsSUFBc0IsQ0FBdEI7QUFDRDtBQUNGO0FBQ0Y7O0FBQ0RLLG1CQUFhLENBQUNqRixJQUFkLENBQW1CaUMsTUFBbkIsRUFqQitCLENBaUJIOztBQUM1QixXQUFLLElBQUlpRCxjQUFULElBQTJCRCxhQUEzQixFQUEwQztBQUN4QyxZQUFJRixVQUFVLENBQUNHLGNBQUQsQ0FBVixLQUErQixDQUFuQyxFQUFzQztBQUFFO0FBQ3RDUCw4QkFBb0IsR0FBR0Esb0JBQW9CLENBQUN2RSxNQUFyQixDQUE0QndFLE1BQU0sSUFBSUEsTUFBTSxLQUFLTSxjQUFqRCxDQUF2QjtBQUVEO0FBQ0Y7O0FBRURELG1CQUFhLEdBQUdqQixPQUFPLENBQUNpQixhQUFELENBQXZCO0FBRUFqRyxZQUFNLENBQUNDLEdBQVAsQ0FBVzhDLFFBQVgsRUFBcUJrRCxhQUFyQjtBQUNELEtBNUJEO0FBK0JILEdBcEl1QixDQXNJeEI7QUFDQTs7O0FBQ0EsV0FBU2pCLE9BQVQsQ0FBaUJKLFNBQWpCLEVBQTRCO0FBQzFCLFNBQUtLLENBQUMsR0FBR0wsU0FBUyxDQUFDM0QsTUFBVixHQUFrQixDQUEzQixFQUErQmdFLENBQUMsR0FBRyxDQUFuQyxFQUFzQ0EsQ0FBQyxFQUF2QyxFQUEyQztBQUN6QyxZQUFNa0IsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLE1BQWlCckIsQ0FBQyxHQUFHLENBQXJCLENBQVgsQ0FBVjtBQUVBLE9BQUNMLFNBQVMsQ0FBQ0ssQ0FBRCxDQUFWLEVBQWVMLFNBQVMsQ0FBQ3VCLENBQUQsQ0FBeEIsSUFBK0IsQ0FBQ3ZCLFNBQVMsQ0FBQ3VCLENBQUQsQ0FBVixFQUFldkIsU0FBUyxDQUFDSyxDQUFELENBQXhCLENBQS9CO0FBQ0Q7O0FBQ0QsV0FBT0wsU0FBUDtBQUNEO0FBRUYsQ0FqSkQsRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuXG4vLyBUaGlzIGlzIHdoZXJlIHlvdSBhZGQgYm90cywgbGlrZSBCb2I6XG5cbkVtcGlyaWNhLmJvdChcImJvYlwiLCB7XG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaCBzdGFnZSAoYWZ0ZXIgb25Sb3VuZFN0YXJ0L29uU3RhZ2VTdGFydClcbiAgLy8gb25TdGFnZVN0YXJ0KGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzKSB7fSxcblxuICAvLyBDYWxsZWQgZHVyaW5nIGVhY2ggc3RhZ2UgYXQgdGljayBpbnRlcnZhbCAofjFzIGF0IHRoZSBtb21lbnQpXG4gIG9uU3RhZ2VUaWNrKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBzZWNvbmRzUmVtYWluaW5nKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQSBwbGF5ZXIgaGFzIGNoYW5nZWQgYSB2YWx1ZVxuICAvLyAvLyBUaGlzIG1pZ2h0IGhhcHBlbiBhIGxvdCFcbiAgLy8gb25TdGFnZVBsYXllckNoYW5nZShib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycywgcGxheWVyKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBlbmQgb2YgdGhlIHN0YWdlIChhZnRlciBpdCBmaW5pc2hlZCwgYmVmb3JlIG9uU3RhZ2VFbmQvb25Sb3VuZEVuZCBpcyBjYWxsZWQpXG4gIC8vIG9uU3RhZ2VFbmQoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMpIHt9XG59KTtcbiIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcblxuaW1wb3J0IHsgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcblxuXG4vLyBvbkdhbWVTdGFydCBpcyB0cmlnZ2VyZWQgb3BuY2UgcGVyIGdhbWUgYmVmb3JlIHRoZSBnYW1lIHN0YXJ0cywgYW5kIGJlZm9yZVxuLy8gdGhlIGZpcnN0IG9uUm91bmRTdGFydC4gSXQgcmVjZWl2ZXMgdGhlIGdhbWUgYW5kIGxpc3Qgb2YgYWxsIHRoZSBwbGF5ZXJzIGluXG4vLyB0aGUgZ2FtZS5cbkVtcGlyaWNhLm9uR2FtZVN0YXJ0KGdhbWUgPT4ge1xuICBjb25zb2xlLmxvZyhcIkdhbWUgc3RhcnRlZFwiKTtcbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5zZXQoXCJpbmFjdGl2ZVwiLCBmYWxzZSk7XG4gICAgY29uc3QgbmV0d29yayA9IHBsYXllci5nZXQoXCJuZWlnaGJvcnNcIik7XG4gICAgY29uc3QgYWN0aXZlQ2hhdHMgPSBbXTtcbiAgICBuZXR3b3JrLm1hcChvdGhlck5vZGVJZCA9PiB7XG4gICAgICB2YXIgcGFpck9mUGxheWVycyA9IFtwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpLCBwYXJzZUludChvdGhlck5vZGVJZCldO1xuICAgICAgcGFpck9mUGxheWVycy5zb3J0KChwMSxwMikgPT4gcDEgLSBwMik7XG4gICAgICBjb25zdCBvdGhlclBsYXllciA9IGdhbWUucGxheWVycy5maW5kKHAgPT4gcC5nZXQoXCJub2RlSWRcIikgPT09IHBhcnNlSW50KG90aGVyTm9kZUlkKSk7XG4gICAgICAvLyBjb25zdCBvdGhlclBsYXllcklkID0gb3RoZXJQbGF5ZXIuaWQ7XG4gICAgICBjb25zdCBjaGF0S2V5ID0gYCR7cGFpck9mUGxheWVyc1swXX0tJHtwYWlyT2ZQbGF5ZXJzWzFdfWA7XG4gICAgICBhY3RpdmVDaGF0cy5wdXNoKGNoYXRLZXkpO1xuICAgIH0pO1xuICAgIC8vIERlZmF1bHQgYWxsIGNoYXRzIHRvIGJlIG9wZW4gd2hlbiBnYW1lIHN0YXJ0c1xuICAgIHBsYXllci5zZXQoXCJhY3RpdmVDaGF0c1wiLCBhY3RpdmVDaGF0cyk7XG4gICAgY29uc29sZS5sb2cocGxheWVyLmdldChcImFjdGl2ZUNoYXRzXCIpKTtcbiAgfSk7XG4gIGdhbWUuc2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIsIGdhbWUucGxheWVycy5sZW5ndGgpO1xufSk7XG5cbi8vIG9uUm91bmRTdGFydCBpcyB0cmlnZ2VyZWQgYmVmb3JlIGVhY2ggcm91bmQgc3RhcnRzLCBhbmQgYmVmb3JlIG9uU3RhZ2VTdGFydC5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lU3RhcnQsIGFuZCB0aGUgcm91bmQgdGhhdCBpcyBzdGFydGluZy5cbkVtcGlyaWNhLm9uUm91bmRTdGFydCgoZ2FtZSwgcm91bmQpID0+IHtcbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAgIHBsYXllci5zZXQoXCJzeW1ib2xTZWxlY3RlZFwiLCBcIlwiKTtcbiAgfSk7XG4gIHJvdW5kLnNldChcInJlc3VsdFwiLCBmYWxzZSk7XG4gIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgMCk7XG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoYWN0aXZlUGxheWVycy5sZW5ndGggPCBnYW1lLmdldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiKSApIHsgLy8gU29tZW9uZSBsZWZ0IGluIHRoZSBtaWRkbGUgb2YgdGhlIHJvdW5kXG4gICAgaWYgKGdhbWUudHJlYXRtZW50LmVuZEdhbWVJZlBsYXllcklkbGUpIHtcbiAgICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICBwLmV4aXQoXCJzb21lb25lSW5hY3RpdmVcIik7XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpOyAvLyBVcGRhdGVzIHRoZSBuZWlnaGJvcnMgdG8gYmUgZnVsbHkgY29ubmVjdGVkXG4gICAgfVxuICBcbiAgfVxuICBnYW1lLnNldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiLCBhY3RpdmVQbGF5ZXJzLmxlbmd0aCk7XG5cbiAgY29uc29sZS5sb2coXCJSb3VuZCBTdGFydGVkXCIpO1xuXG59KTtcblxuLy8gb25TdGFnZVN0YXJ0IGlzIHRyaWdnZXJlZCBiZWZvcmUgZWFjaCBzdGFnZSBzdGFydHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uUm91bmRTdGFydCwgYW5kIHRoZSBzdGFnZSB0aGF0IGlzIHN0YXJ0aW5nLlxuRW1waXJpY2Eub25TdGFnZVN0YXJ0KChnYW1lLCByb3VuZCwgc3RhZ2UpID0+IHtcbiAgY29uc29sZS5sb2coXCJTdGFnZSBTdGFydGVkXCIpXG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJUYXNrXCIpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgY29uc29sZS5sb2coIGBTeW1ib2xzIDogJHtwbGF5ZXIuZ2V0KGAke3N0YWdlLmRpc3BsYXlOYW1lfWApfWApO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKGBBbnN3ZXI6ICR7c3RhZ2UuZ2V0KFwiYW5zd2VyXCIpfWApO1xuICB9XG4gIGlmIChzdGFnZS5uYW1lID09PSBcIlN1cnZleVwiKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIHBsYXllci5zZXQoXCJzdXJ2ZXlOdW1iZXJcIiAsIDEpXG4gICAgfSk7XG4gIH1cbiAgLy8gZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAvLyB9KTtcbiAgLy8gc3RhZ2Uuc2V0KFwic2hvd1Jlc3VsdHNcIiwgZmFsc2UpO1xuICAvLyBzdGFnZS5zZXQoXCJyZXN1bHRzU2hvd25cIiwgZmFsc2UpO1xuXG59KTtcblxuLy8gb25TdGFnZUVuZCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgZWFjaCBzdGFnZS5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25Sb3VuZEVuZCwgYW5kIHRoZSBzdGFnZSB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblN0YWdlRW5kKChnYW1lLCByb3VuZCwgc3RhZ2UpID0+e1xuICBjb25zb2xlLmxvZyhcIlN0YWdlIEVuZGVkXCIpXG4gIFxufSk7XG5cbi8vIG9uUm91bmRFbmQgaXMgdHJpZ2dlcmVkIGFmdGVyIGVhY2ggcm91bmQuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZUVuZCwgYW5kIHRoZSByb3VuZCB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblJvdW5kRW5kKChnYW1lLCByb3VuZCkgPT4ge1xuICAvLyBnYW1lLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAvLyAgIGNvbnN0IHZhbHVlID0gcGxheWVyLnJvdW5kLmdldChcInZhbHVlXCIpIHx8IDA7XG4gIC8vICAgY29uc3QgcHJldlNjb3JlID0gcGxheWVyLmdldChcInNjb3JlXCIpIHx8IDA7XG4gIC8vICAgcGxheWVyLnNldChcInNjb3JlXCIsIHByZXZTY29yZSArIHZhbHVlKTtcbiAgLy8gfSk7XG5cbn0pO1xuXG4vLyBvbkdhbWVFbmQgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGdhbWUgZW5kcy5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lU3RhcnQuXG5FbXBpcmljYS5vbkdhbWVFbmQoZ2FtZSA9PiB7fSk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT4gb25TZXQsIG9uQXBwZW5kIGFuZCBvbkNoYW5nZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBvblNldCwgb25BcHBlbmQgYW5kIG9uQ2hhbmdlIGFyZSBjYWxsZWQgb24gZXZlcnkgc2luZ2xlIHVwZGF0ZSBtYWRlIGJ5IGFsbFxuLy8gcGxheWVycyBpbiBlYWNoIGdhbWUsIHNvIHRoZXkgY2FuIHJhcGlkbHkgYmVjb21lIHF1aXRlIGV4cGVuc2l2ZSBhbmQgaGF2ZVxuLy8gdGhlIHBvdGVudGlhbCB0byBzbG93IGRvd24gdGhlIGFwcC4gVXNlIHdpc2VseS5cbi8vXG4vLyBJdCBpcyB2ZXJ5IHVzZWZ1bCB0byBiZSBhYmxlIHRvIHJlYWN0IHRvIGVhY2ggdXBkYXRlIGEgdXNlciBtYWtlcy4gVHJ5XG4vLyBub250aGVsZXNzIHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgY29tcHV0YXRpb25zIGFuZCBkYXRhYmFzZSBzYXZlcyAoLnNldClcbi8vIGRvbmUgaW4gdGhlc2UgY2FsbGJhY2tzLiBZb3UgY2FuIGFsc28gdHJ5IHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgY2FsbHMgdG9cbi8vIHNldCgpIGFuZCBhcHBlbmQoKSB5b3UgbWFrZSAoYXZvaWQgY2FsbGluZyB0aGVtIG9uIGEgY29udGludW91cyBkcmFnIG9mIGFcbi8vIHNsaWRlciBmb3IgZXhhbXBsZSkgYW5kIGluc2lkZSB0aGVzZSBjYWxsYmFja3MgdXNlIHRoZSBga2V5YCBhcmd1bWVudCBhdCB0aGVcbi8vIHZlcnkgYmVnaW5uaW5nIG9mIHRoZSBjYWxsYmFjayB0byBmaWx0ZXIgb3V0IHdoaWNoIGtleXMgeW91ciBuZWVkIHRvIHJ1blxuLy8gbG9naWMgYWdhaW5zdC5cbi8vXG4vLyBJZiB5b3UgYXJlIG5vdCB1c2luZyB0aGVzZSBjYWxsYmFja3MsIGNvbW1lbnQgdGhlbSBvdXQgc28gdGhlIHN5c3RlbSBkb2VzXG4vLyBub3QgY2FsbCB0aGVtIGZvciBub3RoaW5nLlxuXG4vLyAvLyBvblNldCBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIC5zZXQoKSBtZXRob2Rcbi8vIC8vIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uU2V0KChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbi8vICkgPT4ge1xuLy8gICAvLyAvLyBFeGFtcGxlIGZpbHRlcmluZ1xuLy8gICAvLyBpZiAoa2V5ICE9PSBcInZhbHVlXCIpIHtcbi8vICAgLy8gICByZXR1cm47XG4vLyAgIC8vIH1cbi8vIH0pO1xuXG5FbXBpcmljYS5vblNldCgoXG4gIGdhbWUsXG4gIHJvdW5kLFxuICBzdGFnZSxcbiAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbiAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4gIHZhbHVlLCAvLyBOZXcgdmFsdWVcbiAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4pID0+IHtcbiAgY29uc3QgcGxheWVycyA9IGdhbWUucGxheWVycztcbiAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG4gIC8vIFNvbWUgcGxheWVyIGRlY2lkZXMgdG8gcmVjb25zaWRlciB0aGVpciBhbnN3ZXJcbiAgY29uc29sZS5sb2coXCJrZXlcIiwga2V5KTtcbiAgaWYgKGtleSA9PT0gXCJzdWJtaXR0ZWRcIikgeyBcbiAgICAvLyBDaGVja3MgaWYgZXZlcnlvbmUgaGFzIHN1Ym1pdHRlZCB0aGVpciBhbnN3ZXIgYW5kIGlmIHNvLCBzdWJtaXQgdGhlIHN0YWdlXG4gICAgbGV0IGFsbFN1Ym1pdHRlZCA9IHRydWU7XG4gICAgbGV0IG51bVBsYXllcnNTdWJtaXR0ZWQgPSAwO1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmdldChcInN1Ym1pdHRlZFwiKSkge1xuICAgICAgICBudW1QbGF5ZXJzU3VibWl0dGVkICs9IDE7XG4gICAgICB9XG4gICAgICBhbGxTdWJtaXR0ZWQgPSBwbGF5ZXIuZ2V0KFwic3VibWl0dGVkXCIpICYmIGFsbFN1Ym1pdHRlZDtcbiAgICB9KVxuICAgIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgbnVtUGxheWVyc1N1Ym1pdHRlZCk7XG4gICAgaWYgKGFsbFN1Ym1pdHRlZCkge1xuICAgICAgY29uc3QgbG9nID0gc3RhZ2UuZ2V0KFwibG9nXCIpO1xuICAgICAgY29tcHV0ZVNjb3JlKGFjdGl2ZVBsYXllcnMsIHN0YWdlLCByb3VuZCk7XG4gICAgICAvLyBOZWVkIHRvIHN1Ym1pdCBmb3Igc3VibWl0IHRoZSBzdGFnZSBmb3IgZXZlcnkgcGxheWVyXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgICAgIH0pXG4gICAgfVxuICAvLyAgIGlmIChzdGFnZS5nZXQoXCJyZXN1bHRzU2hvd25cIikpIHtcbiAgLy8gICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgLy8gICAgIH0pXG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gaWYgKHRhcmdldFR5cGUgPT09IFwic3RhZ2VcIiAmJiBrZXkgPT09IFwicmVzdWx0c1Nob3duXCIpIHtcbiAgLy8gICBpZiAoc3RhZ2UuZ2V0KFwicmVzdWx0c1Nob3duXCIpKSB7XG4gIC8vICAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4gIC8vICAgICB9KVxuICAvLyAgIH1cbiAgfVxuXG4gIC8vIGVsc2UgaWYgKGtleSA9PT0gXCJpbmFjdGl2ZVwiKSB7XG4gICAgLy8gZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgLy8gfVxuXG4gIHJldHVybjtcblxufSk7XG5cbmZ1bmN0aW9uIGNvbXB1dGVTY29yZShhY3RpdmVQbGF5ZXJzLCBzdGFnZSwgcm91bmQpIHtcbiAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuICBjb25zb2xlLmxvZyhcIkNPUlJFQ1QgQU5TV0VSOlwiKVxuICBjb25zb2xlLmxvZyhzdGFnZS5nZXQoXCJhbnN3ZXJcIikpO1xuICBjb25zb2xlLmxvZyhcIlBsYXllcnMgZ3Vlc3NlZDpcIilcblxuICBhY3RpdmVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICBjb25zdCBzdWJtaXNzaW9uID0gcGxheWVyLmdldChcInN5bWJvbFNlbGVjdGVkXCIpO1xuICAgIGNvbnNvbGUubG9nKHN1Ym1pc3Npb24pO1xuICAgIGlmIChzdWJtaXNzaW9uICE9PSBzdGFnZS5nZXQoXCJhbnN3ZXJcIikpIHtcbiAgICAgIHN1Y2Nlc3MgPSBmYWxzZVxuICAgIH1cbiAgfSlcbiAgcm91bmQuc2V0KFwicmVzdWx0XCIsIHN1Y2Nlc3MpO1xuICBpZiAoc3VjY2Vzcykge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgY29uc3QgcHJldlNjb3JlID0gcGxheWVyLmdldChcInNjb3JlXCIpIHx8IDA7XG4gICAgICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgcHJldlNjb3JlICsgMSk7XG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyhcIiBBbGwgcGxheWVycyBnb3QgaXQgY29ycmVjdGx5XCIpO1xuICB9IFxufVxuXG4vLyAvLyBvbkFwcGVuZCBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIGAuYXBwZW5kKClgIG1ldGhvZFxuLy8gLy8gb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3IgcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25BcHBlbmQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gKSA9PiB7XG4vLyAgIC8vIE5vdGU6IGB2YWx1ZWAgaXMgdGhlIHNpbmdsZSBsYXN0IHZhbHVlIChlLmcgMC4yKSwgd2hpbGUgYHByZXZWYWx1ZWAgd2lsbFxuLy8gICAvLyAgICAgICBiZSBhbiBhcnJheSBvZiB0aGUgcHJldmlzb3VzIHZhbHVlZCAoZS5nLiBbMC4zLCAwLjQsIDAuNjVdKS5cbi8vIH0pO1xuXG5cbi8vIC8vIG9uQ2hhbmdlIGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgYC5zZXQoKWAgb3IgdGhlXG4vLyAvLyBgLmFwcGVuZCgpYCBtZXRob2Qgb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3Jcbi8vIC8vIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uQ2hhbmdlKChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUsIC8vIFByZXZpb3VzIHZhbHVlXG4vLyAgIGlzQXBwZW5kIC8vIFRydWUgaWYgdGhlIGNoYW5nZSB3YXMgYW4gYXBwZW5kLCBmYWxzZSBpZiBpdCB3YXMgYSBzZXRcbi8vICkgPT4ge1xuLy8gICAvLyBgb25DaGFuZ2VgIGlzIHVzZWZ1bCB0byBydW4gc2VydmVyLXNpZGUgbG9naWMgZm9yIGFueSB1c2VyIGludGVyYWN0aW9uLlxuLy8gICAvLyBOb3RlIHRoZSBleHRyYSBpc0FwcGVuZCBib29sZWFuIHRoYXQgd2lsbCBhbGxvdyB0byBkaWZmZXJlbmNpYXRlIHNldHMgYW5kXG4vLyAgIC8vIGFwcGVuZHMuXG4vLyAgICBHYW1lLnNldChcImxhc3RDaGFuZ2VBdFwiLCBuZXcgRGF0ZSgpLnRvU3RyaW5nKCkpXG4vLyB9KTtcblxuLy8gLy8gb25TdWJtaXQgaXMgY2FsbGVkIHdoZW4gdGhlIHBsYXllciBzdWJtaXRzIGEgc3RhZ2UuXG4vLyBFbXBpcmljYS5vblN1Ym1pdCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyIC8vIFBsYXllciB3aG8gc3VibWl0dGVkXG4vLyApID0+IHtcbi8vIH0pO1xuIiwiY29uc3QgYWxsU3ltYm9scyA9IFtcInQxXCIsIFwidDJcIiwgXCJ0M1wiLCBcInQ0XCIsIFwidDVcIiwgXCJ0NlwiLCBcInQ3XCIsXCJ0OFwiLFwidDlcIixcInQxMFwiLFwidDExXCIsXCJ0MTJcIl07XG5cbi8vIG4gPSBudW1iZXIgb2YgcGVvcGxlICwgcCA9IG51bWJlciBvZiBzeW1ib2xzXG4vLyAobi0xKSpwICsgMVxuLy8gaS5lLiBuID0gMywgcCA9IDMgOiA3XG5cbmV4cG9ydCBjb25zdCB0ZXN0VGFuZ3JhbXMgPSBbXG4gIHtcbiAgICBfaWQ6IFwiMFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMlwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQyXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMlwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgM1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQzXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiM1wiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgNFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ0XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiNFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgNVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ1XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiNVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgNlwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ2XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiNlwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgN1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ3XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiN1wiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgOFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ4XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiOFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgOVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ5XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiOVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTBcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MTBcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxMFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTFcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MTFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxMVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTJcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MTJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxMlwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTNcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEzXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxNFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQyXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTRcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDE1XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDNcIixcbiAgfSxcblxuXTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXROZWlnaGJvcnMoc3RydWN0dXJlLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBsZXQgbmV0d29yayA9IHN0cnVjdHVyZS5zcGxpdChcIixcIik7XG5cbiAgICBuZXR3b3JrLmZvckVhY2goKG4pID0+IHtcbiAgICAgIGNvbnN0IGNvbm5lY3Rpb24gPSBuLnNwbGl0KFwiLVwiKTtcbiAgICAgIGNvbnN0IHBsYXllckluZGV4ID0gcGxheWVyLmdldChcIm5vZGVJZFwiKTtcbiAgXG4gICAgICBpZiAocGxheWVySW5kZXggPT09IHBhcnNlSW50KGNvbm5lY3Rpb25bMF0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGNvbm5lY3Rpb25bMV0pO1xuICAgICAgfSBlbHNlIGlmIChwbGF5ZXJJbmRleCA9PT0gcGFyc2VJbnQoY29ubmVjdGlvblsxXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goY29ubmVjdGlvblswXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIHJldHVybiBfLnVuaXEobmVpZ2hib3JzLCB0cnVlKTtcbiAgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKSB7XG4gICAgY29uc3QgYWN0aXZlTm9kZXMgPSBbXTtcbiAgICBjb25zdCBhbGxOb2RlcyA9IFtdO1xuICAgIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICAgIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG5cbiAgICAvLyBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAvLyAgIGFjdGl2ZU5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgLy8gfSlcblxuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAvLyBpZiAocC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3R2ZVwiKSkge1xuICAgICAgaWYgKCFwLmdldChcImluYWN0dmVcIikpIHtcblxuICAgICAgICBhY3RpdmVOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgICAgfVxuICAgICAgYWxsTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICB9KVxuXG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIC8vIE9ubHkgc2hvdyBhY3RpdmUgcGVvcGxlXG4gICAgICAvLyBjb25zdCBuZXdOZWlnaGJvcnMgPSBhY3RpdmVOb2Rlcy5maWx0ZXIoaWQgPT4gcGFyc2VJbnQoaWQpICE9PSBwLmdldChcIm5vZGVJZFwiKSlcbiAgICAgIC8vIHAuc2V0KFwibmVpZ2hib3JzXCIsIG5ld05laWdoYm9ycyk7XG5cbiAgICAgIC8vIFNob3cgZXZlcnlvbmUsIG1hcmsgb2ZmbGluZSBwZW9wbGUgYXMgb2ZmbGluZVxuICAgICAgY29uc3QgbmV3TmVpZ2hib3JzID0gYWxsTm9kZXMuZmlsdGVyKGlkID0+IHBhcnNlSW50KGlkKSAhPT0gcC5nZXQoXCJub2RlSWRcIikpXG4gICAgICBwLnNldChcIm5laWdoYm9yc1wiLCBuZXdOZWlnaGJvcnMpO1xuICAgIH0pXG59IiwiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuaW1wb3J0IFwiLi9ib3RzLmpzXCI7XG5pbXBvcnQgXCIuL2NhbGxiYWNrcy5qc1wiO1xuXG5pbXBvcnQgeyB0ZXN0U3ltYm9scywgdGVzdFRhbmdyYW1zIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7IFxuaW1wb3J0IHsgZ2V0TmVpZ2hib3JzLCBnZXRGdWxseUNvbm5lY3RlZExheWVyIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG4vLyBnYW1lSW5pdCBpcyB3aGVyZSB0aGUgc3RydWN0dXJlIG9mIGEgZ2FtZSBpcyBkZWZpbmVkLlxuLy8gSnVzdCBiZWZvcmUgZXZlcnkgZ2FtZSBzdGFydHMsIG9uY2UgYWxsIHRoZSBwbGF5ZXJzIG5lZWRlZCBhcmUgcmVhZHksIHRoaXNcbi8vIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIHRoZSB0cmVhdG1lbnQgYW5kIHRoZSBsaXN0IG9mIHBsYXllcnMuXG4vLyBZb3UgbXVzdCB0aGVuIGFkZCByb3VuZHMgYW5kIHN0YWdlcyB0byB0aGUgZ2FtZSwgZGVwZW5kaW5nIG9uIHRoZSB0cmVhdG1lbnRcbi8vIGFuZCB0aGUgcGxheWVycy4gWW91IGNhbiBhbHNvIGdldC9zZXQgaW5pdGlhbCB2YWx1ZXMgb24geW91ciBnYW1lLCBwbGF5ZXJzLFxuLy8gcm91bmRzIGFuZCBzdGFnZXMgKHdpdGggZ2V0L3NldCBtZXRob2RzKSwgdGhhdCB3aWxsIGJlIGFibGUgdG8gdXNlIGxhdGVyIGluXG4vLyB0aGUgZ2FtZS5cbkVtcGlyaWNhLmdhbWVJbml0KGdhbWUgPT4ge1xuICBjb25zdCB7XG4gICAgdHJlYXRtZW50OiB7XG4gICAgICBwbGF5ZXJDb3VudCxcbiAgICAgIG5ldHdvcmtTdHJ1Y3R1cmUsXG4gICAgICBudW1UYXNrUm91bmRzLFxuICAgICAgbnVtU3VydmV5Um91bmRzLFxuICAgICAgc2V0U2l6ZUJhc2VkT25QbGF5ZXJDb3VudCxcbiAgICAgIHVzZXJJbmFjdGl2aXR5RHVyYXRpb24sXG4gICAgICB0YXNrRHVyYXRpb24sXG4gICAgICBkZWZhdWx0U2V0U2l6ZSxcbiAgICAgIHN1cnZleUR1cmF0aW9uLFxuICAgICAgcmVzdWx0c0R1cmF0aW9uLFxuICAgICAgbWF4TnVtT3ZlcmxhcCxcbiAgICB9LFxuICB9ID0gZ2FtZTtcblxuXG4gIGNvbnN0IHN5bWJvbFNldCA9IHRlc3RUYW5ncmFtcztcbiAgY29uc3Qgc2V0U2l6ZSA9IHNldFNpemVCYXNlZE9uUGxheWVyQ291bnQgPyBwbGF5ZXJDb3VudCArIDEgOiBkZWZhdWx0U2V0U2l6ZTsgLy9UT0RPOiBjYW4gY2hhbmdlIGRlZmF1bHQgdmFsdWUgaW4gc2V0dGluZ3NcbiAgY29uc3QgbnVtUm91bmRzQmVmb3JlU3VydmV5ID0gbnVtVGFza1JvdW5kcy9udW1TdXJ2ZXlSb3VuZHM7XG5cbiAgbGV0IGNvbG9ycyA9IFtcIkdyZWVuXCIsIFwiUmVkXCIsIFwiWWVsbG93XCIsIFwiQmx1ZVwiLCBcIlB1cnBsZVwiLCBcIldoaXRlXCIsIFwiQmxhY2tcIl1cbiAgY29sb3JzID0gc2h1ZmZsZShjb2xvcnMpO1xuXG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIsIGkpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwiYXZhdGFyXCIsIGAvYXZhdGFycy9qZGVudGljb24vJHtwbGF5ZXIuX2lkfWApO1xuICAgIHBsYXllci5zZXQoXCJzY29yZVwiLCAwKTtcblxuICAgIC8vIEdpdmUgZWFjaCBwbGF5ZXIgYSBub2RlSWQgYmFzZWQgb24gdGhlaXIgcG9zaXRpb24gKGluZGV4ZWQgYXQgMSlcbiAgICBwbGF5ZXIuc2V0KFwibm9kZUlkXCIsIGkgKyAxKTtcbiAgICBwbGF5ZXIuc2V0KFwibmFtZVwiLCBwbGF5ZXIuaWQpO1xuICAgIHBsYXllci5zZXQoXCJhbm9ueW1vdXNOYW1lXCIsIGNvbG9yc1tpXSlcbiAgfSk7XG5cblxuICBpZiAoZ2FtZS5wbGF5ZXJzLmxlbmd0aCA8IGdhbWUudHJlYXRtZW50LnBsYXllckNvdW50KSB7IC8vIGlmIG5vdCBhIGZ1bGwgZ2FtZSwgZGVmYXVsdCB0byBmdWxseSBjb25uZWN0ZWQgbGF5ZXJcbiAgICBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpO1xuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhwLmdldChcIm5laWdoYm9yc1wiKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgIHAuc2V0KFwibmVpZ2hib3JzXCIsIGdldE5laWdoYm9ycyhuZXR3b3JrU3RydWN0dXJlLCBwKSk7XG4gICAgICBjb25zb2xlLmxvZyhwLmdldChcIm5laWdoYm9yc1wiKSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBGb3IgZWFjaCByb3VuZCwgYWRkIGFsbCB0aGUgc3ltYm9scywgcmFuZG9tbHkgc2VsZWN0IGEgY29ycmVjdCBhbnN3ZXIgYW5kXG4gIC8vIENvbnN0cmFpbnRzOiBNdXN0IGVuc3VyZSB0aGF0IGV2ZXJ5b25lIGhhcyBvbmx5IG9uZSBzeW1ib2wgaW4gY29tbW9uXG4gIF8udGltZXMoIG51bVRhc2tSb3VuZHMsIGkgPT4ge1xuICAgIGNvbnN0IHJvdW5kID0gZ2FtZS5hZGRSb3VuZCgpO1xuXG4gICAgY29uc3Qge3N5bWJvbHMsIHRhc2tOYW1lLCBhbnN3ZXJ9ID0gc3ltYm9sU2V0W2ldO1xuXG4gICAgY29uc3QgdGFza1N0YWdlID0gcm91bmQuYWRkU3RhZ2Uoe1xuICAgICAgbmFtZTogXCJUYXNrXCIsXG4gICAgICBkaXNwbGF5TmFtZTogdGFza05hbWUsXG4gICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiB0YXNrRHVyYXRpb25cbiAgICB9KTtcbiAgICB0YXNrU3RhZ2Uuc2V0KFwidGFza1wiLCBzeW1ib2xTZXRbaV0pO1xuICAgIGdldFN5bWJvbHNGb3JQbGF5ZXJzKHN5bWJvbHMsIGFuc3dlciwgc2V0U2l6ZSwgdGFza05hbWUsIGdhbWUsIG1heE51bU92ZXJsYXApXG4gICAgdGFza1N0YWdlLnNldChcImFuc3dlclwiLCBzeW1ib2xTZXRbaV0uYW5zd2VyKVxuXG4gICAgY29uc3QgcmVzdWx0U3RhZ2UgPSByb3VuZC5hZGRTdGFnZSh7XG4gICAgICBuYW1lOiBcIlJlc3VsdFwiLFxuICAgICAgZGlzcGxheU5hbWU6IFwiUmVzdWx0XCIsXG4gICAgICBkdXJhdGlvbkluU2Vjb25kczogcmVzdWx0c0R1cmF0aW9uXG4gICAgfSk7XG4gICAgXG4gICAgaWYgKChpKzEpICUgbnVtUm91bmRzQmVmb3JlU3VydmV5ID09PSAwKSB7IC8vIEFmdGVyIDUgdGFzayByb3VuZHMsIGFkZCBhIHN1cnZleSByb3VuZFxuICAgICAgY29uc3Qgc3VydmV5Um91bmQgPSBnYW1lLmFkZFJvdW5kKCk7XG5cbiAgICAgIGNvbnN0IHN1cnZleVN0YWdlcyA9IHN1cnZleVJvdW5kLmFkZFN0YWdlKHtcbiAgICAgICAgbmFtZTogXCJTdXJ2ZXlcIixcbiAgICAgICAgZGlzcGxheU5hbWU6IFwiU3VydmV5XCIsXG4gICAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiBzdXJ2ZXlEdXJhdGlvblxuICAgICAgfSlcbiAgICB9XG5cbiAgfSk7XG5cblxuXG4gIGZ1bmN0aW9uIGdldFN5bWJvbHNGb3JQbGF5ZXJzKHN5bWJvbFNldCwgYW5zd2VyLCBzZXRTaXplLCB0YXNrTmFtZSwgZ2FtZSwgbWF4TnVtT3ZlcmxhcCkge1xuICAgICAgbGV0IHN5bWJvbHNXaXRob3V0QW5zd2VyID0gc3ltYm9sU2V0LmZpbHRlcihzeW1ib2wgPT4gc3ltYm9sICE9PSBhbnN3ZXIpO1xuICAgICAgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzaHVmZmxlKHN5bWJvbHNXaXRob3V0QW5zd2VyKTtcbiAgICAgIGxldCBudW1QbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmxlbmd0aDtcbiAgICAgIGxldCBudW1PdmVybGFwID0gMDtcblxuXG4gICAgICAvLyBDcmVhdGUgYSBkaWN0aW9uYXJ5IHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgdGltZXMgc3ltYm9sIGhhcyBiZWVuIHVzZWRcbiAgICAgIGxldCBzeW1ib2xGcmVxID0ge31cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ltYm9sc1dpdGhvdXRBbnN3ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHN5bWJvbCA9IHN5bWJvbHNXaXRob3V0QW5zd2VyW2ldXG4gICAgICAgIGlmICghc3ltYm9sRnJlcS5oYXNPd25Qcm9wZXJ0eShzeW1ib2wpKSB7XG4gICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdID0gbnVtUGxheWVycyAtIDE7IC8vIFRvdGFsIHRpbWUgYSBzeW1ib2wgY2FuIGJlIHVzZWQgXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgICBsZXQgc3ltYm9sc1BpY2tlZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN5bWJvbHNXaXRob3V0QW5zd2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHN5bWJvbCA9IHN5bWJvbHNXaXRob3V0QW5zd2VyW2ldXG4gICAgICAgICAgaWYgKHN5bWJvbHNQaWNrZWQubGVuZ3RoIDwgc2V0U2l6ZSAtIDEpIHsgLy8gQWRkIHN5bWJvbHMgdW50aWwgc2V0U2l6ZSAtIDEgZm9yIGFuc3dlclxuICAgICAgICAgICAgaWYgKHN5bWJvbEZyZXFbc3ltYm9sXSAtIDEgPT09IDApIHsgLy8gVGhpcyBzeW1ib2wgd2lsbCBvdmVybGFwXG4gICAgICAgICAgICAgICAgaWYgKG51bU92ZXJsYXAgPCBtYXhOdW1PdmVybGFwICkgeyAvLyBPbmx5IGFkZCBpZiBsZXNzIHRoYW4gbWF4IG92ZXJsYXBcbiAgICAgICAgICAgICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdIC09IDE7XG4gICAgICAgICAgICAgICAgICBudW1PdmVybGFwICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goc3ltYm9sKTtcbiAgICAgICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdIC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChhbnN3ZXIpOyAvLyBBZGQgdGhlIGFuc3dlclxuICAgICAgICBmb3IgKHZhciBzeW1ib2xUb1JlbW92ZSBvZiBzeW1ib2xzUGlja2VkKSB7XG4gICAgICAgICAgaWYgKHN5bWJvbEZyZXFbc3ltYm9sVG9SZW1vdmVdID09PSAwKSB7IC8vIElmIHN5bWJvbCBoYXMgYmVlbiBwaWNrZWQgbi0xIHBsYXllcnMgdGltZXMsIHJlbW92ZSBpdCBmcm9tIHRoZSBzZXRcbiAgICAgICAgICAgIHN5bWJvbHNXaXRob3V0QW5zd2VyID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXIuZmlsdGVyKHN5bWJvbCA9PiBzeW1ib2wgIT09IHN5bWJvbFRvUmVtb3ZlKTtcblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN5bWJvbHNQaWNrZWQgPSBzaHVmZmxlKHN5bWJvbHNQaWNrZWQpO1xuXG4gICAgICAgIHBsYXllci5zZXQodGFza05hbWUsIHN5bWJvbHNQaWNrZWQpO1xuICAgICAgfSlcblxuXG4gIH1cblxuICAvLyBTaHVmZmxpbmcgYXJyYXlzOlxuICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MDUzNjA0NC9zd2FwcGluZy1hbGwtZWxlbWVudHMtb2YtYW4tYXJyYXktZXhjZXB0LWZvci1maXJzdC1hbmQtbGFzdFxuICBmdW5jdGlvbiBzaHVmZmxlKHN5bWJvbFNldCkge1xuICAgIGZvciAoaSA9IHN5bWJvbFNldC5sZW5ndGggLTEgOyBpID4gMDsgaS0tKSB7XG4gICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG5cbiAgICAgIFtzeW1ib2xTZXRbaV0sIHN5bWJvbFNldFtqXV0gPSBbc3ltYm9sU2V0W2pdLCBzeW1ib2xTZXRbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gc3ltYm9sU2V0O1xuICB9XG5cbn0pO1xuIl19
