import React from "react";
import Slider from "meteor/empirica:slider";

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
import { Centered } from "meteor/empirica:core";

export default class MidSurveyFour extends React.Component {
  state = { sliderValue: 0 };

  handleSliderChange = num => {
    const { stage, player } = this.props;
    // Rounding the number to 2 decimals max
    this.setState({sliderValue : num}) 
    player.stage.set("sliderValue", num);
    player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

  };

  renderLabels = (val) => {
      if (val === 0) { // Min value
          return `${val} Poor`;
      } else if (val === 3) {
          return `${val} Neutral`;
      } else if (val === 6) { // Max value
          return `${val} Great`;
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

    const surveyNumber = player.get("surveyNumber");
    const completedWidth = 590/5 * surveyNumber
    const uncompletedWidth = 590 - completedWidth;
    const offset = 590/5 * 0.5;
    const stageNumPosition = completedWidth - offset;

    const sliderValue = this.state.sliderValue;
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
                    <label className="questionnaire-question"> On the scale below, rate how your team has been working in the recent trials </label>
                    <Slider
                        min={0}
                        max={6}
                        stepSize={1}
                        disabled={false}
                        showTrackFill={false}
                        value={sliderValue}
                        labelRenderer={this.renderLabels}
                        onChange={this.handleSliderChange}
                    />
                    <div className="slider-value-container"> 
                        <div className="slider-value">{sliderValue} </div>
                    </div>

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
