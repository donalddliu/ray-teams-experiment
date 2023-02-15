import React from "react";

import { Checkbox } from "@blueprintjs/core";


export default class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            availability: {},
            dates: ['12/29/22', '12/30/22', '12/31/22', '1/1/23', '1/2/23'],
            times: ['9-10 AM', '10-11 AM', '11-12 PM', '12-1 PM', '1-2 PM', '2-3 PM', '3-4 PM', '4-5 PM', '5-6 PM', '6-7 PM',' 7-8 PM', '8-9 PM', '9-10 PM'],
        }
        this.state.dates.forEach((date) => {
            this.state.times.forEach((time) => {
                this.state.availability[`${date} ${time}`] = false;
            })
        })

    }

    handleChange = event => {
        const el = event.currentTarget;
        this.setState({ availability: {...this.state.availability, [el.name]: !this.state.availability[el.name] }})
    }

    handleSubmit = event => {
        const { onNext, player } = this.props;
        event.preventDefault();
        player.set(`timeAvailabilities`, this.state.availability);
        player.set("passedPreQual", true);
        player.exit("preQualSuccess");
    }

    render(){

        return (
            <div className="network-survey-container">
                <div className="network-survey-header">
                    <p> 
                        Please fill out all the times you will be available to play this game.
                        <br></br>
                        The time with the most overlapping players will be chosen. 
                        <br></br>
                        Note: If there are too many participants filling out the survey at once, there may be some server delays. If you click submit and you do not immediately proceed to the exit page, please be patient as it will eventually submit.

                    </p>
                </div>
                <form className="network-form" onSubmit={this.handleSubmit}>
                    <table className="name-matrix-table">
                        <tbody>
                            <tr>
                                <th style={{textAlign: "right"}}> Time (PST) </th>
                                <th> 12/29/22 (Thu) </th>
                                <th> 12/30/22 (Fri) </th>
                                <th> 12/31/22 (Sat) </th>
                                <th> 1/1/23 (Sun) </th>
                                <th> 1/2/23 (Mon) </th>

                            </tr>
                            {this.state.times.map(time => {
                                return (
                                    <tr>
                                        <td style={{textAlign: "right"}}> {time} </td>
                                        {this.state.dates.map(date => {
                                            return (
                                                <td style={{textAlign: "center"}}>
                                                    <Checkbox 
                                                    // checked={this.state[`${date} ${time}`]}
                                                    key={`${date} ${time}`}
                                                    checked={this.state.availability[`${date} ${time}`]}
                                                    name={`${date} ${time}`}
                                                    onChange={this.handleChange}
                                                    > 
                                                    </Checkbox>
                                                </td>
                                            )

                                        })}
                                    </tr>
                                )
                            })

                        }
                        </tbody>
                    </table>
                    <div className="network-button-container" style={{justifyContent: "flex-end"}}>
                            <button 
                                className={"arrow-button button-submit"}
                                type="submit"> Submit
                            </button> 
                        </div>
                </form>
            </div>

        )
    }
    
     
}