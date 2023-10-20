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


// This section asks the user what their personal emotional closeness is to the listed 5 people.
export default class NetworkSurveySelfEC extends React.Component { 
  constructor(props) {
    super(props);
    const {name1, name2, name3, name4, name5} = this.props.player.get("networkResponse1");

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
  
  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

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
    player.set("networkResponseSelfEC", networkSurveyResponse);
    onNext();
  };

  render() {
    const { player } = this.props;
    const filledOut = this.state.tie1 && this.state.tie2 && this.state.tie3 && this.state.tie4 && this.state.tie5;
    const {name1, name2, name3, name4, name5} = this.state;
    
    return (
          <div className="network-survey-container">
                <div className="network-survey-header">
                    <p>
                        HOW CLOSE ARE YOU TO THE PEOPLE IN YOUR NETWORK?
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