import React from "react";

import { Centered } from "meteor/empirica:core";


export default class Round extends React.Component {

  render() {
    const { stage, round, game } = this.props;
    const result = round.get("result");

    const correctMessage = "Your team was correct, congratulations!";
    const incorrectMessage = "Your team was not correct, better luck on the next one.";
      
    return (
      <div className="results-container">
        <div className="results-content">
            <h1 className="results-text"> {result ? correctMessage : incorrectMessage} </h1>
            <img src={`images/hr-color.png`} width="200px" height="3px" />
        </div>
      </div>
    );
  }
}
