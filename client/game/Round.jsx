import React from "react";

import PlayerProfile from "./PlayerProfile.jsx";
import SocialExposure from "./SocialExposure.jsx";
import MyNetwork from "./MyNetwork.jsx";
import Results from "./Results.jsx";
import Task from "./Task.jsx";
import Timer from "./Timer.jsx";

import MidSurveyOne from "./mid-survey/MidSurvey1";
import MidSurveyTwo from "./mid-survey/MidSurvey2";
import MidSurveyThree from "./mid-survey/MidSurvey3";
import MidSurveyFour from "./mid-survey/MidSurvey4";
import MidSurveyFive from "./mid-survey/MidSurvey5";

export default class Round extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeChats : [],
    }
}

  onOpenChat = (otherPlayerNodeId) => {
    const {player} = this.props;
    var pairOfPlayers = [player.get("nodeId"), parseInt(otherPlayerNodeId)];
    pairOfPlayers.sort((p1,p2) => p1 - p2);
    var customKey = `${pairOfPlayers[0]}-${pairOfPlayers[1]}`;
    console.log(this.state);
    console.log(this.state.activeChats);
    if (!this.state.activeChats.includes(customKey)) {
      this.state.activeChats.push(customKey);
    }

    console.log(this.state);
  }

  onCloseChat = (customKey) => {
    const newActiveChats = this.state.activeChats.filter((chat) => chat !== customKey);
    this.setState({activeChats : newActiveChats});
    console.log(this.state);
  }

  onNext = () => {
    const { player } = this.props;
    const curSurveyNumber = player.get("surveyNumber");
    player.set("surveyNumber", curSurveyNumber + 1);
  }

  renderSubmitted() {
    const { stage, round, player, game } = this.props;

    // Create a list of dots to show how many players submitted
    // const completedWidth = 590/game.players.length * round.get("numPlayersSubmitted");
    // const uncompletedWidth = 590 - completedWidth;

    const windowOffset = 75;
    let completedWidth = (window.innerWidth/game.players.length * round.get("numPlayersSubmitted"));
    let uncompletedWidth = (window.innerWidth - completedWidth);

    completedWidth -= windowOffset;
    uncompletedWidth -= windowOffset;

    <div className="completed-bar">
        <img src={`images/hr-color.png`} width={`${completedWidth} px`} height="7px" />
    </div>

    return (
      <div className="survey-wait-container">
        <img className="survey-wait-static-image" src={`images/title-please-hold.png`} />
        <div className="survey-wait-content">
          <h1 className="results-text">Waiting for all members </h1>
          <div className="progress-bar">
            <img src={`images/hr-color.png`} width={`${completedWidth} px`} height="3px" />
            <img src={`images/hr-white.png`} width={`${uncompletedWidth} px`} height="3px" />
          </div>
        </div>
      </div>
    );
  }

  renderSurvey = () => {
    const { player } = this.props;
    const submitted = player.get("submitted");
    if (submitted) {
      return this.renderSubmitted();
    }

    const surveyNumber = player.get("surveyNumber");
    if (surveyNumber === 1) {
      return <MidSurveyOne {...this.props} onNext={this.onNext}/>
    } else if (surveyNumber === 2) {
      return <MidSurveyTwo {...this.props} onNext={this.onNext}/>
    } else if (surveyNumber === 3) {
      return <MidSurveyThree {...this.props} onNext={this.onNext}/>
    } else if (surveyNumber === 4) {
      return <MidSurveyFour {...this.props} onNext={this.onNext}/>
    } else if (surveyNumber === 5) {
      return <MidSurveyFive {...this.props} onNext={this.onNext}/>
    }
  }

  render() {
    const { stage, round, player, game } = this.props;

    // Create a list of dots to show how many players submitted
    const playersSubmitted = round.get("numPlayersSubmitted");
    const playersNotSubmitted = game.players.length - playersSubmitted;
    let filledDots = [];
    let unfilledDots = [];
    for (let i = 0; i < playersSubmitted; i++) {
      filledDots.push(<span className="filled-dot"></span>)
    }
    for (let i = 0; i < playersNotSubmitted; i++) {
      unfilledDots.push(<span className="empty-dot"></span>)
    }

    // if (showResults) {
    //   const result = stage.get("result")
    //   return (
    //   <div>
    //     <StageResult stage={stage} showResults={showResults} result={result} timer={10}/>
    //   </div>
    //   )
    // }

    if (stage.name === "Result") {
      return (
        <div className="round">
          <Results game={game} round={round} stage={stage}/> 
          {/* <Timer stage={stage}/> */}
        </div>
      )
    } else if (stage.name === "Survey"){
      return this.renderSurvey()

    } else { // Load the round
      
      return (
        <div className="round">
          <div className="content">
            {/* <PlayerProfile player={player} stage={stage} game={game} /> */}
            <div className="task-network-container">
              <Task game={game} round={round} stage={stage} player={player} />
              <MyNetwork game={game} round={round} stage={stage} player={player} onOpenChat={(otherPlayerNodeId) => this.onOpenChat(otherPlayerNodeId)}/>
            </div>
            <SocialExposure game={game} round={round} stage={stage} player={player} onCloseChat={(customKey) => this.onCloseChat(customKey)} activeChats={this.state.activeChats} />
            {/* <Timer stage={stage} /> */}
          </div>
        </div>
      );
    }
  } 
}
