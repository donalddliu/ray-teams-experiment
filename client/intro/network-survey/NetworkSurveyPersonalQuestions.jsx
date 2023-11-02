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

const RaceSpecific = ({message, textValue, handleRaceChange }) => {
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

const RaceQuestionSet = ({selected, textValue, handleRaceChange}) => {
    const options = [
        "African American or Black",
        "Asian",
        "Hispanic",
        "White",
        "Multiracial or biracial",
        "Other",
    ];

    const askRaceSpecific = {
        "Asian" : "Print race",
        "Other" : "Print race",
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

const EducationSpecific = ({message, textValue, handleEducationChange }) => {
    return(
    <div className="personal-input-race-specific-container">
        <p style={{margin:"0px 0px", fontSize:"100%"}}> {message}</p>
        <input 
            className="personal-input-race-specific-input"
            id="educationSpecific"
            type="text"
            dir="auto"
            name="educationSpecific"
            value={textValue}
            onChange={handleEducationChange}
            required
        />
    </div>  

    )
}

const EducationQuestionSet = ({selected, textValue, handleEducationChange}) => {
    const options = ["High school graduate",
        "Bachelor's degree",
        "Master's degree or higher",
        "Other"]

    const askEducationSpecific = {
        "Other" : "Please specify",
    }

    return(
        <div className="personal-input-container" >
            <p>What is your highest education qualification?</p>
            <div className="personal-input-radio-list-container">
                {
                    options.map((option) => {
                        return (
                            <div className="personal-input-radio-container">
                                <Radio
                                    key={option}
                                    selected={selected}
                                    name="education"
                                    value={option}
                                    label={option}
                                    onChange={handleEducationChange}
                                />
                                {/* If the race specific is selected and is being rendered */}
                                {selected in askEducationSpecific && option == selected ? 
                                    <EducationSpecific 
                                        message={askEducationSpecific[selected]} 
                                        textValue={textValue} 
                                        handleEducationChange={handleEducationChange} />
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

const EmploymentQuestionSet = ({selected, handleEmploymentChange}) => {
    const options = ["Yes",
        "No"]

    return(
        <div className="personal-input-container" >
            <p>Are you currently employed?</p>
            <div className="personal-input-radio-list-container">
                {
                    options.map((option) => {
                        return (
                            <Radio
                                key={option}
                                selected={selected}
                                name="employed"
                                value={option}
                                label={option}
                                onChange={handleEmploymentChange}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

const JobTitleQuestionSet = ({textValue, handleJobTitleChange}) => {
    return (
        <div className="personal-input-container" >
            <p>What is your job title?</p>
            <input
                className="personal-input-job-title-input"
                id="jobTitle"
                type="text"
                dir="auto"
                name="jobTitle"
                value={textValue}
                onChange={handleJobTitleChange}
                required
            />
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
        educatoinSpecific: "",
        employed : "",
        jobTitle: "",
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
    const networkSurveyResponse = this.state;

    event.preventDefault();
    // TODO: log player response to survey question
    player.set("networkResponsePersonalQuestions", networkSurveyResponse);
    onNext();
  };

  render() {
    const { player } = this.props;
    const filledOut = this.state.age && this.state.gender && this.state.race && this.state.education && this.state.employed ;
    const {name1, name2, name3, name4, name5} = this.state;
    const names = [name1, name2, name3, name4, name5];

    return (
          <div className="network-survey-container">
                <div className="network-survey-header">
                    <p>
                        PLEASE ANSWER SOME QUESTIONS ABOUT YOURSELF
                    </p>
                </div>
                <img src={`images/hr-color.png`} />
                <div className="network-survey-body">
                    <p>Please answer some questions about yourself. </p>
                    <ul className="network-list">
                    </ul>
                    <form className="network-form" onSubmit={this.handleSubmit}>
                        <AgeQuestionSet ageValue={this.state.age} handleAgeChange={this.handleChange} />
                        <GenderButtonSet genderSelected={this.state.gender} handleGenderSelect={this.handleGenderSelect} />    
                        <HispanicQuestionSet selected={this.state.isHispanic} handleIsHispanicChange={this.handleChange} />
                        <RaceQuestionSet selected={this.state.race} textValue={this.state.raceSpecific} handleRaceChange={this.handleChange} />
                        <EducationQuestionSet selected={this.state.education} textValue={this.state.EducationSpecific} handleEducationChange={this.handleChange} />
                        <EmploymentQuestionSet selected={this.state.employed} handleEmploymentChange={this.handleChange} />
                        {this.state.employed == "Yes" && <JobTitleQuestionSet textValue={this.state.jobTitle} handleJobTitleChange={this.handleChange} />}
                        <div className="network-button-container" style={{marginTop: "2em"}}>
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
