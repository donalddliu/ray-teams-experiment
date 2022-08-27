import React from "react";
import '../../../public/css/intro.css';
import {englishScreeningQuestions} from "./EnglishQuestions"; 

import { Centered } from "meteor/empirica:core";

const Question = ({ selected, passage, question, question_number, name, onChange }) => (
    <div className="question-section">
        <label className="questionnaire-question">
            <div style={{fontWeight: "bold"}}>Sentence {question_number}: </div>
            {passage}
        </label>
        <label className="questionnaire-question">
            <div style={{fontWeight: "bold"}}>Question {question_number}: </div>
            {question}
        </label>
        <div className="english-screening-buttons">
            <label className="questionnaire-radio" style={{marginRight: "15px"}}>
                <input
                className="quiz-button"
                type="radio"
                name={name}
                value="Yes"
                checked={selected === "Yes"}
                onChange={onChange}
                />
                Yes
            </label>
            <label className="questionnaire-radio">
                <input
                className="quiz-button"
                type="radio"
                name={name}
                value="No"
                checked={selected === "No"}
                onChange={onChange}
                />
                No
            </label>
        </div>
        <p>----------------------------------------------------------------------------------------------------</p>
    </div>
);

export default class EnglishScreen extends React.Component {
    state = { q1: "", q2: "", q4: "", q5: "", q6: "", q7: "", q8: "", q9:"", q10:""};
  
    componentDidMount() {
    //   const {player} = this.props;
    //   if (!player.get("attentionCheckTries")) {
    //       player.set("attentionCheckTries", 2);
    //   } 
    }
  
    handleChange = event => {
        const el = event.currentTarget;
        this.setState({ [el.name]: el.value });
        console.log(this.state);
    };

    checkAnswers = () => {
        let numCorrect = 0
        const totalNumQuestions = 10
        englishScreeningQuestions.forEach((questionSet) => {
            const {passage, question, answer, question_number} = questionSet;
            if (this.state[`q${question_number}`] === answer) {
                numCorrect += 1
            }
        })
        console.log(numCorrect);
        return numCorrect/totalNumQuestions >= 0.8;
    }
  
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
      if (this.checkAnswers()) {
            console.log("Checked Answers")
            onNext();
      } else {
            player.exit("failedEnglishScreen");
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
                        <h2>Instructions:</h2>
                        <ol>
                            <li>
                                <p>1. Read the target sentence</p>
                            </li>
                            <li>
                                <p>2. Answer the question immediately following</p>
                            </li>
                        </ol>

                            {
                                englishScreeningQuestions.map((questionSet) => {
                                    const {passage, question, answer, question_number} = questionSet;
                                    return (
                                        <Question
                                        key={question_number}
                                        selected={this.state[`q${question_number}`]}
                                        name={`q${question_number}`}
                                        passage={passage}
                                        question={question}
                                        question_number={question_number}
                                        onChange={this.handleChange}
                                        />
                                    )
                                })
                            }
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
  