import React from "react";

import { Centered } from "meteor/empirica:core";
import _ from "lodash";
import { elevationClass } from "@blueprintjs/core/lib/esm/common/classes";

const Radio = ({ selected, name, value, label, onChange }) => (
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected === value}
        onChange={onChange}
        required
        style={{marginRight: "5px"}}
      />
      {label}
    </label>
  );
  
const RaceSpecific = ({race, message, textValue, handleRaceChange }) => {
    return(
    <div className="personal-input-race-specific-container">
        <p style={{margin:"0px 0px", fontSize:"100%"}}> {message}</p>
        <input 
            className="personal-input-race-specific-input"
            id="raceSpecific"
            type="text"
            dir="auto"
            name="raceSpecific"
            value={textValue}
            onChange={handleRaceChange}
            required
        />
    </div>  

    )
}

const AgeQuestionSet = ({ageValue, handleAgeChange}) => {
    return (
        <div className="personal-input-container-row">
            <p> What is your age? </p>
            <input
                id="age"
                type="number"
                min="0"
                max="150"
                step="1"
                dir="auto"
                name="age"
                value={ageValue}
                onChange={handleAgeChange}
                style={{height: "fit-content", margin: "0em 1em"}}
                required
            />
        </div>
    )
}

const GenderButtonSet = ({genderSelected, handleGenderSelect}) => {
    const genders = ["Male", "Female", "N/A"];

    return(    
        <div className="personal-input-container-row">
            <p> What is your gender? </p>
            <div className="relationship-buttons-container" style={{width: "30%"}}>
            {genders.map((gender, index) => {
                return (
                    <div key={`${index}`} name="gender" value={gender} className={gender === genderSelected ? "network-relationship-button selected" : "network-relationship-button"} onClick={() => handleGenderSelect(gender)}> {gender} </div>
                )
            })
            }
            </div>
        </div>
    )

}

const HispanicQuestionSet = ({selected, handleIsHispanicChange}) => {
    const options = ["No, not Spanish/Hispanic/Latino", 
        "Yes, Mexican, Mexican-American, Chicano", 
        "Yes, Puerto Rican", 
        "Yes, Cuban", 
        "Yes, other Spanish, Hispanic, or Latino"];

    return(
        <div className="personal-input-container">
            <p>Are you Spanish, Hispanic, or Latino?</p>
            <div className="personal-input-radio-list-container">
                {
                    options.map((option) => {
                        return (
                            <Radio
                                key={option}
                                selected={selected}
                                name="isHispanic"
                                value={option}
                                label={option}
                                onChange={handleIsHispanicChange}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

const RaceQuestionSet = ({selected, textValue, handleRaceChange}) => {
    const options = ["White",
        "Black or African American",
        "Indian (American)",
        "Eskimo",
        "Aleut",
        "Chinese",
        "Filipino",
        "Hawaiian",
        "Korean",
        "Vietnamese",
        "Japanese",
        "Asian Indian",
        "Samoan",
        "Guamanian",
        "Other Asian or Pacific Islander",
        "Some other race",
        "Multiracial or biracial"
    ];

    const askRaceSpecific = {
        "Indian (American)" : "Please specify the name of the enrolled or principal tribe",
        "Other Asian or Pacific Islander" : "Print race",
        "Some other race" : "Print race",
        "Multiracial or biracial" : "Print races"
    }

    return(
        <div className="personal-input-container" >
            <p>What is your race/ethnicity?</p>
            <div className="personal-input-radio-list-container">
                {
                    options.map((option) => {
                        return (
                            <div className="personal-input-radio-container">
                                <Radio
                                    key={option}
                                    selected={selected}
                                    name="race"
                                    value={option}
                                    label={option}
                                    onChange={handleRaceChange}
                                />
                                {/* If the race specific is selected and is being rendered */}
                                {selected in askRaceSpecific && option == selected ? 
                                <RaceSpecific 
                                    race={selected} 
                                    message={askRaceSpecific[selected]} 
                                    textValue={textValue} 
                                    handleRaceChange={handleRaceChange} />
                                : null
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )

}

const EducationQuestionSet = ({selected, handleEducationChange}) => {
    const options = ["High school graduate",
        "Some college, no degree",
        "Associate's degree",
        "Bachelor's degree",
        "Master's degree",
        "Professional degree (e.g., MD, JD)",
        "Doctoral degree"]

    return(
        <div className="personal-input-container" >
            <p>What is your highest education qualification?</p>
            <div className="personal-input-radio-list-container">
                {
                    options.map((option) => {
                        return (
                            <Radio
                                key={option}
                                selected={selected}
                                name="education"
                                value={option}
                                label={option}
                                onChange={handleEducationChange}
                            />
                        )
                    })
                }
            </div>
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
        raceSpecific: "",
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

  handleGenderSelect = (gender) => {
    this.setState({gender : gender});
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
                        <AgeQuestionSet ageValue={this.state.age} handleAgeChange={this.handleChange} />
                        <GenderButtonSet genderSelected={this.state.gender} handleGenderSelect={this.handleGenderSelect} />    
                        <HispanicQuestionSet selected={this.state.isHispanic} handleIsHispanicChange={this.handleChange} />
                        <RaceQuestionSet selected={this.state.race} textValue={this.state.raceSpecific} handleRaceChange={this.handleChange} />
                        <EducationQuestionSet selected={this.state.education} handleEducationChange={this.handleChange} />

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
