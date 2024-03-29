import React from "react";


import { Centered } from "meteor/empirica:core";
import { HTMLSelect } from "@blueprintjs/core";

const DropdownSelect = () => (
    <div className="bp4-html-select">
        <select className="dropdown-select-input" defaultValue="">
            <option value="" disbaled="true" hidden></option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="lessoften">Less often</option>
        </select>
    </div>
);

export default class NetworkSurveyTwo extends React.Component {

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    const { onNext, player } = this.props;
    event.preventDefault();
    // TODO: log player response to survey question
    onNext();
  };

  render() {
    const { game, round, stage, player } = this.props;
    console.log(player.get("networkResponse"));
    // const { name1, name2, name3, name4, name5 } = {name1: "w", name2: "a", name3: "s", name4: "d", name5:"f"};
    const filledOut = true;
    const {name1, name2, name3, name4, name5} = player.get("networkResponse");
    
    return (
          <div className="network-survey-container">
                <div className="network-survey-header">
                    <p>
                        HOW CLOSE ARE YOU TO THE PEOPLE IN YOUR NETWORK?
                    </p>
                </div>
                <img src={`images/hr-color.png`} />
                <div className="network-survey-body">
                    <p>The people you cited on the previous page are listed in the table below. The task is indicate how often you communicate and interact with each of them. </p>
                    <ul className="network-list">
                        <li>
                            “Daily” means this is someone you communicate with daily.
                        </li>
                        <li>
                            “Weekly” indicates this is someone you usually interact with and communicate on a weekly basis.
                        </li>
                        <li>
                            “Less often” indicates this is someone you speak to infrequently.
                        </li>
                    </ul>
                    <form className="network-form" onSubmit={this.handleSubmit}>
                        <p> How often do you communicate with _ ? </p>
                        <div className="input-row">
                            <label className="dropdown-input-label" htmlFor="name1"> <p>{name1}</p> </label>
                            <DropdownSelect></DropdownSelect>
                        </div>
                        <div className="input-row">
                            <label className="dropdown-input-label" htmlFor="name2"> <p>{name2}</p> </label>
                            <DropdownSelect></DropdownSelect>

                        </div>
                        <div className="input-row">
                            <label className="dropdown-input-label" htmlFor="name3"> <p>{name3}</p> </label>
                            <DropdownSelect></DropdownSelect>

                        </div>
                        <div className="input-row">
                            <label className="dropdown-input-label" htmlFor="name4"> <p>{name4}</p> </label>
                            <DropdownSelect></DropdownSelect>

                        </div>
                        <div className="input-row">
                            <label className="dropdown-input-label" htmlFor="name5"> <p>{name5}</p> </label>
                            <DropdownSelect></DropdownSelect>

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
