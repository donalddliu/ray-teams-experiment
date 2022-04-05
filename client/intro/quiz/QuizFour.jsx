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

export default class QuizFour extends React.Component {
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
                    <label className="questionnaire-question">Is the following statement true or false? If any member of my team doesn't register a guess or communicate with a colleague for five minutes, the task will end and the entire 5-person team (including myself) will be sent to the exit page of the survey.</label>
                    <Radio
                        selected={response}
                        name="response"
                        value="yes"
                        label="Yes"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="no"
                        label="No"
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
