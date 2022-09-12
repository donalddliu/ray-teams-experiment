import React from "react";

export default class TaskWarningModal extends React.Component {

    render() {
        const {game, player, onCloseModal} = this.props;

        return (
            <div className="dark-bg" onClick={onCloseModal}>
                <div className="modal-centered">
                    <div className="modal">
                        <div className="modal-content">
                            Warning, this round is ending in 30 seconds. Please submit your final answer.
                        </div>
                        <button className="modal-button" onClick={onCloseModal}>
                            Okay
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}