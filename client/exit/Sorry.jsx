import React, { Component } from 'react'
import { Meteor } from "meteor/meteor";
import { Centered } from "meteor/empirica:core";

import FailedAttentionCheck from "./FailedAttentionCheck";

export default class Sorry extends Component {
    static stepName = "Sorry";

    render() {
        const { player, game } = this.props;
        let msg;

        switch (player.exitStatus) {
            case "gameFull":
                msg = "All games you are eligible for have filled up too fast...";
                break;
            case "gameLobbyTimedOut":
                msg = "There were NOT enough players for the game to start...";
                break;
            case "playerEndedLobbyWait":
                msg =
                    "You decided to stop waiting, we are sorry it was too long a wait.";
                break;
            default:
                msg = "Unfortunately the Game was cancelled...";
                break;
        }
        if (player.exitReason === "failedQuestion") {
            return <FailedAttentionCheck />
        }
        if (player.exitReason === "inactive") {
            msg = "You were inactive for too long, and we had to end the game. Thank you for participating in this game, you will still get paid the base amount including any bonuses for teh rounds you successfully passed. Please submit your MTurk Worker Id to the HIT and we will make sure you get paid accordingly.";
        }
        if (player.exitReason === "someoneInactive") {
            msg = "A player was inactive for too long, and we had to end the game. Thank you for participating in this game, you will get paid the base amount including any bonuses for the rounds you successfully passed. Please submit your MTurk Worker ID to the HIT and we will make sure you get paid accordingly. ";
        }
        // Only for dev
        if (!game && Meteor.isDevelopment) {
            msg =
                "Unfortunately the Game was cancelled because of failed to init Game (only visible in development, check the logs).";
        }
        return (
            <Centered>
                <div>
                    <h4>Sorry!</h4>
                    <p>Sorry, you were not able to play today! {msg}</p>
                    <p>
                        <strong>Please contact the researcher to see if there are more games available.</strong>
                    </p>
                </div>
            </Centered>
        );
    }
}