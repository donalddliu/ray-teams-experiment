import React from "react";
import '../../../public/css/intro.css';

import { Centered } from "meteor/empirica:core";
import AttentionCheckModal from "./AttentionCheckModal";

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

export default class QuizFive extends React.Component {
  state = {modalIsOpen: false };

  componentDidMount() {
    const {player} = this.props;
    if (!player.get("attentionCheck1Tries")) {
      player.set("attentionCheck1Tries", 2);
    }
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    const { hasPrev, hasNext, onNext, onPrev, game, player } = this.props;
    event.preventDefault();
    if (this.state.response === 'one') {
        onNext();
    } else {
      const currentTriesLeft = player.get("attentionCheck1Tries");
      const attentionCheck1Answer = this.state.response;
      player.set(`attentionCheck1-${currentTriesLeft}`, attentionCheck1Answer);
      player.set("attentionCheck1Tries", currentTriesLeft-1);

      if (currentTriesLeft-1 <= 0) {
        player.exit("failedQuestion");
      } else {
        this.onOpenModal();
      }

    }
  };

  onOpenModal = () => {
    this.setState({modalIsOpen: true});
  }

  onCloseModal = () => {
    this.setState({modalIsOpen: false});
  }

  render() {
    const { player } = this.props;
    const { response } = this.state;

    return (
      <Centered>
        <div className="intro-heading questionnaire-heading"> Questionnaire </div>
            <div className="questionnaire-content-container">
                <div className="questionnaire-body">
                    <label className="questionnaire-question"> The task requires that members of a small network work together to identify abstract symbols for multiple trials. At the beginning of each trial, each member of your network will be assigned a set of symbols. One and only one of those symbols will be shared among you. Your job is to discover the shared symbol by communicating with the members of your network within the time allotted. Your symbols are illustrated in the "my card" box. When you believe you have identified the shared symbol, select it and then hit the submit answer button. If your team runs out of time, your team will be marked incorrect and you will move onto the next round.  </label>
                    <p>----------------------------------------------------------------------------------------------------</p>
                    <label className="questionnaire-question">On any trial, how many abstract symbols will you and any member of your team have in common?</label>
                    <Radio
                        selected={response}
                        name="response"
                        value="zero"
                        label="0"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="one"
                        label="1"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="two"
                        label="2"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="many"
                        label="More than 2"
                        onChange={this.handleChange}
                    />
                </div>
                <form className="questionnaire-btn-container" onSubmit={this.handleSubmit}>
                    <button 
                        className={!response ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}
                        disabled={!response} type="submit"> Submit </button> 
                </form>
                {this.state.modalIsOpen && <AttentionCheckModal player={player} triesLeft={player.get("attentionCheck1Tries")} onCloseModal={this.onCloseModal} /> }
            </div>
      </Centered>
    );
  }
}
