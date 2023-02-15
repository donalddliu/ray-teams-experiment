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
// const allSymbols = ["t1", "t2", "t3", "t4", "t5", "t6", "t7","t8","t9","t10","t11","t12"];
const allSymbols = ["t1", "t2", "t3", "t4", "t5", "t6"]; // n = number of people , p = number of symbols
// (n-1)*p + 1
// i.e. n = 3, p = 3 : 7

const testTangrams = [{
  _id: "0",
  taskName: "Task 1",
  symbols: allSymbols // answer: "t1",

}, {
  _id: "1",
  taskName: "Task 2",
  symbols: allSymbols // answer: "t2",

}, {
  _id: "2",
  taskName: "Task 3",
  symbols: allSymbols // answer: "t3",

}, {
  _id: "3",
  taskName: "Task 4",
  symbols: allSymbols // answer: "t4",

}, {
  _id: "4",
  taskName: "Task 5",
  symbols: allSymbols // answer: "t5",

}, {
  _id: "5",
  taskName: "Task 6",
  symbols: allSymbols // answer: "t6",

}, {
  _id: "6",
  taskName: "Task 7",
  symbols: allSymbols // answer: "t1",

}, {
  _id: "7",
  taskName: "Task 8",
  symbols: allSymbols // answer: "t2",

}, {
  _id: "8",
  taskName: "Task 9",
  symbols: allSymbols // answer: "t3",

}, {
  _id: "9",
  taskName: "Task 10",
  symbols: allSymbols // answer: "t4",

}, {
  _id: "10",
  taskName: "Task 11",
  symbols: allSymbols // answer: "t5",

}, {
  _id: "11",
  taskName: "Task 12",
  symbols: allSymbols // answer: "t6",

}, {
  _id: "12",
  taskName: "Task 13",
  symbols: allSymbols // answer: "t1",

}, {
  _id: "13",
  taskName: "Task 14",
  symbols: allSymbols // answer: "t2",

}, {
  _id: "14",
  taskName: "Task 15",
  symbols: allSymbols // answer: "t3",

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
      taskName
    } = symbolSet[i];
    const taskStage = round.addStage({
      name: "Task",
      displayName: taskName,
      durationInSeconds: taskDuration
    });
    console.log(taskName);
    taskStage.set("task", symbolSet[i]); // getSymbolsForPlayers(symbols, answer, setSize, taskName, game, maxNumOverlap);

    let answer = distributeSymbolsForPlayers(symbols, playerCount, taskName, game);
    taskStage.set("answer", answer);
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
  }

  function distributeSymbolsForPlayers(symbolSet, playerCount, taskName, game) {
    let fullSymbolDistribution = createSymbolSetDistribution(symbolSet);
    let cardSets = [];

    for (let i = 1; i <= playerCount + 1; i++) {
      cardSets.push("t".concat(i));
    }

    let cardDistributions = {};
    game.players.forEach(player => {
      let cardSetNum = _.sample(cardSets);

      let removedCardSetNum = _.remove(cardSets, num => num === cardSetNum);

      cardDistributions[player.get("nodeId")] = cardSetNum;
    });

    let answer = _.sample(cardSets); // console.log(cardSets);
    // console.log(cardSets[0]);
    // console.log(`Full Symbol Distribution : ${fullSymbolDistribution}`);


    game.players.forEach(player => {
      let symbolsPicked = fullSymbolDistribution[answer][cardDistributions[player.get("nodeId")]];
      player.set(taskName, symbolsPicked);
    });
    return answer;
  }

  function createSymbolSetDistribution(symbolSet) {
    let fullDistribution = {};
    symbolSet.forEach(answer => {
      symbolsWithoutAnswer = symbolSet.filter(s => s !== answer);
      let distribution = {};
      let i = 0;
      symbolsWithoutAnswer.forEach(s => {
        let symbolsWithoutSymbolToRemove = symbolsWithoutAnswer.filter(remove => remove !== s);
        symbolsWithoutSymbolToRemove.push(answer);
        distribution[s] = _.sortBy(symbolsWithoutSymbolToRemove);
        i++;
      });
      fullDistribution[answer] = distribution;
    });
    return fullDistribution;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2JvdHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jYWxsYmFja3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci91dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJFbXBpcmljYSIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsImJvdCIsIm9uU3RhZ2VUaWNrIiwiZ2FtZSIsInJvdW5kIiwic3RhZ2UiLCJzZWNvbmRzUmVtYWluaW5nIiwiZ2V0RnVsbHlDb25uZWN0ZWRMYXllciIsIm1vbWVudCIsIlRpbWVTeW5jIiwib25HYW1lU3RhcnQiLCJjb25zb2xlIiwibG9nIiwicGxheWVycyIsImZvckVhY2giLCJwbGF5ZXIiLCJzZXQiLCJEYXRlIiwibm93IiwibmV0d29yayIsImdldCIsImFjdGl2ZUNoYXRzIiwibWFwIiwib3RoZXJOb2RlSWQiLCJwYWlyT2ZQbGF5ZXJzIiwicGFyc2VJbnQiLCJzb3J0IiwicDEiLCJwMiIsIm90aGVyUGxheWVyIiwiZmluZCIsInAiLCJjaGF0S2V5IiwicHVzaCIsImxlbmd0aCIsInRyZWF0bWVudCIsIm1heEdhbWVUaW1lIiwiYWRkIiwib25Sb3VuZFN0YXJ0IiwiYWN0aXZlUGxheWVycyIsImZpbHRlciIsImVuZEdhbWVJZlBsYXllcklkbGUiLCJleGl0IiwibWluUGxheWVyQ291bnQiLCJvblN0YWdlU3RhcnQiLCJuYW1lIiwiZGlzcGxheU5hbWUiLCJvblN0YWdlRW5kIiwib25Sb3VuZEVuZCIsIm9uR2FtZUVuZCIsIm9uU2V0IiwidGFyZ2V0IiwidGFyZ2V0VHlwZSIsImtleSIsInZhbHVlIiwicHJldlZhbHVlIiwiYWxsU3VibWl0dGVkIiwibnVtUGxheWVyc1N1Ym1pdHRlZCIsImNvbXB1dGVTY29yZSIsInN1Ym1pdCIsInN1Y2Nlc3MiLCJwbGF5ZXJBbnN3ZXJzIiwiYWxsQW5zd2Vyc0VxdWFsIiwiYXJyIiwiZXZlcnkiLCJzdWJtaXNzaW9uIiwicHJldlNjb3JlIiwiZXhwb3J0IiwidGVzdFRhbmdyYW1zIiwiYWxsU3ltYm9scyIsIl9pZCIsInRhc2tOYW1lIiwic3ltYm9scyIsImdldE5laWdoYm9ycyIsInN0cnVjdHVyZSIsIm5laWdoYm9ycyIsInNwbGl0IiwicGxheWVySW5kZXgiLCJuIiwiY29ubmVjdGlvbiIsInJlcGxhY2UiLCJTZXQiLCJhY3RpdmVOb2RlcyIsImFsbE5vZGVzIiwibmV3TmVpZ2hib3JzIiwiaWQiLCJfIiwidGVzdFN5bWJvbHMiLCJnYW1lSW5pdCIsInBsYXllckNvdW50IiwibmV0d29ya1N0cnVjdHVyZSIsIm51bVRhc2tSb3VuZHMiLCJudW1TdXJ2ZXlSb3VuZHMiLCJzZXRTaXplQmFzZWRPblBsYXllckNvdW50IiwidXNlckluYWN0aXZpdHlEdXJhdGlvbiIsInRhc2tEdXJhdGlvbiIsImRlZmF1bHRTZXRTaXplIiwic3VydmV5RHVyYXRpb24iLCJyZXN1bHRzRHVyYXRpb24iLCJtYXhOdW1PdmVybGFwIiwic3ltYm9sU2V0Iiwic2V0U2l6ZSIsIm51bVJvdW5kc0JlZm9yZVN1cnZleSIsImNvbG9ycyIsInN1cnZleU51bSIsInNodWZmbGUiLCJpIiwidGltZXMiLCJhZGRSb3VuZCIsInRhc2tTdGFnZSIsImFkZFN0YWdlIiwiZHVyYXRpb25JblNlY29uZHMiLCJhbnN3ZXIiLCJkaXN0cmlidXRlU3ltYm9sc0ZvclBsYXllcnMiLCJyZXN1bHRTdGFnZSIsInN1cnZleVJvdW5kIiwic3VydmV5U3RhZ2VzIiwiZ2V0U3ltYm9sc0ZvclBsYXllcnMiLCJzeW1ib2xzV2l0aG91dEFuc3dlciIsInN5bWJvbCIsIm51bVBsYXllcnMiLCJudW1PdmVybGFwIiwic3ltYm9sRnJlcSIsImhhc093blByb3BlcnR5Iiwic3ltYm9sc1BpY2tlZCIsInN5bWJvbFRvUmVtb3ZlIiwiZnVsbFN5bWJvbERpc3RyaWJ1dGlvbiIsImNyZWF0ZVN5bWJvbFNldERpc3RyaWJ1dGlvbiIsImNhcmRTZXRzIiwiY2FyZERpc3RyaWJ1dGlvbnMiLCJjYXJkU2V0TnVtIiwic2FtcGxlIiwicmVtb3ZlZENhcmRTZXROdW0iLCJyZW1vdmUiLCJudW0iLCJmdWxsRGlzdHJpYnV0aW9uIiwicyIsImRpc3RyaWJ1dGlvbiIsInN5bWJvbHNXaXRob3V0U3ltYm9sVG9SZW1vdmUiLCJzb3J0QnkiLCJqIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLFFBQUo7QUFBYUMsTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0osWUFBUSxHQUFDSSxDQUFUO0FBQVc7O0FBQXZCLENBQW5DLEVBQTRELENBQTVEO0FBRWI7QUFFQUosUUFBUSxDQUFDSyxHQUFULENBQWEsS0FBYixFQUFvQjtBQUNsQjtBQUNBO0FBRUE7QUFDQUMsYUFBVyxDQUFDRCxHQUFELEVBQU1FLElBQU4sRUFBWUMsS0FBWixFQUFtQkMsS0FBbkIsRUFBMEJDLGdCQUExQixFQUE0QyxDQUFFLENBTHZDLENBT2xCO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7OztBQVprQixDQUFwQixFOzs7Ozs7Ozs7OztBQ0pBLElBQUlWLFFBQUo7QUFBYUMsTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0osWUFBUSxHQUFDSSxDQUFUO0FBQVc7O0FBQXZCLENBQW5DLEVBQTRELENBQTVEO0FBQStELElBQUlPLHNCQUFKO0FBQTJCVixNQUFNLENBQUNDLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNTLHdCQUFzQixDQUFDUCxDQUFELEVBQUc7QUFBQ08sMEJBQXNCLEdBQUNQLENBQXZCO0FBQXlCOztBQUFwRCxDQUFyQixFQUEyRSxDQUEzRTtBQUE4RSxJQUFJUSxNQUFKO0FBQVdYLE1BQU0sQ0FBQ0MsSUFBUCxD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QUNBWSwwQkFBb0IsQ0FBQ3hHLE9BQXJCLENBQThCMEgsQ0FBRCxJQUFPO0FBQ2xDLFlBQUlFLDRCQUE0QixHQUFHcEIsb0JBQW9CLENBQUM5RSxNQUFyQixDQUE0QjZGLE1BQU0sSUFBSUEsTUFBTSxLQUFLRyxDQUFqRCxDQUFuQztBQUNBRSxvQ0FBNEIsQ0FBQ3pHLElBQTdCLENBQWtDK0UsTUFBbEM7QUFDQXlCLG9CQUFZLENBQUNELENBQUQsQ0FBWixHQUFrQmxELENBQUMsQ0FBQ3FELE1BQUYsQ0FBU0QsNEJBQVQsQ0FBbEI7QUFDQWhDLFNBQUM7QUFDRixPQUxEO0FBTUE2QixzQkFBZ0IsQ0FBQ3ZCLE1BQUQsQ0FBaEIsR0FBMkJ5QixZQUEzQjtBQUNELEtBWEQ7QUFhQSxXQUFPRixnQkFBUDtBQUNELEdBdEx1QixDQXdMeEI7QUFDQTs7O0FBQ0EsV0FBUzlCLE9BQVQsQ0FBaUJMLFNBQWpCLEVBQTRCO0FBQzFCLFNBQUtNLENBQUMsR0FBR04sU0FBUyxDQUFDbEUsTUFBVixHQUFrQixDQUEzQixFQUErQndFLENBQUMsR0FBRyxDQUFuQyxFQUFzQ0EsQ0FBQyxFQUF2QyxFQUEyQztBQUN6QyxZQUFNa0MsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLE1BQWlCckMsQ0FBQyxHQUFHLENBQXJCLENBQVgsQ0FBVjtBQUVBLE9BQUNOLFNBQVMsQ0FBQ00sQ0FBRCxDQUFWLEVBQWVOLFNBQVMsQ0FBQ3dDLENBQUQsQ0FBeEIsSUFBK0IsQ0FBQ3hDLFNBQVMsQ0FBQ3dDLENBQUQsQ0FBVixFQUFleEMsU0FBUyxDQUFDTSxDQUFELENBQXhCLENBQS9CO0FBQ0Q7O0FBQ0QsV0FBT04sU0FBUDtBQUNEO0FBRUYsQ0FuTUQsRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVtcGlyaWNhIGZyb20gXCJtZXRlb3IvZW1waXJpY2E6Y29yZVwiO1xuXG4vLyBUaGlzIGlzIHdoZXJlIHlvdSBhZGQgYm90cywgbGlrZSBCb2I6XG5cbkVtcGlyaWNhLmJvdChcImJvYlwiLCB7XG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaCBzdGFnZSAoYWZ0ZXIgb25Sb3VuZFN0YXJ0L29uU3RhZ2VTdGFydClcbiAgLy8gb25TdGFnZVN0YXJ0KGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXJzKSB7fSxcblxuICAvLyBDYWxsZWQgZHVyaW5nIGVhY2ggc3RhZ2UgYXQgdGljayBpbnRlcnZhbCAofjFzIGF0IHRoZSBtb21lbnQpXG4gIG9uU3RhZ2VUaWNrKGJvdCwgZ2FtZSwgcm91bmQsIHN0YWdlLCBzZWNvbmRzUmVtYWluaW5nKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQSBwbGF5ZXIgaGFzIGNoYW5nZWQgYSB2YWx1ZVxuICAvLyAvLyBUaGlzIG1pZ2h0IGhhcHBlbiBhIGxvdCFcbiAgLy8gb25TdGFnZVBsYXllckNoYW5nZShib3QsIGdhbWUsIHJvdW5kLCBzdGFnZSwgcGxheWVycywgcGxheWVyKSB7fVxuXG4gIC8vIC8vIE5PVCBTVVBQT1JURUQgQ2FsbGVkIGF0IHRoZSBlbmQgb2YgdGhlIHN0YWdlIChhZnRlciBpdCBmaW5pc2hlZCwgYmVmb3JlIG9uU3RhZ2VFbmQvb25Sb3VuZEVuZCBpcyBjYWxsZWQpXG4gIC8vIG9uU3RhZ2VFbmQoYm90LCBnYW1lLCByb3VuZCwgc3RhZ2UsIHBsYXllcnMpIHt9XG59KTtcbiIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcblxuaW1wb3J0IHsgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0IHsgVGltZVN5bmMgfSBmcm9tIFwibWV0ZW9yL21penphbzp0aW1lc3luY1wiO1xuXG5cblxuLy8gb25HYW1lU3RhcnQgaXMgdHJpZ2dlcmVkIG9wbmNlIHBlciBnYW1lIGJlZm9yZSB0aGUgZ2FtZSBzdGFydHMsIGFuZCBiZWZvcmVcbi8vIHRoZSBmaXJzdCBvblJvdW5kU3RhcnQuIEl0IHJlY2VpdmVzIHRoZSBnYW1lIGFuZCBsaXN0IG9mIGFsbCB0aGUgcGxheWVycyBpblxuLy8gdGhlIGdhbWUuXG5FbXBpcmljYS5vbkdhbWVTdGFydChnYW1lID0+IHtcbiAgY29uc29sZS5sb2coXCJHYW1lIHN0YXJ0ZWRcIik7XG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwiaW5hY3RpdmVcIiwgZmFsc2UpO1xuICAgIHBsYXllci5zZXQoXCJpbmFjdGl2ZVdhcm5pbmdVc2VkXCIsIGZhbHNlKTtcbiAgICBwbGF5ZXIuc2V0KFwibGFzdEFjdGl2ZVwiLCBtb21lbnQoRGF0ZS5ub3coKSkpO1xuICAgIGNvbnN0IG5ldHdvcmsgPSBwbGF5ZXIuZ2V0KFwibmVpZ2hib3JzXCIpO1xuICAgIGNvbnN0IGFjdGl2ZUNoYXRzID0gW107XG4gICAgbmV0d29yay5tYXAob3RoZXJOb2RlSWQgPT4ge1xuICAgICAgdmFyIHBhaXJPZlBsYXllcnMgPSBbcGxheWVyLmdldChcIm5vZGVJZFwiKSwgcGFyc2VJbnQob3RoZXJOb2RlSWQpXTtcbiAgICAgIHBhaXJPZlBsYXllcnMuc29ydCgocDEscDIpID0+IHAxIC0gcDIpO1xuICAgICAgY29uc3Qgb3RoZXJQbGF5ZXIgPSBnYW1lLnBsYXllcnMuZmluZChwID0+IHAuZ2V0KFwibm9kZUlkXCIpID09PSBwYXJzZUludChvdGhlck5vZGVJZCkpO1xuICAgICAgLy8gY29uc3Qgb3RoZXJQbGF5ZXJJZCA9IG90aGVyUGxheWVyLmlkO1xuICAgICAgY29uc3QgY2hhdEtleSA9IGAke3BhaXJPZlBsYXllcnNbMF19LSR7cGFpck9mUGxheWVyc1sxXX1gO1xuICAgICAgYWN0aXZlQ2hhdHMucHVzaChjaGF0S2V5KTtcbiAgICB9KTtcbiAgICAvLyBEZWZhdWx0IGFsbCBjaGF0cyB0byBiZSBvcGVuIHdoZW4gZ2FtZSBzdGFydHNcbiAgICBwbGF5ZXIuc2V0KFwiYWN0aXZlQ2hhdHNcIiwgYWN0aXZlQ2hhdHMpO1xuICB9KTtcbiAgZ2FtZS5zZXQoXCJwcmV2aW91c051bUFjdGl2ZVBsYXllcnNcIiwgZ2FtZS5wbGF5ZXJzLmxlbmd0aCk7XG4gIGdhbWUuc2V0KFwiZ2FtZVN0YXJ0VGltZVwiLCBtb21lbnQoRGF0ZS5ub3coKSkpO1xuICBpZiAoZ2FtZS50cmVhdG1lbnQubWF4R2FtZVRpbWUpIHtcbiAgICBnYW1lLnNldChcIm1heEdhbWVFbmRUaW1lXCIsIG1vbWVudChEYXRlLm5vdygpKS5hZGQoZ2FtZS50cmVhdG1lbnQubWF4R2FtZVRpbWUsICdtJykpXG4gIH1cbn0pO1xuXG4vLyBvblJvdW5kU3RhcnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSBlYWNoIHJvdW5kIHN0YXJ0cywgYW5kIGJlZm9yZSBvblN0YWdlU3RhcnQuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZVN0YXJ0LCBhbmQgdGhlIHJvdW5kIHRoYXQgaXMgc3RhcnRpbmcuXG5FbXBpcmljYS5vblJvdW5kU3RhcnQoKGdhbWUsIHJvdW5kKSA9PiB7XG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwic3VibWl0dGVkXCIsIGZhbHNlKTtcbiAgICBwbGF5ZXIuc2V0KFwic3ltYm9sU2VsZWN0ZWRcIiwgXCJcIik7XG4gIH0pO1xuICByb3VuZC5zZXQoXCJyZXN1bHRcIiwgZmFsc2UpO1xuICByb3VuZC5zZXQoXCJudW1QbGF5ZXJzU3VibWl0dGVkXCIsIDApO1xuICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG5cbiAgaWYgKGFjdGl2ZVBsYXllcnMubGVuZ3RoIDwgZ2FtZS5nZXQoXCJwcmV2aW91c051bUFjdGl2ZVBsYXllcnNcIikgKSB7IC8vIFNvbWVvbmUgbGVmdCBpbiB0aGUgbWlkZGxlIG9mIHRoZSByb3VuZFxuICAgIGlmIChnYW1lLnRyZWF0bWVudC5lbmRHYW1lSWZQbGF5ZXJJZGxlKSB7XG4gICAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgLy8gcC5leGl0KFwic29tZW9uZUluYWN0aXZlXCIpO1xuICAgICAgICBwLmV4aXQoXCJtaW5QbGF5ZXJDb3VudE5vdE1haW50YWluZWRcIik7XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpOyAvLyBVcGRhdGVzIHRoZSBuZWlnaGJvcnMgdG8gYmUgZnVsbHkgY29ubmVjdGVkXG4gICAgICBnYW1lLnNldChcImNoZWNrRm9yU2ltaWxhclN5bWJvbFwiLCB0cnVlKTtcbiAgICB9XG4gIFxuICB9XG4gIGdhbWUuc2V0KFwicHJldmlvdXNOdW1BY3RpdmVQbGF5ZXJzXCIsIGFjdGl2ZVBsYXllcnMubGVuZ3RoKTtcblxuICBpZiAoZ2FtZS50cmVhdG1lbnQubWluUGxheWVyQ291bnQgJiYgYWN0aXZlUGxheWVycy5sZW5ndGggPCBnYW1lLnRyZWF0bWVudC5taW5QbGF5ZXJDb3VudCkge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgcC5leGl0KFwibWluUGxheWVyQ291bnROb3RNYWludGFpbmVkXCIpO1xuICAgIH0pXG4gIH1cblxuICBjb25zb2xlLmxvZyhcIlJvdW5kIFN0YXJ0ZWRcIik7XG5cbn0pO1xuXG4vLyBvblN0YWdlU3RhcnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSBlYWNoIHN0YWdlIHN0YXJ0cy5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25Sb3VuZFN0YXJ0LCBhbmQgdGhlIHN0YWdlIHRoYXQgaXMgc3RhcnRpbmcuXG5FbXBpcmljYS5vblN0YWdlU3RhcnQoKGdhbWUsIHJvdW5kLCBzdGFnZSkgPT4ge1xuICBjb25zb2xlLmxvZyhcIlN0YWdlIFN0YXJ0ZWRcIilcbiAgLy8gY29uc3QgYWN0aXZlUGxheWVycyA9IGdhbWUucGxheWVycy5maWx0ZXIocCA9PiBwLm9ubGluZSA9PT0gdHJ1ZSAmJiAhcC5nZXQoXCJpbmFjdGl2ZVwiKSk7XG4gIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuXG4gIGlmIChzdGFnZS5uYW1lID09PSBcIlRhc2tcIikge1xuICAgIGFjdGl2ZVBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyggYFN5bWJvbHMgOiAke3BsYXllci5nZXQoYCR7c3RhZ2UuZGlzcGxheU5hbWV9YCl9YCk7XG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coYEFuc3dlcjogJHtzdGFnZS5nZXQoXCJhbnN3ZXJcIil9YCk7XG4gIH1cbiAgaWYgKHN0YWdlLm5hbWUgPT09IFwiU3VydmV5XCIpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgcGxheWVyLnNldChcInN1cnZleU51bWJlclwiICwgMSlcbiAgICB9KTtcbiAgfVxuICAvLyBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgcGxheWVyLnNldChcInN1Ym1pdHRlZFwiLCBmYWxzZSk7XG4gIC8vIH0pO1xuICAvLyBzdGFnZS5zZXQoXCJzaG93UmVzdWx0c1wiLCBmYWxzZSk7XG4gIC8vIHN0YWdlLnNldChcInJlc3VsdHNTaG93blwiLCBmYWxzZSk7XG5cbn0pO1xuXG4vLyBvblN0YWdlRW5kIGlzIHRyaWdnZXJlZCBhZnRlciBlYWNoIHN0YWdlLlxuLy8gSXQgcmVjZWl2ZXMgdGhlIHNhbWUgb3B0aW9ucyBhcyBvblJvdW5kRW5kLCBhbmQgdGhlIHN0YWdlIHRoYXQganVzdCBlbmRlZC5cbkVtcGlyaWNhLm9uU3RhZ2VFbmQoKGdhbWUsIHJvdW5kLCBzdGFnZSkgPT57XG4gIGNvbnNvbGUubG9nKFwiU3RhZ2UgRW5kZWRcIilcbiAgXG59KTtcblxuLy8gb25Sb3VuZEVuZCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgZWFjaCByb3VuZC5cbi8vIEl0IHJlY2VpdmVzIHRoZSBzYW1lIG9wdGlvbnMgYXMgb25HYW1lRW5kLCBhbmQgdGhlIHJvdW5kIHRoYXQganVzdCBlbmRlZC5cbkVtcGlyaWNhLm9uUm91bmRFbmQoKGdhbWUsIHJvdW5kKSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiUm91bmQgRW5kZWRcIilcbiAgLy8gZ2FtZS5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgLy8gICBjb25zdCB2YWx1ZSA9IHBsYXllci5yb3VuZC5nZXQoXCJ2YWx1ZVwiKSB8fCAwO1xuICAvLyAgIGNvbnN0IHByZXZTY29yZSA9IHBsYXllci5nZXQoXCJzY29yZVwiKSB8fCAwO1xuICAvLyAgIHBsYXllci5zZXQoXCJzY29yZVwiLCBwcmV2U2NvcmUgKyB2YWx1ZSk7XG4gIC8vIH0pO1xuXG59KTtcblxuLy8gb25HYW1lRW5kIGlzIHRyaWdnZXJlZCB3aGVuIHRoZSBnYW1lIGVuZHMuXG4vLyBJdCByZWNlaXZlcyB0aGUgc2FtZSBvcHRpb25zIGFzIG9uR2FtZVN0YXJ0LlxuRW1waXJpY2Eub25HYW1lRW5kKGdhbWUgPT4ge30pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID0+IG9uU2V0LCBvbkFwcGVuZCBhbmQgb25DaGFuZ2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gb25TZXQsIG9uQXBwZW5kIGFuZCBvbkNoYW5nZSBhcmUgY2FsbGVkIG9uIGV2ZXJ5IHNpbmdsZSB1cGRhdGUgbWFkZSBieSBhbGxcbi8vIHBsYXllcnMgaW4gZWFjaCBnYW1lLCBzbyB0aGV5IGNhbiByYXBpZGx5IGJlY29tZSBxdWl0ZSBleHBlbnNpdmUgYW5kIGhhdmVcbi8vIHRoZSBwb3RlbnRpYWwgdG8gc2xvdyBkb3duIHRoZSBhcHAuIFVzZSB3aXNlbHkuXG4vL1xuLy8gSXQgaXMgdmVyeSB1c2VmdWwgdG8gYmUgYWJsZSB0byByZWFjdCB0byBlYWNoIHVwZGF0ZSBhIHVzZXIgbWFrZXMuIFRyeVxuLy8gbm9udGhlbGVzcyB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGNvbXB1dGF0aW9ucyBhbmQgZGF0YWJhc2Ugc2F2ZXMgKC5zZXQpXG4vLyBkb25lIGluIHRoZXNlIGNhbGxiYWNrcy4gWW91IGNhbiBhbHNvIHRyeSB0byBsaW1pdCB0aGUgYW1vdW50IG9mIGNhbGxzIHRvXG4vLyBzZXQoKSBhbmQgYXBwZW5kKCkgeW91IG1ha2UgKGF2b2lkIGNhbGxpbmcgdGhlbSBvbiBhIGNvbnRpbnVvdXMgZHJhZyBvZiBhXG4vLyBzbGlkZXIgZm9yIGV4YW1wbGUpIGFuZCBpbnNpZGUgdGhlc2UgY2FsbGJhY2tzIHVzZSB0aGUgYGtleWAgYXJndW1lbnQgYXQgdGhlXG4vLyB2ZXJ5IGJlZ2lubmluZyBvZiB0aGUgY2FsbGJhY2sgdG8gZmlsdGVyIG91dCB3aGljaCBrZXlzIHlvdXIgbmVlZCB0byBydW5cbi8vIGxvZ2ljIGFnYWluc3QuXG4vL1xuLy8gSWYgeW91IGFyZSBub3QgdXNpbmcgdGhlc2UgY2FsbGJhY2tzLCBjb21tZW50IHRoZW0gb3V0IHNvIHRoZSBzeXN0ZW0gZG9lc1xuLy8gbm90IGNhbGwgdGhlbSBmb3Igbm90aGluZy5cblxuLy8gLy8gb25TZXQgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSAuc2V0KCkgbWV0aG9kXG4vLyAvLyBvbiBnYW1lcywgcm91bmRzLCBzdGFnZXMsIHBsYXllcnMsIHBsYXllclJvdW5kcyBvciBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vblNldCgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlIC8vIFByZXZpb3VzIHZhbHVlXG4vLyApID0+IHtcbi8vICAgLy8gLy8gRXhhbXBsZSBmaWx0ZXJpbmdcbi8vICAgLy8gaWYgKGtleSAhPT0gXCJ2YWx1ZVwiKSB7XG4vLyAgIC8vICAgcmV0dXJuO1xuLy8gICAvLyB9XG4vLyB9KTtcblxuRW1waXJpY2Eub25TZXQoKFxuICBnYW1lLFxuICByb3VuZCxcbiAgc3RhZ2UsXG4gIHBsYXllciwgLy8gUGxheWVyIHdobyBtYWRlIHRoZSBjaGFuZ2VcbiAgdGFyZ2V0LCAvLyBPYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBwbGF5ZXIpXG4gIHRhcmdldFR5cGUsIC8vIFR5cGUgb2Ygb2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gXCJwbGF5ZXJcIilcbiAga2V5LCAvLyBLZXkgb2YgY2hhbmdlZCB2YWx1ZSAoZS5nLiBwbGF5ZXIuc2V0KFwic2NvcmVcIiwgMSkgPT4gXCJzY29yZVwiKVxuICB2YWx1ZSwgLy8gTmV3IHZhbHVlXG4gIHByZXZWYWx1ZSAvLyBQcmV2aW91cyB2YWx1ZVxuKSA9PiB7XG4gIGNvbnNvbGUubG9nKFwia2V5XCIsIGtleSk7XG4gIC8vIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBnYW1lLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5vbmxpbmUgPT09IHRydWUgJiYgIXAuZ2V0KFwiaW5hY3RpdmVcIikpO1xuICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuICAvLyBTb21lIHBsYXllciBkZWNpZGVzIHRvIHJlY29uc2lkZXIgdGhlaXIgYW5zd2VyXG4gIGlmIChrZXkgPT09IFwic3VibWl0dGVkXCIpIHsgXG4gICAgLy8gQ2hlY2tzIGlmIGV2ZXJ5b25lIGhhcyBzdWJtaXR0ZWQgdGhlaXIgYW5zd2VyIGFuZCBpZiBzbywgc3VibWl0IHRoZSBzdGFnZVxuICAgIGxldCBhbGxTdWJtaXR0ZWQgPSB0cnVlO1xuICAgIGxldCBudW1QbGF5ZXJzU3VibWl0dGVkID0gMDtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgaWYgKHBsYXllci5nZXQoXCJzdWJtaXR0ZWRcIikpIHtcbiAgICAgICAgbnVtUGxheWVyc1N1Ym1pdHRlZCArPSAxO1xuICAgICAgfVxuICAgICAgYWxsU3VibWl0dGVkID0gcGxheWVyLmdldChcInN1Ym1pdHRlZFwiKSAmJiBhbGxTdWJtaXR0ZWQ7XG4gICAgfSlcbiAgICByb3VuZC5zZXQoXCJudW1QbGF5ZXJzU3VibWl0dGVkXCIsIG51bVBsYXllcnNTdWJtaXR0ZWQpO1xuICAgIGlmIChhbGxTdWJtaXR0ZWQpIHtcbiAgICAgIGlmIChzdGFnZS5uYW1lID09PSBcIlRhc2tcIikge1xuICAgICAgICBjb21wdXRlU2NvcmUoYWN0aXZlUGxheWVycywgZ2FtZSwgc3RhZ2UsIHJvdW5kKTtcbiAgICAgIH1cbiAgICAgIC8vIE5lZWQgdG8gc3VibWl0IGZvciBzdWJtaXQgdGhlIHN0YWdlIGZvciBldmVyeSBwbGF5ZXJcbiAgICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgICAgcGxheWVyLnN0YWdlLnN1Ym1pdCgpO1xuICAgICAgfSlcbiAgICB9XG4gIC8vICAgaWYgKHN0YWdlLmdldChcInJlc3VsdHNTaG93blwiKSkge1xuICAvLyAgICAgcGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgLy8gICAgICAgcGxheWVyLnN0YWdlLnN1Ym1pdCgpO1xuICAvLyAgICAgfSlcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvLyBpZiAodGFyZ2V0VHlwZSA9PT0gXCJzdGFnZVwiICYmIGtleSA9PT0gXCJyZXN1bHRzU2hvd25cIikge1xuICAvLyAgIGlmIChzdGFnZS5nZXQoXCJyZXN1bHRzU2hvd25cIikpIHtcbiAgLy8gICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gIC8vICAgICAgIHBsYXllci5zdGFnZS5zdWJtaXQoKTtcbiAgLy8gICAgIH0pXG4gIC8vICAgfVxuICB9XG5cbiAgLy8gZWxzZSBpZiAoa2V5ID09PSBcImluYWN0aXZlXCIpIHtcbiAgICAvLyBnZXRGdWxseUNvbm5lY3RlZExheWVyKGdhbWUpO1xuICAvLyB9XG5cbiAgcmV0dXJuO1xuXG59KTtcblxuZnVuY3Rpb24gY29tcHV0ZVNjb3JlKGFjdGl2ZVBsYXllcnMsIGdhbWUsIHN0YWdlLCByb3VuZCkge1xuICBsZXQgc3VjY2VzcyA9IHRydWU7XG4gIGNvbnNvbGUubG9nKFwiQ09SUkVDVCBBTlNXRVI6XCIpXG4gIGNvbnNvbGUubG9nKHN0YWdlLmdldChcImFuc3dlclwiKSk7XG4gIGNvbnNvbGUubG9nKFwiUGxheWVycyBndWVzc2VkOlwiKVxuXG4gIGxldCBwbGF5ZXJBbnN3ZXJzID0gW107XG4gIGNvbnN0IGFsbEFuc3dlcnNFcXVhbCA9IGFyciA9PiBhcnIuZXZlcnkoIHYgPT4gdiA9PT0gYXJyWzBdICkgLy9GdW5jIHRvIGNoZWNrIGlmIGFsbCBwbGF5ZXIgYW5zd2VycyBhcmUgZXF1YWxcblxuICBhY3RpdmVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICBjb25zdCBzdWJtaXNzaW9uID0gcGxheWVyLmdldChcInN5bWJvbFNlbGVjdGVkXCIpO1xuICAgIGNvbnNvbGUubG9nKHN1Ym1pc3Npb24pO1xuICAgIGlmIChnYW1lLmdldChcImNoZWNrRm9yU2ltaWxhclN5bWJvbFwiKSkge1xuICAgICAgcGxheWVyQW5zd2Vycy5wdXNoKHN1Ym1pc3Npb24pO1xuICAgIH1cbiAgICBpZiAoc3VibWlzc2lvbiAhPT0gc3RhZ2UuZ2V0KFwiYW5zd2VyXCIpKSB7XG4gICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgfVxuICB9KVxuXG4gIGlmIChnYW1lLmdldChcImNoZWNrRm9yU2ltaWxhclN5bWJvbFwiKSkge1xuICAgIGlmIChhbGxBbnN3ZXJzRXF1YWwocGxheWVyQW5zd2VycykpIHtcbiAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJvdW5kLnNldChcInJlc3VsdFwiLCBzdWNjZXNzKTtcbiAgaWYgKHN1Y2Nlc3MpIHtcbiAgICBhY3RpdmVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgIGNvbnN0IHByZXZTY29yZSA9IHBsYXllci5nZXQoXCJzY29yZVwiKSB8fCAwO1xuICAgICAgcGxheWVyLnNldChcInNjb3JlXCIsIHByZXZTY29yZSArIDEpO1xuICAgIH0pXG4gICAgY29uc29sZS5sb2coXCIgQWxsIHBsYXllcnMgZ290IGl0IGNvcnJlY3RseVwiKTtcbiAgfSBcbn1cblxuLy8gLy8gb25BcHBlbmQgaXMgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxsIHRoZSBgLmFwcGVuZCgpYCBtZXRob2Rcbi8vIC8vIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yIHBsYXllclN0YWdlcy5cbi8vIEVtcGlyaWNhLm9uQXBwZW5kKChcbi8vICAgZ2FtZSxcbi8vICAgcm91bmQsXG4vLyAgIHN0YWdlLFxuLy8gICBwbGF5ZXIsIC8vIFBsYXllciB3aG8gbWFkZSB0aGUgY2hhbmdlXG4vLyAgIHRhcmdldCwgLy8gT2JqZWN0IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugd2FzIG1hZGUgKGVnLiBwbGF5ZXIuc2V0KCkgPT4gcGxheWVyKVxuLy8gICB0YXJnZXRUeXBlLCAvLyBUeXBlIG9mIG9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IFwicGxheWVyXCIpXG4vLyAgIGtleSwgLy8gS2V5IG9mIGNoYW5nZWQgdmFsdWUgKGUuZy4gcGxheWVyLnNldChcInNjb3JlXCIsIDEpID0+IFwic2NvcmVcIilcbi8vICAgdmFsdWUsIC8vIE5ldyB2YWx1ZVxuLy8gICBwcmV2VmFsdWUgLy8gUHJldmlvdXMgdmFsdWVcbi8vICkgPT4ge1xuLy8gICAvLyBOb3RlOiBgdmFsdWVgIGlzIHRoZSBzaW5nbGUgbGFzdCB2YWx1ZSAoZS5nIDAuMiksIHdoaWxlIGBwcmV2VmFsdWVgIHdpbGxcbi8vICAgLy8gICAgICAgYmUgYW4gYXJyYXkgb2YgdGhlIHByZXZpc291cyB2YWx1ZWQgKGUuZy4gWzAuMywgMC40LCAwLjY1XSkuXG4vLyB9KTtcblxuXG4vLyAvLyBvbkNoYW5nZSBpcyBjYWxsZWQgd2hlbiB0aGUgZXhwZXJpbWVudCBjb2RlIGNhbGwgdGhlIGAuc2V0KClgIG9yIHRoZVxuLy8gLy8gYC5hcHBlbmQoKWAgbWV0aG9kIG9uIGdhbWVzLCByb3VuZHMsIHN0YWdlcywgcGxheWVycywgcGxheWVyUm91bmRzIG9yXG4vLyAvLyBwbGF5ZXJTdGFnZXMuXG4vLyBFbXBpcmljYS5vbkNoYW5nZSgoXG4vLyAgIGdhbWUsXG4vLyAgIHJvdW5kLFxuLy8gICBzdGFnZSxcbi8vICAgcGxheWVyLCAvLyBQbGF5ZXIgd2hvIG1hZGUgdGhlIGNoYW5nZVxuLy8gICB0YXJnZXQsIC8vIE9iamVjdCBvbiB3aGljaCB0aGUgY2hhbmdlIHdhcyBtYWRlIChlZy4gcGxheWVyLnNldCgpID0+IHBsYXllcilcbi8vICAgdGFyZ2V0VHlwZSwgLy8gVHlwZSBvZiBvYmplY3Qgb24gd2hpY2ggdGhlIGNoYW5nZSB3YXMgbWFkZSAoZWcuIHBsYXllci5zZXQoKSA9PiBcInBsYXllclwiKVxuLy8gICBrZXksIC8vIEtleSBvZiBjaGFuZ2VkIHZhbHVlIChlLmcuIHBsYXllci5zZXQoXCJzY29yZVwiLCAxKSA9PiBcInNjb3JlXCIpXG4vLyAgIHZhbHVlLCAvLyBOZXcgdmFsdWVcbi8vICAgcHJldlZhbHVlLCAvLyBQcmV2aW91cyB2YWx1ZVxuLy8gICBpc0FwcGVuZCAvLyBUcnVlIGlmIHRoZSBjaGFuZ2Ugd2FzIGFuIGFwcGVuZCwgZmFsc2UgaWYgaXQgd2FzIGEgc2V0XG4vLyApID0+IHtcbi8vICAgLy8gYG9uQ2hhbmdlYCBpcyB1c2VmdWwgdG8gcnVuIHNlcnZlci1zaWRlIGxvZ2ljIGZvciBhbnkgdXNlciBpbnRlcmFjdGlvbi5cbi8vICAgLy8gTm90ZSB0aGUgZXh0cmEgaXNBcHBlbmQgYm9vbGVhbiB0aGF0IHdpbGwgYWxsb3cgdG8gZGlmZmVyZW5jaWF0ZSBzZXRzIGFuZFxuLy8gICAvLyBhcHBlbmRzLlxuLy8gICAgR2FtZS5zZXQoXCJsYXN0Q2hhbmdlQXRcIiwgbmV3IERhdGUoKS50b1N0cmluZygpKVxuLy8gfSk7XG5cbi8vIC8vIG9uU3VibWl0IGlzIGNhbGxlZCB3aGVuIHRoZSBwbGF5ZXIgc3VibWl0cyBhIHN0YWdlLlxuLy8gRW1waXJpY2Eub25TdWJtaXQoKFxuLy8gICBnYW1lLFxuLy8gICByb3VuZCxcbi8vICAgc3RhZ2UsXG4vLyAgIHBsYXllciAvLyBQbGF5ZXIgd2hvIHN1Ym1pdHRlZFxuLy8gKSA9PiB7XG4vLyB9KTtcbiIsIi8vIGNvbnN0IGFsbFN5bWJvbHMgPSBbXCJ0MVwiLCBcInQyXCIsIFwidDNcIiwgXCJ0NFwiLCBcInQ1XCIsIFwidDZcIiwgXCJ0N1wiLFwidDhcIixcInQ5XCIsXCJ0MTBcIixcInQxMVwiLFwidDEyXCJdO1xuY29uc3QgYWxsU3ltYm9scyA9IFtcInQxXCIsIFwidDJcIiwgXCJ0M1wiLCBcInQ0XCIsIFwidDVcIiwgXCJ0NlwiXTtcblxuLy8gbiA9IG51bWJlciBvZiBwZW9wbGUgLCBwID0gbnVtYmVyIG9mIHN5bWJvbHNcbi8vIChuLTEpKnAgKyAxXG4vLyBpLmUuIG4gPSAzLCBwID0gMyA6IDdcblxuZXhwb3J0IGNvbnN0IHRlc3RUYW5ncmFtcyA9IFtcbiAge1xuICAgIF9pZDogXCIwXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICAvLyBhbnN3ZXI6IFwidDFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAyXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICAvLyBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAzXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICAvLyBhbnN3ZXI6IFwidDNcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIzXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICAvLyBhbnN3ZXI6IFwidDRcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI0XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA1XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICAvLyBhbnN3ZXI6IFwidDVcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI1XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA2XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICAvLyBhbnN3ZXI6IFwidDZcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI2XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA3XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICAvLyBhbnN3ZXI6IFwidDFcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI3XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA4XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICAvLyBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI4XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayA5XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICAvLyBhbnN3ZXI6IFwidDNcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCI5XCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxMFwiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgLy8gYW5zd2VyOiBcInQ0XCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTBcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDExXCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICAvLyBhbnN3ZXI6IFwidDVcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxMVwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTJcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIC8vIGFuc3dlcjogXCJ0NlwiLFxuICB9LFxuICB7XG4gICAgX2lkOiBcIjEyXCIsXG4gICAgdGFza05hbWU6IFwiVGFzayAxM1wiLFxuICAgIHN5bWJvbHM6IGFsbFN5bWJvbHMsXG4gICAgLy8gYW5zd2VyOiBcInQxXCIsXG4gIH0sXG4gIHtcbiAgICBfaWQ6IFwiMTNcIixcbiAgICB0YXNrTmFtZTogXCJUYXNrIDE0XCIsXG4gICAgc3ltYm9sczogYWxsU3ltYm9scyxcbiAgICAvLyBhbnN3ZXI6IFwidDJcIixcbiAgfSxcbiAge1xuICAgIF9pZDogXCIxNFwiLFxuICAgIHRhc2tOYW1lOiBcIlRhc2sgMTVcIixcbiAgICBzeW1ib2xzOiBhbGxTeW1ib2xzLFxuICAgIC8vIGFuc3dlcjogXCJ0M1wiLFxuICB9LFxuXG5dO1xuXG5cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXROZWlnaGJvcnMoc3RydWN0dXJlLCBwbGF5ZXIpIHtcbiAgICBjb25zdCBuZWlnaGJvcnMgPSBbXTtcbiAgICBsZXQgbmV0d29yayA9IHN0cnVjdHVyZS5zcGxpdChcIixcIik7XG4gICAgY29uc3QgcGxheWVySW5kZXggPSBwbGF5ZXIuZ2V0KFwibm9kZUlkXCIpO1xuXG4gICAgbmV0d29yay5mb3JFYWNoKChuKSA9PiB7XG4gICAgICBjb25zdCBjb25uZWN0aW9uID0gbi5zcGxpdChcIi1cIik7XG5cbiAgICAgIGlmIChwbGF5ZXJJbmRleCA9PT0gcGFyc2VJbnQoY29ubmVjdGlvblswXSkpIHtcbiAgICAgICAgbmVpZ2hib3JzLnB1c2goY29ubmVjdGlvblsxXS5yZXBsYWNlKC9cXHMvZywgJycpKTtcbiAgICAgIH0gZWxzZSBpZiAocGxheWVySW5kZXggPT09IHBhcnNlSW50KGNvbm5lY3Rpb25bMV0pKSB7XG4gICAgICAgIG5laWdoYm9ycy5wdXNoKGNvbm5lY3Rpb25bMF0ucmVwbGFjZSgvXFxzL2csICcnKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIHJldHVybiBbLi4uIG5ldyBTZXQobmVpZ2hib3JzKV07XG4gIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bGx5Q29ubmVjdGVkTGF5ZXIoZ2FtZSkge1xuICAgIGNvbnN0IGFjdGl2ZU5vZGVzID0gW107XG4gICAgY29uc3QgYWxsTm9kZXMgPSBbXTtcbiAgICAvLyBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0aXZlXCIpKTtcbiAgICBjb25zdCBhY3RpdmVQbGF5ZXJzID0gZ2FtZS5wbGF5ZXJzLmZpbHRlcihwID0+ICFwLmdldChcImluYWN0aXZlXCIpKTtcblxuXG4gICAgLy8gYWN0aXZlUGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgLy8gICBhY3RpdmVOb2Rlcy5wdXNoKGAke3AuZ2V0KFwibm9kZUlkXCIpfWApO1xuICAgIC8vIH0pXG5cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgLy8gaWYgKHAub25saW5lID09PSB0cnVlICYmICFwLmdldChcImluYWN0dmVcIikpIHtcbiAgICAgIGlmICghcC5nZXQoXCJpbmFjdHZlXCIpKSB7XG5cbiAgICAgICAgYWN0aXZlTm9kZXMucHVzaChgJHtwLmdldChcIm5vZGVJZFwiKX1gKTtcbiAgICAgIH1cbiAgICAgIGFsbE5vZGVzLnB1c2goYCR7cC5nZXQoXCJub2RlSWRcIil9YCk7XG4gICAgfSlcblxuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAvLyBPbmx5IHNob3cgYWN0aXZlIHBlb3BsZVxuICAgICAgLy8gY29uc3QgbmV3TmVpZ2hib3JzID0gYWN0aXZlTm9kZXMuZmlsdGVyKGlkID0+IHBhcnNlSW50KGlkKSAhPT0gcC5nZXQoXCJub2RlSWRcIikpXG4gICAgICAvLyBwLnNldChcIm5laWdoYm9yc1wiLCBuZXdOZWlnaGJvcnMpO1xuXG4gICAgICAvLyBTaG93IGV2ZXJ5b25lLCBtYXJrIG9mZmxpbmUgcGVvcGxlIGFzIG9mZmxpbmVcbiAgICAgIGNvbnN0IG5ld05laWdoYm9ycyA9IGFsbE5vZGVzLmZpbHRlcihpZCA9PiBwYXJzZUludChpZCkgIT09IHAuZ2V0KFwibm9kZUlkXCIpKVxuICAgICAgcC5zZXQoXCJuZWlnaGJvcnNcIiwgbmV3TmVpZ2hib3JzKTtcbiAgICB9KVxufSIsImltcG9ydCBFbXBpcmljYSBmcm9tIFwibWV0ZW9yL2VtcGlyaWNhOmNvcmVcIjtcbmltcG9ydCBcIi4vYm90cy5qc1wiO1xuaW1wb3J0IFwiLi9jYWxsYmFja3MuanNcIjtcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgdGVzdFN5bWJvbHMsIHRlc3RUYW5ncmFtcyB9IGZyb20gXCIuL2NvbnN0YW50c1wiOyBcbmltcG9ydCB7IGdldE5laWdoYm9ycywgZ2V0RnVsbHlDb25uZWN0ZWRMYXllciB9IGZyb20gXCIuL3V0aWxcIjtcblxuLy8gZ2FtZUluaXQgaXMgd2hlcmUgdGhlIHN0cnVjdHVyZSBvZiBhIGdhbWUgaXMgZGVmaW5lZC5cbi8vIEp1c3QgYmVmb3JlIGV2ZXJ5IGdhbWUgc3RhcnRzLCBvbmNlIGFsbCB0aGUgcGxheWVycyBuZWVkZWQgYXJlIHJlYWR5LCB0aGlzXG4vLyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgdHJlYXRtZW50IGFuZCB0aGUgbGlzdCBvZiBwbGF5ZXJzLlxuLy8gWW91IG11c3QgdGhlbiBhZGQgcm91bmRzIGFuZCBzdGFnZXMgdG8gdGhlIGdhbWUsIGRlcGVuZGluZyBvbiB0aGUgdHJlYXRtZW50XG4vLyBhbmQgdGhlIHBsYXllcnMuIFlvdSBjYW4gYWxzbyBnZXQvc2V0IGluaXRpYWwgdmFsdWVzIG9uIHlvdXIgZ2FtZSwgcGxheWVycyxcbi8vIHJvdW5kcyBhbmQgc3RhZ2VzICh3aXRoIGdldC9zZXQgbWV0aG9kcyksIHRoYXQgd2lsbCBiZSBhYmxlIHRvIHVzZSBsYXRlciBpblxuLy8gdGhlIGdhbWUuXG5FbXBpcmljYS5nYW1lSW5pdChnYW1lID0+IHtcbiAgY29uc3Qge1xuICAgIHRyZWF0bWVudDoge1xuICAgICAgcGxheWVyQ291bnQsXG4gICAgICBuZXR3b3JrU3RydWN0dXJlLFxuICAgICAgbnVtVGFza1JvdW5kcyxcbiAgICAgIG51bVN1cnZleVJvdW5kcyxcbiAgICAgIHNldFNpemVCYXNlZE9uUGxheWVyQ291bnQsXG4gICAgICB1c2VySW5hY3Rpdml0eUR1cmF0aW9uLFxuICAgICAgdGFza0R1cmF0aW9uLFxuICAgICAgZGVmYXVsdFNldFNpemUsXG4gICAgICBzdXJ2ZXlEdXJhdGlvbixcbiAgICAgIHJlc3VsdHNEdXJhdGlvbixcbiAgICAgIG1heE51bU92ZXJsYXAsXG4gICAgfSxcbiAgfSA9IGdhbWU7XG5cblxuICBjb25zdCBzeW1ib2xTZXQgPSB0ZXN0VGFuZ3JhbXM7XG4gIGNvbnN0IHNldFNpemUgPSBzZXRTaXplQmFzZWRPblBsYXllckNvdW50ID8gcGxheWVyQ291bnQgKyAxIDogZGVmYXVsdFNldFNpemU7IC8vVE9ETzogY2FuIGNoYW5nZSBkZWZhdWx0IHZhbHVlIGluIHNldHRpbmdzXG4gIGNvbnN0IG51bVJvdW5kc0JlZm9yZVN1cnZleSA9IG51bVRhc2tSb3VuZHMvbnVtU3VydmV5Um91bmRzO1xuXG4gIGxldCBjb2xvcnMgPSBbXCJHcmVlblwiLCBcIlJlZFwiLCBcIlllbGxvd1wiLCBcIkJsdWVcIiwgXCJQdXJwbGVcIiwgXCJXaGl0ZVwiLCBcIkJsYWNrXCJdXG4gIGxldCBzdXJ2ZXlOdW0gPSAxXG4gIGNvbG9ycyA9IF8uc2h1ZmZsZShjb2xvcnMpO1xuXG4gIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIsIGkpID0+IHtcbiAgICBwbGF5ZXIuc2V0KFwiYXZhdGFyXCIsIGAvYXZhdGFycy9qZGVudGljb24vJHtwbGF5ZXIuX2lkfWApO1xuICAgIHBsYXllci5zZXQoXCJzY29yZVwiLCAwKTtcblxuICAgIC8vIEdpdmUgZWFjaCBwbGF5ZXIgYSBub2RlSWQgYmFzZWQgb24gdGhlaXIgcG9zaXRpb24gKGluZGV4ZWQgYXQgMSlcbiAgICBwbGF5ZXIuc2V0KFwibm9kZUlkXCIsIGkgKyAxKTtcbiAgICBwbGF5ZXIuc2V0KFwibmFtZVwiLCBwbGF5ZXIuaWQpO1xuICAgIHBsYXllci5zZXQoXCJhbm9ueW1vdXNOYW1lXCIsIGNvbG9yc1tpXSlcbiAgfSk7XG5cbiAgaWYgKGdhbWUucGxheWVycy5sZW5ndGggPCBnYW1lLnRyZWF0bWVudC5wbGF5ZXJDb3VudCkgeyAvLyBpZiBub3QgYSBmdWxsIGdhbWUsIGRlZmF1bHQgdG8gZnVsbHkgY29ubmVjdGVkIGxheWVyXG4gICAgZ2V0RnVsbHlDb25uZWN0ZWRMYXllcihnYW1lKTtcbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgY29uc29sZS5sb2cocC5nZXQoXCJuZWlnaGJvcnNcIikpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBwLnNldChcIm5laWdoYm9yc1wiLCBnZXROZWlnaGJvcnMobmV0d29ya1N0cnVjdHVyZSwgcCkpO1xuICAgICAgY29uc29sZS5sb2cocC5nZXQoXCJuZWlnaGJvcnNcIikpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gRm9yIGVhY2ggcm91bmQsIGFkZCBhbGwgdGhlIHN5bWJvbHMsIHJhbmRvbWx5IHNlbGVjdCBhIGNvcnJlY3QgYW5zd2VyIGFuZFxuICAvLyBDb25zdHJhaW50czogTXVzdCBlbnN1cmUgdGhhdCBldmVyeW9uZSBoYXMgb25seSBvbmUgc3ltYm9sIGluIGNvbW1vblxuICBfLnRpbWVzKCBudW1UYXNrUm91bmRzLCBpID0+IHtcbiAgICBjb25zdCByb3VuZCA9IGdhbWUuYWRkUm91bmQoKTtcblxuICAgIGNvbnN0IHtzeW1ib2xzLCB0YXNrTmFtZX0gPSBzeW1ib2xTZXRbaV07XG5cbiAgICBjb25zdCB0YXNrU3RhZ2UgPSByb3VuZC5hZGRTdGFnZSh7XG4gICAgICBuYW1lOiBcIlRhc2tcIixcbiAgICAgIGRpc3BsYXlOYW1lOiB0YXNrTmFtZSxcbiAgICAgIGR1cmF0aW9uSW5TZWNvbmRzOiB0YXNrRHVyYXRpb25cbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyh0YXNrTmFtZSk7XG4gICAgdGFza1N0YWdlLnNldChcInRhc2tcIiwgc3ltYm9sU2V0W2ldKTtcbiAgICAvLyBnZXRTeW1ib2xzRm9yUGxheWVycyhzeW1ib2xzLCBhbnN3ZXIsIHNldFNpemUsIHRhc2tOYW1lLCBnYW1lLCBtYXhOdW1PdmVybGFwKTtcbiAgICBsZXQgYW5zd2VyID0gZGlzdHJpYnV0ZVN5bWJvbHNGb3JQbGF5ZXJzKHN5bWJvbHMsIHBsYXllckNvdW50LCB0YXNrTmFtZSwgZ2FtZSk7XG4gICAgdGFza1N0YWdlLnNldChcImFuc3dlclwiLCBhbnN3ZXIpO1xuXG4gICAgY29uc3QgcmVzdWx0U3RhZ2UgPSByb3VuZC5hZGRTdGFnZSh7XG4gICAgICBuYW1lOiBcIlJlc3VsdFwiLFxuICAgICAgZGlzcGxheU5hbWU6IFwiUmVzdWx0XCIsXG4gICAgICBkdXJhdGlvbkluU2Vjb25kczogcmVzdWx0c0R1cmF0aW9uXG4gICAgfSk7XG4gICAgXG4gICAgaWYgKChpKzEpICUgbnVtUm91bmRzQmVmb3JlU3VydmV5ID09PSAwKSB7IC8vIEFmdGVyIDUgdGFzayByb3VuZHMsIGFkZCBhIHN1cnZleSByb3VuZFxuICAgICAgY29uc3Qgc3VydmV5Um91bmQgPSBnYW1lLmFkZFJvdW5kKCk7XG5cbiAgICAgIGNvbnN0IHN1cnZleVN0YWdlcyA9IHN1cnZleVJvdW5kLmFkZFN0YWdlKHtcbiAgICAgICAgbmFtZTogXCJTdXJ2ZXlcIixcbiAgICAgICAgZGlzcGxheU5hbWU6IFwiU3VydmV5IFwiICsgc3VydmV5TnVtLFxuICAgICAgICBkdXJhdGlvbkluU2Vjb25kczogc3VydmV5RHVyYXRpb25cbiAgICAgIH0pXG4gICAgICBcbiAgICAgIHN1cnZleU51bSsrO1xuICAgIH1cblxuICB9KTtcblxuXG5cbiAgZnVuY3Rpb24gZ2V0U3ltYm9sc0ZvclBsYXllcnMoc3ltYm9sU2V0LCBhbnN3ZXIsIHNldFNpemUsIHRhc2tOYW1lLCBnYW1lLCBtYXhOdW1PdmVybGFwKSB7XG4gICAgICBsZXQgc3ltYm9sc1dpdGhvdXRBbnN3ZXIgPSBzeW1ib2xTZXQuZmlsdGVyKHN5bWJvbCA9PiBzeW1ib2wgIT09IGFuc3dlcik7XG4gICAgICBzeW1ib2xzV2l0aG91dEFuc3dlciA9IF8uc2h1ZmZsZShzeW1ib2xzV2l0aG91dEFuc3dlcik7XG4gICAgICBsZXQgbnVtUGxheWVycyA9IGdhbWUucGxheWVycy5sZW5ndGg7XG4gICAgICBsZXQgbnVtT3ZlcmxhcCA9IDA7XG5cblxuICAgICAgLy8gQ3JlYXRlIGEgZGljdGlvbmFyeSB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IHRpbWVzIHN5bWJvbCBoYXMgYmVlbiB1c2VkXG4gICAgICBsZXQgc3ltYm9sRnJlcSA9IHt9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN5bWJvbHNXaXRob3V0QW5zd2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBzeW1ib2wgPSBzeW1ib2xzV2l0aG91dEFuc3dlcltpXVxuICAgICAgICBpZiAoIXN5bWJvbEZyZXEuaGFzT3duUHJvcGVydHkoc3ltYm9sKSkge1xuICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSA9IG51bVBsYXllcnMgLSAxOyAvLyBUb3RhbCB0aW1lIGEgc3ltYm9sIGNhbiBiZSB1c2VkIFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdhbWUucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IHtcbiAgICAgICAgbGV0IHN5bWJvbHNQaWNrZWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzeW1ib2xzV2l0aG91dEFuc3dlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBzeW1ib2wgPSBzeW1ib2xzV2l0aG91dEFuc3dlcltpXVxuICAgICAgICAgIGlmIChzeW1ib2xzUGlja2VkLmxlbmd0aCA8IHNldFNpemUgLSAxKSB7IC8vIEFkZCBzeW1ib2xzIHVudGlsIHNldFNpemUgLSAxIGZvciBhbnN3ZXJcbiAgICAgICAgICAgIGlmIChzeW1ib2xGcmVxW3N5bWJvbF0gLSAxID09PSAwKSB7IC8vIFRoaXMgc3ltYm9sIHdpbGwgb3ZlcmxhcFxuICAgICAgICAgICAgICAgIGlmIChudW1PdmVybGFwIDwgbWF4TnVtT3ZlcmxhcCApIHsgLy8gT25seSBhZGQgaWYgbGVzcyB0aGFuIG1heCBvdmVybGFwXG4gICAgICAgICAgICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goc3ltYm9sKTtcbiAgICAgICAgICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSAtPSAxO1xuICAgICAgICAgICAgICAgICAgbnVtT3ZlcmxhcCArPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3ltYm9sc1BpY2tlZC5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgIHN5bWJvbEZyZXFbc3ltYm9sXSAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzeW1ib2xzUGlja2VkLnB1c2goYW5zd2VyKTsgLy8gQWRkIHRoZSBhbnN3ZXJcbiAgICAgICAgZm9yICh2YXIgc3ltYm9sVG9SZW1vdmUgb2Ygc3ltYm9sc1BpY2tlZCkge1xuICAgICAgICAgIGlmIChzeW1ib2xGcmVxW3N5bWJvbFRvUmVtb3ZlXSA9PT0gMCkgeyAvLyBJZiBzeW1ib2wgaGFzIGJlZW4gcGlja2VkIG4tMSBwbGF5ZXJzIHRpbWVzLCByZW1vdmUgaXQgZnJvbSB0aGUgc2V0XG4gICAgICAgICAgICBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHN5bWJvbHNXaXRob3V0QW5zd2VyLmZpbHRlcihzeW1ib2wgPT4gc3ltYm9sICE9PSBzeW1ib2xUb1JlbW92ZSk7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzeW1ib2xzUGlja2VkID0gXy5zaHVmZmxlKHN5bWJvbHNQaWNrZWQpO1xuXG4gICAgICAgIHBsYXllci5zZXQodGFza05hbWUsIHN5bWJvbHNQaWNrZWQpO1xuICAgICAgfSlcblxuXG4gIH1cblxuICBmdW5jdGlvbiBkaXN0cmlidXRlU3ltYm9sc0ZvclBsYXllcnMoc3ltYm9sU2V0LCBwbGF5ZXJDb3VudCwgdGFza05hbWUsIGdhbWUpIHtcbiAgICBsZXQgZnVsbFN5bWJvbERpc3RyaWJ1dGlvbiA9IGNyZWF0ZVN5bWJvbFNldERpc3RyaWJ1dGlvbihzeW1ib2xTZXQpO1xuXG4gICAgbGV0IGNhcmRTZXRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcGxheWVyQ291bnQrMTsgaSsrKSB7XG4gICAgICBjYXJkU2V0cy5wdXNoKGB0JHtpfWApO1xuICAgIH1cblxuICAgIGxldCBjYXJkRGlzdHJpYnV0aW9ucyA9IHt9XG4gICAgZ2FtZS5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xuICAgICAgbGV0IGNhcmRTZXROdW0gPSBfLnNhbXBsZShjYXJkU2V0cyk7XG4gICAgICBsZXQgcmVtb3ZlZENhcmRTZXROdW0gPSBfLnJlbW92ZShjYXJkU2V0cywgKG51bSkgPT4gbnVtID09PSBjYXJkU2V0TnVtKTtcbiAgICAgIGNhcmREaXN0cmlidXRpb25zW3BsYXllci5nZXQoXCJub2RlSWRcIildID0gY2FyZFNldE51bTtcbiAgICB9KVxuXG4gICAgbGV0IGFuc3dlciA9IF8uc2FtcGxlKGNhcmRTZXRzKTtcbiAgICAvLyBjb25zb2xlLmxvZyhjYXJkU2V0cyk7XG4gICAgLy8gY29uc29sZS5sb2coY2FyZFNldHNbMF0pO1xuICAgIC8vIGNvbnNvbGUubG9nKGBGdWxsIFN5bWJvbCBEaXN0cmlidXRpb24gOiAke2Z1bGxTeW1ib2xEaXN0cmlidXRpb259YCk7XG5cbiAgICBnYW1lLnBsYXllcnMuZm9yRWFjaCgocGxheWVyKSA9PiB7XG4gICAgICBsZXQgc3ltYm9sc1BpY2tlZCA9IGZ1bGxTeW1ib2xEaXN0cmlidXRpb25bYW5zd2VyXVtjYXJkRGlzdHJpYnV0aW9uc1twbGF5ZXIuZ2V0KFwibm9kZUlkXCIpXV1cbiAgICAgIHBsYXllci5zZXQodGFza05hbWUsIHN5bWJvbHNQaWNrZWQpO1xuICAgIH0pXG5cbiAgICByZXR1cm4gYW5zd2VyO1xuXG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTeW1ib2xTZXREaXN0cmlidXRpb24oc3ltYm9sU2V0KSB7XG4gICAgbGV0IGZ1bGxEaXN0cmlidXRpb24gPSB7fTtcbiAgICBzeW1ib2xTZXQuZm9yRWFjaCgoYW5zd2VyKSA9PiB7XG4gICAgICBzeW1ib2xzV2l0aG91dEFuc3dlciA9IHN5bWJvbFNldC5maWx0ZXIocyA9PiBzICE9PSBhbnN3ZXIpO1xuICAgICAgbGV0IGRpc3RyaWJ1dGlvbiA9IHt9O1xuICAgICAgbGV0IGkgPSAwO1xuICAgICAgc3ltYm9sc1dpdGhvdXRBbnN3ZXIuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICBsZXQgc3ltYm9sc1dpdGhvdXRTeW1ib2xUb1JlbW92ZSA9IHN5bWJvbHNXaXRob3V0QW5zd2VyLmZpbHRlcihyZW1vdmUgPT4gcmVtb3ZlICE9PSBzKTtcbiAgICAgICAgc3ltYm9sc1dpdGhvdXRTeW1ib2xUb1JlbW92ZS5wdXNoKGFuc3dlcik7XG4gICAgICAgIGRpc3RyaWJ1dGlvbltzXSA9IF8uc29ydEJ5KHN5bWJvbHNXaXRob3V0U3ltYm9sVG9SZW1vdmUpO1xuICAgICAgICBpKys7XG4gICAgICB9KVxuICAgICAgZnVsbERpc3RyaWJ1dGlvblthbnN3ZXJdID0gZGlzdHJpYnV0aW9uO1xuICAgIH0pXG5cbiAgICByZXR1cm4gZnVsbERpc3RyaWJ1dGlvbjtcbiAgfVxuXG4gIC8vIFNodWZmbGluZyBhcnJheXM6XG4gIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUwNTM2MDQ0L3N3YXBwaW5nLWFsbC1lbGVtZW50cy1vZi1hbi1hcnJheS1leGNlcHQtZm9yLWZpcnN0LWFuZC1sYXN0XG4gIGZ1bmN0aW9uIHNodWZmbGUoc3ltYm9sU2V0KSB7XG4gICAgZm9yIChpID0gc3ltYm9sU2V0Lmxlbmd0aCAtMSA7IGkgPiAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcblxuICAgICAgW3N5bWJvbFNldFtpXSwgc3ltYm9sU2V0W2pdXSA9IFtzeW1ib2xTZXRbal0sIHN5bWJvbFNldFtpXV07XG4gICAgfVxuICAgIHJldHVybiBzeW1ib2xTZXQ7XG4gIH1cblxufSk7XG4iXX0=
