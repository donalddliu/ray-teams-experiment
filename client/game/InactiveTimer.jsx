import React from 'react';
import Timer from "./Timer.jsx";

import { StageTimeWrapper } from "meteor/empirica:core";

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";

import Modal from "./Modal";


class inactiveTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          modalIsOpen: false,
        }
    }

    onOpenModal = () => {
        this.setState({modalIsOpen: true});
    }
    
    onCloseModal = () => {
        const {player} = this.props;
        this.setState({modalIsOpen: false});
        if (!player.get("inactiveWarningUsed")) {
            player.set("lastActive", moment(TimeSync.serverTime(null, 1000)).subtract(30, 'seconds'));
            player.set("inactiveWarningUsed", true);
        }
    }
    
    onPlayerInactive = (player, game) => {
        if (player.get("inactive") === false) {
            player.set("inactive", true);
            player.set("submitted", false);
            game.set("checkForSimilarSymbol", true);
        }
    }

    render() {
        const {game, round, stage, player} = this.props; 
        const currentTime = moment(TimeSync.serverTime(null, 1000));
        const inactiveDuration = game.treatment.userInactivityDuration;
        const inactiveDurationPlus30 = inactiveDuration + game.treatment.idleWarningTime;
        const activePlayers = game.players.filter(p => !p.get("inactive"));

        activePlayers.forEach((p) => {
            const playerLastActive = p.get("lastActive");
            const timeDiff = currentTime.diff(playerLastActive, 'seconds');

            if (!p.get("inactiveWarningUsed")) {
                if (timeDiff >= inactiveDurationPlus30) {
                    this.onPlayerInactive(p,game);
                    p.exit("inactive");
                }
                else if (timeDiff >= inactiveDuration) {
                    if (!this.state.modalIsOpen && p._id === player._id){
                        this.onOpenModal();
                    }
                }
            } else {
                if (timeDiff >= inactiveDuration) {
                    this.onPlayerInactive(p,game);
                    p.exit("inactive");
                }
            }
            // if (timeDiff >= inactiveDuration) {
            //     this.onPlayerInactive(p, game);
            //     p.exit("inactive");
            //     // this.onPlayerInactive();
    
            // } else if (timeDiff > inactiveDuration - game.treatment.idleWarningTime) {
            //     if (!this.state.modalIsOpen && p._id === player._id) {
            //         if (!p.get("inactiveWarningUsed")) {
            //             this.onOpenModal();
            //         } else if (p.get("inactiveWarningUsed") && (timeDiff % 5 === 0)) {
            //             this.onOpenModal();
            //         }

            //     }
            // }
        })
        // const playerLastActive = player.get("lastActive");
        // const inactiveDuration = game.treatment.userInactivityDuration;
        // const timeDiff = currentTime.diff(playerLastActive, 'seconds');
        
        // if (timeDiff >= inactiveDuration) {
        //     this.onPlayerInactive();
        //     player.exit("inactive");
        //     // this.onPlayerInactive();

        // } else if (timeDiff > inactiveDuration - game.treatment.idleWarningTime) {
        //     if (!this.state.modalIsOpen) {
        //         this.onOpenModal();
        //     }
        // }

        return(
            <div>
                {this.state.modalIsOpen && <Modal game={game} player={player} onCloseModal={this.onCloseModal} />}
                {/* Last Active: {timeDiff} */}
            </div>
        )
    }
}

export default (InactiveTimer = StageTimeWrapper(inactiveTimer));
