import React from "react";

import { Centered } from "meteor/empirica:core";
import _ from "lodash";

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


// This section asks the user what their personal emotional closeness is to the listed 5 people.
export default class NetworkSurveyGenderInterpreter extends React.Component { 
  constructor(props) {
    super(props);
    // const {name1, name2, name3, name4, name5} = this.props.player.get("networkResponse1");
    const {name1, name2, name3, name4, name5} = {
        name1 : "Person 1",
        name2 : "Person 2",
        name3 : "Person 3",
        name4 : "Person 4",
        name5 : "Person 5"};

    this.state = {
        tie1 : "", 
        tie2 : "",
        tie3 : "",
        tie4 : "",
        tie5 : "",
        name1: name1,
        name2: name2,
        name3: name3,
        name4: name4,
        name5: name5
      };
  }

  handleGenderSelect = (tie, gender) => {
    this.state[tie] = gender;
  }


  handleSubmit = event => {
    const { onNext, player } = this.props;
    const networkSurveyResponse = {
        tie1 : this.state.tie1, 
        tie2 : this.state.tie2,
        tie3 : this.state.tie3,
        tie4 : this.state.tie4,
        tie5 : this.state.tie5,

      };

    event.preventDefault();
    // TODO: log player response to survey question
    player.set("networkResponseGenderInterpreter", networkSurveyResponse);
    onNext();
  };

  render() {
    const { player } = this.props;
    const filledOut = this.state.tie1 && this.state.tie2 && this.state.tie3 && this.state.tie4 && this.state.tie5;
    const {name1, name2, name3, name4, name5} = this.state;
    const names = [name1, name2, name3, name4, name5];
    const genders = ["Male", "Female", "N/A"];
    
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
                        {names.map((name, i) => {
                            return (
                                <GenderButtonSet key={i} contactName={name} tie={`tie${i+1}`} genders={genders} genderSelected={this.state[`tie${i+1}`]} handleGenderSelect={this.handleGenderSelect}/>    
                            )
                        })}
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
