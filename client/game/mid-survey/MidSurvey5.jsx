import React from "react";
import Slider from "meteor/empirica:slider";

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
import { Centered } from "meteor/empirica:core";
import PlayerTab from "../PlayerTab";

export default class MidSurveyFive extends React.Component {
  state = { response: "" };

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSliderChange = num => {
    const { stage, player } = this.props;
    // Rounding the number to 2 decimals max
    this.setState({sliderValue : num}) 
    player.stage.set("sliderValue", num);

  };

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
    const { onNext, player, stage } = this.props;
    const surveyNumber = player.get("surveyNumber");

    event.preventDefault();
    // TODO: log player response to survey question
    player.round.set(`survey_${surveyNumber}`, this.state);
    stage.set(`survey_${surveyNumber}`, this.state);
    player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

    player.set("submitted", true);
  };
  

  render() {
    const { game, round, stage, player } = this.props;
    const { response } = this.state;

    const submitted = player.get("submitted");

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
                    <label className="questionnaire-question"> Do you think your group could improve its efficiency? If so, how? </label>
                    <textarea
                        className="survey-textarea"
                        dir="auto"
                        id="response"
                        name="response"
                        value={response}
                        onChange={this.handleChange}
                    />

                </div>
                <form className="questionnaire-btn-container" onSubmit={this.handleSubmit}>
                    <button 
                        className={!response ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}
                        disabled={!response} type="submit"> Submit </button> 
                </form>
            </div>
      </Centered>
    );
  }
}
