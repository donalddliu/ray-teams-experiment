import React from 'react';
import Timer from "./Timer.jsx";

import { StageTimeWrapper } from "meteor/empirica:core";

import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";

import TaskWarningModal from "./TaskWarningModal";


class taskTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          modalIsOpen: false,
          warningShown: false,
        }
    }

    onOpenModal = () => {
        this.setState({modalIsOpen: true, warningShown: true});
    }
    
    onCloseModal = () => {
        const {player} = this.props;
        this.setState({modalIsOpen: false});
        player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    }

    render() {
        const {game, round, stage, player, remainingSeconds} = this.props; 
        const taskWarningTime = game.treatment.taskWarningTime;
        const classes = ["timer"];
        if (remainingSeconds <= 5) {
          classes.push("lessThan5");
        } else if (remainingSeconds <= 10) {
          classes.push("lessThan10");
        }

        if (remainingSeconds <= taskWarningTime && !this.state.modalIsOpen && !this.state.warningShown) {
            this.onOpenModal();
        }



        return(
            <div className={classes.join(" ")} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <div>
                    <h1 className="results-text" style={{margin: "0px 0px"}}>Time Left for Task: {remainingSeconds}</h1>
                </div>
                {this.state.modalIsOpen && <TaskWarningModal game={game} player={player} onCloseModal={this.onCloseModal} />}
            </div>
        )
    }
}

export default (TaskTimer = StageTimeWrapper(taskTimer));
