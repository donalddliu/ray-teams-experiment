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

export default class NetworkSurveyThree extends React.Component {

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
                                        return(
                                            <td key={i}><DropdownSelect /> </td>
                                        )
                                    })}
                                </tr>
                                <tr>
                                    <td> {name2}</td>
                                    {_.times(4, i=> {
                                        return i > 0 ? <td key={i}><DropdownSelect /> </td> : <td></td>
                                        }
                                    )}
                                </tr>
                                <tr>
                                    <td> {name3}</td>
                                    {_.times(4, i=> {
                                        return i > 1 ? <td key={i}><DropdownSelect /> </td> : <td></td>
                                        }
                                    )}
                                </tr>
                                <tr>
                                    <td> {name4}</td>
                                    {_.times(4, i=> {
                                        return i > 2 ? <td key={i}><DropdownSelect /> </td> : <td></td>
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
