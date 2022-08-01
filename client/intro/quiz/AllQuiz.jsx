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

export default class AllQuiz extends React.Component {
  state = { q1: "", q2: "", q4: "", q5: "", q6: "", q7: "", q8: "", modalIsOpen: false};

  componentDidMount() {
    const {player} = this.props;
    if (!player.get("attentionCheckTries")) {
        player.set("attentionCheckTries", 2);
    } 
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  allCorrect = () => {
      return (
        this.state.q1 === 'yes' &&
        this.state.q2 === 'yes' &&
        this.state.q4 === 'yes' &&
        this.state.q5 === 'one' &&
        this.state.q6 === 'false' &&
        this.state.q7 === 'false' &&
        this.state.q8 === 'yes'
      )
  }

  handleSubmit = event => {
    const { hasPrev, hasNext, onNext, onPrev, game, player } = this.props;
    event.preventDefault();
    if (this.allCorrect()) {
        const currentTriesLeft = player.get("attentionCheckTries");
        const attentionCheckAnswers = this.state;
        player.set(`attentionCheck-${currentTriesLeft}`, attentionCheckAnswers)

        onNext();
    } else {
        const currentTriesLeft = player.get("attentionCheckTries");
        // Log the attention check answers
        const attentionCheckAnswers = this.state;
        player.set(`attentionCheck-${currentTriesLeft}`, attentionCheckAnswers);
        // Log how many tries they have left
        player.set("attentionCheckTries", currentTriesLeft-1);
        console.log(`You have ${player.get("attentionCheckTries")} tries left.`);

        // If player uses all their attention check tries, they fail; otherwise show them how many tries they have left
        if (player.get("attentionCheckTries") === 0) {
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
    const { game, onPrev, player } = this.props;
    const { q1, q2, q4, q5, q6, q7, q8 } = this.state;    

    const allSelected = Object.keys(this.state).every(key => this.state[key] !== "")
    return (
      <Centered>
        <div className="intro-heading questionnaire-heading"> Questionnaire </div>
            <div className="questionnaire-content-container">
                <div className="questionnaire-body">
                    <div className="question-section">
                        <label className="questionnaire-question">Are you willing to participate in an online team exercise that could last for approximately 60 minutes?</label>
                        <Radio
                            selected={q1}
                            name="q1"
                            value="yes"
                            label="Yes"
                            onChange={this.handleChange}
                        />
                        <Radio
                            selected={q1}
                            name="q1"
                            value="no"
                            label="No"
                            onChange={this.handleChange}
                        />
                    </div>

                    <div className="question-section">
                    <label className="questionnaire-question">
                        {game.treatment.endGameIfPlayerIdle ? 
                        <span>If you do not interact with the application for a while, your session will timeout and the experiment will end for EVERYONE in your team. 1 minute before the timeout you will be notified you are about to timeout, and be given a chance to reset this timer.</span> :
                        <span>If you do not interact with the application for a while, your session will timeout and you will be kicked out from the game. 1 minute before the timeout you will be notified you are about to timeout, and be given a chance to reset this timer.</span> 
                        }
                        <br></br>
                        <span style={{fontWeight: 'bolder'}}> 
                        {game.treatment.endGameIfPlayerIdle ? 
                        <span>NOTE: If you allow your session to timeout, your HIT will not be accepted. If a team member causes a timeout you will be sent to the end of challenge page, and your HIT will be accepted.</span> :
                        <span>NOTE: If you allow your session to timeout, your HIT will not be accepted.</span>
                        }
                        </span>
                    </label>
                    <Radio
                        selected={q2}
                        name="q2"
                        value="yes"
                        label="PROCEED"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={q2}
                        name="q2"
                        value="no"
                        label="DO NOT PROCEED"
                        onChange={this.handleChange}
                    />
                    </div>

                    <div className="question-section">
                    <p className="questionnaire-question">Next you will be asked questions about the instruction you just read. You need to get the answers correct in order to be accepted into the exercise. </p>
                    {/* <Radio
                        selected={q3}
                        name="q3"
                        value="yes"
                        label="PROCEED"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={q3}
                        name="q3"
                        value="no"
                        label="DO NOT PROCEED"
                        onChange={this.handleChange}
                    /> */}
                    </div>

                    <div className="question-section">
                    <label className="questionnaire-question">
                        Is the following statement true or false?  
                        {game.treatment.endGameIfPlayerIdle ? 
                        <span> If any member of my team doesn't register a guess or communicate with a colleague for long time, the task will end and the entire team (including myself) will be sent to the exit page of the survey.</span> :
                        <span> If a member of my team doesn't register a guess or communicate with a colleague for long time, the inactive player will be kicked and the task will continue for the rest of the team.</span>
                        }
                    </label>
                    <Radio
                        selected={q4}
                        name="q4"
                        value="yes"
                        label="Yes"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={q4}
                        name="q4"
                        value="no"
                        label="No"
                        onChange={this.handleChange}
                    />
                    </div>

                    <div className="question-section">
                    <label className="questionnaire-question">On any trial, how many abstract symbols will you and any member of your team have in common?</label>
                    <Radio
                        selected={q5}
                        name="q5"
                        value="one"
                        label="Only 1"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={q5}
                        name="q5"
                        value="many"
                        label="More than 1"
                        onChange={this.handleChange}
                    />
                    </div>

                    <div className="question-section">
                    <label className="questionnaire-question">Is the following statement true or false? I will be able to communicate with my team members using an overall group chat.</label>
                    <Radio
                        selected={q6}
                        name="q6"
                        value="true"
                        label="True"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={q6}
                        name="q6"
                        value="false"
                        label="False"
                        onChange={this.handleChange}
                    />
                    </div>

                    <div className="question-section">
                    <label className="questionnaire-question">The reconsider button will only appear if I submit an incorrect answer.</label>
                    <Radio
                        selected={q7}
                        name="q7"
                        value="true"
                        label="True"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={q7}
                        name="q7"
                        value="false"
                        label="False"
                        onChange={this.handleChange}
                    />
                    </div>

                    <div className="question-section">  
                    <label className="questionnaire-question">If you pass the attention check, you may participate in this task. You will receive a flat fee of $2 for participating. You will also receive $1 bonus each time your team correctly identifies the shared symbol. If you complete all trials of the experiment, you could earn up to $8.</label>
                    <Radio
                        selected={q8}
                        name="q8"
                        value="yes"
                        label="PROCEED"
                        onChange={this.handleChange}
                    />
                    <Radio
                        selected={q8}
                        name="q8"
                        value="no"
                        label="DO NOT PROCEED"
                        onChange={this.handleChange}
                    />  
                    </div>                  
                </div>
                <form className="questionnaire-btn-container" onSubmit={this.handleSubmit}>
                    <button 
                        className={!allSelected ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}
                        disabled={!allSelected} type="submit"> Submit </button> 
                </form>
                {this.state.modalIsOpen && <AttentionCheckModal player={player} onPrev={onPrev} onCloseModal={this.onCloseModal} /> }
            </div>
      </Centered>
    );
  }
}
