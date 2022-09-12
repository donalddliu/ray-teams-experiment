import React from "react";

import { Centered } from "meteor/empirica:core";

export default class Thanks extends React.Component {
  static stepName = "Thanks";
  render() {
    const { player, game } = this.props;
    const basePay = game.treatment.basePay;
    const conversionRate = game.treatment.conversionRate;

    return (
      <div className="finished">
        <div>
          <h4>Finished!</h4>
            <p>Thank you for participating! Please submit the following code to receive your bonus 
              { basePay && conversionRate ? ` of $${basePay + parseInt(player.get("score")*conversionRate)}` : ""}
               :{" "}
              <strong>{player._id}</strong>
            </p> 
        </div>
      </div>
    );
  }
}
