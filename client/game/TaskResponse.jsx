import React from "react";
import Slider from "meteor/empirica:slider";
import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";

import SymbolButton from "./SymbolButton.jsx";

export default class TaskResponse extends React.Component {
  constructor(props) {
    super(props);  
    this.state = {
      selectedButton: props.player.get("symbolSelected") | "",
    }
  }

  handleSubmit = event => {
    const { stage, player, game } = this.props;

    event.preventDefault();

    stage.append("log", {
      verb: "playerSubmitted",
      subjectId: player.id,
      object: true,
      at: moment(TimeSync.serverTime(null, 1000)),
    })
    player.set("submitted", true);
  };

  handleReconsider = event => {
    const { stage, player, game } = this.props;

    event.preventDefault();
    console.log("Reconsidering...");
    player.set("submitted", false);

    stage.append("log", {
      verb: "playerReconsidered",
      subjectId: player.id,
      object: true,
      at: moment(TimeSync.serverTime(null, 1000)),
    })

    // this.setState({selectedButton: ""});

  }

  handleButtonSelect= (symbolName) => {
    const { stage, player, game } = this.props;
    // stage.set("selectedButton", symbolName);
    this.setState({selectedButton: symbolName});

    stage.append("log", {
      verb: "selectingSymbol",
      subjectId: player.id,
      object: symbolName,
      at: moment(TimeSync.serverTime(null, 1000)),
    });

  }

  renderSubmitted() {
    return (
      <div>
        <h5>Waiting on other players...</h5>
        Please wait until all players are ready. If you would like to reconsider your answer, click on the reconsider button.
      </div>
    );
  }

  renderSlider() {
    const { player } = this.props;
    const value = player.round.get("value");
    return (
      <Slider
        min={0}
        max={1}
        stepSize={0.01}
        labelStepSize={0.25}
        onChange={this.handleChange}
        value={value}
        hideHandleOnEmpty
      />
    );
  }

  renderButton() {
    const { stage, player, game } = this.props;
    // const task = stage.get("task");
    const selectedSymbol = player.get("symbolSelected")
    const task = player.get(`${stage.displayName}`)
    return (
      task.map((symbol) => 
      <SymbolButton 
        key={symbol}
        name={symbol}
        handleButtonSelect={(symbolName) => this.handleButtonSelect(symbolName)}
        selected={selectedSymbol === symbol}
        stage={stage}
        game={game}
        player={player}
      />
      )
    );
  }

  render() {
    const { stage, round, player, game } = this.props;


    const selected = player.get("symbolSelected")
    const submitted = player.get("submitted");

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

    // If the player already submitted, don't show the slider or submit button
    
    const disabled = player.get("submitted");
    return (
      <div className="task-response-container">
        <div className="task-response-header">
          <p className="header"> MY CARD</p>
          <div className="submission-dots-container">
            <p className="header"> SUBMITTED ANSWERS </p>
            {filledDots}
            {unfilledDots}
          </div>
        </div>
        <div className="task-response-body">
          {/* <div className="submission-message-container">
            {submitted ? this.renderSubmitted() : ""}
          </div> */}
          <div className="task-response">
              {this.renderButton()}
          </div>
        </div>
          <div className="button-container">
              <form onSubmit={this.handleSubmit} style={{opacity: submitted ? 0 : 1}}>
                <button 
                  className={!selected || submitted ? "arrow-button button-submit-disabled" : "arrow-button button-submit"} 
                  disabled= {!selected || submitted ? true : false} type="submit"> Submit </button> 
              </form>
              <form onSubmit={this.handleReconsider} style={{opacity: !submitted ? 0 : 1}}>
                <button className={!submitted ? "arrow-button button-reconsider-disabled" : "arrow-button button-reconsider"} disabled={!submitted ? true : false}> Reconsider </button> 
              </form>
          </div>

        </div>
    );
  }
}
