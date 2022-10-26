import Empirica from "meteor/empirica:core";
import { render } from "react-dom";
import ExitSurvey from "./exit/ExitSurvey";
import PreQualExitSurvey from "./exit/PreQualExitSurvey";
import FinalMidSurveyOne from "./exit/final-mid-survey/FinalMidSurvey1";
import FinalMidSurveyTwo from "./exit/final-mid-survey/FinalMidSurvey2";
import FinalMidSurveyThree from "./exit/final-mid-survey/FinalMidSurvey3";
import FinalMidSurveyFour from "./exit/final-mid-survey/FinalMidSurvey4";
import FinalMidSurveyFive from "./exit/final-mid-survey/FinalMidSurvey5";
import Thanks from "./exit/Thanks";
import Sorry from "./exit/Sorry";
import About from "./game/About";
import Round from "./game/Round";
import Consent from "./intro/Consent";

import NetworkSurveyOne from "./intro/network-survey/NetworkSurvey1";
import NetworkSurveyTwo from "./intro/network-survey/NetworkSurvey2";
import NetworkSurveyThree from "./intro/network-survey/NetworkSurvey3";


import TutorialPageOne from "./intro/tutorial/TutorialPageOne";
import TutorialPageTwo from "./intro/tutorial/TutorialPageTwo";
import TutorialPageThree from "./intro/tutorial/TutorialPageThree";
import TutorialPageFour from "./intro/tutorial/TutorialPageFour";

import AllQuiz from "./intro/quiz/AllQuiz";
import QuizFive from "./intro/quiz/QuizFive";
import QuizSix from "./intro/quiz/QuizSix";
import QuizSeven from "./intro/quiz/QuizSeven";
import QuizTwo from "./intro/quiz/QuizTwo";
import QuizOne from "./intro/quiz/QuizOne";

import QuizOverview from "./intro/quiz/QuizOverview";

import EnglishScreen from "./intro/english-screening/EnglishScreen";

import DescribeSymbolQuestion from "./intro/DescribeSymbolQuestion";

import Schedule from "./intro/Schedule";

import NewPlayer from "./intro/NewPlayer";


// Get rid of Breadcrumb component
Empirica.breadcrumb(() => null);

// Set the About Component you want to use for the About dialog (optional).
Empirica.about(About);

// Set the Consent Component you want to present players (optional).
Empirica.consent(Consent);

// Set the component for getting the player id (optional)
Empirica.newPlayer(NewPlayer);

// Introduction pages to show before they play the game (optional).
// At this point they have been assigned a treatment. You can return
// different instruction steps depending on the assigned treatment.
Empirica.introSteps((game, treatment) => {
  // MidSurveyFive, MidSurveyFour, MidSurveyThree, MidSurveyTwo, MidSurveyOne,
  const durationConsent = [QuizOne];
  const englishScreen = [EnglishScreen];
  const networkSurvey = [NetworkSurveyOne, NetworkSurveyTwo, NetworkSurveyThree];
  const tutorialSteps = [TutorialPageOne, TutorialPageThree, TutorialPageFour,];
  const symbolDescription = [DescribeSymbolQuestion];
  // const quizSteps = [QuizOne, QuizTwo, QuizThree, QuizFour, QuizFive, QuizSix, QuizSeven, QuizEight,];
  // const quizSteps = [AllQuiz];
  const quizSteps = [QuizFive, QuizSix, QuizSeven, QuizTwo];
  const quizOverview = [QuizOverview];
  const schedule = [Schedule]
  let steps;
  if (game.treatment.isPreQualification) {
    steps = durationConsent.concat(englishScreen, tutorialSteps, quizSteps, symbolDescription, networkSurvey, schedule);
    // steps = englishScreen.concat(networkSurvey,tutorialSteps,quizSteps, symbolDescription, schedule);
    // steps = quizSteps.concat(symbolDescription);

  } else {
    steps = tutorialSteps.concat(quizOverview);
  }

  if (treatment.skipIntro) {
    return [];
  }
  // return [QuizFive, QuizSix, QuizSeven, QuizTwo];
  return steps;
});

// The Round component containing the game UI logic.
// This is where you will be doing the most development.
// See client/game/Round.jsx to learn more.
Empirica.round(Round);

// End of Game pages. These may vary depending on player or game information.
// For example we can show the score of the user, or we can show them a
// different message if they actually could not participate the game (timed
// out), etc.
// The last step will be the last page shown to user and will be shown to the
// user if they come back to the website.
// If you don't return anything, or do not define this function, a default
// exit screen will be shown.
Empirica.exitSteps((game, player) => {
  if (player.exitStatus && player.exitStatus === "custom" && 
      (player.exitReason === "maxGameTimeReached" || player.exitReason === "minPlayerCountNotMaintained")) {
    return [FinalMidSurveyOne, FinalMidSurveyTwo, FinalMidSurveyThree, FinalMidSurveyFour, FinalMidSurveyFive, ExitSurvey, Thanks];
  }
  if (player.exitStatus && player.exitStatus === "custom" &&
      (player.exitReason === "preQualSuccess")) {
        return [PreQualExitSurvey, Thanks];
  }

  if (
    !game ||
    (player.exitStatus &&
      player.exitStatus !== "finished" &&
      player.exitReason !== "playerQuit")
  ) {
    return [Sorry];
  }
  return [ExitSurvey, Thanks];
});

// Start the app render tree.
// NB: This must be called after any other Empirica calls (Empirica.round(),
// Empirica.introSteps(), ...).
// It is required and usually does not need changing.
Meteor.startup(() => {
  render(Empirica.routes(), document.getElementById("app"));
});
