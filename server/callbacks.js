import Empirica from "meteor/empirica:core";

import { getFullyConnectedLayer } from "./util";


// onGameStart is triggered opnce per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart(game => {
  console.log("Game started");
  game.players.forEach((player) => {
    player.set("inactive", false);
    const network = player.get("neighbors");
    const activeChats = [];
    network.map(otherNodeId => {
      var pairOfPlayers = [player.get("nodeId"), parseInt(otherNodeId)];
      pairOfPlayers.sort((p1,p2) => p1 - p2);
      const otherPlayer = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId));
      // const otherPlayerId = otherPlayer.id;
      const chatKey = `${pairOfPlayers[0]}-${pairOfPlayers[1]}`;
      activeChats.push(chatKey);
    });
    // Default all chats to be open when game starts
    player.set("activeChats", activeChats);
    console.log(player.get("activeChats"));
  });
  game.set("previousNumActivePlayers", game.players.length);
});

// onRoundStart is triggered before each round starts, and before onStageStart.
// It receives the same options as onGameStart, and the round that is starting.
Empirica.onRoundStart((game, round) => {
  game.players.forEach((player) => {
    player.set("submitted", false);
    player.set("symbolSelected", "");
  });
  round.set("result", false);
  round.set("numPlayersSubmitted", 0);
  // const activePlayers = game.players.filter(p => p.online === true && !p.get("inactive"));
  const activePlayers = game.players.filter(p => !p.get("inactive"));

  if (activePlayers.length < game.get("previousNumActivePlayers") ) { // Someone left in the middle of the round
    if (game.treatment.endGameIfPlayerIdle) {
      activePlayers.forEach((p) => {
        p.exit("someoneInactive");
      })
    } else {
      getFullyConnectedLayer(game); // Updates the neighbors to be fully connected
    }
  
  }
  game.set("previousNumActivePlayers", activePlayers.length);

  console.log("Round Started");

});

// onStageStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.
Empirica.onStageStart((game, round, stage) => {
  console.log("Stage Started")
  // const activePlayers = game.players.filter(p => p.online === true && !p.get("inactive"));
  const activePlayers = game.players.filter(p => !p.get("inactive"));

  if (stage.name === "Task") {
    activePlayers.forEach((player) => {
      console.log(player.id);
      console.log( `Symbols : ${player.get(`${stage.displayName}`)}`);
    });
    console.log(`Answer: ${stage.get("answer")}`);
  }
  if (stage.name === "Survey") {
    activePlayers.forEach((player) => {
      player.set("surveyNumber" , 1)
    });
  }
  // game.players.forEach((player) => {
  //   player.set("submitted", false);
  // });
  // stage.set("showResults", false);
  // stage.set("resultsShown", false);

});

// onStageEnd is triggered after each stage.
// It receives the same options as onRoundEnd, and the stage that just ended.
Empirica.onStageEnd((game, round, stage) =>{
  console.log("Stage Ended")
  
});

// onRoundEnd is triggered after each round.
// It receives the same options as onGameEnd, and the round that just ended.
Empirica.onRoundEnd((game, round) => {
  // game.players.forEach(player => {
  //   const value = player.round.get("value") || 0;
  //   const prevScore = player.get("score") || 0;
  //   player.set("score", prevScore + value);
  // });

});

// onGameEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd(game => {});

// ===========================================================================
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

Empirica.onSet((
  game,
  round,
  stage,
  player, // Player who made the change
  target, // Object on which the change was made (eg. player.set() => player)
  targetType, // Type of object on which the change was made (eg. player.set() => "player")
  key, // Key of changed value (e.g. player.set("score", 1) => "score")
  value, // New value
  prevValue // Previous value
) => {
  const players = game.players;
  // const activePlayers = game.players.filter(p => p.online === true && !p.get("inactive"));
  const activePlayers = game.players.filter(p => !p.get("inactive"));

  // Some player decides to reconsider their answer
  console.log("key", key);
  if (key === "submitted") { 
    console.log("Updated a submission");
    // Checks if everyone has submitted their answer and if so, submit the stage
    let allSubmitted = true;
    let numPlayersSubmitted = 0;
    activePlayers.forEach((player) => {
      if (player.get("submitted")) {
        numPlayersSubmitted += 1;
      }
      allSubmitted = player.get("submitted") && allSubmitted;
    })
    round.set("numPlayersSubmitted", numPlayersSubmitted);
    if (allSubmitted) {
      const log = stage.get("log");
      computeScore(activePlayers, stage, round);
      // Need to submit for submit the stage for every player
      game.players.forEach((player) => {
        player.stage.submit();
      })
    }
  //   if (stage.get("resultsShown")) {
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
  }

  // else if (key === "inactive") {
    // getFullyConnectedLayer(game);
  // }

  return;

});

function computeScore(activePlayers, stage, round) {
  let success = true;
  console.log("CORRECT ANSWER:")
  console.log(stage.get("answer"));
  console.log("Players guessed:")

  activePlayers.forEach(player => {
    const submission = player.get("symbolSelected");
    console.log(submission);
    if (submission !== stage.get("answer")) {
      success = false
    }
  })
  round.set("result", success);
  if (success) {
    activePlayers.forEach(player => {
      const prevScore = player.get("score") || 0;
      player.set("score", prevScore + 1);
    })
    console.log(" All players got it correctly");
  } 
}

// // onAppend is called when the experiment code call the `.append()` method
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
