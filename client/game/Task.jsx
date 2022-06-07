import React from "react";

import TaskResponse from "./TaskResponse";

export default class Task extends React.Component {
  render() {
    const { stage, player, game } = this.props;

    return (
      <div className="task-container">
        <TaskResponse {...this.props} />
      </div>
    );
  }
}
