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
      const log = stage.get("log");
      computeScore(activePlayers, game, stage, round); // Need to submit for submit the stage for every player

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm1vbWVudCIsIlRpbWVTeW5jIiwib25HYW1lU3RhcnQiLCJjb25zb2xlIiwibG9nIiwicGxheWVycyIsImZvckVhY2giLCJwbGF5ZXIiLCJzZXQiLCJsYXN0QWN0aXZpdHlBdCIsIm5ldHdvcmsiLCJnZXQiLCJhY3RpdmVDaGF0cyIsIm1hcCIsIm90aGVyTm9kZUlkIiwicGFpck9mUGxheWVycyIsInBhcnNlSW50Iiwic29ydCIsInAxIiwicDIiLCJvdGhlclBsYXllciIsImZpbmQiLCJwIiwiY2hhdEtleSIsInB1c2giLCJsZW5ndGgiLCJvblJvdW5kU3RhcnQiLCJhY3RpdmVQbGF5ZXJzIiwiZmlsdGVyIiwidHJlYXRtZW50IiwiZW5kR2FtZUlmUGxheWVySWRsZSIsImV4aXQiLCJvblN0YWdlU3RhcnQiLCJuYW1lIiwiZGlzcGxheU5hbWUiLCJvblN0YWdlRW5kIiwib25Sb3VuZEVuZCIsIm9uR2FtZUVuZCIsIm9uU2V0IiwidGFyZ2V0IiwidGFyZ2V0VHlwZSIsImtleSIsInZhbHVlIiwicHJldlZhbHVlIiwiYWxsU3VibWl0dGVkIiwibnVtUGxheWVyc1N1Ym1pdHRlZCIsImNvbXB1dGVTY29yZSIsInN1Ym1pdCIsInN1Y2Nlc3MiLCJwbGF5ZXJBbnN3ZXJzIiwiYWxsQW5zd2Vyc0VxdWFsIiwiYXJyIiwiZXZlcnkiLCJzdWJtaXNzaW9uIiwicHJldlNjb3JlIiwiZXhwb3J0IiwidGVzdFRhbmdyYW1zIiwiYWxsU3ltYm9scyIsIl9pZCIsInRhc2tOYW1lIiwic3ltYm9scyIsImFuc3dlciIsImdldE5laWdoYm9ycyIsInN0cnVjdHVyZSIsIm5laWdoYm9ycyIsInNwbGl0IiwicGxheWVySW5kZXgiLCJuIiwiY29ubmVjdGlvbiIsInJlcGxhY2UiLCJTZXQiLCJhY3RpdmVOb2RlcyIsImFsbE5vZGVzIiwibmV3TmVpZ2hib3JzIiwiaWQiLCJ0ZXN0U3ltYm9scyIsImdhbWVJbml0IiwicGxheWVyQ291bnQiLCJuZXR3b3JrU3RydWN0dXJlIiwibnVtVGFza1JvdW5kcyIsIm51bVN1cnZleVJvdW5kcyIsInNldFNpemVCYXNlZE9uUGxheWVyQ291bnQiLCJ1c2VySW5hY3Rpdml0eUR1cmF0aW9uIiwidGFza0R1cmF0aW9uIiwiZGVmYXVsdFNldFNpemUiLCJzdXJ2ZXlEdXJhdGlvbiIsInJlc3VsdHNEdXJhdGlvbiIsIm1heE51bU92ZXJsYXAiLCJzeW1ib2xTZXQiLCJzZXRTaXplIiwibnVtUm91bmRzQmVmb3JlU3VydmV5IiwiY29sb3JzIiwic3VydmV5TnVtIiwic2h1ZmZsZSIsImkiLCJfIiwidGltZXMiLCJhZGRSb3VuZCIsInRhc2tTdGFnZSIsImFkZFN0YWdlIiwiZHVyYXRpb25JblNlY29uZHMiLCJnZXRTeW1ib2xzRm9yUGxheWVycyIsInJlc3VsdFN0YWdlIiwic3VydmV5Um91bmQiLCJzdXJ2ZXlTdGFnZXMiLCJzeW1ib2xzV2l0aG91dEFuc3dlciIsInN5bWJvbCIsIm51bVBsYXllcnMiLCJudW1PdmVybGFwIiwic3ltYm9sRnJlcSIsImhhc093blByb3BlcnR5Iiwic3ltYm9sc1BpY2tlZCIsInN5bWJvbFRvUmVtb3ZlIiwiaiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxRQUFKO0FBQWFDLE1BQU0sQ0FBQ0Ms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Qy9ELE1BQVYsR0FBa0IsQ0FBM0IsRUFBK0JxRSxDQUFDLEdBQUcsQ0FBbkMsRUFBc0NBLENBQUMsRUFBdkMsRUFBMkM7QUFDekMsWUFBTW1CLENBQUMsR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsTUFBTCxNQUFpQnRCLENBQUMsR0FBRyxDQUFyQixDQUFYLENBQVY7QUFFQSxPQUFDTixTQUFTLENBQUNNLENBQUQsQ0FBVixFQUFlTixTQUFTLENBQUN5QixDQUFELENBQXhCLElBQStCLENBQUN6QixTQUFTLENBQUN5QixDQUFELENBQVYsRUFBZXpCLFNBQVMsQ0FBQ00sQ0FBRCxDQUF4QixDQUEvQjtBQUNEOztBQUNELFdBQU9OLFNBQVA7QUFDRDtBQUVGLENBcEpELEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcblxuLy8gVGhpcyBpcyB3aGVyZSB5b3UgYWRkIGJvdHMsIGxpa2UgQm9iOlxuXG5FbXBpcmljYS5ib3QoXCJib2JcIiwge1xuICAvLyAvLyBOT1QgU1VQUE9SVEVEIENhbGxlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGVhY2ggc3RhZ2UgKGFmdGVyIG9uUm91bmRTdGFydC9vblN0YWdlU3RhcnQpXG4gIC8vIG9uU3RhZ2VTdGFydChib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycykge30sXG5cbiAgLy8gQ2FsbGVkIGR1cmluZyBlYWNoIHN0YWdlIGF0IHRpY2sgaW50ZXJ2YWwgKH4xcyBhdCB0aGUgbW9tZW50KVxuICBvblN0YWdlVGljayhib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgc2Vjb25kc1JlbWFpbmluZykge31cblxuICAvLyAvLyBOT1QgU1VQUE9SVEVEIEEgcGxheWVyIGhhcyBjaGFuZ2VkIGEgdmFsdWVcbiAgLy8gLy8gVGhpcyBtaWdodCBoYXBwZW4gYSBsb3QhXG4gIC8vIG9uU3RhZ2VQbGF5ZXJDaGFuZ2UoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMsIHBsYXllcikge31cblxuICAvLyAvLyBOT1QgU1VQUE9SVEVEIENhbGxlZCBhdCB0aGUgZW5kIG9mIHRoZSBzdGFnZSAoYWZ0ZXIgaXQgZmluaXNoZWQsIGJlZm9yZSBvblN0YWdlRW5kL29uUm91bmRFbmQgaXMgY2FsbGVkKVxuICAvLyBvblN0YWdlRW5kKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzKSB7fVxufSk7XG4iLCJpbXBvcnQgRW1waXJpY2EgZnJvbSBcIm1ldGVvci9lbXBpcmljYTpjb3JlXCI7XG5cbmltcG9ydCB7IGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIgfSBmcm9tIFwiLi91dGlsXCI7XG5pbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcbmltcG9ydCB7IFRpbWVTeW5jIH0gZnJvbSBcIm1ldGVvci9taXp6YW86dGltZXN5bmNcIjtcblxuXG5cbi8vIG9uR2FtZVN0YXJ0IGlzIHRyaWdnZXJlZCBvcG5jZSBwZXIgZ2FtZSBiZWZvcmUgdGhlIGdhbWUgc3RhcnRzLCBhbmQgYmVmb3JlXG4vLyB0aGUgZmlyc3Qgb25Sb3VuZFN0YXJ0LiBJdCByZWNlaXZlcyB0aGUgZ2FtZSBhbmQgbGlzdCBvZiBhbGwgdGhlIHBsYXllcnMgaW5cbi8vIHRoZSBnYW1lLlxuRW1waXJpY2Eub25HYW1lU3RhcnQoZ2FtZSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiR2FtZSBzdGFydGVkXCIpO1xuICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgcGxheWVyLnNldChcImluYWN0aXZlXCIsIGZhbHNlKTtcbiAgICBwbGF5ZXIuc2V0KFwibGFzdEFjdGl2ZVwiLCBwbGF5ZXIubGFzdEFjdGl2aXR5QXQpO1xuICAgIGNvbnN0IG5ldHdvcmsgPSBwbGF5ZXIuZ2V0KFwibmVpZ2hib3JzXCIpO1xuICAgIGNvbnN0IGFjdGl2ZUNoYXRzID0gW107XG4gICAgbmV0d29yay5tYXAob3RoZXJOb2RlSWQgPT4ge1xuICAgICAgdmFyIHBhaXJPZlBsYXllcnMgPSBbcGxheWVyLmdldChcIm5vZGVJZFwiKSwgcGFyc2VJbnQob3RoZXJOb2RlSWQpXTtcbiAgICAgIHBhaXJPZlBsYXllcnMuc29ydCgocDEscDIpID0+IHAxIC0gcDIpO1xuICAgICAgY29uc3Qgb3RoZXJQbGF5ZXIgPSBnYW1lLnBsYXllcnMuZmluZChwID0+IHAuZ2V0KFwibm9kZUlkXCIpID09PSBwYXJzZUludChvdGhlck5vZGVJZCkpO1xuICAgICAgLy8gY29uc3Qgb3RoZXJQbGF5ZXJJZCA9IG90aGVyUGxheWVyLmlkO1xuICAgICAgY29uc3QgY2hhdEtleSA9IGAke3BhaXJPZlBsYXllcnNbMF19LSR7cGFpck9mUGxheWVyc1sxXX1gO1xuICAgICAgYWN0aXZlQ2hhdHMucHVzaChjaGF0S2V5KTtcbiAgICB9KTtcbiAgICAvLyBEZWZhdWx0IGFsbCBjaGF0cyB0byBiZSBvcGVuIHdoZW4gZ2FtZSBzdGFydHNcbiAgICBwbGF5ZXIuc2V0KFwiYWN0aXZlQ2hhdHNcIiwgYWN0aXZlQ2hhdHMpO1xuICAgIGNvbnNvbGUubG9nKHBsYXllci5nZXQoXCJhY3RpdmVDaGF0c1wiKSk7XG4gIH0pO1xuICBnYW1lLnNldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiLCBnYW1lLnBsYXllcnMubGVuZ3RoKTtcbn0pO1xuXG4vLyBvblJvdW5kU3RhcnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSBlYWNoIHJvdW5kIHN0YXJ0cywgYW5kIGJlZm9yZSBvblN0YWdlU3RhcnQuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZVN0YXJ0LCBhbmQgdGhlIHJvdW5kIHRoYXQgaXMgc3RhcnRpbmcuXG5FbXBpcmljYS5vblJvdW5kU3RhcnQoKGdhbWUsIHJvdW5kKSA9PiB7XG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwic3VibWl0dGVkXCIsIGZhbHNlKTtcbiAgICBwbGF5ZXIuc2V0KFwic3ltYm9sU2VsZWN0ZWRcIiwgXCJcIik7XG4gIH0pO1xuICByb3VuZC5zZXQoXCJyZXN1bHRcIiwgZmFsc2UpO1xuICByb3VuZC5zZXQoXCJudW1QbGF5ZXJzU3VibWl0dGVkXCIsIDApO1xuICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cbiAgaWYgKGFjdGl2ZVBsYXllcnMubGVuZ3RoIDwgZ2FtZS5nZXQoXCJwcmV2aW91c051bUFjdGl2ZVBsYXllcnNcIikgKSB7IC8vIFNvbWVvbmUgbGVmdCBpbiB0aGUgbWlkZGxlIG9mIHRoZSByb3VuZFxuICAgIGlmIChnYW1lLnRyZWF0bWVudC5lbmRHYW1lSWZQbGF5ZXJJZGxlKSB7XG4gICAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgcC5leGl0KFwic29tZW9uZUluYWN0aXZlXCIpO1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTsgLy8gVXBkYXRlcyB0aGUgbmVpZ2hib3JzIHRvIGJlIGZ1bGx5IGNvbm5lY3RlZFxuICAgICAgZ2FtZS5zZXQoXCJjaGVja0ZvclNpbWlsYXJTeW1ib2xcIiwgdHJ1ZSk7XG4gICAgfVxuICBcbiAgfVxuICBnYW1lLnNldChcInByZXZpb3VzTnVtQWN0aXZlUGxheWVyc1wiLCBhY3RpdmVQbGF5ZXJzLmxlbmd0aCk7XG5cbiAgY29uc29sZS5sb2coXCJSb3VuZCBTdGFydGVkXCIpO1xuXG59KTtcblxuLy8gb25TdGFnZVN0YXJ0IGlzIHRyaWdnZXJlZCBiZWZvcmUgZWFjaCBzdGFnZSBzdGFydHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uUm91bmRTdGFydCwgYW5kIHRoZSBzdGFnZSB0aGF0IGlzIHN0YXJ0aW5nLlxuRW1waXJpY2Eub25TdGFnZVN0YXJ0KChnYW1lLCByb3VuZCwgc3RhZ2UpID0+IHtcbiAgY29uc29sZS5sb2coXCJTdGFnZSBTdGFydGVkXCIpXG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICBpZiAoc3RhZ2UubmFtZSA9PT0gXCJUYXNrXCIpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgY29uc29sZS5sb2coIGBTeW1ib2xzIDogJHtwbGF5ZXIuZ2V0KGAke3N0YWdlLmRpc3BsYXlOYW1lfWApfWApO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKGBBbnN3ZXI6ICR7c3RhZ2UuZ2V0KFwiYW5zd2VyXCIpfWApO1xuICB9XG4gIGlmIChzdGFnZS5uYW1lID09PSBcIlN1cnZleVwiKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgIHBsYXllci5zZXQoXCJzdXJ2ZXlOdW1iZXJcIiAsIDEpXG4gICAgfSk7XG4gIH1cbiAgLy8gZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgIHBsYXllci5zZXQoXCJzdWJtaXR0ZWRcIiwgZmFsc2UpO1xuICAvLyB9KTtcbiAgLy8gc3RhZ2Uuc2V0KFwic2hvd1Jlc3VsdHNcIiwgZmFsc2UpO1xuICAvLyBzdGFnZS5zZXQoXCJyZXN1bHRzU2hvd25cIiwgZmFsc2UpO1xuXG59KTtcblxuLy8gb25TdGFnZUVuZCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgZWFjaCBzdGFnZS5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25Sb3VuZEVuZCwgYW5kIHRoZSBzdGFnZSB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblN0YWdlRW5kKChnYW1lLCByb3VuZCwgc3RhZ2UpID0+e1xuICBjb25zb2xlLmxvZyhcIlN0YWdlIEVuZGVkXCIpXG4gIFxufSk7XG5cbi8vIG9uUm91bmRFbmQgaXMgdHJpZ2dlcmVkIGFmdGVyIGVhY2ggcm91bmQuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZUVuZCwgYW5kIHRoZSByb3VuZCB0aGF0IGp1c3QgZW5kZWQuXG5FbXBpcmljYS5vblJvdW5kRW5kKChnYW1lLCByb3VuZCkgPT4ge1xuICAvLyBnYW1lLnBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAvLyAgIGNvbnN0IHZhbHVlID0gcGxheWVyLnJvdW5kLmdldChcInZhbHVlXCIpIHx8IDA7XG4gIC8vICAgY29uc3QgcHJldlNjb3JlID0gcGxheWVyLmdldChcInNjb3JlXCIpIHx8IDA7XG4gIC8vICAgcGxheWVyLnNldChcInNjb3JlXCIsIHByZXZTY29yZSArIHZhbHVlKTtcbiAgLy8gfSk7XG5cbn0pO1xuXG4vLyBvbkdhbWVFbmQgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGdhbWUgZW5kcy5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lU3RhcnQuXG5FbXBpcmljYS5vbkdhbWVFbmQoZ2FtZSA9PiB7fSk7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT4gb25TZXQsIG9uQXBwZW5kIGFuZCBvbkNoYW5nZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBvblNldCwgb25BcHBlbmQgYW5kIG9uQ2hhbmdlIGFyZSBjYWxsZWQgb24gZXZlcnkgc2luZ2xlIHVwZGF0ZSBtYWRlIGJ5IGFsbFxuLy8gcGxheWVycyBpbiBlYWNoIGdhbWUsIHNvIHRoZXkgY2FuIHJhcGlkbHkgYmVjb21lIHF1aXRlIGV4cGVuc2l2ZSBhbmQgaGF2ZVxuLy8gdGhlIHBvdGVudGlhbCB0byBzbG93IGRvd24gdGhlIGFwcC4gVXNlIHdpc2VseS5cbi8vXG4vLyBJdCBpcyB2ZXJ5IHVzZWZ1bCB0byBiZSBhYmxlIHRvIHJlYWN0IHRvIGVhY2ggdXBkYXRlIGEgdXNlciBtYWtlcy4gVHJ5XG4vLyBub250aGVsZXNzIHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgY29tcHV0YXRpb25zIGFuZCBkYXRhYmFzZSBzYXZlcyAoLnNldClcbi8vIGRvbmUgaW4gdGhlc2UgY2FsbGJhY2tzLiBZb3UgY2FuIGFsc28gdHJ5IHRvIGxpbWl0IHRoZSBhbW91bnQgb2YgY2FsbHMgdG9cbi8vIHNldCgpIGFuZCBhcHBlbmQoKSB5b3UgbWFrZSAoYXZvaWQgY2FsbGluZyB0aGVtIG9uIGEgY29udGludW91cyBkcmFnIG9mIGFcbi8vIHNsaWRlciBmb3IgZXhhbXBsZSkgYW5kIGluc2lkZSB0aGVzZSBjYWxsYmFja3MgdXNlIHRoZSBga2V5YCBhcmd1bWVudCBhdCB0aGVcbi8vIHZlcnkgYmVnaW5uaW5nIG9mIHRoZSBjYWxsYmFjayB0byBmaWx0ZXIgb3V0IHdoaWNoIGtleXMgeW91ciBuZWVkIHRvIHJ1blxuLy8gbG9naWMgYWdhaW5zdC5cbi8vXG4vLyBJZiB5b3UgYXJlIG5vdCB1c2luZyB0aGVzZSBjYWxsYmFja3MsIGNvbW1lbnQgdGhlbSBvdXQgc28gdGhlIHN5c3RlbSBkb2VzXG4vLyBub3QgY2FsbCB0aGVtIGZvciBub3RoaW5nLlxuXG4vLyAvLyBvblNldCBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIC5zZXQoKSBtZXRob2Rcbi8vIC8vIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uU2V0KChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbi8vICkgPT4ge1xuLy8gICAvLyAvLyBFeGFtcGxlIGZpbHRlcmluZ1xuLy8gICAvLyBpZiAoa2V5ICE9PSBcInZhbHVlXCIpIHtcbi8vICAgLy8gICByZXR1cm47XG4vLyAgIC8vIH1cbi8vIH0pO1xuXG5FbXBpcmljYS5vblNldCgoXG4gIGdhbWUsXG4gIHJvdW5kLFxuICBzdGFnZSxcbiAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbiAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4gIHZhbHVlLCAvLyBOZXcgdmFsdWVcbiAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4pID0+IHtcbiAgY29uc3QgcGxheWVycyA9IGdhbWUucGxheWVycztcbiAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG4gIC8vIFNvbWUgcGxheWVyIGRlY2lkZXMgdG8gcmVjb25zaWRlciB0aGVpciBhbnN3ZXJcbiAgY29uc29sZS5sb2coXCJrZXlcIiwga2V5KTtcbiAgaWYgKGtleSA9PT0gXCJzdWJtaXR0ZWRcIikgeyBcbiAgICAvLyBDaGVja3MgaWYgZXZlcnlvbmUgaGFzIHN1Ym1pdHRlZCB0aGVpciBhbnN3ZXIgYW5kIGlmIHNvLCBzdWJtaXQgdGhlIHN0YWdlXG4gICAgbGV0IGFsbFN1Ym1pdHRlZCA9IHRydWU7XG4gICAgbGV0IG51bVBsYXllcnNTdWJtaXR0ZWQgPSAwO1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBpZiAocGxheWVyLmdldChcInN1Ym1pdHRlZFwiKSkge1xuICAgICAgICBudW1QbGF5ZXJzU3VibWl0dGVkICs9IDE7XG4gICAgICB9XG4gICAgICBhbGxTdWJtaXR0ZWQgPSBwbGF5ZXIuZ2V0KFwic3VibWl0dGVkXCIpICYmIGFsbFN1Ym1pdHRlZDtcbiAgICB9KVxuICAgIHJvdW5kLnNldChcIm51bVBsYXllcnNTdWJtaXR0ZWRcIiwgbnVtUGxheWVyc1N1Ym1pdHRlZCk7XG4gICAgaWYgKGFsbFN1Ym1pdHRlZCkge1xuICAgICAgY29uc3QgbG9nID0gc3RhZ2UuZ2V0KFwibG9nXCIpO1xuICAgICAgY29tcHV0ZVNjb3JlKGFjdGl2ZVBsYXllcnMsIGdhbWUsIHN0YWdlLCByb3VuZCk7XG4gICAgICAvLyBOZWVkIHRvIHN1Ym1pdCBmb3Igc3VibWl0IHRoZSBzdGFnZSBmb3IgZXZlcnkgcGxheWVyXG4gICAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgICAgIH0pXG4gICAgfVxuICAvLyAgIGlmIChzdGFnZS5nZXQoXCJyZXN1bHRzU2hvd25cIikpIHtcbiAgLy8gICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgLy8gICAgIH0pXG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gaWYgKHRhcmdldFR5cGUgPT09IFwic3RhZ2VcIiAmJiBrZXkgPT09IFwicmVzdWx0c1Nob3duXCIpIHtcbiAgLy8gICBpZiAoc3RhZ2UuZ2V0KFwicmVzdWx0c1Nob3duXCIpKSB7XG4gIC8vICAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAvLyAgICAgICBwbGF5ZXIuc3RhZ2Uuc3VibWl0KCk7XG4gIC8vICAgICB9KVxuICAvLyAgIH1cbiAgfVxuXG4gIC8vIGVsc2UgaWYgKGtleSA9PT0gXCJpbmFjdGl2ZVwiKSB7XG4gICAgLy8gZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgLy8gfVxuXG4gIHJldHVybjtcblxufSk7XG5cbmZ1bmN0aW9uIGNvbXB1dGVTY29yZShhY3RpdmVQbGF5ZXJzLCBnYW1lLCBzdGFnZSwgcm91bmQpIHtcbiAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuICBjb25zb2xlLmxvZyhcIkNPUlJFQ1QgQU5TV0VSOlwiKVxuICBjb25zb2xlLmxvZyhzdGFnZS5nZXQoXCJhbnN3ZXJcIikpO1xuICBjb25zb2xlLmxvZyhcIlBsYXllcnMgZ3Vlc3NlZDpcIilcblxuICBsZXQgcGxheWVyQW5zd2VycyA9IFtdO1xuICBjb25zdCBhbGxBbnN3ZXJzRXF1YWwgPSBhcnIgPT4gYXJyLmV2ZXJ5KCB2ID0+IHYgPT09IGFyclswXSApIC8vRnVuYyB0byBjaGVjayBpZiBhbGwgcGxheWVyIGFuc3dlcnMgYXJlIGVxdWFsXG5cbiAgYWN0aXZlUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgY29uc3Qgc3VibWlzc2lvbiA9IHBsYXllci5nZXQoXCJzeW1ib2xTZWxlY3RlZFwiKTtcbiAgICBjb25zb2xlLmxvZyhzdWJtaXNzaW9uKTtcbiAgICBpZiAoZ2FtZS5nZXQoXCJjaGVja0ZvclNpbWlsYXJTeW1ib2xcIikpIHtcbiAgICAgIHBsYXllckFuc3dlcnMucHVzaChzdWJtaXNzaW9uKTtcbiAgICB9XG4gICAgaWYgKHN1Ym1pc3Npb24gIT09IHN0YWdlLmdldChcImFuc3dlclwiKSkge1xuICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgIH1cbiAgfSlcblxuICBpZiAoZ2FtZS5nZXQoXCJjaGVja0ZvclNpbWlsYXJTeW1ib2xcIikpIHtcbiAgICBpZiAoYWxsQW5zd2Vyc0VxdWFsKHBsYXllckFuc3dlcnMpKSB7XG4gICAgICBzdWNjZXNzID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByb3VuZC5zZXQoXCJyZXN1bHRcIiwgc3VjY2Vzcyk7XG4gIGlmIChzdWNjZXNzKSB7XG4gICAgYWN0aXZlUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICBjb25zdCBwcmV2U2NvcmUgPSBwbGF5ZXIuZ2V0KFwic2NvcmVcIikgfHwgMDtcbiAgICAgIHBsYXllci5zZXQoXCJzY29yZVwiLCBwcmV2U2NvcmUgKyAxKTtcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKFwiIEFsbCBwbGF5ZXJzIGdvdCBpdCBjb3JyZWN0bHlcIik7XG4gIH0gXG59XG5cbi8vIC8vIG9uQXBwZW5kIGlzIGNhbGxlZCB3aGVuIHRoZSBleHBlcmltZW50IGNvZGUgY2FsbCB0aGUgYC5hcHBlbmQoKWAgbWV0aG9kXG4vLyAvLyBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvciBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vbkFwcGVuZCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4vLyApID0+IHtcbi8vICAgLy8gTm90ZTogYHZhbHVlYCBpcyB0aGUgc2luZ2xlIGxhc3QgdmFsdWUgKGUuZyAwLjIpLCB3aGlsZSBgcHJldlZhbHVlYCB3aWxsXG4vLyAgIC8vICAgICAgIGJlIGFuIGFycmF5IG9mIHRoZSBwcmV2aXNvdXMgdmFsdWVkIChlLmcuIFswLjMsIDAuNCwgMC42NV0pLlxuLy8gfSk7XG5cblxuLy8gLy8gb25DaGFuZ2UgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSBgLnNldCgpYCBvciB0aGVcbi8vIC8vIGAuYXBwZW5kKClgIG1ldGhvZCBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvclxuLy8gLy8gcGxheWVyU3RhZ2VzLlxuLy8gRW1waXJpY2Eub25DaGFuZ2UoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2Vcbi8vICAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4vLyAgIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbi8vICAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuLy8gICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4vLyAgIHByZXZWYWx1ZSwgLy8gUHJldmlvdXMgdmFsdWVcbi8vICAgaXNBcHBlbmQgLy8gVHJ1ZSBpZiB0aGUgY2hhbmdlIHdhcyBhbiBhcHBlbmQsIGZhbHNlIGlmIGl0IHdhcyBhIHNldFxuLy8gKSA9PiB7XG4vLyAgIC8vIGBvbkNoYW5nZWAgaXMgdXNlZnVsIHRvIHJ1biBzZXJ2ZXItc2lkZSBsb2dpYyBmb3IgYW55IHVzZXIgaW50ZXJhY3Rpb24uXG4vLyAgIC8vIE5vdGUgdGhlIGV4dHJhIGlzQXBwZW5kIGJvb2xlYW4gdGhhdCB3aWxsIGFsbG93IHRvIGRpZmZlcmVuY2lhdGUgc2V0cyBhbmRcbi8vICAgLy8gYXBwZW5kcy5cbi8vICAgIEdhbWUuc2V0KFwibGFzdENoYW5nZUF0XCIsIG5ldyBEYXRlKCkudG9TdHJpbmcoKSlcbi8vIH0pO1xuXG4vLyAvLyBvblN1Ym1pdCBpcyBjYWxsZWQgd2hlbiB0aGUgcGxheWVyIHN1Ym1pdHMgYSBzdGFnZS5cbi8vIEVtcGlyaWNhLm9uU3VibWl0KChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIgLy8gUGxheWVyIHdobyBzdWJtaXR0ZWRcbi8vICkgPT4ge1xuLy8gfSk7XG4iLCJjb25zdCBhbGxTeW1ib2xzID0gW1widDFcIiwgXCJ0MlwiLCBcInQzXCIsIFwidDRcIiwgXCJ0NVwiLCBcInQ2XCIsIFwidDdcIixcInQ4XCIsXCJ0OVwiLFwidDEwXCIsXCJ0MTFcIixcInQxMlwiXTtcblxuLy8gbiA9IG51bWJlciBvZiBwZW9wbGUgLCBwID0gbnVtYmVyIG9mIHN5bWJvbHNcbi8vIChuLTEpKnAgKyAxXG4vLyBpLmUuIG4gPSAzLCBwID0gMyA6IDdcblxuZXhwb3J0IGNvbnN0IHRlc3RUYW5ncmFtcyA9IFtcbiAge1xuICAgIF9pZDogXCIwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAyXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAzXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDNcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIzXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDRcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI0XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA1XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDVcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI1XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA2XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDZcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI2XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA3XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDdcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI3XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA4XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDhcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI4XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA5XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDlcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI5XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMFwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMVwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMVwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjExXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMlwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxMlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxM1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgYW5zd2VyOiBcInQxXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTNcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDE0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxNFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTVcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIGFuc3dlcjogXCJ0M1wiLFxuICB9LFxuXG5dO1xuXG5cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXROZWlnaGJvcnMoc3RydWN0dXJlLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBsZXQgbmV0d29yayA9IHN0cnVjdHVyZS5zcGxpdChcIixcIik7XG4gICAgY29uc3QgcGxheWVySW5kZXggPSBwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpO1xuXG4gICAgbmV0d29yay5mb3JFYWNoKChuKSA9PiB7XG4gICAgICBjb25zdCBjb25uZWN0aW9uID0gbi5zcGxpdChcIi1cIik7XG5cbiAgICAgIGlmIChwbGF5ZXJJbmRleCA9PT0gcGFyc2VJbnQoY29ubmVjdGlvblswXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goY29ubmVjdGlvblsxXS5yZXBsYWNlKC9cXHMvZywgJycpKTtcbiAgICAgIH0gZWxzZSBpZiAocGxheWVySW5kZXggPT09IHBhcnNlSW50KGNvbm5lY3Rpb25bMV0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGNvbm5lY3Rpb25bMF0ucmVwbGFjZSgvXFxzL2csICcnKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIHJldHVybiBbLi4uIG5ldyBTZXQobmVpZ2hib3JzKV07XG4gIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSkge1xuICAgIGNvbnN0IGFjdGl2ZU5vZGVzID0gW107XG4gICAgY29uc3QgYWxsTm9kZXMgPSBbXTtcbiAgICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuXG4gICAgLy8gYWN0aXZlUGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgLy8gICBhY3RpdmVOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgIC8vIH0pXG5cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgLy8gaWYgKHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0dmVcIikpIHtcbiAgICAgIGlmICghcC5nZXQoXCJpbmFjdHZlXCIpKSB7XG5cbiAgICAgICAgYWN0aXZlTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICAgIH1cbiAgICAgIGFsbE5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgfSlcblxuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAvLyBPbmx5IHNob3cgYWN0aXZlIHBlb3BsZVxuICAgICAgLy8gY29uc3QgbmV3TmVpZ2hib3JzID0gYWN0aXZlTm9kZXMuZmlsdGVyKGlkID0+IHBhcnNlSW50KGlkKSAhPT0gcC5nZXQoXCJub2RlSWRcIikpXG4gICAgICAvLyBwLnNldChcIm5laWdoYm9yc1wiLCBuZXdOZWlnaGJvcnMpO1xuXG4gICAgICAvLyBTaG93IGV2ZXJ5b25lLCBtYXJrIG9mZmxpbmUgcGVvcGxlIGFzIG9mZmxpbmVcbiAgICAgIGNvbnN0IG5ld05laWdoYm9ycyA9IGFsbE5vZGVzLmZpbHRlcihpZCA9PiBwYXJzZUludChpZCkgIT09IHAuZ2V0KFwibm9kZUlkXCIpKVxuICAgICAgcC5zZXQoXCJuZWlnaGJvcnNcIiwgbmV3TmVpZ2hib3JzKTtcbiAgICB9KVxufSIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcbmltcG9ydCBcIi4vYm90cy5qc1wiO1xuaW1wb3J0IFwiLi9jYWxsYmFja3MuanNcIjtcblxuaW1wb3J0IHsgdGVzdFN5bWJvbHMsIHRlc3RUYW5ncmFtcyB9IGZyb20gXCIuL2NvbnN0YW50c1wiOyBcbmltcG9ydCB7IGdldE5laWdoYm9ycywgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcblxuLy8gZ2FtZUluaXQgaXMgd2hlcmUgdGhlIHN0cnVjdHVyZSBvZiBhIGdhbWUgaXMgZGVmaW5lZC5cbi8vIEp1c3QgYmVmb3JlIGV2ZXJ5IGdhbWUgc3RhcnRzLCBvbmNlIGFsbCB0aGUgcGxheWVycyBuZWVkZWQgYXJlIHJlYWR5LCB0aGlzXG4vLyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgdHJlYXRtZW50IGFuZCB0aGUgbGlzdCBvZiBwbGF5ZXJzLlxuLy8gWW91IG11c3QgdGhlbiBhZGQgcm91bmRzIGFuZCBzdGFnZXMgdG8gdGhlIGdhbWUsIGRlcGVuZGluZyBvbiB0aGUgdHJlYXRtZW50XG4vLyBhbmQgdGhlIHBsYXllcnMuIFlvdSBjYW4gYWxzbyBnZXQvc2V0IGluaXRpYWwgdmFsdWVzIG9uIHlvdXIgZ2FtZSwgcGxheWVycyxcbi8vIHJvdW5kcyBhbmQgc3RhZ2VzICh3aXRoIGdldC9zZXQgbWV0aG9kcyksIHRoYXQgd2lsbCBiZSBhYmxlIHRvIHVzZSBsYXRlciBpblxuLy8gdGhlIGdhbWUuXG5FbXBpcmljYS5nYW1lSW5pdChnYW1lID0+IHtcbiAgY29uc3Qge1xuICAgIHRyZWF0bWVudDoge1xuICAgICAgcGxheWVyQ291bnQsXG4gICAgICBuZXR3b3JrU3RydWN0dXJlLFxuICAgICAgbnVtVGFza1JvdW5kcyxcbiAgICAgIG51bVN1cnZleVJvdW5kcyxcbiAgICAgIHNldFNpemVCYXNlZE9uUGxheWVyQ291bnQsXG4gICAgICB1c2VySW5hY3Rpdml0eUR1cmF0aW9uLFxuICAgICAgdGFza0R1cmF0aW9uLFxuICAgICAgZGVmYXVsdFNldFNpemUsXG4gICAgICBzdXJ2ZXlEdXJhdGlvbixcbiAgICAgIHJlc3VsdHNEdXJhdGlvbixcbiAgICAgIG1heE51bU92ZXJsYXAsXG4gICAgfSxcbiAgfSA9IGdhbWU7XG5cblxuICBjb25zdCBzeW1ib2xTZXQgPSB0ZXN0VGFuZ3JhbXM7XG4gIGNvbnN0IHNldFNpemUgPSBzZXRTaXplQmFzZWRPblBsYXllckNvdW50ID8gcGxheWVyQ291bnQgKyAxIDogZGVmYXVsdFNldFNpemU7IC8vVE9ETzogY2FuIGNoYW5nZSBkZWZhdWx0IHZhbHVlIGluIHNldHRpbmdzXG4gIGNvbnN0IG51bVJvdW5kc0JlZm9yZVN1cnZleSA9IG51bVRhc2tSb3VuZHMvbnVtU3VydmV5Um91bmRzO1xuXG4gIGxldCBjb2xvcnMgPSBbXCJHcmVlblwiLCBcIlJlZFwiLCBcIlllbGxvd1wiLCBcIkJsdWVcIiwgXCJQdXJwbGVcIiwgXCJXaGl0ZVwiLCBcIkJsYWNrXCJdXG4gIGxldCBzdXJ2ZXlOdW0gPSAxXG4gIGNvbG9ycyA9IHNodWZmbGUoY29sb3JzKTtcblxuICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyLCBpKSA9PiB7XG4gICAgcGxheWVyLnNldChcImF2YXRhclwiLCBgL2F2YXRhcnMvamRlbnRpY29uLyR7cGxheWVyLl9pZH1gKTtcbiAgICBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMCk7XG5cbiAgICAvLyBHaXZlIGVhY2ggcGxheWVyIGEgbm9kZUlkIGJhc2VkIG9uIHRoZWlyIHBvc2l0aW9uIChpbmRleGVkIGF0IDEpXG4gICAgcGxheWVyLnNldChcIm5vZGVJZFwiLCBpICsgMSk7XG4gICAgcGxheWVyLnNldChcIm5hbWVcIiwgcGxheWVyLmlkKTtcbiAgICBwbGF5ZXIuc2V0KFwiYW5vbnltb3VzTmFtZVwiLCBjb2xvcnNbaV0pXG4gIH0pO1xuXG5cbiAgaWYgKGdhbWUucGxheWVycy5sZW5ndGggPCBnYW1lLnRyZWF0bWVudC5wbGF5ZXJDb3VudCkgeyAvLyBpZiBub3QgYSBmdWxsIGdhbWUsIGRlZmF1bHQgdG8gZnVsbHkgY29ubmVjdGVkIGxheWVyXG4gICAgZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgY29uc29sZS5sb2cocC5nZXQoXCJuZWlnaGJvcnNcIikpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBwLnNldChcIm5laWdoYm9yc1wiLCBnZXROZWlnaGJvcnMobmV0d29ya1N0cnVjdHVyZSwgcCkpO1xuICAgICAgY29uc29sZS5sb2cocC5nZXQoXCJuZWlnaGJvcnNcIikpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRm9yIGVhY2ggcm91bmQsIGFkZCBhbGwgdGhlIHN5bWJvbHMsIHJhbmRvbWx5IHNlbGVjdCBhIGNvcnJlY3QgYW5zd2VyIGFuZFxuICAvLyBDb25zdHJhaW50czogTXVzdCBlbnN1cmUgdGhhdCBldmVyeW9uZSBoYXMgb25seSBvbmUgc3ltYm9sIGluIGNvbW1vblxuICBfLnRpbWVzKCBudW1UYXNrUm91bmRzLCBpID0+IHtcbiAgICBjb25zdCByb3VuZCA9IGdhbWUuYWRkUm91bmQoKTtcblxuICAgIGNvbnN0IHtzeW1ib2xzLCB0YXNrTmFtZSwgYW5zd2VyfSA9IHN5bWJvbFNldFtpXTtcblxuICAgIGNvbnN0IHRhc2tTdGFnZSA9IHJvdW5kLmFkZFN0YWdlKHtcbiAgICAgIG5hbWU6IFwiVGFza1wiLFxuICAgICAgZGlzcGxheU5hbWU6IHRhc2tOYW1lLFxuICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICBkdXJhdGlvbkluU2Vjb25kczogdGFza0R1cmF0aW9uXG4gICAgfSk7XG4gICAgdGFza1N0YWdlLnNldChcInRhc2tcIiwgc3ltYm9sU2V0W2ldKTtcbiAgICBnZXRTeW1ib2xzRm9yUGxheWVycyhzeW1ib2xzLCBhbnN3ZXIsIHNldFNpemUsIHRhc2tOYW1lLCBnYW1lLCBtYXhOdW1PdmVybGFwKVxuICAgIHRhc2tTdGFnZS5zZXQoXCJhbnN3ZXJcIiwgc3ltYm9sU2V0W2ldLmFuc3dlcilcblxuICAgIGNvbnN0IHJlc3VsdFN0YWdlID0gcm91bmQuYWRkU3RhZ2Uoe1xuICAgICAgbmFtZTogXCJSZXN1bHRcIixcbiAgICAgIGRpc3BsYXlOYW1lOiBcIlJlc3VsdFwiLFxuICAgICAgZHVyYXRpb25JblNlY29uZHM6IHJlc3VsdHNEdXJhdGlvblxuICAgIH0pO1xuICAgIFxuICAgIGlmICgoaSsxKSAlIG51bVJvdW5kc0JlZm9yZVN1cnZleSA9PT0gMCkgeyAvLyBBZnRlciA1IHRhc2sgcm91bmRzLCBhZGQgYSBzdXJ2ZXkgcm91bmRcbiAgICAgIGNvbnN0IHN1cnZleVJvdW5kID0gZ2FtZS5hZGRSb3VuZCgpO1xuXG4gICAgICBjb25zdCBzdXJ2ZXlTdGFnZXMgPSBzdXJ2ZXlSb3VuZC5hZGRTdGFnZSh7XG4gICAgICAgIG5hbWU6IFwiU3VydmV5XCIsXG4gICAgICAgIGRpc3BsYXlOYW1lOiBcIlN1cnZleSBcIiArIHN1cnZleU51bSxcbiAgICAgICAgZHVyYXRpb25JblNlY29uZHM6IHN1cnZleUR1cmF0aW9uXG4gICAgICB9KVxuICAgICAgXG4gICAgICBzdXJ2ZXlOdW0rKztcbiAgICB9XG5cbiAgfSk7XG5cblxuXG4gIGZ1bmN0aW9uIGdldFN5bWJvbHNGb3JQbGF5ZXJzKHN5bWJvbFNldCwgYW5zd2VyLCBzZXRTaXplLCB0YXNrTmFtZSwgZ2FtZSwgbWF4TnVtT3ZlcmxhcCkge1xuICAgICAgbGV0IHN5bWJvbHNXaXRob3V0QW5zd2VyID0gc3ltYm9sU2V0LmZpbHRlcihzeW1ib2wgPT4gc3ltYm9sICE9PSBhbnN3ZXIpO1xuICAgICAgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzaHVmZmxlKHN5bWJvbHNXaXRob3V0QW5zd2VyKTtcbiAgICAgIGxldCBudW1QbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmxlbmd0aDtcbiAgICAgIGxldCBudW1PdmVybGFwID0gMDtcblxuXG4gICAgICAvLyBDcmVhdGUgYSBkaWN0aW9uYXJ5IHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgdGltZXMgc3ltYm9sIGhhcyBiZWVuIHVzZWRcbiAgICAgIGxldCBzeW1ib2xGcmVxID0ge31cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ltYm9sc1dpdGhvdXRBbnN3ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHN5bWJvbCA9IHN5bWJvbHNXaXRob3V0QW5zd2VyW2ldXG4gICAgICAgIGlmICghc3ltYm9sRnJlcS5oYXNPd25Qcm9wZXJ0eShzeW1ib2wpKSB7XG4gICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdID0gbnVtUGxheWVycyAtIDE7IC8vIFRvdGFsIHRpbWUgYSBzeW1ib2wgY2FuIGJlIHVzZWQgXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgICBsZXQgc3ltYm9sc1BpY2tlZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN5bWJvbHNXaXRob3V0QW5zd2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHN5bWJvbCA9IHN5bWJvbHNXaXRob3V0QW5zd2VyW2ldXG4gICAgICAgICAgaWYgKHN5bWJvbHNQaWNrZWQubGVuZ3RoIDwgc2V0U2l6ZSAtIDEpIHsgLy8gQWRkIHN5bWJvbHMgdW50aWwgc2V0U2l6ZSAtIDEgZm9yIGFuc3dlclxuICAgICAgICAgICAgaWYgKHN5bWJvbEZyZXFbc3ltYm9sXSAtIDEgPT09IDApIHsgLy8gVGhpcyBzeW1ib2wgd2lsbCBvdmVybGFwXG4gICAgICAgICAgICAgICAgaWYgKG51bU92ZXJsYXAgPCBtYXhOdW1PdmVybGFwICkgeyAvLyBPbmx5IGFkZCBpZiBsZXNzIHRoYW4gbWF4IG92ZXJsYXBcbiAgICAgICAgICAgICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdIC09IDE7XG4gICAgICAgICAgICAgICAgICBudW1PdmVybGFwICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goc3ltYm9sKTtcbiAgICAgICAgICAgICAgc3ltYm9sRnJlcVtzeW1ib2xdIC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN5bWJvbHNQaWNrZWQucHVzaChhbnN3ZXIpOyAvLyBBZGQgdGhlIGFuc3dlclxuICAgICAgICBmb3IgKHZhciBzeW1ib2xUb1JlbW92ZSBvZiBzeW1ib2xzUGlja2VkKSB7XG4gICAgICAgICAgaWYgKHN5bWJvbEZyZXFbc3ltYm9sVG9SZW1vdmVdID09PSAwKSB7IC8vIElmIHN5bWJvbCBoYXMgYmVlbiBwaWNrZWQgbi0xIHBsYXllcnMgdGltZXMsIHJlbW92ZSBpdCBmcm9tIHRoZSBzZXRcbiAgICAgICAgICAgIHN5bWJvbHNXaXRob3V0QW5zd2VyID0gc3ltYm9sc1dpdGhvdXRBbnN3ZXIuZmlsdGVyKHN5bWJvbCA9PiBzeW1ib2wgIT09IHN5bWJvbFRvUmVtb3ZlKTtcblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN5bWJvbHNQaWNrZWQgPSBzaHVmZmxlKHN5bWJvbHNQaWNrZWQpO1xuXG4gICAgICAgIHBsYXllci5zZXQodGFza05hbWUsIHN5bWJvbHNQaWNrZWQpO1xuICAgICAgfSlcblxuXG4gIH1cblxuICAvLyBTaHVmZmxpbmcgYXJyYXlzOlxuICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MDUzNjA0NC9zd2FwcGluZy1hbGwtZWxlbWVudHMtb2YtYW4tYXJyYXktZXhjZXB0LWZvci1maXJzdC1hbmQtbGFzdFxuICBmdW5jdGlvbiBzaHVmZmxlKHN5bWJvbFNldCkge1xuICAgIGZvciAoaSA9IHN5bWJvbFNldC5sZW5ndGggLTEgOyBpID4gMDsgaS0tKSB7XG4gICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG5cbiAgICAgIFtzeW1ib2xTZXRbaV0sIHN5bWJvbFNldFtqXV0gPSBbc3ltYm9sU2V0W2pdLCBzeW1ib2xTZXRbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gc3ltYm9sU2V0O1xuICB9XG5cbn0pO1xuIl19
