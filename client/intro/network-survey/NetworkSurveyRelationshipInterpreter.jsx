import React from "react";

import { Centered } from "meteor/empirica:core";
import _ from "lodash";
import { Checkbox } from "@blueprintjs/core";

const RelationshipButtonSet = ({contactName, tie, categories, categoriesSelected, handleCategorySelect}) => {
    return(    
        <div className="relationship-input-row" style={{width: "100%"}}>
            <label className="relationship-input-label" htmlFor={tie}> <p>{contactName}</p> </label>
            <div className="relationship-buttons-container">
            {categories.map((category, index) => {
                return (
                    <div key={`${contactName}-${category}`} className={categoriesSelected[index] ? "network-relationship-button selected" : "network-relationship-button"} onClick={() => handleCategorySelect(tie, index)}> {category} </div>
                )
            })
            }
            </div>
        </div>
    )

}

// This section asks the user what their personal emotional closeness is to the listed 5 people.
export default class NetworkSurveyRelationshipInterpreter extends React.Component { 
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
        tie1 : [false, false, false, false], 
        tie2 : [false, false, false, false],
        tie3 : [false, false, false, false],
        tie4 : [false, false, false, false],
        tie5 : [false, false, false, false],
        name1: name1,
        name2: name2,
        name3: name3,
        name4: name4,
        name5: name5,
        categories: ["Colleague", "Friend", "Spouse", "Other kin"]
      };
  }

  handleCategorySelect = (tie, category_i) => {
    this.state[tie][category_i] = !this.state[tie][category_i];
  }

  handleSubmit = event => {
    const { onNext, player } = this.props;
    const networkSurveyResponse = {
        tie1 : this.state.tie1, 
        tie2 : this.state.tie2,
        tie3 : this.state.tie3,
        tie4 : this.state.tie4,
        tie5 : this.state.tie5,
        categories: this.state.categories
      };

    event.preventDefault();
    // TODO: log player response to survey question
    player.set("networkResponseRelationshipInterpreter", networkSurveyResponse);
    onNext();
  };

  render() {
    const { player } = this.props;
    const filledOut = this.state.tie1 && this.state.tie2 && this.state.tie3 && this.state.tie4 && this.state.tie5;
    const {name1, name2, name3, name4, name5} = this.state;
    const names = [name1, name2, name3, name4, name5];
    const categories = ["Current Colleague", "Previous Colleague", "Spouse", "Other kin", "Other"];
    
    return (
          <div className="network-survey-container">
                <div className="network-survey-header">
                    <p>
                        WHAT ARE YOUR RELATIONSHIPS TO THE PEOPLE IN YOUR NETWORK?
                    </p>
                </div>
                <img src={`images/hr-color.png`} />
                <div className="network-survey-body">
                    <p>The people you cited on the previous page are listed in the table below. Please select the options next to each name that best describes your relationship with each listed person. For each person, you are allowed to select multiple options. </p>
                    <ul className="network-list">
                        <li>
                            “Current Colleague” indicates someone who works at the same organization you do.
                        </li>
                        <li>
                            "Previous Colleague" indicates someone with whom you used to work with.
                        </li>
                        <li>
                            “Spouse" indicates that you and this person are, or were, married, or lived together as if married at some time.
                        </li>
                        <li>
                            "Other kin" indicates any family relative other than spouse.
                        </li>
                        <li>
                            "Other" indicates someone that does not fall within one of the above categories
                        </li>
                    </ul>
                    <form className="network-form" onSubmit={this.handleSubmit}>
                        <p> What is their relationship to you? (Select all that applies) </p>
                        {names.map((name, i) => {
                            return (
                                <RelationshipButtonSet key={i} contactName={name} tie={`tie${i+1}`} categories={categories} categoriesSelected={this.state[`tie${i+1}`]} handleCategorySelect={this.handleCategorySelect}/>    
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
