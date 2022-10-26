import React from 'react';
import Timer from "./Timer.jsx";

import { StageTimeWrapper } from "meteor/empirica:core";

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";

import Modal from "./Modal";
import _ from 'lodash';

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
        const {player, game} = this.props;
        const inactiveDuration = game.treatment.userInactivityDuration;
        const extra30Seconds = inactiveDuration - game.treatment.idleWarningTime;

        if (!player.get("inactiveWarningUsed")) {
            player.set("lastActive", moment(TimeSync.serverTime(null, 1000)).subtract(extra30Seconds, 'seconds'));
            player.set("inactiveWarningUsed", true);
        }
        this.setState({modalIsOpen: false});

    }
    
    onPlayerInactive = (player, game) => {
        if (player.get("inactive") === false) {
            player.set("inactive", true);
            player.set("submitted", false);
            game.set("checkForSimilarSymbol", true);
        }
    }

    checkEveryoneLastActive = _.throttle((game, player) => {
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
        })
    }
    , 1000, {leading: true});


    render() {
        const {game, round, stage, player} = this.props; 
        this.checkEveryoneLastActive(game, player);
        // const currentTime = moment(TimeSync.serverTime(null, 1000));
        // const inactiveDuration = game.treatment.userInactivityDuration;
        // const inactiveDurationPlus30 = inactiveDuration + game.treatment.idleWarningTime;
        // const activePlayers = game.players.filter(p => !p.get("inactive"));

        // activePlayers.forEach((p) => {
        //     console.log("checking");
        //     const playerLastActive = p.get("lastActive");
        //     const timeDiff = currentTime.diff(playerLastActive, 'seconds');


        //     if (!p.get("inactiveWarningUsed")) {
        //         if (timeDiff >= inactiveDurationPlus30) {
        //             this.onPlayerInactive(p,game);
        //             p.exit("inactive");
        //         }
        //         else if (timeDiff >= inactiveDuration) {
        //             if (!this.state.modalIsOpen && p._id === player._id){
        //                 this.onOpenModal();
        //             }
        //         }
        //     } else {
        //         if (timeDiff >= inactiveDuration) {
        //             this.onPlayerInactive(p,game);
        //             p.exit("inactive");
        //         }
        //     }
        // })
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
        const currentTime = moment(TimeSync.serverTime(null, 1000));
        const playerLastActive = player.get("lastActive");
        const timeDiffForMe = currentTime.diff(playerLastActive, 'seconds');
        return(
            <div>
                {this.state.modalIsOpen && <Modal game={game} player={player} onCloseModal={this.onCloseModal} />}
                Last Active: {timeDiffForMe}
            </div>
        )
    }
}

export default (InactiveTimer = StageTimeWrapper(inactiveTimer));
