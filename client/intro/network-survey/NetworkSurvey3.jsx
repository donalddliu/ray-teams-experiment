import React from "react";


import { Centered } from "meteor/empirica:core";
import { HTMLSelect } from "@blueprintjs/core";

const DropdownSelect = ({id, name, handleChange}) => (
    <div className="bp4-html-select">
        <select className="dropdown-select-input" defaultValue="" id={id} name={name} onChange={handleChange} required>
            <option value="" disbaled="true" hidden></option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="lessoften">Less often</option>
        </select>
    </div>
);

export default class NetworkSurveyThree extends React.Component {
  state = {
        tie12 : "", tie13 : "", tie14: "", tie15: "", 
        tie23 : "", tie24 : "", tie25 : "",
        tie34 : "", tie35 : "",
        tie45 : "",
  };
  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    const { onNext, player } = this.props;
    event.preventDefault();
    const networkSurveyResponse = this.state;
    player.set("networkResponse3", networkSurveyResponse);

    // TODO: log player response to survey question
    onNext();
  };

  render() {
    const { game, round, stage, player } = this.props;
    const {tie12, tie13, tie14, tie15, tie23, tie24, tie25, tie34, tie35, tie45} = this.state;
    const filledOut = tie12 && tie13 && tie14 && tie15 && tie23 && tie24 && tie25 && tie34 && tie35 && tie45;
    const {name1, name2, name3, name4, name5} = player.get("networkResponse1");
    
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
                        The people you cited on the previous page are listed in the table below. The task is to indicate how often the people you know communicate with each other.
                    </p>
                    <ul className="network-list">
                        <li>
                            “Daily” means that to the best of your knowledge, the two people communicate daily.
                        </li>
                        <li>
                            “Weekly” indicates the two people usually interact and communicate on a weekly basis.
                        </li>
                        <li>
                            “Less often” indicates, again, as best you know, that the two people communicate infrequently or not at all.
                        </li>
                    </ul>
                    <form className="network-form" onSubmit={this.handleSubmit}>
                        <table className="name-matrix-table">
                            <tbody>
                                <tr>
                                    <th>How often does __ communicate with __ ?</th>
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
