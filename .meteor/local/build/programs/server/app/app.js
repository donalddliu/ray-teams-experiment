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
    player.set("lastActive", player.lastActivityAt);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm1vbWVudCIsIlRpbWVTeW5jIiwib25HYW1lU3RhcnQiLCJjb25zb2xlIiwibG9nIiwicGxheWVycyIsImZvckVhY2giLCJwbGF5ZXIiLCJzZXQiLCJsYXN0QWN0aXZpdHlBdCIsIm5ldHdvcmsiLCJnZXQiLCJhY3RpdmVDaGF0cyIsIm1hcCIsIm90aGVyTm9kZUlkIiwicGFpck9mUGxheWVycyIsInBhcnNlSW50Iiwic29ydCIsInAxIiwicDIiLCJvdGhlclBsYXllciIsImZpbmQiLCJwIiwiY2hhdEtleSIsInB1c2giLCJsZW5ndGgiLCJvblJvdW5kU3RhcnQiLCJhY3RpdmVQbGF5ZXJzIiwiZmlsdGVyIiwidHJlYXRtZW50IiwiZW5kR2FtZUlmUGxheWVySWRsZSIsImV4aXQiLCJvblN0YWdlU3RhcnQiLCJuYW1lIiwiZGlzcGxheU5hbWUiLCJvblN0YWdlRW5kIiwib25Sb3VuZEVuZCIsIm9uR2FtZUVuZCIsIm9uU2V0IiwidGFyZ2V0IiwidGFyZ2V0VHlwZSIsImtleSIsInZhbHVlIiwicHJldlZhbHVlIiwiYWxsU3VibWl0dGVkIiwibnVtUGxheWVyc1N1Ym1pdHRlZCIsImNvbXB1dGVTY29yZSIsInN1Ym1pdCIsInN1Y2Nlc3MiLCJzdWJtaXNzaW9uIiwicHJldlNjb3JlIiwiZXhwb3J0IiwidGVzdFRhbmdyYW1zIiwiYWxsU3ltYm9scyIsIl9pZCIsInRhc2tOYW1lIiwic3ltYm9scyIsImFuc3dlciIsImdldE5laWdoYm9ycyIsInN0cnVjdHVyZSIsIm5laWdoYm9ycyIsInNwbGl0IiwicGxheWVySW5kZXgiLCJuIiwiY29ubmVjdGlvbiIsInJlcGxhY2UiLCJTZXQiLCJhY3RpdmVOb2RlcyIsImFsbE5vZGVzIiwibmV3TmVpZ2hib3JzIiwiaWQiLCJ0ZXN0U3ltYm9scyIsImdhbWVJbml0IiwicGxheWVyQ291bnQiLCJuZXR3b3JrU3RydWN0dXJlIiwibnVtVGFza1JvdW5kcyIsIm51bVN1cnZleVJvdW5kcyIsInNldFNpemVCYXNlZE9uUGxheWVyQ291bnQiLCJ1c2VySW5hY3Rpdml0eUR1cmF0aW9uIiwidGFza0R1cmF0aW9uIiwiZGVmYXVsdFNldFNpemUiLCJzdXJ2ZXlEdXJhdGlvbiIsInJlc3VsdHNEdXJhdGlvbiIsIm1heE51bU92ZXJsYXAiLCJzeW1ib2xTZXQiLCJzZXRTaXplIiwibnVtUm91bmRzQmVmb3JlU3VydmV5IiwiY29sb3JzIiwic2h1ZmZsZSIsImkiLCJfIiwidGltZXMiLCJhZGRSb3VuZCIsInRhc2tTdGFnZSIsImFkZFN0YWdlIiwiZHVyYXRpb25JblNlY29uZHMiLCJnZXRTeW1ib2xzRm9yUGxheWVycyIsInJlc3VsdFN0YWdlIiwic3VydmV5Um91bmQiLCJzdXJ2ZXlTdGFnZXMiLCJzeW1ib2xzV2l0aG91dEFuc3dlciIsInN5bWJvbCIsIm51bVBsYXllcnMiLCJudW1PdmVybGFwIiwic3ltYm9sRnJlcSIsImhhc093blByb3BlcnR5Iiwic3ltYm9sc1BpY2tlZCIsInN5bWJvbFRvUmVtb3ZlIiwiaiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxRQUFKO0FBQWFDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNKLFlBQVEsR0FBQ0ksQ0FBVDtBQUFXOztBQUF2QixDQUFuQyxFQUE0RCxDQUE1RDtBQUViO0FBRUFKLFFBQVEsQ0FBQ0ssR0FBVCxDQUFhLEtBQWIsRUFBb0I7QUFDbEI7QUFDQTtBQUVBO0FBQ0FDLGFBQVcsQ0FBQ0QsR0FBRCxFQUFNRSxJQUFOLEVBQVlDLEtBQVosRUFBbUJDLEtBQW5CLEVBQTBCQyxnQkFBMUIsRUFBNEMsQ0FBRSxDQUx2QyxDQU9sQjtBQUNBO0FBQ0E7QUFFQTtBQUNBOzs7QUFaa0IsQ0FBcEIsRTs7Ozs7Ozs7Ozs7QUNKQSxJQUFJVixRQUFKO0FBQWFDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNKLFlBQVEsR0FBQ0ksQ0FBVDtBQUFXOztBQUF2QixDQUFuQyxFQUE0RCxDQUE1RDtBQUErRCxJQUFJTyxzQkFBSjtBQUEyQlYsTUFBTSxDQUFDQyxJQUFQLENBQVksUUFBWixFQUFxQjtBQUFDUyx3QkFBc0IsQ0FBQ1AsQ0FBRCxFQUFHO0FBQUNPLDBCQUFzQixHQUFDUCxDQUF2QjtBQUF5Qjs7QUFBcEQsQ0FBckIsRUFBMkUsQ0FBM0U7QUFBOEUsSUFBSVEsTUFBSjtBQUFXWCxNQUFNLENBQUNDLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNRLFVBQU0sR0FBQ1IsQ0FBUDtBQUFTOztBQUFyQixDQUFyQixFQUE0QyxDQUE1QztBQUErQyxJQUFJUyxRQUFKO0FBQWFaLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHdCQUFaLEVBQXFDO0FBQUNXLFVBQVEsQ0FBQ1QsQ0FBRCxFQUFHO0FBQUNTLFlBQVEsR0FBQ1QsQ0FBVDtBQUFXOztBQUF4QixDQUFyQyxFQUErRCxDQUEvRDtBQVE1UDtBQUNBO0FBQ0E7QUFDQUosUUFBUSxDQUFDYyxXQUFULENBQXFCUCxJQUFJLElBQUk7QUFDM0JRLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLGNBQVo7QUFDQVQsTUFBSSxDQUFDVSxPQUFMLENBQWFDLE9BQWIsQ0FBc0JDLE1BQUQsSUFBWTtBQUMvQkEsVUFBTSxDQUFDQyxHQUFQLENBQVcsVUFBWCxFQUF1QixLQUF2QjtBQUNBRCxVQUFNLENBQUNDLEdBQVAsQ0FBVyxZQUFYLEVBQXlCRCxNQUFNLENBQUNFLGNBQWhDO0FBQ0EsVUFBTUMsT0FBTyxHQUFHSCxNQUFNLENBQUNJLEdBQVAsQ0FBVyxXQUFYLENBQWhCO0FBQ0EsVUFBTUMsV0FBVyxHQUFHLEVBQXBCO0FBQ0FGLFdBQU8sQ0FBQ0csR0FBUixDQUFZQyxXQUFXLElBQUk7QUFDekIsVUFBSUMsYUFBYSxHQUFHLENBQUNSLE1BQU0sQ0FBQ0ksR0FBUCxDQUFXLFFBQVgsQ0FBRCxFQUF1QkssUUFBUSxDQUFDRixXQUFELENBQS9CLENBQXBCO0FBQ0FDLG1CQUFhLENBQUNFLElBQWQsQ0FBbUIsQ0FBQ0MsRUFBRCxFQUFJQyxFQUFKLEtBQVdELEVBQUUsR0FBR0MsRUFBbkM7QUFDQSxZQUFNQyxXQUFXLEdBQUd6QixJQUFJLENBQUNVLE9BQUwsQ0FBYWdCLElBQWIsQ0FBa0JDLENBQUMsSUFBSUEsQ0FBQyxDQUFDWCxHQUFGLENBQU0sUUFBTixNQUFvQkssUUFBUSxDQUFDRixXQUFELENBQW5ELENBQXBCLENBSHlCLENBSXpCOztBQUNBLFlBQU1TLE9BQU8sYUFBTVIsYUFBYSxDQUFDLENBQUQsQ0FBbkIsY0FBMEJBLGFBQWEsQ0FBQyxDQUFELENBQXZDLENBQWI7QUFDQUgsaUJBQVcsQ0FBQ1ksSUFBWixDQUFpQkQsT0FBakI7QUFDRCxLQVBELEVBTCtCLENBYS9COztBQUNBaEIsVUFBTSxDQUFDQyxHQUFQLENBQVcsYUFBWCxFQUEwQkksV0FBMUI7QUFDQVQsV0FBTyxDQUFDQyxHQUFSLENBQVlHLE1BQU0sQ0FBQ0ksR0FBUCxDQUFXLGFBQVgsQ0FBWjtBQUNELEdBaEJEO0FBaUJBaEIsTUFBSSxDQUFDYSxHQUFMLENBQVMsMEJBQVQsRUFBcUNiLElBQUksQ0FBQ1UsT0FBTCxDQUFhb0IsTUFBbEQ7QUFDRCxDQXBCRCxFLENBc0JBO0FBQ0E7O0FBQ0FyQyxRQUFRLENBQUNzQyxZQUFULENBQXNCLENBQUMvQixJQUFELEVBQU9DLEtBQVAsS0FBaUI7QUFDckNELE1BQUksQ0FBQ1UsT0FBTCxDQUFhQyxPQUFiLENBQXNCQyxNQUFELElBQVk7QUFDL0JBLFVBQU0sQ0FBQ0MsR0FBUCxDQUFXLFdBQVgsRUFBd0IsS0FBeEI7QUFDQUQsVUFBTSxDQUFDQyxHQUFQLENBQVcsZ0JBQVgsRUFBNkIsRUFBN0I7QUFDRCxHQUhEO0FBSUFaLE9BQUssQ0FBQ1ksR0FBTixDQUFVLFFBQVYsRUFBb0IsS0FBcEI7QUFDQVosT0FBSyxDQUFDWSxHQUFOLENBQVUscUJBQVYsRUFBaUMsQ0FBakMsRUFOcUMsQ0FPckM7O0FBQ0EsUUFBTW1CLGFBQWEsR0FBR2hDLElBQUksQ0FBQ1UsT0FBTCxDQUFhdUIsTUFBYixDQUFvQk4sQ0FBQyxJQUFJLENBQUNBLENBQUMsQ0FBQ1gsR0FBRixDQUFNLFVBQU4sQ0FBMUIsQ0FBdEI7O0FBRUEsTUFBSWdCLGFBQWEsQ0FBQ0YsTUFBZCxHQUF1QjlCLElBQUksQ0FBQ2dCLEdBQUwsQ0FBUywwQkFBVCxDQUEzQixFQUFrRTtBQUFFO0FBQ2xFLFFBQUloQixJQUFJLENBQUNrQyxTQUFMLENBQWVDLG1CQUFuQixFQUF3QztBQUN0Q0gsbUJBQWEsQ0FBQ3JCLE9BQWQsQ0FBdUJnQixDQUFELElBQU87QUFDM0JBLFNBQUMsQ0FBQ1MsSUFBRixDQUFPLGlCQUFQO0FBQ0QsT0FGRDtBQUdELEtBSkQsTUFJTztBQUNMaEMsNEJBQXNCLENBQUNKLElBQUQsQ0FBdEIsQ0FESyxDQUN5QjtBQUMvQjtBQUVGOztBQUNEQSxNQUFJLENBQUNhLEdBQUwsQ0FBUywwQkFBVCxFQUFxQ21CLGFBQWEsQ0FBQ0YsTUFBbkQ7QUFFQXRCLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLGVBQVo7QUFFRCxDQXhCRCxFLENBMEJBO0FBQ0E7O0FBQ0FoQixRQUFRLENBQUM0QyxZQUFULENBQXNCLENBQUNyQyxJQUFELEVBQU9DLEtBQVAsRUFBY0MsS0FBZCxLQUF3QjtBQUM1Q00sU0FBTyxDQUFDQyxHQUFSLENBQVksZUFBWixFQUQ0QyxDQUU1Qzs7QUFDQSxRQUFNdUIsYUFBYSxHQUFHaEMsSUFBSSxDQUFDVSxPQUFMLENBQWF1QixNQUFiLENBQW9CTixDQUFDLElBQUksQ0FBQ0EsQ0FBQyxDQUFDWCxHQUFGLENBQU0sVUFBTixDQUExQixDQUF0Qjs7QUFFQSxNQUFJZCxLQUFLLENBQUNvQyxJQUFOLEtBQWUsTUFBbkIsRUFBMkI7QUFDekJOLGlCQUFhLENBQUNyQixPQUFkLENBQXVCQyxNQUFELElBQVk7QUFDaENKLGFBQU8sQ0FBQ0MsR0FBUixxQkFBMEJHLE1BQU0sQ0FBQ0ksR0FBUCxXQUFjZCxLQUFLLENBQUNxQyxXQUFwQixFQUExQjtBQUNELEtBRkQ7QUFHQS9CLFdBQU8sQ0FBQ0MsR0FBUixtQkFBdUJQLEtBQUssQ0FBQ2MsR0FBTixDQUFVLFFBQVYsQ0FBdkI7QUFDRDs7QUFDRCxNQUFJZCxLQUFLLENBQUNvQyxJQUFOLEtBQWUsUUFBbkIsRUFBNkI7QUFDM0JOLGlCQUFhLENBQUNyQixPQUFkLENBQXVCQyxNQUFELElBQVk7QUFDaENBLFlBQU0sQ0FBQ0MsR0FBUCxDQUFXLGNBQVgsRUFBNEIsQ0FBNUI7QUFDRCxLQUZEO0FBR0QsR0FmMkMsQ0FnQjVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUQsQ0F0QkQsRSxDQXdCQTtBQUNBOztBQUNBcEIsUUFBUSxDQUFDK0MsVUFBVCxDQUFvQixDQUFDeEMsSUFBRCxFQUFPQyxLQUFQLEVBQWNDLEtBQWQsS0FBdUI7QUFDekNNLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLGFBQVo7QUFFRCxDQUhELEUsQ0FLQTtBQUNBOztBQUNBaEIsUUFBUSxDQUFDZ0QsVUFBVCxDQUFvQixDQUFDekMsSUFBRCxFQUFPQyxLQUFQLEtBQWlCLENBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFRCxDQVBELEUsQ0FTQTtBQUNBOztBQUNBUixRQUFRLENBQUNpRCxTQUFULENBQW1CMUMsSUFBSSxJQUFJLENBQUUsQ0FBN0IsRSxDQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFQLFFBQVEsQ0FBQ2tELEtBQVQsQ0FBZSxDQUNiM0MsSUFEYSxFQUViQyxLQUZhLEVBR2JDLEtBSGEsRUFJYlUsTUFKYSxFQUlMO0FBQ1JnQyxNQUxhLEVBS0w7QUFDUkMsVUFOYSxFQU1EO0FBQ1pDLEdBUGEsRUFPUjtBQUNMQyxLQVJhLEVBUU47QUFDUEMsU0FUYSxDQVNIO0FBVEcsS0FVVjtBQUNILFFBQU10QyxPQUFPLEdBQUdWLElBQUksQ0FBQ1UsT0FBckIsQ0FERyxDQUVIOztBQUNBLFFBQU1zQixhQUFhLEdBQUdoQyxJQUFJLENBQUNVLE9BQUwsQ0FBYXVCLE1BQWIsQ0FBb0JOLENBQUMsSUFBSSxDQUFDQSxDQUFDLENBQUNYLEdBQUYsQ0FBTSxVQUFOLENBQTFCLENBQXRCLENBSEcsQ0FLSDs7QUFDQVIsU0FBTyxDQUFDQyxHQUFSLENBQVksS0FBWixFQUFtQnFDLEdBQW5COztBQUNBLE1BQUlBLEdBQUcsS0FBSyxXQUFaLEVBQXlCO0FBQ3ZCO0FBQ0EsUUFBSUcsWUFBWSxHQUFHLElBQW5CO0FBQ0EsUUFBSUMsbUJBQW1CLEdBQUcsQ0FBMUI7QUFDQWxCLGlCQUFhLENBQUNyQixPQUFkLENBQXVCQyxNQUFELElBQVk7QUFDaEMsVUFBSUEsTUFBTSxDQUFDSSxHQUFQLENBQVcsV0FBWCxDQUFKLEVBQTZCO0FBQzNCa0MsMkJBQW1CLElBQUksQ0FBdkI7QUFDRDs7QUFDREQsa0JBQVksR0FBR3JDLE1BQU0sQ0FBQ0ksR0FBUCxDQUFXLFdBQVgsS0FBMkJpQyxZQUExQztBQUNELEtBTEQ7QUFNQWhELFNBQUssQ0FBQ1ksR0FBTixDQUFVLHFCQUFWLEVBQWlDcUMsbUJBQWpDOztBQUNBLFFBQUlELFlBQUosRUFBa0I7QUFDaEIsWUFBTXhDLEdBQUcsR0FBR1AsS0FBSyxDQUFDYyxHQUFOLENBQVUsS0FBVixDQUFaO0FBQ0FtQyxrQkFBWSxDQUFDbkIsYUFBRCxFQUFnQjlCLEtBQWhCLEVBQXVCRCxLQUF2QixDQUFaLENBRmdCLENBR2hCOztBQUNBRCxVQUFJLENBQUNVLE9BQUwsQ0FBYUMsT0FBYixDQUFzQkMsTUFBRCxJQUFZO0FBQy9CQSxjQUFNLENBQUNWLEtBQVAsQ0FBYWtELE1BQWI7QUFDRCxPQUZEO0FBR0QsS0FsQnNCLENBbUJ6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0MsR0F2Q0UsQ0F5Q0g7QUFDRTtBQUNGOzs7QUFFQTtBQUVELENBekREOztBQTJEQSxTQUFTRCxZQUFULENBQXNCbkIsYUFBdEIsRUFBcUM5QixLQUFyQyxFQUE0Q0QsS0FBNUMsRUFBbUQ7QUFDakQsTUFBSW9ELE9BQU8sR0FBRyxJQUFkO0FBQ0E3QyxTQUFPLENBQUNDLEdBQVIsQ0FBWSxpQkFBWjtBQUNBRCxTQUFPLENBQUNDLEdBQVIsQ0FBWVAsS0FBSyxDQUFDYyxHQUFOLENBQVUsUUFBVixDQUFaO0FBQ0FSLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLGtCQUFaO0FBRUF1QixlQUFhLENBQUNyQixPQUFkLENBQXNCQyxNQUFNLElBQUk7QUFDOUIsVUFBTTBDLFVBQVUsR0FBRzFDLE1BQU0sQ0FBQ0ksR0FBUCxDQUFXLGdCQUFYLENBQW5CO0FBQ0FSLFdBQU8sQ0FBQ0MsR0FBUixDQUFZNkMsVUFBWjs7QUFDQSxRQUFJQSxVQUFVLEtBQUtwRCxLQUFLLENBQUNjLEdBQU4sQ0FBVSxRQUFWLENBQW5CLEVBQXdDO0FBQ3RDcUMsYUFBTyxHQUFHLEtBQVY7QUFDRDtBQUNGLEdBTkQ7QUFPQXBELE9BQUssQ0FBQ1ksR0FBTixDQUFVLFFBQVYsRUFBb0J3QyxPQUFwQjs7QUFDQSxNQUFJQSxPQUFKLEVBQWE7QUFDWHJCLGlCQUFhLENBQUNyQixPQUFkLENBQXNCQyxNQUFNLElBQUk7QUFDOUIsWUFBTTJDLFNBQVMsR0FBRzNDLE1BQU0sQ0FBQ0ksR0FBUCxDQUFXLE9BQVgsS0FBdUIsQ0FBekM7QUFDQUosWUFBTSxDQUFDQyxHQUFQLENBQVcsT0FBWCxFQUFvQjBDLFNBQVMsR0FBRyxDQUFoQztBQUNELEtBSEQ7QUFJQS9DLFdBQU8sQ0FBQ0MsR0FBUixDQUFZLCtCQUFaO0FBQ0Q7QUFDRixDLENBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNOzs7Ozs7Ozs7OztBQ25SQWYsTUFBTSxDQUFDOEQsTUFBUCxDQUFjO0FBQUNDLGNBQVksRUFBQyxNQUFJQTtBQUFsQixDQUFkO0FBQUEsTUFBTUMsVUFBVSxHQUFHLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CLEVBQXFDLElBQXJDLEVBQTBDLElBQTFDLEVBQStDLElBQS9DLEVBQW9ELEtBQXBELEVBQTBELEtBQTFELEVBQWdFLEtBQWhFLENBQW5CLEMsQ0FFQTtBQUNBO0FBQ0E7O0FBRU8sTUFBTUQsWUFBWSxHQUFHLENBQzFCO0FBQ0VFLEtBQUcsRUFBRSxHQURQO0FBRUVDLFVBQVEsRUFBRSxRQUZaO0FBR0VDLFNBQU8sRUFBRUgsVUFIWDtBQUlFSSxRQUFNLEVBQUU7QUFKVixDQUQwQixFQU8xQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FQMEIsRUFhMUI7QUFDRUgsS0FBRyxFQUFFLEdBRFA7QUFFRUMsVUFBUSxFQUFFLFFBRlo7QUFHRUMsU0FBTyxFQUFFSCxVQUhYO0FBSUVJLFFBQU0sRUFBRTtBQUpWLENBYjBCLEVBbUIxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FuQjBCLEVBeUIxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0F6QjBCLEVBK0IxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0EvQjBCLEVBcUMxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FyQzBCLEVBMkMxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0EzQzBCLEVBaUQxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsUUFGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FqRDBCLEVBdUQxQjtBQUNFSCxLQUFHLEVBQUUsR0FEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0F2RDBCLEVBNkQxQjtBQUNFSCxLQUFHLEVBQUUsSUFEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0E3RDBCLEVBbUUxQjtBQUNFSCxLQUFHLEVBQUUsSUFEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FuRTBCLEVBeUUxQjtBQUNFSCxLQUFHLEVBQUUsSUFEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0F6RTBCLEVBK0UxQjtBQUNFSCxLQUFHLEVBQUUsSUFEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0EvRTBCLEVBcUYxQjtBQUNFSCxLQUFHLEVBQUUsSUFEUDtBQUVFQyxVQUFRLEVBQUUsU0FGWjtBQUdFQyxTQUFPLEVBQUVILFVBSFg7QUFJRUksUUFBTSxFQUFFO0FBSlYsQ0FyRjBCLENBQXJCLEM7Ozs7Ozs7Ozs7O0FDTlBwRSxNQUFNLENBQUM4RCxNQUFQLENBQWM7QUFBQ08sY0FBWSxFQUFDLE1BQUlBLFlBQWxCO0FBQStCM0Qsd0JBQXNCLEVBQUMsTUFBSUE7QUFBMUQsQ0FBZDs7QUFBTyxTQUFTMkQsWUFBVCxDQUFzQkMsU0FBdEIsRUFBaUNwRCxNQUFqQyxFQUF5QztBQUM1QyxRQUFNcUQsU0FBUyxHQUFHLEVBQWxCO0FBQ0EsTUFBSWxELE9BQU8sR0FBR2lELFNBQVMsQ0FBQ0UsS0FBVixDQUFnQixHQUFoQixDQUFkO0FBQ0EsUUFBTUMsV0FBVyxHQUFHdkQsTUFBTSxDQUFDSSxHQUFQLENBQVcsUUFBWCxDQUFwQjtBQUVBRCxTQUFPLENBQUNKLE9BQVIsQ0FBaUJ5RCxDQUFELElBQU87QUFDckIsVUFBTUMsVUFBVSxHQUFHRCxDQUFDLENBQUNGLEtBQUYsQ0FBUSxHQUFSLENBQW5COztBQUVBLFFBQUlDLFdBQVcsS0FBSzlDLFFBQVEsQ0FBQ2dELFVBQVUsQ0FBQyxDQUFELENBQVgsQ0FBNUIsRUFBNkM7QUFDM0NKLGVBQVMsQ0FBQ3BDLElBQVYsQ0FBZXdDLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0MsT0FBZCxDQUFzQixLQUF0QixFQUE2QixFQUE3QixDQUFmO0FBQ0QsS0FGRCxNQUVPLElBQUlILFdBQVcsS0FBSzlDLFFBQVEsQ0FBQ2dELFVBQVUsQ0FBQyxDQUFELENBQVgsQ0FBNUIsRUFBNkM7QUFDbERKLGVBQVMsQ0FBQ3BDLElBQVYsQ0FBZXdDLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0MsT0FBZCxDQUFzQixLQUF0QixFQUE2QixFQUE3QixDQUFmO0FBQ0Q7QUFDRixHQVJEO0FBVUEsU0FBTyxDQUFDLEdBQUksSUFBSUMsR0FBSixDQUFRTixTQUFSLENBQUwsQ0FBUDtBQUNEOztBQUVJLFNBQVM3RCxzQkFBVCxDQUFnQ0osSUFBaEMsRUFBc0M7QUFDekMsUUFBTXdFLFdBQVcsR0FBRyxFQUFwQjtBQUNBLFFBQU1DLFFBQVEsR0FBRyxFQUFqQixDQUZ5QyxDQUd6Qzs7QUFDQSxRQUFNekMsYUFBYSxHQUFHaEMsSUFBSSxDQUFDVSxPQUFMLENBQWF1QixNQUFiLENBQW9CTixDQUFDLElBQUksQ0FBQ0EsQ0FBQyxDQUFDWCxHQUFGLENBQU0sVUFBTixDQUExQixDQUF0QixDQUp5QyxDQU96QztBQUNBO0FBQ0E7O0FBRUFoQixNQUFJLENBQUNVLE9BQUwsQ0FBYUMsT0FBYixDQUFzQmdCLENBQUQsSUFBTztBQUMxQjtBQUNBLFFBQUksQ0FBQ0EsQ0FBQyxDQUFDWCxHQUFGLENBQU0sU0FBTixDQUFMLEVBQXVCO0FBRXJCd0QsaUJBQVcsQ0FBQzNDLElBQVosV0FBb0JGLENBQUMsQ0FBQ1gsR0FBRixDQUFNLFFBQU4sQ0FBcEI7QUFDRDs7QUFDRHlELFlBQVEsQ0FBQzVDLElBQVQsV0FBaUJGLENBQUMsQ0FBQ1gsR0FBRixDQUFNLFFBQU4sQ0FBakI7QUFDRCxHQVBEO0FBU0FoQixNQUFJLENBQUNVLE9BQUwsQ0FBYUMsT0FBYixDQUFzQmdCLENBQUQsSUFBTztBQUMxQjtBQUNBO0FBQ0E7QUFFQTtBQUNBLFVBQU0rQyxZQUFZLEdBQUdELFFBQVEsQ0FBQ3hDLE1BQVQsQ0FBZ0IwQyxFQUFFLElBQUl0RCxRQUFRLENBQUNzRCxFQUFELENBQVIsS0FBaUJoRCxDQUFDLENBQUNYLEdBQUYsQ0FBTSxRQUFOLENBQXZDLENBQXJCO0FBQ0FXLEtBQUMsQ0FBQ2QsR0FBRixDQUFNLFdBQU4sRUFBbUI2RCxZQUFuQjtBQUNELEdBUkQ7QUFTSCxDOzs7Ozs7Ozs7OztBQy9DRCxJQUFJakYsUUFBSjtBQUFhQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSixZQUFRLEdBQUNJLENBQVQ7QUFBVzs7QUFBdkIsQ0FBbkMsRUFBNEQsQ0FBNUQ7QUFBK0RILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFdBQVo7QUFBeUJELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdCQUFaO0FBQThCLElBQUlpRixXQUFKLEVBQWdCbkIsWUFBaEI7QUFBNkIvRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxhQUFaLEVBQTBCO0FBQUNpRixhQUFXLENBQUMvRSxDQUFELEVBQUc7QUFBQytFLGVBQVcsR0FBQy9FLENBQVo7QUFBYyxHQUE5Qjs7QUFBK0I0RCxjQUFZLENBQUM1RCxDQUFELEVBQUc7QUFBQzRELGdCQUFZLEdBQUM1RCxDQUFiO0FBQWU7O0FBQTlELENBQTFCLEVBQTBGLENBQTFGO0FBQTZGLElBQUlrRSxZQUFKLEVBQWlCM0Qsc0JBQWpCO0FBQXdDVixNQUFNLENBQUNDLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNvRSxjQUFZLENBQUNsRSxDQUFELEVBQUc7QUFBQ2tFLGdCQUFZLEdBQUNsRSxDQUFiO0FBQWUsR0FBaEM7O0FBQWlDTyx3QkFBc0IsQ0FBQ1AsQ0FBRCxFQUFHO0FBQUNPLDBCQUFzQixHQUFDUCxDQUF2QjtBQUF5Qjs7QUFBcEYsQ0FBckIsRUFBMkcsQ0FBM0c7QUFPclM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUosUUFBUSxDQUFDb0YsUUFBVCxDQUFrQjdFLElBQUksSUFBSTtBQUN4QixRQUFNO0FBQ0prQyxhQUFTLEVBQUU7QUFDVDRDLGlCQURTO0FBRVRDLHNCQUZTO0FBR1RDLG1CQUhTO0FBSVRDLHFCQUpTO0FBS1RDLCtCQUxTO0FBTVRDLDRCQU5TO0FBT1RDLGtCQVBTO0FBUVRDLG9CQVJTO0FBU1RDLG9CQVRTO0FBVVRDLHFCQVZTO0FBV1RDO0FBWFM7QUFEUCxNQWNGeEYsSUFkSjtBQWlCQSxRQUFNeUYsU0FBUyxHQUFHaEMsWUFBbEI7QUFDQSxRQUFNaUMsT0FBTyxHQUFHUix5QkFBeUIsR0FBR0osV0FBVyxHQUFHLENBQWpCLEdBQXFCTyxjQUE5RCxDQW5Cd0IsQ0FtQnNEOztBQUM5RSxRQUFNTSxxQkFBcUIsR0FBR1gsYUFBYSxHQUFDQyxlQUE1QztBQUVBLE1BQUlXLE1BQU0sR0FBRyxDQUFDLE9BQUQsRUFBVSxLQUFWLEVBQWlCLFFBQWpCLEVBQTJCLE1BQTNCLEVBQW1DLFFBQW5DLEVBQTZDLE9BQTdDLEVBQXNELE9BQXRELENBQWI7QUFDQUEsUUFBTSxHQUFHQyxPQUFPLENBQUNELE1BQUQsQ0FBaEI7QUFFQTVGLE1BQUksQ0FBQ1UsT0FBTCxDQUFhQyxPQUFiLENBQXFCLENBQUNDLE1BQUQsRUFBU2tGLENBQVQsS0FBZTtBQUNsQ2xGLFVBQU0sQ0FBQ0MsR0FBUCxDQUFXLFFBQVgsK0JBQTJDRCxNQUFNLENBQUMrQyxHQUFsRDtBQUNBL0MsVUFBTSxDQUFDQyxHQUFQLENBQVcsT0FBWCxFQUFvQixDQUFwQixFQUZrQyxDQUlsQzs7QUFDQUQsVUFBTSxDQUFDQyxHQUFQLENBQVcsUUFBWCxFQUFxQmlGLENBQUMsR0FBRyxDQUF6QjtBQUNBbEYsVUFBTSxDQUFDQyxHQUFQLENBQVcsTUFBWCxFQUFtQkQsTUFBTSxDQUFDK0QsRUFBMUI7QUFDQS9ELFVBQU0sQ0FBQ0MsR0FBUCxDQUFXLGVBQVgsRUFBNEIrRSxNQUFNLENBQUNFLENBQUQsQ0FBbEM7QUFDRCxHQVJEOztBQVdBLE1BQUk5RixJQUFJLENBQUNVLE9BQUwsQ0FBYW9CLE1BQWIsR0FBc0I5QixJQUFJLENBQUNrQyxTQUFMLENBQWU0QyxXQUF6QyxFQUFzRDtBQUFFO0FBQ3REMUUsMEJBQXNCLENBQUNKLElBQUQsQ0FBdEI7QUFDQUEsUUFBSSxDQUFDVSxPQUFMLENBQWFDLE9BQWIsQ0FBc0JnQixDQUFELElBQU87QUFDMUJuQixhQUFPLENBQUNDLEdBQVIsQ0FBWWtCLENBQUMsQ0FBQ1gsR0FBRixDQUFNLFdBQU4sQ0FBWjtBQUNELEtBRkQ7QUFHRCxHQUxELE1BS087QUFDTGhCLFFBQUksQ0FBQ1UsT0FBTCxDQUFhQyxPQUFiLENBQXNCZ0IsQ0FBRCxJQUFPO0FBQzFCQSxPQUFDLENBQUNkLEdBQUYsQ0FBTSxXQUFOLEVBQW1Ca0QsWUFBWSxDQUFDZ0IsZ0JBQUQsRUFBbUJwRCxDQUFuQixDQUEvQjtBQUNBbkIsYUFBTyxDQUFDQyxHQUFSLENBQVlrQixDQUFDLENBQUNYLEdBQUYsQ0FBTSxXQUFOLENBQVo7QUFDRCxLQUhEO0FBSUQsR0E5Q3VCLENBZ0R4QjtBQUNBOzs7QUFDQStFLEdBQUMsQ0FBQ0MsS0FBRixDQUFTaEIsYUFBVCxFQUF3QmMsQ0FBQyxJQUFJO0FBQzNCLFVBQU03RixLQUFLLEdBQUdELElBQUksQ0FBQ2lHLFFBQUwsRUFBZDtBQUVBLFVBQU07QUFBQ3BDLGFBQUQ7QUFBVUQsY0FBVjtBQUFvQkU7QUFBcEIsUUFBOEIyQixTQUFTLENBQUNLLENBQUQsQ0FBN0M7QUFFQSxVQUFNSSxTQUFTLEdBQUdqRyxLQUFLLENBQUNrRyxRQUFOLENBQWU7QUFDL0I3RCxVQUFJLEVBQUUsTUFEeUI7QUFFL0JDLGlCQUFXLEVBQUVxQixRQUZrQjtBQUcvQkUsWUFBTSxFQUFFQSxNQUh1QjtBQUkvQnNDLHVCQUFpQixFQUFFaEI7QUFKWSxLQUFmLENBQWxCO0FBTUFjLGFBQVMsQ0FBQ3JGLEdBQVYsQ0FBYyxNQUFkLEVBQXNCNEUsU0FBUyxDQUFDSyxDQUFELENBQS9CO0FBQ0FPLHdCQUFvQixDQUFDeEMsT0FBRCxFQUFVQyxNQUFWLEVBQWtCNEIsT0FBbEIsRUFBMkI5QixRQUEzQixFQUFxQzVELElBQXJDLEVBQTJDd0YsYUFBM0MsQ0FBcEI7QUFDQVUsYUFBUyxDQUFDckYsR0FBVixDQUFjLFFBQWQsRUFBd0I0RSxTQUFTLENBQUNLLENBQUQsQ0FBVCxDQUFhaEMsTUFBckM7QUFFQSxVQUFNd0MsV0FBVyxHQUFHckcsS0FBSyxDQUFDa0csUUFBTixDQUFlO0FBQ2pDN0QsVUFBSSxFQUFFLFFBRDJCO0FBRWpDQyxpQkFBVyxFQUFFLFFBRm9CO0FBR2pDNkQsdUJBQWlCLEVBQUViO0FBSGMsS0FBZixDQUFwQjs7QUFNQSxRQUFJLENBQUNPLENBQUMsR0FBQyxDQUFILElBQVFILHFCQUFSLEtBQWtDLENBQXRDLEVBQXlDO0FBQUU7QUFDekMsWUFBTVksV0FBVyxHQUFHdkcsSUFBSSxDQUFDaUcsUUFBTCxFQUFwQjtBQUVBLFlBQU1PLFlBQVksR0FBR0QsV0FBVyxDQUFDSixRQUFaLENBQXFCO0FBQ3hDN0QsWUFBSSxFQUFFLFFBRGtDO0FBRXhDQyxtQkFBVyxFQUFFLFFBRjJCO0FBR3hDNkQseUJBQWlCLEVBQUVkO0FBSHFCLE9BQXJCLENBQXJCO0FBS0Q7QUFFRixHQS9CRDs7QUFtQ0EsV0FBU2Usb0JBQVQsQ0FBOEJaLFNBQTlCLEVBQXlDM0IsTUFBekMsRUFBaUQ0QixPQUFqRCxFQUEwRDlCLFFBQTFELEVBQW9FNUQsSUFBcEUsRUFBMEV3RixhQUExRSxFQUF5RjtBQUNyRixRQUFJaUIsb0JBQW9CLEdBQUdoQixTQUFTLENBQUN4RCxNQUFWLENBQWlCeUUsTUFBTSxJQUFJQSxNQUFNLEtBQUs1QyxNQUF0QyxDQUEzQjtBQUNBMkMsd0JBQW9CLEdBQUdaLE9BQU8sQ0FBQ1ksb0JBQUQsQ0FBOUI7QUFDQSxRQUFJRSxVQUFVLEdBQUczRyxJQUFJLENBQUNVLE9BQUwsQ0FBYW9CLE1BQTlCO0FBQ0EsUUFBSThFLFVBQVUsR0FBRyxDQUFqQixDQUpxRixDQU9yRjs7QUFDQSxRQUFJQyxVQUFVLEdBQUcsRUFBakI7O0FBQ0EsU0FBSyxJQUFJZixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHVyxvQkFBb0IsQ0FBQzNFLE1BQXpDLEVBQWlEZ0UsQ0FBQyxFQUFsRCxFQUFzRDtBQUNwRCxVQUFJWSxNQUFNLEdBQUdELG9CQUFvQixDQUFDWCxDQUFELENBQWpDOztBQUNBLFVBQUksQ0FBQ2UsVUFBVSxDQUFDQyxjQUFYLENBQTBCSixNQUExQixDQUFMLEVBQXdDO0FBQ3RDRyxrQkFBVSxDQUFDSCxNQUFELENBQVYsR0FBcUJDLFVBQVUsR0FBRyxDQUFsQyxDQURzQyxDQUNEO0FBQ3RDO0FBQ0Y7O0FBRUQzRyxRQUFJLENBQUNVLE9BQUwsQ0FBYUMsT0FBYixDQUFzQkMsTUFBRCxJQUFZO0FBQy9CLFVBQUltRyxhQUFhLEdBQUcsRUFBcEI7O0FBQ0EsV0FBSyxJQUFJakIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1csb0JBQW9CLENBQUMzRSxNQUF6QyxFQUFpRGdFLENBQUMsRUFBbEQsRUFBc0Q7QUFDcEQsWUFBSVksTUFBTSxHQUFHRCxvQkFBb0IsQ0FBQ1gsQ0FBRCxDQUFqQzs7QUFDQSxZQUFJaUIsYUFBYSxDQUFDakYsTUFBZCxHQUF1QjRELE9BQU8sR0FBRyxDQUFyQyxFQUF3QztBQUFFO0FBQ3hDLGNBQUltQixVQUFVLENBQUNILE1BQUQsQ0FBVixHQUFxQixDQUFyQixLQUEyQixDQUEvQixFQUFrQztBQUFFO0FBQ2hDLGdCQUFJRSxVQUFVLEdBQUdwQixhQUFqQixFQUFpQztBQUFFO0FBQ2pDdUIsMkJBQWEsQ0FBQ2xGLElBQWQsQ0FBbUI2RSxNQUFuQjtBQUNBRyx3QkFBVSxDQUFDSCxNQUFELENBQVYsSUFBc0IsQ0FBdEI7QUFDQUUsd0JBQVUsSUFBSSxDQUFkO0FBQ0Q7QUFDSixXQU5ELE1BTU87QUFDTEcseUJBQWEsQ0FBQ2xGLElBQWQsQ0FBbUI2RSxNQUFuQjtBQUNBRyxzQkFBVSxDQUFDSCxNQUFELENBQVYsSUFBc0IsQ0FBdEI7QUFDRDtBQUNGO0FBQ0Y7O0FBQ0RLLG1CQUFhLENBQUNsRixJQUFkLENBQW1CaUMsTUFBbkIsRUFqQitCLENBaUJIOztBQUM1QixXQUFLLElBQUlrRCxjQUFULElBQTJCRCxhQUEzQixFQUEwQztBQUN4QyxZQUFJRixVQUFVLENBQUNHLGNBQUQsQ0FBVixLQUErQixDQUFuQyxFQUFzQztBQUFFO0FBQ3RDUCw4QkFBb0IsR0FBR0Esb0JBQW9CLENBQUN4RSxNQUFyQixDQUE0QnlFLE1BQU0sSUFBSUEsTUFBTSxLQUFLTSxjQUFqRCxDQUF2QjtBQUVEO0FBQ0Y7O0FBRURELG1CQUFhLEdBQUdsQixPQUFPLENBQUNrQixhQUFELENBQXZCO0FBRUFuRyxZQUFNLENBQUNDLEdBQVAsQ0FBVytDLFFBQVgsRUFBcUJtRCxhQUFyQjtBQUNELEtBNUJEO0FBK0JILEdBcEl1QixDQXNJeEI7QUFDQTs7O0FBQ0EsV0FBU2xCLE9BQVQsQ0FBaUJKLFNBQWpCLEVBQTRCO0FBQzFCLFNBQUtLLENBQUMsR0FBR0wsU0FBUyxDQUFDM0QsTUFBVixHQUFrQixDQUEzQixFQUErQmdFLENBQUMsR0FBRyxDQUFuQyxFQUFzQ0EsQ0FBQyxFQUF2QyxFQUEyQztBQUN6QyxZQUFNbUIsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLE1BQWlCdEIsQ0FBQyxHQUFHLENBQXJCLENBQVgsQ0FBVjtBQUVBLE9BQUNMLFNBQVMsQ0FBQ0ssQ0FBRCxDQUFWLEVBQWVMLFNBQVMsQ0FBQ3dCLENBQUQsQ0FBeEIsSUFBK0IsQ0FBQ3hCLFNBQVMsQ0FBQ3dCLENBQUQsQ0FBVixFQUFleEIsU0FBUyxDQUFDSyxDQUFELENBQXhCLENBQS9CO0FBQ0Q7O0FBQ0QsV0FBT0wsU0FBUDtBQUNEO0FBRUYsQ0FqSkQsRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuXG4vLyBUaGlzIGlzIHdoZXJlIHlvdSBhZGQgYm90cywgbGlrZSBCb2I6XG5cbkVtcGlyaWNhLmJvdChcImJvYlwiLCB7XG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaCBzdGFnZSAoYWZ0ZXIgb25Sb3VuZFN0YXJ0L29uU3RhZ2VTdGFydClcbiAgLy8gb25TdGFnZVN0YXJ0KGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzKSB7fSxcblxuICAvLyBDYWxsZWQgZHVyaW5nIGVhY2ggc3RhZ2UgYXQgdGljayBpbnRlcnZhbCAofjFzIGF0IHRoZSBtb21lbnQpXG4gIG9uU3RhZ2VUaWNrKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBzZWNvbmRzUmVtYWluaW5nKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQSBwbGF5ZXIgaGFzIGNoYW5nZWQgYSB2YWx1ZVxuICAvLyAvLyBUaGlzIG1pZ2h0IGhhcHBlbiBhIGxvdCFcbiAgLy8gb25TdGFnZVBsYXllckNoYW5nZShib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycywgcGxheWVyKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBlbmQgb2YgdGhlIHN0YWdlIChhZnRlciBpdCBmaW5pc2hlZCwgYmVmb3JlIG9uU3RhZ2VFbmQvb25Sb3VuZEVuZCBpcyBjYWxsZWQpXG4gIC8vIG9uU3RhZ2VFbmQoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMpIHt9XG59KTtcbiIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcblxuaW1wb3J0IHsgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0IHsgVGltZVN5bmMgfSBmcm9tIFwibWV0ZW9yL21penphbzp0aW1lc3luY1wiO1xuXG5cblxuLy8gb25HYW1lU3RhcnQgaXMgdHJpZ2dlcmVkIG9wbmNlIHBlciBnYW1lIGJlZm9yZSB0aGUgZ2FtZSBzdGFydHMsIGFuZCBiZWZvcmVcbi8vIHRoZSBmaXJzdCBvblJvdW5kU3RhcnQuIEl0IHJlY2VpdmVzIHRoZSBnYW1lIGFuZCBsaXN0IG9mIGFsbCB0aGUgcGxheWVycyBpblxuLy8gdGhlIGdhbWUuXG5FbXBpcmljYS5vbkdhbWVTdGFydChnYW1lID0+IHtcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0ZWRcIik7XG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwiaW5hY3RpdmVcIiwgZmFsc2UpO1xuICAgIHBsYXllci5zZXQoXCJsYXN0QWN0aXZlXCIsIHBsYXllci5sYXN0QWN0aXZpdHlBdCk7XG4gICAgY29uc3QgbmV0d29yayA9IHBsYXllci5nZXQoXCJuZWlnaGJvcnNcIik7XG4gICAgY29uc3QgYWN0aXZlQ2hhdHMgPSBbXTtcbiAgICBuZXR3b3JrLm1hcChvdGhlck5vZGVJZCA9PiB7XG4gICAgICB2YXIgcGFpck9mUGxheWVycyA9IFtwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpLCBwYXJzZUludChvdGhlck5vZGVJZCldO1xuICAgICAgcGFpck9mUGxheWVycy5zb3J0KChwMSxwMikgPT4gcDEgLSBwMik7XG4gICAgICBjb25zdCBvdGhlclBsYXllciA9IGdhbWUucGxheWVycy5maW5kKHAgPT4gcC5nZXQoXCJub2RlSWRcIikgPT09IHBhcnNlSW50KG90aGVyTm9kZUlkKSk7XG4gICAgICAvLyBjb25zdCBvdGhlclBsYXllcklkID0gb3RoZXJQbGF5ZXIuaWQ7XG4gICAgICBjb25zdCBjaGF0S2V5ID0gYCR7cGFpck9mUGxheWVyc1swXX0tJHtwYWlyT2ZQbGF5ZXJzWzFdfWA7XG4gICAgICBhY3RpdmVDaGF0cy5wdXNoKGNoYXRLZXkpO1xuICAgIH0pO1xuICAgIC8vIERlZmF1bHQgYWxsIGNoYXRzIHRvIGJlIG9wZW4gd2hlbiBnYW1lIHN0YXJ0c1xuICAgIHBsYXllci5zZXQoXCJhY3RpdmVDaGF0c1wiLCBhY3RpdmVDaGF0cyk7XG4gICAgY29uc29sZS5sb2cocGxheWVyLmdldChcImFjdGl2ZUNoYXRzXCIpKTtcbiAgfSk7XG4gIGdhbWUuc2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIsIGdhbWUucGxheWVycy5sZW5ndGgpO1xufSk7XG5cbi8vIG9uUm91bmRTdGFydCBpcyB0cmlnZ2VyZWQgYmVmb3JlIGVhY2ggcm91bmQgc3RhcnRzLCBhbmQgYmVmb3JlIG9uU3RhZ2VTdGFydC5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lU3RhcnQsIGFuZCB0aGUgcm91bmQgdGhhdCBpcyBzdGFydGluZy5cbkVtcGlyaWNhLm9uUm91bmRTdGFydCgoZ2FtZSwgcm91bmQpID0+IHtcbiAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAgIHBsYXllci5zZXQoXCJzeW1ib2xTZWxlY3RlZFwiLCBcIlwiKTtcbiAgfSk7XG4gIHJvdW5kLnNldChcInJlc3VsdFwiLCBmYWxzZSk7XG4gIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgMCk7XG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoYWN0aXZlUGxheWVycy5sZW5ndGggPCBnYW1lLmdldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiKSApIHsgLy8gU29tZW9uZSBsZWZ0IGluIHRoZSBtaWRkbGUgb2YgdGhlIHJvdW5kXG4gICAgaWYgKGdhbWUudHJlYXRtZW50LmVuZEdhbWVJZlBsYXllcklkbGUpIHtcbiAgICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICBwLmV4aXQoXCJzb21lb25lSW5hY3RpdmVcIik7XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpOyAvLyBVcGRhdGVzIHRoZSBuZWlnaGJvcnMgdG8gYmUgZnVsbHkgY29ubmVjdGVkXG4gICAgfVxuICBcbiAgfVxuICBnYW1lLnNldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiLCBhY3RpdmVQbGF5ZXJzLmxlbmd0aCk7XG5cbiAgY29uc29sZS5sb2coXCJSb3VuZCBTdGFydGVkXCIpO1xuXG59KTtcblxuLy8gb25TdGFnZVN0YXJ0IGlzIHRyaWdnZXJlZCBiZWZvcmUgZWFjaCBzdGFnZSBzdGFydHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uUm91bmRTdGFydCwgYW5kIHRoZSBzdGFnZSB0aGF0IGlzIHN0YXJ0aW5nLlxuRW1waXJpY2Eub25TdGFnZVN0YXJ0KChnYW1lLCByb3VuZCwgc3RhZ2UpID0+IHtcbiAgY29uc29sZS5sb2coXCJTdGFnZSBTdGFydGVkXCIpXG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJUYXNrXCIpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgY29uc29sZS5sb2coIGBTeW1ib2xzIDogJHtwbGF5ZXIuZ2V0KGAke3N0YWdlLmRpc3BsYXlOYW1lfWApfWApO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKGBBbnN3ZXI6ICR7c3RhZ2UuZ2V0KFwiYW5zd2VyXCIpfWApO1xuICB9XG4gIGlmIChzdGFnZS5uYW1lID09PSBcIlN1cnZleVwiKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIHBsYXllci5zZXQoXCJzdXJ2ZXlOdW1iZXJcIiAsIDEpXG4gICAgfSk7XG4gIH1cbiAgLy8gZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAvLyB9KTtcbiAgLy8gc3RhZ2Uuc2V0KFwic2hvd1Jlc3VsdHNcIiwgZmFsc2UpO1xuICAvLyBzdGFnZS5zZXQoXCJyZXN1bHRzU2hvd25cIiwgZmFsc2UpO1xuXG59KTtcblxuLy8gb25TdGFnZUVuZCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgZWFjaCBzdGFnZS5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25Sb3VuZEVuZCwgYW5kIHRoZSBzdGFnZSB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblN0YWdlRW5kKChnYW1lLCByb3VuZCwgc3RhZ2UpID0+e1xuICBjb25zb2xlLmxvZyhcIlN0YWdlIEVuZGVkXCIpXG4gIFxufSk7XG5cbi8vIG9uUm91bmRFbmQgaXMgdHJpZ2dlcmVkIGFmdGVyIGVhY2ggcm91bmQuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZUVuZCwgYW5kIHRoZSByb3VuZCB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblJvdW5kRW5kKChnYW1lLCByb3VuZCkgPT4ge1xuICAvLyBnYW1lLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAvLyAgIGNvbnN0IHZhbHVlID0gcGxheWVyLnJvdW5kLmdldChcInZhbHVlXCIpIHx8IDA7XG4gIC8vICAgY29uc3QgcHJldlNjb3JlID0gcGxheWVyLmdldChcInNjb3JlXCIpIHx8IDA7XG4gIC8vICAgcGxheWVyLnNldChcInNjb3JlXCIsIHByZXZTY29yZSArIHZhbHVlKTtcbiAgLy8gfSk7XG5cbn0pO1xuXG4vLyBvbkdhbWVFbmQgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGdhbWUgZW5kcy5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lU3RhcnQuXG5FbXBpcmljYS5vbkdhbWVFbmQoZ2FtZSA9PiB7fSk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT4gb25TZXQsIG9uQXBwZW5kIGFuZCBvbkNoYW5nZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBvblNldCwgb25BcHBlbmQgYW5kIG9uQ2hhbmdlIGFyZSBjYWxsZWQgb24gZXZlcnkgc2luZ2xlIHVwZGF0ZSBtYWRlIGJ5IGFsbFxuLy8gcGxheWVycyBpbiBlYWNoIGdhbWUsIHNvIHRoZXkgY2FuIHJhcGlkbHkgYmVjb21lIHF1aXRlIGV4cGVuc2l2ZSBhbmQgaGF2ZVxuLy8gdGhlIHBvdGVudGlhbCB0byBzbG93IGRvd24gdGhlIGFwcC4gVXNlIHdpc2VseS5cbi8vXG4vLyBJdCBpcyB2ZXJ5IHVzZWZ1bCB0byBiZSBhYmxlIHRvIHJlYWN0IHRvIGVhY2ggdXBkYXRlIGEgdXNlciBtYWtlcy4gVHJ5XG4vLyBub250aGVsZXNzIHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgY29tcHV0YXRpb25zIGFuZCBkYXRhYmFzZSBzYXZlcyAoLnNldClcbi8vIGRvbmUgaW4gdGhlc2UgY2FsbGJhY2tzLiBZb3UgY2FuIGFsc28gdHJ5IHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgY2FsbHMgdG9cbi8vIHNldCgpIGFuZCBhcHBlbmQoKSB5b3UgbWFrZSAoYXZvaWQgY2FsbGluZyB0aGVtIG9uIGEgY29udGludW91cyBkcmFnIG9mIGFcbi8vIHNsaWRlciBmb3IgZXhhbXBsZSkgYW5kIGluc2lkZSB0aGVzZSBjYWxsYmFja3MgdXNlIHRoZSBga2V5YCBhcmd1bWVudCBhdCB0aGVcbi8vIHZlcnkgYmVnaW5uaW5nIG9mIHRoZSBjYWxsYmFjayB0byBmaWx0ZXIgb3V0IHdoaWNoIGtleXMgeW91ciBuZWVkIHRvIHJ1blxuLy8gbG9naWMgYWdhaW5zdC5cbi8vXG4vLyBJZiB5b3UgYXJlIG5vdCB1c2luZyB0aGVzZSBjYWxsYmFja3MsIGNvbW1lbnQgdGhlbSBvdXQgc28gdGhlIHN5c3RlbSBkb2VzXG4vLyBub3QgY2FsbCB0aGVtIGZvciBub3RoaW5nLlxuXG4vLyAvLyBvblNldCBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIC5zZXQoKSBtZXRob2Rcbi8vIC8vIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uU2V0KChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbi8vICkgPT4ge1xuLy8gICAvLyAvLyBFeGFtcGxlIGZpbHRlcmluZ1xuLy8gICAvLyBpZiAoa2V5ICE9PSBcInZhbHVlXCIpIHtcbi8vICAgLy8gICByZXR1cm47XG4vLyAgIC8vIH1cbi8vIH0pO1xuXG5FbXBpcmljYS5vblNldCgoXG4gIGdhbWUsXG4gIHJvdW5kLFxuICBzdGFnZSxcbiAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbiAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4gIHZhbHVlLCAvLyBOZXcgdmFsdWVcbiAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4pID0+IHtcbiAgY29uc3QgcGxheWVycyA9IGdhbWUucGxheWVycztcbiAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG4gIC8vIFNvbWUgcGxheWVyIGRlY2lkZXMgdG8gcmVjb25zaWRlciB0aGVpciBhbnN3ZXJcbiAgY29uc29sZS5sb2coXCJrZXlcIiwga2V5KTtcbiAgaWYgKGtleSA9PT0gXCJzdWJtaXR0ZWRcIikgeyBcbiAgICAvLyBDaGVja3MgaWYgZXZlcnlvbmUgaGFzIHN1Ym1pdHRlZCB0aGVpciBhbnN3ZXIgYW5kIGlmIHNvLCBzdWJtaXQgdGhlIHN0YWdlXG4gICAgbGV0IGFsbFN1Ym1pdHRlZCA9IHRydWU7XG4gICAgbGV0IG51bVBsYXllcnNTdWJtaXR0ZWQgPSAwO1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmdldChcInN1Ym1pdHRlZFwiKSkge1xuICAgICAgICBudW1QbGF5ZXJzU3VibWl0dGVkICs9IDE7XG4gICAgICB9XG4gICAgICBhbGxTdWJtaXR0ZWQgPSBwbGF5ZXIuZ2V0KFwic3VibWl0dGVkXCIpICYmIGFsbFN1Ym1pdHRlZDtcbiAgICB9KVxuICAgIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgbnVtUGxheWVyc1N1Ym1pdHRlZCk7XG4gICAgaWYgKGFsbFN1Ym1pdHRlZCkge1xuICAgICAgY29uc3QgbG9nID0gc3RhZ2UuZ2V0KFwibG9nXCIpO1xuICAgICAgY29tcHV0ZVNjb3JlKGFjdGl2ZVBsYXllcnMsIHN0YWdlLCByb3VuZCk7XG4gICAgICAvLyBOZWVkIHRvIHN1Ym1pdCBmb3Igc3VibWl0IHRoZSBzdGFnZSBmb3IgZXZlcnkgcGxheWVyXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgICAgIH0pXG4gICAgfVxuICAvLyAgIGlmIChzdGFnZS5nZXQoXCJyZXN1bHRzU2hvd25cIikpIHtcbiAgLy8gICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgLy8gICAgIH0pXG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gaWYgKHRhcmdldFR5cGUgPT09IFwic3RhZ2VcIiAmJiBrZXkgPT09IFwicmVzdWx0c1Nob3duXCIpIHtcbiAgLy8gICBpZiAoc3RhZ2UuZ2V0KFwicmVzdWx0c1Nob3duXCIpKSB7XG4gIC8vICAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4gIC8vICAgICB9KVxuICAvLyAgIH1cbiAgfVxuXG4gIC8vIGVsc2UgaWYgKGtleSA9PT0gXCJpbmFjdGl2ZVwiKSB7XG4gICAgLy8gZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgLy8gfVxuXG4gIHJldHVybjtcblxufSk7XG5cbmZ1bmN0aW9uIGNvbXB1dGVTY29yZShhY3RpdmVQbGF5ZXJzLCBzdGFnZSwgcm91bmQpIHtcbiAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuICBjb25zb2xlLmxvZyhcIkNPUlJFQ1QgQU5TV0VSOlwiKVxuICBjb25zb2xlLmxvZyhzdGFnZS5nZXQoXCJhbnN3ZXJcIikpO1xuICBjb25zb2xlLmxvZyhcIlBsYXllcnMgZ3Vlc3NlZDpcIilcblxuICBhY3RpdmVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICBjb25zdCBzdWJtaXNzaW9uID0gcGxheWVyLmdldChcInN5bWJvbFNlbGVjdGVkXCIpO1xuICAgIGNvbnNvbGUubG9nKHN1Ym1pc3Npb24pO1xuICAgIGlmIChzdWJtaXNzaW9uICE9PSBzdGFnZS5nZXQoXCJhbnN3ZXJcIikpIHtcbiAgICAgIHN1Y2Nlc3MgPSBmYWxzZVxuICAgIH1cbiAgfSlcbiAgcm91bmQuc2V0KFwicmVzdWx0XCIsIHN1Y2Nlc3MpO1xuICBpZiAoc3VjY2Vzcykge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgY29uc3QgcHJldlNjb3JlID0gcGxheWVyLmdldChcInNjb3JlXCIpIHx8IDA7XG4gICAgICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgcHJldlNjb3JlICsgMSk7XG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyhcIiBBbGwgcGxheWVycyBnb3QgaXQgY29ycmVjdGx5XCIpO1xuICB9IFxufVxuXG4vLyAvLyBvbkFwcGVuZCBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIGAuYXBwZW5kKClgIG1ldGhvZFxuLy8gLy8gb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3IgcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25BcHBlbmQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gKSA9PiB7XG4vLyAgIC8vIE5vdGU6IGB2YWx1ZWAgaXMgdGhlIHNpbmdsZSBsYXN0IHZhbHVlIChlLmcgMC4yKSwgd2hpbGUgYHByZXZWYWx1ZWAgd2lsbFxuLy8gICAvLyAgICAgICBiZSBhbiBhcnJheSBvZiB0aGUgcHJldmlzb3VzIHZhbHVlZCAoZS5nLiBbMC4zLCAwLjQsIDAuNjVdKS5cbi8vIH0pO1xuXG5cbi8vIC8vIG9uQ2hhbmdlIGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgYC5zZXQoKWAgb3IgdGhlXG4vLyAvLyBgLmFwcGVuZCgpYCBtZXRob2Qgb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3Jcbi8vIC8vIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uQ2hhbmdlKChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUsIC8vIFByZXZpb3VzIHZhbHVlXG4vLyAgIGlzQXBwZW5kIC8vIFRydWUgaWYgdGhlIGNoYW5nZSB3YXMgYW4gYXBwZW5kLCBmYWxzZSBpZiBpdCB3YXMgYSBzZXRcbi8vICkgPT4ge1xuLy8gICAvLyBgb25DaGFuZ2VgIGlzIHVzZWZ1bCB0byBydW4gc2VydmVyLXNpZGUgbG9naWMgZm9yIGFueSB1c2VyIGludGVyYWN0aW9uLlxuLy8gICAvLyBOb3RlIHRoZSBleHRyYSBpc0FwcGVuZCBib29sZWFuIHRoYXQgd2lsbCBhbGxvdyB0byBkaWZmZXJlbmNpYXRlIHNldHMgYW5kXG4vLyAgIC8vIGFwcGVuZHMuXG4vLyAgICBHYW1lLnNldChcImxhc3RDaGFuZ2VBdFwiLCBuZXcgRGF0ZSgpLnRvU3RyaW5nKCkpXG4vLyB9KTtcblxuLy8gLy8gb25TdWJtaXQgaXMgY2FsbGVkIHdoZW4gdGhlIHBsYXllciBzdWJtaXRzIGEgc3RhZ2UuXG4vLyBFbXBpcmljYS5vblN1Ym1pdCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyIC8vIFBsYXllciB3aG8gc3VibWl0dGVkXG4vLyApID0+IHtcbi8vIH0pO1xuIiwiY29uc3QgYWxsU3ltYm9scyA9IFtcInQxXCIsIFwidDJcIiwgXCJ0M1wiLCBcInQ0XCIsIFwidDVcIiwgXCJ0NlwiLCBcInQ3XCIsXCJ0OFwiLFwidDlcIixcInQxMFwiLFwidDExXCIsXCJ0MTJcIl07XG5cbi8vIG4gPSBudW1iZXIgb2YgcGVvcGxlICwgcCA9IG51bWJlciBvZiBzeW1ib2xzXG4vLyAobi0xKSpwICsgMVxuLy8gaS5lLiBuID0gMywgcCA9IDMgOiA3XG5cbmV4cG9ydCBjb25zdCB0ZXN0VGFuZ3JhbXMgPSBbXG4gIHtcbiAgICBfaWQ6IFwiMFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMlwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQyXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMlwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgM1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQzXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiM1wiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgNFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ0XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiNFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgNVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ1XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiNVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgNlwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ2XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiNlwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgN1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ3XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiN1wiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgOFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ4XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiOFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgOVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQ5XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiOVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTBcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MTBcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxMFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTFcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MTFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxMVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTJcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MTJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxMlwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTNcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0MVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEzXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxNFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQyXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTRcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDE1XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDNcIixcbiAgfSxcblxuXTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXROZWlnaGJvcnMoc3RydWN0dXJlLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBsZXQgbmV0d29yayA9IHN0cnVjdHVyZS5zcGxpdChcIixcIik7XG4gICAgY29uc3QgcGxheWVySW5kZXggPSBwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpO1xuXG4gICAgbmV0d29yay5mb3JFYWNoKChuKSA9PiB7XG4gICAgICBjb25zdCBjb25uZWN0aW9uID0gbi5zcGxpdChcIi1cIik7XG5cbiAgICAgIGlmIChwbGF5ZXJJbmRleCA9PT0gcGFyc2VJbnQoY29ubmVjdGlvblswXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goY29ubmVjdGlvblsxXS5yZXBsYWNlKC9cXHMvZywgJycpKTtcbiAgICAgIH0gZWxzZSBpZiAocGxheWVySW5kZXggPT09IHBhcnNlSW50KGNvbm5lY3Rpb25bMV0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGNvbm5lY3Rpb25bMF0ucmVwbGFjZSgvXFxzL2csICcnKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIHJldHVybiBbLi4uIG5ldyBTZXQobmVpZ2hib3JzKV07XG4gIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSkge1xuICAgIGNvbnN0IGFjdGl2ZU5vZGVzID0gW107XG4gICAgY29uc3QgYWxsTm9kZXMgPSBbXTtcbiAgICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuXG4gICAgLy8gYWN0aXZlUGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgLy8gICBhY3RpdmVOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgIC8vIH0pXG5cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgLy8gaWYgKHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0dmVcIikpIHtcbiAgICAgIGlmICghcC5nZXQoXCJpbmFjdHZlXCIpKSB7XG5cbiAgICAgICAgYWN0aXZlTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICAgIH1cbiAgICAgIGFsbE5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgfSlcblxuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAvLyBPbmx5IHNob3cgYWN0aXZlIHBlb3BsZVxuICAgICAgLy8gY29uc3QgbmV3TmVpZ2hib3JzID0gYWN0aXZlTm9kZXMuZmlsdGVyKGlkID0+IHBhcnNlSW50KGlkKSAhPT0gcC5nZXQoXCJub2RlSWRcIikpXG4gICAgICAvLyBwLnNldChcIm5laWdoYm9yc1wiLCBuZXdOZWlnaGJvcnMpO1xuXG4gICAgICAvLyBTaG93IGV2ZXJ5b25lLCBtYXJrIG9mZmxpbmUgcGVvcGxlIGFzIG9mZmxpbmVcbiAgICAgIGNvbnN0IG5ld05laWdoYm9ycyA9IGFsbE5vZGVzLmZpbHRlcihpZCA9PiBwYXJzZUludChpZCkgIT09IHAuZ2V0KFwibm9kZUlkXCIpKVxuICAgICAgcC5zZXQoXCJuZWlnaGJvcnNcIiwgbmV3TmVpZ2hib3JzKTtcbiAgICB9KVxufSIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcbmltcG9ydCBcIi4vYm90cy5qc1wiO1xuaW1wb3J0IFwiLi9jYWxsYmFja3MuanNcIjtcblxuaW1wb3J0IHsgdGVzdFN5bWJvbHMsIHRlc3RUYW5ncmFtcyB9IGZyb20gXCIuL2NvbnN0YW50c1wiOyBcbmltcG9ydCB7IGdldE5laWdoYm9ycywgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcblxuLy8gZ2FtZUluaXQgaXMgd2hlcmUgdGhlIHN0cnVjdHVyZSBvZiBhIGdhbWUgaXMgZGVmaW5lZC5cbi8vIEp1c3QgYmVmb3JlIGV2ZXJ5IGdhbWUgc3RhcnRzLCBvbmNlIGFsbCB0aGUgcGxheWVycyBuZWVkZWQgYXJlIHJlYWR5LCB0aGlzXG4vLyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgdHJlYXRtZW50IGFuZCB0aGUgbGlzdCBvZiBwbGF5ZXJzLlxuLy8gWW91IG11c3QgdGhlbiBhZGQgcm91bmRzIGFuZCBzdGFnZXMgdG8gdGhlIGdhbWUsIGRlcGVuZGluZyBvbiB0aGUgdHJlYXRtZW50XG4vLyBhbmQgdGhlIHBsYXllcnMuIFlvdSBjYW4gYWxzbyBnZXQvc2V0IGluaXRpYWwgdmFsdWVzIG9uIHlvdXIgZ2FtZSwgcGxheWVycyxcbi8vIHJvdW5kcyBhbmQgc3RhZ2VzICh3aXRoIGdldC9zZXQgbWV0aG9kcyksIHRoYXQgd2lsbCBiZSBhYmxlIHRvIHVzZSBsYXRlciBpblxuLy8gdGhlIGdhbWUuXG5FbXBpcmljYS5nYW1lSW5pdChnYW1lID0+IHtcbiAgY29uc3Qge1xuICAgIHRyZWF0bWVudDoge1xuICAgICAgcGxheWVyQ291bnQsXG4gICAgICBuZXR3b3JrU3RydWN0dXJlLFxuICAgICAgbnVtVGFza1JvdW5kcyxcbiAgICAgIG51bVN1cnZleVJvdW5kcyxcbiAgICAgIHNldFNpemVCYXNlZE9uUGxheWVyQ291bnQsXG4gICAgICB1c2VySW5hY3Rpdml0eUR1cmF0aW9uLFxuICAgICAgdGFza0R1cmF0aW9uLFxuICAgICAgZGVmYXVsdFNldFNpemUsXG4gICAgICBzdXJ2ZXlEdXJhdGlvbixcbiAgICAgIHJlc3VsdHNEdXJhdGlvbixcbiAgICAgIG1heE51bU92ZXJsYXAsXG4gICAgfSxcbiAgfSA9IGdhbWU7XG5cblxuICBjb25zdCBzeW1ib2xTZXQgPSB0ZXN0VGFuZ3JhbXM7XG4gIGNvbnN0IHNldFNpemUgPSBzZXRTaXplQmFzZWRPblBsYXllckNvdW50ID8gcGxheWVyQ291bnQgKyAxIDogZGVmYXVsdFNldFNpemU7IC8vVE9ETzogY2FuIGNoYW5nZSBkZWZhdWx0IHZhbHVlIGluIHNldHRpbmdzXG4gIGNvbnN0IG51bVJvdW5kc0JlZm9yZVN1cnZleSA9IG51bVRhc2tSb3VuZHMvbnVtU3VydmV5Um91bmRzO1xuXG4gIGxldCBjb2xvcnMgPSBbXCJHcmVlblwiLCBcIlJlZFwiLCBcIlllbGxvd1wiLCBcIkJsdWVcIiwgXCJQdXJwbGVcIiwgXCJXaGl0ZVwiLCBcIkJsYWNrXCJdXG4gIGNvbG9ycyA9IHNodWZmbGUoY29sb3JzKTtcblxuICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyLCBpKSA9PiB7XG4gICAgcGxheWVyLnNldChcImF2YXRhclwiLCBgL2F2YXRhcnMvamRlbnRpY29uLyR7cGxheWVyLl9pZH1gKTtcbiAgICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMCk7XG5cbiAgICAvLyBHaXZlIGVhY2ggcGxheWVyIGEgbm9kZUlkIGJhc2VkIG9uIHRoZWlyIHBvc2l0aW9uIChpbmRleGVkIGF0IDEpXG4gICAgcGxheWVyLnNldChcIm5vZGVJZFwiLCBpICsgMSk7XG4gICAgcGxheWVyLnNldChcIm5hbWVcIiwgcGxheWVyLmlkKTtcbiAgICBwbGF5ZXIuc2V0KFwiYW5vbnltb3VzTmFtZVwiLCBjb2xvcnNbaV0pXG4gIH0pO1xuXG5cbiAgaWYgKGdhbWUucGxheWVycy5sZW5ndGggPCBnYW1lLnRyZWF0bWVudC5wbGF5ZXJDb3VudCkgeyAvLyBpZiBub3QgYSBmdWxsIGdhbWUsIGRlZmF1bHQgdG8gZnVsbHkgY29ubmVjdGVkIGxheWVyXG4gICAgZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgY29uc29sZS5sb2cocC5nZXQoXCJuZWlnaGJvcnNcIikpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBwLnNldChcIm5laWdoYm9yc1wiLCBnZXROZWlnaGJvcnMobmV0d29ya1N0cnVjdHVyZSwgcCkpO1xuICAgICAgY29uc29sZS5sb2cocC5nZXQoXCJuZWlnaGJvcnNcIikpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRm9yIGVhY2ggcm91bmQsIGFkZCBhbGwgdGhlIHN5bWJvbHMsIHJhbmRvbWx5IHNlbGVjdCBhIGNvcnJlY3QgYW5zd2VyIGFuZFxuICAvLyBDb25zdHJhaW50czogTXVzdCBlbnN1cmUgdGhhdCBldmVyeW9uZSBoYXMgb25seSBvbmUgc3ltYm9sIGluIGNvbW1vblxuICBfLnRpbWVzKCBudW1UYXNrUm91bmRzLCBpID0+IHtcbiAgICBjb25zdCByb3VuZCA9IGdhbWUuYWRkUm91bmQoKTtcblxuICAgIGNvbnN0IHtzeW1ib2xzLCB0YXNrTmFtZSwgYW5zd2VyfSA9IHN5bWJvbFNldFtpXTtcblxuICAgIGNvbnN0IHRhc2tTdGFnZSA9IHJvdW5kLmFkZFN0YWdlKHtcbiAgICAgIG5hbWU6IFwiVGFza1wiLFxuICAgICAgZGlzcGxheU5hbWU6IHRhc2tOYW1lLFxuICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICBkdXJhdGlvbkluU2Vjb25kczogdGFza0R1cmF0aW9uXG4gICAgfSk7XG4gICAgdGFza1N0YWdlLnNldChcInRhc2tcIiwgc3ltYm9sU2V0W2ldKTtcbiAgICBnZXRTeW1ib2xzRm9yUGxheWVycyhzeW1ib2xzLCBhbnN3ZXIsIHNldFNpemUsIHRhc2tOYW1lLCBnYW1lLCBtYXhOdW1PdmVybGFwKVxuICAgIHRhc2tTdGFnZS5zZXQoXCJhbnN3ZXJcIiwgc3ltYm9sU2V0W2ldLmFuc3dlcilcblxuICAgIGNvbnN0IHJlc3VsdFN0YWdlID0gcm91bmQuYWRkU3RhZ2Uoe1xuICAgICAgbmFtZTogXCJSZXN1bHRcIixcbiAgICAgIGRpc3BsYXlOYW1lOiBcIlJlc3VsdFwiLFxuICAgICAgZHVyYXRpb25JblNlY29uZHM6IHJlc3VsdHNEdXJhdGlvblxuICAgIH0pO1xuICAgIFxuICAgIGlmICgoaSsxKSAlIG51bVJvdW5kc0JlZm9yZVN1cnZleSA9PT0gMCkgeyAvLyBBZnRlciA1IHRhc2sgcm91bmRzLCBhZGQgYSBzdXJ2ZXkgcm91bmRcbiAgICAgIGNvbnN0IHN1cnZleVJvdW5kID0gZ2FtZS5hZGRSb3VuZCgpO1xuXG4gICAgICBjb25zdCBzdXJ2ZXlTdGFnZXMgPSBzdXJ2ZXlSb3VuZC5hZGRTdGFnZSh7XG4gICAgICAgIG5hbWU6IFwiU3VydmV5XCIsXG4gICAgICAgIGRpc3BsYXlOYW1lOiBcIlN1cnZleVwiLFxuICAgICAgICBkdXJhdGlvbkluU2Vjb25kczogc3VydmV5RHVyYXRpb25cbiAgICAgIH0pXG4gICAgfVxuXG4gIH0pO1xuXG5cblxuICBmdW5jdGlvbiBnZXRTeW1ib2xzRm9yUGxheWVycyhzeW1ib2xTZXQsIGFuc3dlciwgc2V0U2l6ZSwgdGFza05hbWUsIGdhbWUsIG1heE51bU92ZXJsYXApIHtcbiAgICAgIGxldCBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHN5bWJvbFNldC5maWx0ZXIoc3ltYm9sID0+IHN5bWJvbCAhPT0gYW5zd2VyKTtcbiAgICAgIHN5bWJvbHNXaXRob3V0QW5zd2VyID0gc2h1ZmZsZShzeW1ib2xzV2l0aG91dEFuc3dlcik7XG4gICAgICBsZXQgbnVtUGxheWVycyA9IGdhbWUucGxheWVycy5sZW5ndGg7XG4gICAgICBsZXQgbnVtT3ZlcmxhcCA9IDA7XG5cblxuICAgICAgLy8gQ3JlYXRlIGEgZGljdGlvbmFyeSB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IHRpbWVzIHN5bWJvbCBoYXMgYmVlbiB1c2VkXG4gICAgICBsZXQgc3ltYm9sRnJlcSA9IHt9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN5bWJvbHNXaXRob3V0QW5zd2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBzeW1ib2wgPSBzeW1ib2xzV2l0aG91dEFuc3dlcltpXVxuICAgICAgICBpZiAoIXN5bWJvbEZyZXEuaGFzT3duUHJvcGVydHkoc3ltYm9sKSkge1xuICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSA9IG51bVBsYXllcnMgLSAxOyAvLyBUb3RhbCB0aW1lIGEgc3ltYm9sIGNhbiBiZSB1c2VkIFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgICAgbGV0IHN5bWJvbHNQaWNrZWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzeW1ib2xzV2l0aG91dEFuc3dlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBzeW1ib2wgPSBzeW1ib2xzV2l0aG91dEFuc3dlcltpXVxuICAgICAgICAgIGlmIChzeW1ib2xzUGlja2VkLmxlbmd0aCA8IHNldFNpemUgLSAxKSB7IC8vIEFkZCBzeW1ib2xzIHVudGlsIHNldFNpemUgLSAxIGZvciBhbnN3ZXJcbiAgICAgICAgICAgIGlmIChzeW1ib2xGcmVxW3N5bWJvbF0gLSAxID09PSAwKSB7IC8vIFRoaXMgc3ltYm9sIHdpbGwgb3ZlcmxhcFxuICAgICAgICAgICAgICAgIGlmIChudW1PdmVybGFwIDwgbWF4TnVtT3ZlcmxhcCApIHsgLy8gT25seSBhZGQgaWYgbGVzcyB0aGFuIG1heCBvdmVybGFwXG4gICAgICAgICAgICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goc3ltYm9sKTtcbiAgICAgICAgICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSAtPSAxO1xuICAgICAgICAgICAgICAgICAgbnVtT3ZlcmxhcCArPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goYW5zd2VyKTsgLy8gQWRkIHRoZSBhbnN3ZXJcbiAgICAgICAgZm9yICh2YXIgc3ltYm9sVG9SZW1vdmUgb2Ygc3ltYm9sc1BpY2tlZCkge1xuICAgICAgICAgIGlmIChzeW1ib2xGcmVxW3N5bWJvbFRvUmVtb3ZlXSA9PT0gMCkgeyAvLyBJZiBzeW1ib2wgaGFzIGJlZW4gcGlja2VkIG4tMSBwbGF5ZXJzIHRpbWVzLCByZW1vdmUgaXQgZnJvbSB0aGUgc2V0XG4gICAgICAgICAgICBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHN5bWJvbHNXaXRob3V0QW5zd2VyLmZpbHRlcihzeW1ib2wgPT4gc3ltYm9sICE9PSBzeW1ib2xUb1JlbW92ZSk7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzeW1ib2xzUGlja2VkID0gc2h1ZmZsZShzeW1ib2xzUGlja2VkKTtcblxuICAgICAgICBwbGF5ZXIuc2V0KHRhc2tOYW1lLCBzeW1ib2xzUGlja2VkKTtcbiAgICAgIH0pXG5cblxuICB9XG5cbiAgLy8gU2h1ZmZsaW5nIGFycmF5czpcbiAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTA1MzYwNDQvc3dhcHBpbmctYWxsLWVsZW1lbnRzLW9mLWFuLWFycmF5LWV4Y2VwdC1mb3ItZmlyc3QtYW5kLWxhc3RcbiAgZnVuY3Rpb24gc2h1ZmZsZShzeW1ib2xTZXQpIHtcbiAgICBmb3IgKGkgPSBzeW1ib2xTZXQubGVuZ3RoIC0xIDsgaSA+IDA7IGktLSkge1xuICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuXG4gICAgICBbc3ltYm9sU2V0W2ldLCBzeW1ib2xTZXRbal1dID0gW3N5bWJvbFNldFtqXSwgc3ltYm9sU2V0W2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHN5bWJvbFNldDtcbiAgfVxuXG59KTtcbiJdfQ==
