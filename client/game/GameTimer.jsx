import { StageTimeWrapper } from "meteor/empirica:core";
import React from "react";
import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";

class timer extends React.Component {
  render() {
    const { remainingSeconds, game } = this.props;
    const classes = ["timer"];
    if (remainingSeconds <= 5) {
      classes.push("lessThan5");
    } else if (remainingSeconds <= 10) {
      classes.push("lessThan10");
    }

    const gameStartTime = moment(game.get("gameStartTime"));
    const gameEndTime = moment(game.get("maxGameEndTime"));
    const currentTime =  moment(TimeSync.serverTime(null, 1000));

    const timeDiff = gameEndTime.diff(currentTime, 'seconds');

    const activePlayers = game.players.filter(p => !p.get("inactive"));
    if (timeDiff < 0) {
        activePlayers.forEach((p) => {
            p.exit("maxGameTimeReached");
        })
    }


    return (
        <div className={classes.join(" ")} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <div>
          <h1 className="results-text" style={{margin: "0px 0px"}}>Total Game Time Left: {timeDiff}</h1>
          </div>
        </div>
    );
  }
}

export default (GameTimer = StageTimeWrapper(timer));
