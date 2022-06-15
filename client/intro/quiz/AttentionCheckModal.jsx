import React from "react";

export default class AttentionCheckModal extends React.Component {

    render() {
        const {player, onPrev, onCloseModal} = this.props;
        const triesLeft = player.get("attentionCheckTries");
        return (
            <div className="dark-bg" onClick={onCloseModal}>
                <div className="modal-centered">
                    <div className="modal">
                        <div className="modal-content">
                            You have failed the attention check. You have {triesLeft} tries left. You can choose to try again, or go back to reread the instructions.
                        </div>
                        <div className="attention-check-button-container">
                            <button className="modal-button" onClick={onPrev}> 
                                Review
                            </button>
                            <button className="modal-button" onClick={onCloseModal}>
                                Try Again
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}