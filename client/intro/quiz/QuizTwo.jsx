import React from "react";
import '../../../public/css/intro.css';

import { Centered } from "meteor/empirica:core";

const Radio = ({ selected, name, value, label, onChange }) => (
    <label className="questionnaire-radio">
        <input
        className="quiz-button"
        type="radio"
        name={name}
        value={value}
        checked={selected === value}
        onChange={onChange}
        />
        {label}
    </label>
);

export default class QuizTwo extends React.Component {
  state = { };

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    const { hasPrev, hasNext, onNext, onPrev, game, player } = this.props;
    event.preventDefault();
    if (this.state.response === 'yes') {
        onNext();
    } else {
        player.exit("failedQuestion");
    }
  };

  render() {
    const { player } = this.props;
    const { response } = this.state;

    return (
      <Centered>
        <div className="intro-heading questionnaire-heading"> Questionnaire </div>
            <div className="questionnaire-content-container">
                <div className="questionnaire-body">
                    <label className="questionnaire-question">If you do not interact with the application for 5 minutes your session will timeout, and the experiment will end for everyone in your team. 1 minute before the timeout you will be notified you are about to timeout, and be given a chance to reset this timer. If you allow your session to timeout your HIT will not be accepted. If a team member causes a timeout you will be sent to the end of challenge page, and your HIT will be accepted.</label>
                    <Radio
                        selected={response}
                        name="response"
                        value="yes"
                        label="PROCEED"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="no"
                        label="DO NOT PROCEED"
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
