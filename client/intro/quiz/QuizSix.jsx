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

export default class QuizSix extends React.Component {
  state = {modalIsOpen: false};

  componentDidMount() {
    const {player} = this.props;
    if (!player.get("attentionCheck2Tries")) {
      player.set("attentionCheck2Tries", 2);
    }
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    const { hasPrev, hasNext, onNext, onPrev, game, player } = this.props;
    event.preventDefault();
    if (this.state.response === 'individual') {
        const currentTriesLeft = player.get("attentionCheck2Tries");
        const attentionCheck2Answer = this.state.response;
        player.set(`attentionCheck2-${currentTriesLeft}`, attentionCheck2Answer);
        onNext();
    } else {
        const currentTriesLeft = player.get("attentionCheck2Tries");
        const attentionCheck2Answer = this.state.response;
        player.set(`attentionCheck2-${currentTriesLeft}`, attentionCheck2Answer);
        player.set("attentionCheck2Tries", currentTriesLeft-1);

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
                    <label className="questionnaire-question">Each player will have a network of people they can talk to through individual chats. Each member of your network has an unique dialogue box and you can have multiple dialogue boxes open on your screen as you communicate during a trial. You can open or close a box. You can also scroll up and down within a box to view the messages you have exchanged with a specific contact. There will be no overall team chat where you can talk to everyone at once. </label>
                    <p>----------------------------------------------------------------------------------------------------</p>
                    <label className="questionnaire-question">How will I communicate with my team members?</label>
                    <Radio
                        selected={response}
                        name="response"
                        value="individual"
                        label="1-on-1 chats"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="group"
                        label="Overall team group chat"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={response}
                        name="response"
                        value="none"
                        label="There is no communication"
                        onChange={this.handleChange}
                    />
                </div>
                <form className="questionnaire-btn-container" onSubmit={this.handleSubmit}>
                    <button 
                        className={!response ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}
                        disabled={!response} type="submit"> Submit </button> 
                </form>
                {this.state.modalIsOpen && <AttentionCheckModal player={player} triesLeft={player.get("attentionCheck2Tries")} onCloseModal={this.onCloseModal} /> }
            </div>
      </Centered>
    );
  }
}
