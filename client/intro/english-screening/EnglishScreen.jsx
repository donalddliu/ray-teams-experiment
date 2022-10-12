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
    state = { q1: "", q2: "", q3:"", q4: "", q5: "", q6: "", q7: "", q8: "", q9:"", q10:""};
  
    componentDidMount() {
      const {player} = this.props;
      player.set("passedPreQual", false);
      console.log("set passedPreQual to false");
    }
  
    handleChange = event => {
        const el = event.currentTarget;
        this.setState({ [el.name]: el.value });
    };

    passCorrectThreshold = () => {
        const {player} = this.props;
        let numCorrect = 0
        const totalNumQuestions = 20
        englishScreeningQuestions.forEach((questionSet) => {
            const {passage, question, answer, question_number} = questionSet;
            if (this.state[`q${question_number}`] === answer) {
                numCorrect += 1
            }
        })
        player.set("englishScreenPercentage", numCorrect/totalNumQuestions);
        console.log("set engScreen %");

        return numCorrect/totalNumQuestions >= 0.8;
    }
  
    handleSubmit = event => {
      const { hasPrev, hasNext, onNext, onPrev, game, player } = this.props;
      event.preventDefault();
      player.set("name", player.id);

      if (this.passCorrectThreshold()) {
            player.set("englishScreenPassed", this.state);
            console.log("set engScreen passed");

            onNext();
      } else {
            player.set("englishScreenFailed", this.state);
            console.log("set engScreen failed");
            player.exit("failedEnglishScreen");

      }
    };
  
    render() {  
      const allSelected = Object.keys(this.state).every(key => this.state[key] !== "");
      console.log("rendered");
      return (
        <Centered>
          <div className="intro-heading questionnaire-heading"> Questionnaire </div>
                <div className="questionnaire-content-container">
                    <div className="questionnaire-body">
                        <h2> This game will require heavy communication in English with other players. Thus, we will begin with a quick questionnaire to test your English fluency. </h2>
                        <br></br>
                        <h2>Instructions:</h2>
                        <ol>
                            <li>
                                <p>1. Read the target sentence</p>
                            </li>
                            <li>
                                <p>2. Answer the question immediately following</p>
                            </li>
                        </ol>
                        <div>Because some Mechanical Turk users answer questions randomly, we will reject users with error rates of 25% or larger. Consequently, if you cannot answer 75% of the questions correctly, please do not fill out the survey.</div>
                        <br></br>
                        <div>Note: <span style={{fontWeight: "bold"}}>Please read the sentence </span> before answering the question!</div>
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
                </div>
        </Centered>
      );
    }
  }
  