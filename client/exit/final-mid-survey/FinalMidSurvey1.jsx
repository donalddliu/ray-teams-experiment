import React from "react";

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
import { Centered } from "meteor/empirica:core";

const Radio = ({ selected, name, value, label, playerIsOnline, onChange }) => (
    <label className="questionnaire-radio">
        <input
        className="quiz-button"
        type="radio"
        name={name}
        value={value}
        checked={selected === value}
        onChange={onChange}
        />
        {label} {playerIsOnline ? "" : " (offline)"}
    </label>
);

export default class FinalMidSurveyOne extends React.Component {
  static stepName = "FinalMidSurveyOne";

  state = { };

  handleChange = event => {
    const { player } = this.props;

    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
    player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

  };

  handleSubmit = event => {
    const { onNext, player, stage } = this.props;

    event.preventDefault();
    // TODO: log player response to survey question
    player.set(`final_survey_1`, this.state);
    player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

    this.props.onSubmit(this.state);
  };

  render() {
    console.log(this.props);
    const { game, round, stage, player } = this.props;
    const { response } = this.state;

    const network = player.get("neighbors");

    const surveyNumber = 1;
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
                    <label className="questionnaire-question"> Did your group have a leader? If so, who?</label>
                    {network.map(otherNodeId => {
                        const otherPlayer = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId));
                        const otherPlayerId = otherPlayer.get("anonymousName");
                        // const playerIsOnline = otherPlayer.online === true && !otherPlayer.get("inactive");
                        const playerIsOnline = !otherPlayer.get("inactive");

                        return (
                            <Radio
                                selected={response}
                                key={otherPlayerId}
                                name="response"
                                value={otherPlayerId}
                                label={otherPlayerId}
                                playerIsOnline={playerIsOnline}
                                onChange={this.handleChange}
                            />
                        )
                        })
                    }
                    <Radio
                        selected={response}
                        name="response"
                        value="myself"
                        label="Myself"
                        playerIsOnline={true}
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="team"
                        label="We worked as a team"
                        playerIsOnline={true}
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="none"
                        label="Our team did not have a leader"
                        playerIsOnline={true}
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
