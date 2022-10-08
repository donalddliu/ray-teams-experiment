import React from "react";
import moment from "moment";


import { Centered } from "meteor/empirica:core";

export default class Thanks extends React.Component {
  static stepName = "Thanks";
  render() {
    const { player, game } = this.props;
    const basePay = game.treatment.basePay;
    const conversionRate = game.treatment.conversionRate;

    console.log(player.get("nodeId"))
    return (
      <div className="finished">
        <div>
          {player.get("nodeId") ?
          <p> If you are receiving this message, it means you have participated in one of our symbol task games before. As mentioned in out HIT expectations, if you've participated in one of our HIT sessions before, you cannot participate in another. We are trying to gather new players for each game. 
            If you think this is a mistake, please do no hesistate to reach out.</p>
          :
          <div>
            <h4>Finished!</h4>
              {player.exitReason === "preQualSuccess" ? 
                <p>Thank you for participating! Please submit the following code to receive your bonus 
                { basePay && conversionRate ? ` of $${basePay} : ` : " "} 
                <strong>{player._id}</strong>
                </p> 
                
                : 
                <p>Thank you for participating! Please submit the following code to receive your bonus 
                { basePay && conversionRate ? ` of $${basePay + parseInt(player.get("score")*conversionRate)} : ` : " "}
                <strong>{player._id}</strong>
                </p> 
                
              }
            </div>
          }

        </div>
      </div>
    );
  }
}
