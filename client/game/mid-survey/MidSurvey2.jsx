import React from "react";
import Slider from "meteor/empirica:slider";

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
import { Centered } from "meteor/empirica:core";

export default class MidSurveyTwo extends React.Component {
    state = {}

  componentDidMount() {
    const { game, round, stage, player } = this.props;

    player.get("neighbors").forEach(otherNodeId => {
        const otherPlayerId = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId)).get("anonymousName")
        this.setState({[otherPlayerId] : 0});
    })
  }

  renderLabels = (val) => {
      if (val === 0) { // Min value
          return `${val} Unhappy`;
      } else if (val === 3) {
          return `${val} Neutral`;
      } else if (val === 6) { // Max value
          return `${val} Happy`;
      }
      return ""
  }

  handleSubmit = event => {
    const { onNext, player } = this.props;
    const surveyNumber = player.get("surveyNumber");

    event.preventDefault();
    // TODO: log player response to survey question
    player.round.set(`survey_${surveyNumber}`, this.state);
    player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));


    onNext();
  };

  

  render() {
    const { game, round, stage, player } = this.props;
    const { response } = this.state;

    const network = player.get("neighbors");

    const surveyNumber = player.get("surveyNumber");
    const completedWidth = 590/5 * surveyNumber
    const uncompletedWidth = 590 - completedWidth;
    const offset = 590/5 * 0.5;
    const stageNumPosition = completedWidth - offset;

    return (
      <Centered>
        <div className="intro-heading questionnaire-heading"> To complete the challenge, please fill in the following questionnaire </div>
            <div className="questionnaire-content-container">
                <div className="progress-bar">
                    <div className="completed-bar">
                        <div className="completed-heading" style={{marginLeft: stageNumPosition }}> {surveyNumber} </div>
                        <img src={`images/hr-color.png`} width={`${completedWidth} px`} height="7px" />
                    </div>
                    <img src={`images/hr-color-dark.png`} width={`${uncompletedWidth} px`} height="7px" />
                </div>
                <div className="questionnaire-body">
                    <label className="questionnaire-question"> Please rate how well you have been working with each teammate in the recent trials?</label>
                    {network.map(otherNodeId => {
                        const otherPlayer = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId));
                        const otherPlayerId = otherPlayer.get("anonymousName");
                        const playerIsOnline = otherPlayer.online === true && !otherPlayer.get("inactive");
                        const handleSliderChange = (num) => {
                            // Rounding the number to 2 decimals max
                            this.setState({[otherPlayerId] : num});
                            player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

                          };
                        
                        return (
                            <div className="player-slider-container">
                                <div className="player-label"> {otherPlayerId} {playerIsOnline ? "" : " (offline)"} </div>
                                <Slider
                                    key={otherNodeId}
                                    min={0}
                                    max={6}
                                    stepSize={1}
                                    disabled={false}
                                    showTrackFill={false}
                                    name={otherPlayerId}
                                    value={this.state[otherPlayerId]}
                                    labelRenderer={this.renderLabels}
                                    onChange={handleSliderChange}
                                />
                                <div className="slider-value-container" style={{width: `15%`}}> 
                                    <div className="slider-value">{this.state[otherPlayerId]} </div>
                                </div>
                            </div>
                            )
                        })
                    }

                </div>
                <form className="questionnaire-btn-container" onSubmit={this.handleSubmit}>
                    <button 
                        className="arrow-button button-submit"
                        type="submit"> Submit </button> 
                </form>
            </div>
      </Centered>
    );
  }
}
