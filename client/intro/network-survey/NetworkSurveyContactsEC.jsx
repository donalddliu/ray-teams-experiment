import React from "react";


import { Centered } from "meteor/empirica:core";
import { HTMLSelect } from "@blueprintjs/core";

const DropdownSelect = ({id, name, handleChange}) => (
    <div className="bp4-html-select">
        <select className="dropdown-select-input" defaultValue="" id={id} name={name} onChange={handleChange} required>
            <option value="" disbaled="true" hidden></option>
            <option value="EC">Especially Close</option>
            <option value="S">Strangers</option>
            <option value="M">Neither</option>
        </select>
    </div>
);

export default class NetworkSurveyContactsEC extends React.Component {
  constructor(props) {
    super(props);
    const {name1, name2, name3, name4, name5} = this.props.player.get("networkResponse1");

    this.state = {
        tie12 : "", tie13 : "", tie14: "", tie15: "", 
        tie23 : "", tie24 : "", tie25 : "",
        tie34 : "", tie35 : "",
        tie45 : "",
        name1: name1, name2: name2, name3: name3, name4: name4, name5: name5
     };
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    const { onNext, player } = this.props;
    event.preventDefault();
    const {tie12, tie13, tie14, tie15, tie23, tie24, tie25, tie34, tie35, tie45} = this.state;

    const networkSurveyResponse = {
        tie12 : tie12, tie13 : tie13, tie14: tie14, tie15: tie15, 
        tie23 : tie23, tie24 : tie24, tie25 : tie25,
        tie34 : tie34, tie35 : tie35,
        tie45 : tie45,
    };
    player.set("networkResponseContactsEC", networkSurveyResponse);

    // TODO: log player response to survey question
    onNext();
  };

  render() {
    const { game, round, stage, player } = this.props;
    const {tie12, tie13, tie14, tie15, tie23, tie24, tie25, tie34, tie35, tie45} = this.state;
    const filledOut = tie12 && tie13 && tie14 && tie15 && tie23 && tie24 && tie25 && tie34 && tie35 && tie45;
    const {name1, name2, name3, name4, name5} = this.state;

    
    return (
          <div className="network-survey-container">
                <div className="network-survey-header">
                    <p>
                    THIS QUESTION ASKS FOR YOUR VIEW OF CONNECTIONS AMONG THE PEOPLE YOU NAMED. YOU ARE ALMOST FINISHED.
                    </p>
                </div>
                <img src={`images/hr-color.png`} />
                <div className="network-survey-body">
                    <p>
                        The people you cited on the previous page are listed in the table below. Next, please think about connections between the people you mentioned. Some of them can be total strangers in the sense that they wouldn't recognize the other person if they bumped into one other on the street. Some of them can be especially close, as close or closer to each other as they are to you. Please select the appropriate box to describe how close the people you know are with each other.
                    </p>
                    <ul className="network-list">
                        <li>
                            “Especially Close” indicates this is one of your closest personal contacts.
                        </li>
                        <li>
                            "Strangers" indicates that they rarely work together, are total strangers as far as you know, or do not enjoy one another's company.
                        </li>
                        <li>
                            “Neither" indicates this is someone you don't mind working with, but have no wish to develop a friendship.
                        </li>
                    </ul>
                    <form className="network-form" onSubmit={this.handleSubmit}>
                        <table className="name-matrix-table">
                            <tbody>
                                <tr>
                                    <th>How close is __ with __ ?</th>
                                    <th>{name2}</th>
                                    <th>{name3}</th>
                                    <th>{name4}</th>
                                    <th>{name5}</th>
                                </tr>
                                <tr>
                                    <td> {name1}</td>
                                    {_.times(4, i=> {
                                        return( // tie12, tie13, tie14, tie15
                                            <td key={`tie1${i+2}`}><DropdownSelect id={`tie1${i+2}`} name={`tie1${i+2}`} handleChange={this.handleChange}/> </td>
                                        )
                                    })}
                                </tr>
                                <tr>
                                    <td> {name2}</td>
                                    {_.times(4, i=> { // tie23, tie24, tie25
                                        return i > 0 ? <td key={`tie2${i+2}`}><DropdownSelect id={`tie2${i+2}`} name={`tie2${i+2}`} handleChange={this.handleChange}/> </td> : <td></td>
                                        }
                                    )}
                                </tr>
                                <tr>
                                    <td> {name3}</td>
                                    {_.times(4, i=> { // tie34, tie35
                                        return i > 1 ? <td key={`tie3${i+2}`}><DropdownSelect id={`tie3${i+2}`} name={`tie3${i+2}`} handleChange={this.handleChange}/> </td> : <td></td>
                                        }
                                    )}
                                </tr>
                                <tr>
                                    <td> {name4}</td>
                                    {_.times(4, i=> { // tie45
                                        return i > 2 ? <td key={`tie4${i+2}`}><DropdownSelect id={`tie4${i+2}`} name={`tie4${i+2}`} handleChange={this.handleChange}/> </td> : <td></td>
                                        }
                                    )}
                                </tr>

                            </tbody>
                        </table>
                        <div className="network-button-container">
                            <button 
                                className={!filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}
                                disabled={!filledOut} 
                                type="submit"> Submit
                            </button> 
                        </div>
                    </form>
                </div>
          </div>
   
    );
  }
}
