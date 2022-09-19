import React from "react";

import PlayerProfile from "./PlayerProfile.jsx";
import SocialExposure from "./SocialExposure.jsx";
import MyNetwork from "./MyNetwork.jsx";
import RoundMetaData from './RoundMetaData.jsx';
import Results from "./Results.jsx";
import Task from "./Task.jsx";

import MidSurveyOne from "./mid-survey/MidSurvey1";
import MidSurveyTwo from "./mid-survey/MidSurvey2";
import MidSurveyThree from "./mid-survey/MidSurvey3";
import MidSurveyFour from "./mid-survey/MidSurvey4";
import MidSurveyFive from "./mid-survey/MidSurvey5";

import InactiveTimer from "./InactiveTimer.jsx";
import Modal from "./Modal";

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
import GameTimer from "./GameTimer.jsx";

export default class Round extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // activeChats : [],
      modalIsOpen: false,
    }
}


  audio = new Audio(`sounds/Game Start Countdown Sound.wav`);

  componentDidMount() {
    const {round, stage, player} = this.props;
    // Set the player's first activity at the start of the round
    player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

    if (round.index === 0 && stage.index === 0) {
      // Play game start sound cue
      this.audio.play();
    }

  }

  onOpenModal = () => {
    this.setState({modalIsOpen: true});
  }

  onCloseModal = () => {
    const {player} = this.props;
    this.setState({modalIsOpen: false});
    player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
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
    // const numActivePlayers = game.players.filter(p => p.online === true && !p.get("inactive")).length;
    const numActivePlayers = game.players.filter(p => !p.get("inactive")).length;

    let completedWidth = (window.innerWidth/numActivePlayers * round.get("numPlayersSubmitted"));
    let uncompletedWidth = (window.innerWidth - completedWidth);

    completedWidth -= windowOffset;
    uncompletedWidth -= windowOffset;

    // <div className="completed-bar">
    //     <img src={`images/hr-color.png`} width={`${completedWidth} px`} height="7px" />
    // </div>

    const currentTime = moment(TimeSync.serverTime(null, 1000));
    const playerLastActive = player.get("lastActive");
    const timeDiff = currentTime.diff(playerLastActive, 'seconds');

    if (timeDiff > 10) {
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    }

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
    const { game, player } = this.props;
    const submitted = player.get("submitted");

    if (submitted) {
      return this.renderSubmitted();
    }

    const surveyNumber = player.get("surveyNumber");
    if (surveyNumber === 1) {
      return (
      <>
        <MidSurveyOne {...this.props} onNext={this.onNext}/>
        <InactiveTimer game={game} player={player} />
      </>
      )
    } else if (surveyNumber === 2) {
      return (
      <>
        <MidSurveyTwo {...this.props} onNext={this.onNext}/>
        <InactiveTimer game={game} player={player} />
      </>
      )
    } else if (surveyNumber === 3) {
      return (
        <>
          <MidSurveyThree {...this.props} onNext={this.onNext}/>
          <InactiveTimer game={game} player={player} />
        </>
      )    
    } else if (surveyNumber === 4) {
      return (
        <>
          <MidSurveyFour {...this.props} onNext={this.onNext}/>
          <InactiveTimer game={game} player={player} />
        </>
     )    
    } else if (surveyNumber === 5) {
      return (
        <>
          <MidSurveyFive {...this.props} onNext={this.onNext}/>
          <InactiveTimer game={game} player={player} />
        </>
      )    
    }
  }

  render() {
    const { stage, round, player, game } = this.props;
    // const numActivePlayers = game.players.filter(p => p.online === true && !p.get("inactive")).length;
    const numActivePlayers = game.players.filter(p => !p.get("inactive")).length;

    if (stage.name === "Result") {
      return (
        <div className="round">
          <Results game={game} round={round} stage={stage}/> 
        </div>
      )
    } else if (stage.name === "Survey"){
      return this.renderSurvey()

    } else { // Load the round
      
      return (
        <div className="round">
          <div className="content">
            {game.treatment.maxGameTime && <GameTimer game={game}/>}
            <div className="round-task-container">
              <RoundMetaData game={game} round={round} stage={stage} player={player} />
              <Task game={game} round={round} stage={stage} player={player} />

            </div>
            {/* <PlayerProfile player={player} stage={stage} game={game} /> */}
              {/* <MyNetwork game={game} round={round} stage={stage} player={player} onOpenChat={(otherPlayerNodeId) => this.onOpenChat(otherPlayerNodeId)}/> */}
            <SocialExposure 
              game={game} round={round} stage={stage} player={player} 
              // onOpenChat = {(otherPlayerNodeId) => this.onOpenChat(otherPlayerNodeId)} 
              // onCloseChat={(customKey) => this.onCloseChat(customKey)} 
              activeChats={this.state.activeChats} 
            />
          </div>
        </div>
      );
    }
  } 
}
