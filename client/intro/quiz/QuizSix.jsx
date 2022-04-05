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

export default class QuizSix extends React.Component {
  state = { };

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    const { hasPrev, hasNext, onNext, onPrev, game, player } = this.props;
    event.preventDefault();
    if (this.state.response === 'false') {
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
                    <label className="questionnaire-question">Is the following statement true or false? I will be able to communicate with my team members using a group chat and I will always be able to communicate with every member of my team.</label>
                    <Radio
                        selected={response}
                        name="response"
                        value="true"
                        label="True"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="false"
                        label="False"
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
