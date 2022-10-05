import Empirica from "meteor/empirica:core";
import "./bots.js";
import "./callbacks.js";

import { testSymbols, testTangrams } from "./constants"; 
import { getNeighbors, getFullyConnectedLayer } from "./util";

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
      maxNumOverlap,
    },
  } = game;


  const symbolSet = testTangrams;
  const setSize = setSizeBasedOnPlayerCount ? playerCount + 1 : defaultSetSize; //TODO: can change default value in settings
  const numRoundsBeforeSurvey = numTaskRounds/numSurveyRounds;

  let colors = ["Green", "Red", "Yellow", "Blue", "Purple", "White", "Black"]
  let surveyNum = 1
  colors = shuffle(colors);

  game.players.forEach((player, i) => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    player.set("score", 0);

    // Give each player a nodeId based on their position (indexed at 1)
    player.set("nodeId", i + 1);
    player.set("name", player.id);
    player.set("anonymousName", colors[i])
  });

  if (game.players.length < game.treatment.playerCount) { // if not a full game, default to fully connected layer
    getFullyConnectedLayer(game);
    game.players.forEach((p) => {
      console.log(p.get("neighbors"));
    });
  } else {
    game.players.forEach((p) => {
      p.set("neighbors", getNeighbors(networkStructure, p));
      console.log(p.get("neighbors"));
    });
  }

  // For each round, add all the symbols, randomly select a correct answer and
  // Constraints: Must ensure that everyone has only one symbol in common
  _.times( numTaskRounds, i => {
    const round = game.addRound();

    const {symbols, taskName, answer} = symbolSet[i];

    const taskStage = round.addStage({
      name: "Task",
      displayName: taskName,
      answer: answer,
      durationInSeconds: taskDuration
    });
    taskStage.set("task", symbolSet[i]);
    getSymbolsForPlayers(symbols, answer, setSize, taskName, game, maxNumOverlap)
    taskStage.set("answer", symbolSet[i].answer)

    const resultStage = round.addStage({
      name: "Result",
      displayName: "Result",
      durationInSeconds: resultsDuration
    });
    
    if ((i+1) % numRoundsBeforeSurvey === 0) { // After 5 task rounds, add a survey round
      const surveyRound = game.addRound();

      const surveyStages = surveyRound.addStage({
        name: "Survey",
        displayName: "Survey " + surveyNum,
        durationInSeconds: surveyDuration
      })
      
      surveyNum++;
    }

  });



  function getSymbolsForPlayers(symbolSet, answer, setSize, taskName, game, maxNumOverlap) {
      let symbolsWithoutAnswer = symbolSet.filter(symbol => symbol !== answer);
      symbolsWithoutAnswer = shuffle(symbolsWithoutAnswer);
      let numPlayers = game.players.length;
      let numOverlap = 0;


      // Create a dictionary to keep track of how many times symbol has been used
      let symbolFreq = {}
      for (let i = 0; i < symbolsWithoutAnswer.length; i++) {
        let symbol = symbolsWithoutAnswer[i]
        if (!symbolFreq.hasOwnProperty(symbol)) {
          symbolFreq[symbol] = numPlayers - 1; // Total time a symbol can be used 
        }
      }

      game.players.forEach((player) => {
        let symbolsPicked = [];
        for (let i = 0; i < symbolsWithoutAnswer.length; i++) {
          let symbol = symbolsWithoutAnswer[i]
          if (symbolsPicked.length < setSize - 1) { // Add symbols until setSize - 1 for answer
            if (symbolFreq[symbol] - 1 === 0) { // This symbol will overlap
                if (numOverlap < maxNumOverlap ) { // Only add if less than max overlap
                  symbolsPicked.push(symbol);
                  symbolFreq[symbol] -= 1;
                  numOverlap += 1
                }
            } else {
              symbolsPicked.push(symbol);
              symbolFreq[symbol] -= 1;
            }
          }
        }
        symbolsPicked.push(answer); // Add the answer
        for (var symbolToRemove of symbolsPicked) {
          if (symbolFreq[symbolToRemove] === 0) { // If symbol has been picked n-1 players times, remove it from the set
            symbolsWithoutAnswer = symbolsWithoutAnswer.filter(symbol => symbol !== symbolToRemove);

          }
        }

        symbolsPicked = shuffle(symbolsPicked);

        player.set(taskName, symbolsPicked);
      })


  }

  // Shuffling arrays:
  // https://stackoverflow.com/questions/50536044/swapping-all-elements-of-an-array-except-for-first-and-last
  function shuffle(symbolSet) {
    for (i = symbolSet.length -1 ; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [symbolSet[i], symbolSet[j]] = [symbolSet[j], symbolSet[i]];
    }
    return symbolSet;
  }

});
