import React from "react";


import { Centered } from "meteor/empirica:core";
import { HTMLSelect } from "@blueprintjs/core";

const DropdownSelect = ({id, name, handleChange}) => (
    <div className="bp4-html-select">
        <select className="dropdown-select-input" defaultValue="" id={id} name={name} onChange={handleChange} required>
            <option value="" disbaled="true" hidden></option>
            <option value="EC">Especially Close</option>
            <option value="C">Close</option>
            <option value="LTC">Less Than Close</option>
        </select>
    </div>
);

const RelationshipButtonSet = ({contactName, tie, categories, categoriesSelected, handleCategorySelect}) => {

    return(    
        <div className="relationship-input-row" style={{width: "100%"}}>
            <label className="relationship-input-label" htmlFor={tie}> <p>{contactName}</p> </label>
            <div className="relationship-buttons-container">
            {categories.map((category, index) => {
                return (
                    <div key={`${contactName}-${category}`} className={categoriesSelected[index] ? "network-relationship-button selected" : "network-relationship-button"} onClick={() => handleCategorySelect(tie, index)}> <p> {category} </p> </div>
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
        name5: name5
      };
  }
  
  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleCategorySelect = (tie, category_i) => {
    console.log("called");
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
    const categories = ["colleague", "friend", "spouse", "other kin"];
    console.log(this.state);

    
    return (
          <div className="network-survey-container">
                <div className="network-survey-header">
                    <p>
                        WHAT ARE YOUR RELATIONSHIPS TO THE PEOPLE IN YOUR NETWORK?
                    </p>
                </div>
                <img src={`images/hr-color.png`} />
                <div className="network-survey-body">
                    <p>The people you cited on the previous page are listed in the table below. Please select the option next to each name that best describes how close you feel with each listed person. For each person, are you “especially close” (EC), “close” (C), or “less than close” (LTC)? </p>
                    <ul className="network-list">
                        <li>
                            “Especially Close” indicates this is one of your closest personal contacts.
                        </li>
                        <li>
                            “Close” indicates this is someone you enjoy, but don't count him or her among your closest personal contacts.
                        </li>
                        <li>
                            “Less Than Close" indicates this is someone you don't mind working with, but have no wish to develop a friendship.
                        </li>
                    </ul>
                    <form className="network-form" onSubmit={this.handleSubmit}>
                        <p> How often do you communicate with _ ? </p>
                        <RelationshipButtonSet contactName={name1} tie="tie1" categories={categories} categoriesSelected={this.state["tie1"]} handleCategorySelect={this.handleCategorySelect}/>
                        <div className="input-row">
                            <label className="dropdown-input-label" htmlFor="tie1"> <p>{name1}</p> </label>
                            <DropdownSelect id="tie1" name="tie1" handleChange={this.handleChange}></DropdownSelect>
                        </div>
                        <div className="input-row">
                            <label className="dropdown-input-label" htmlFor="tie2"> <p>{name2}</p> </label>
                            <DropdownSelect id="tie2" name="tie2" handleChange={this.handleChange}></DropdownSelect>

                        </div>
                        <div className="input-row">
                            <label className="dropdown-input-label" htmlFor="tie3"> <p>{name3}</p> </label>
                            <DropdownSelect id="tie3" name="tie3" handleChange={this.handleChange}></DropdownSelect>

                        </div>
                        <div className="input-row">
                            <label className="dropdown-input-label" htmlFor="tie4"> <p>{name4}</p> </label>
                            <DropdownSelect id="tie4" name="tie4" handleChange={this.handleChange}></DropdownSelect>

                        </div>
                        <div className="input-row">
                            <label className="dropdown-input-label" htmlFor="tie5"> <p>{name5}</p> </label>
                            <DropdownSelect id="tie5" name="tie5" handleChange={this.handleChange}></DropdownSelect>

                        </div>
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
