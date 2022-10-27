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

export default class QuizTwo extends React.Component {
  state = {modalIsOpen: false };

  componentDidMount() {
    const {player} = this.props;
    if (!player.get("attentionCheck4Tries")) {
      player.set("attentionCheck4Tries", 2);
    }
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    const { hasPrev, hasNext, onNext, onPrev, game, player } = this.props;
    event.preventDefault();
    if (this.state.response === 'end') {
        const currentTriesLeft = player.get("attentionCheck4Tries");
        const attentionCheck4Answer = this.state.response;
        player.set(`attentionCheck4-${currentTriesLeft}`, attentionCheck4Answer);
        onNext();
    } else {
      const currentTriesLeft = player.get("attentionCheck4Tries");
      const attentionCheck4Answer = this.state.response;
      player.set(`attentionCheck4-${currentTriesLeft}`, attentionCheck4Answer);
      player.set("attentionCheck4Tries", currentTriesLeft-1);

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
    const { player, game } = this.props;
    const { response } = this.state;

    return (
      <Centered>
        <div className="intro-heading questionnaire-heading"> Questionnaire </div>
            <div className="questionnaire-content-container">
                <div className="questionnaire-body">
                    <label className="questionnaire-question">If you do not interact within the game for a while, you will be kicked and the game will end for EVERYONE in your team. You will be given ONE warning the first time you reach the inactivity limit. If you still are not active within {game.treatment.idleWarningTime} seconds, you will be kicked. If you are active, your inactivity timer will reset.</label>
                    <p>----------------------------------------------------------------------------------------------------</p>                    
                    <label>After receiving an inactivity warning, if I still do not interact within the game for a while, what will happen?</label>
                    <Radio
                        selected={response}
                        name="response"
                        value="warning"
                        label="I will get another inactivity warning"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="continue"
                        label="I will be kicked but the game will continue without me"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="end"
                        label="I will be kicked and the game will end for everyone in my team"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="nothing"
                        label="Nothing will happen"
                        onChange={this.handleChange}
                    />
                </div>
                <form className="questionnaire-btn-container" onSubmit={this.handleSubmit}>
                    <button 
                        className={!response ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}
                        disabled={!response} type="submit"> Submit </button> 
                </form>
                {this.state.modalIsOpen && <AttentionCheckModal player={player} triesLeft={player.get("attentionCheck4Tries")} onCloseModal={this.onCloseModal} /> }

            </div>
      </Centered>
    );
  }
}
