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
        player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    }
    
    onPlayerInactive = (player) => {
        if (player.get("inactive") === false) {
            player.set("inactive", true);
            player.set("submitted", false);
        }
    }

    render() {
        const {game, round, stage, player} = this.props; 
        const currentTime = moment(TimeSync.serverTime(null, 1000));
        const inactiveDuration = game.treatment.userInactivityDuration;
        const activePlayers = game.players.filter(p => !p.get("inactive"));
        console.log(activePlayers);

        activePlayers.forEach((p) => {
            const playerLastActive = p.get("lastActive");
            const timeDiff = currentTime.diff(playerLastActive, 'seconds');
            
            if (timeDiff >= inactiveDuration) {
                this.onPlayerInactive(p);
                p.exit("inactive");
                // this.onPlayerInactive();
    
            } else if (timeDiff > inactiveDuration - game.treatment.idleWarningTime) {
                if (!this.state.modalIsOpen && p._id === player._id) {
                    this.onOpenModal();
                }
            }
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
