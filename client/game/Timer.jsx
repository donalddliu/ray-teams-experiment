import { StageTimeWrapper } from "meteor/empirica:core";
import React from "react";

class timer extends React.Component {
  render() {
    const { remainingSeconds, stage } = this.props;
    const classes = ["timer"];
    if (remainingSeconds <= 5) {
      classes.push("lessThan5");
    } else if (remainingSeconds <= 10) {
      classes.push("lessThan10");
    }

    return (
      <div className={classes.join(" ")} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        {stage.name === "Result" ? 
        <div>
          <h1 className="results-text">Next Round In</h1>
          <h1 className="results-text" style={{margin: "0px 0px"}}>{remainingSeconds}</h1>
        </div> :
        <div>
        <h1 className="results-text" style={{margin: "0px 0px"}}>Time Left: {remainingSeconds}</h1>
        </div>
        }
      </div>
    );
  }
}

export default (Timer = StageTimeWrapper(timer));
