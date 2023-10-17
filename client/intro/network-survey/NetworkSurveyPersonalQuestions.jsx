import React from "react";

import { Centered } from "meteor/empirica:core";
import _ from "lodash";
import { elevationClass } from "@blueprintjs/core/lib/esm/common/classes";

const GenderButtonSet = ({contactName, tie, genders, genderSelected, handleGenderSelect}) => {
    return(    
        <div className="relationship-input-row" style={{width: "100%"}}>
            <label className="relationship-input-label" htmlFor={tie}> <p>{contactName}</p> </label>
            <div className="relationship-buttons-container">
            {genders.map((gender, index) => {
                return (
                    <div key={`${contactName}-${gender}`} className={gender === genderSelected ? "network-relationship-button selected" : "network-relationship-button"} onClick={() => handleGenderSelect(tie, gender)}> {gender} </div>
                )
            })
            }
            </div>
        </div>
    )

}

const Radio = ({ selected, name, value, label, onChange }) => (
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected === value}
        onChange={onChange}
        required
      />
      {label}
    </label>
  );

const HispanicQuestionSet = ({selected, handleIsHispanicChange}) => {
    const options = ["No, not Spanish/Hispanic/Latino", "Yes, Mexican, Mexican-American, Chicano", "Yes, Puerto Rican", "Yes, Cuban", "Yes, other Spanish, Hispanic, or Latino"]
    return(
        <div className="relationship-input-row" style={{width: "100%"}}>
            <p>Are you Spanish, Hispanic, or Latino?</p>
            {
                options.map((option) => {
                    return (
                        <Radio
                            selected={selected}
                            name="isHispanic"
                            value={option}
                            label={option}
                            onChange={handleIsHispanicChange}
                        />
                    )
                })
            }
            <Radio />
        </div>

    )
}


// This section asks the user what their personal emotional closeness is to the listed 5 people.
export default class NetworkSurveyPersonalQuestions extends React.Component { 
  constructor(props) {
    super(props);

    // Age, gender, race, level of education, employment, job title, how many people report to you

    this.state = {
        age : "", 
        gender : "",
        isHispanic : "",
        race : "",
        education : "",
        employment : "",
        job_title: "",
        report: "",
      };
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleGenderSelect = (tie, gender) => {
    this.state[tie] = gender;
  }


  handleSubmit = event => {
    const { onNext, player } = this.props;
    const networkSurveyResponse = {
        age : this.state.age, 
        gender : this.state.gender,
        race : this.state.race,
        education : this.state.education,
        job_title : this.state.employment,
        report : this.state.report
      };

    event.preventDefault();
    // TODO: log player response to survey question
    player.set("networkResponsePersonalQuestions", networkSurveyResponse);
    onNext();
  };

  render() {
    const { player } = this.props;
    const filledOut = this.state.age && this.state.gender && this.state.race && this.state.education && this.state.job_title;
    const {name1, name2, name3, name4, name5} = this.state;
    const names = [name1, name2, name3, name4, name5];
    const genders = ["Male", "Female", "N/A"];
    const races = ["White", "Hispanic", "Black or African American", "Asian", "American Indian or Alaska Native", "Native Hawaiian and Other Pacific Islander", "Other"];
    const education = ["High School", "Bachelor", "Master or higher", "Other"];
    
    return (
          <div className="network-survey-container">
                <div className="network-survey-header">
                    <p>
                        WHAT ARE THE GENDERS OF THE PEOPLE IN YOUR NETWORK?
                    </p>
                </div>
                <img src={`images/hr-color.png`} />
                <div className="network-survey-body">
                    <p>The people you cited on the previous page are listed in the table below. Please select the option next to each name that best describes each listed person's gender. </p>
                    <ul className="network-list">
                    </ul>
                    <form className="network-form" onSubmit={this.handleSubmit}>
                        <p> What is the gender of each person? </p>
                        <input
                            id="age"
                            type="number"
                            min="0"
                            max="150"
                            step="1"
                            dir="auto"
                            name="age"
                            value={age}
                            onChange={this.handleAgeChange}
                            required
                        />
                        <HispanicQuestionSet selected={this.state.isHispanic} handleIsHispanicChange={this.handleChange} />
                        <GenderButtonSet key={i} contactName={"Gender"} tie={`tie${i+1}`} genders={genders} genderSelected={this.state[`tie${i+1}`]} handleGenderSelect={this.handleChange}/>    

                        <div className="network-button-container">
                            <button 
                                className={!filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}
                                disabled={!filledOut} 
                                type="submit"> Next Page
                            </button> 
                        </div>
                    </form>
                </div>
          </div>
   
    );
  }
}
