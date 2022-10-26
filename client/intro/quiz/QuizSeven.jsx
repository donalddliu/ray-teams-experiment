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

export default class QuizSeven extends React.Component {
  state = {modalIsOpen: false };

  componentDidMount() {
    const {player} = this.props;
    if (!player.get("attentionCheck3Tries")) {
      player.set("attentionCheck3Tries", 2);
    }
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    const { hasPrev, hasNext, onNext, onPrev, game, player } = this.props;
    event.preventDefault();
    if (this.state.response === 'self') {
        onNext();
    } else {
      const currentTriesLeft = player.get("attentionCheck3Tries");
      const attentionCheck3Answer = this.state.response;
      player.set(`attentionCheck3-${currentTriesLeft}`, attentionCheck3Answer);
      player.set("attentionCheck3Tries", currentTriesLeft-1);

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
                    <label className="questionnaire-question">You guess the symbol by selecting it and then selecting the submit answer button. While you are waiting for your team members to submit an answer, you will have an opportunity to reconsider your choice. The reconsider button does not indicate you have made an incorrect choice. </label>
                    <p>----------------------------------------------------------------------------------------------------</p>
                    <label className="questionnaire-question">When will the reconsider button appear?</label>
                    <Radio
                        selected={response}
                        name="response"
                        value="incorrect"
                        label="After I submit an incorrect answer"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="self"
                        label="After I submit my symbol"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="team"
                        label="After all my teammates submit a symbol"
                        onChange={this.handleChange}
                    />
                </div>
                <form className="questionnaire-btn-container" onSubmit={this.handleSubmit}>
                    <button 
                        className={!response ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}
                        disabled={!response} type="submit"> Submit </button> 
                </form>
                {this.state.modalIsOpen && <AttentionCheckModal player={player} triesLeft={player.get("attentionCheck3Tries")} onCloseModal={this.onCloseModal} /> }

            </div>
      </Centered>
    );
  }
}
