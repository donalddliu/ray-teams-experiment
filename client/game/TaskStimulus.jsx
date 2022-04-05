import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
    const { stage, player } = this.props;

    return (
      <div className="task-stimulus">
        Work with your teammates to find the common symbol.
      </div>
    );
  }
}
