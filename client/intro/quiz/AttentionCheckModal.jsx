import React from "react";

export default class AttentionCheckModal extends React.Component {

    render() {
        const {player, triesLeft, onCloseModal} = this.props;
        return (
            <div className="dark-bg" onClick={onCloseModal}>
                <div className="modal-centered">
                    <div className="modal">
                        <div className="modal-content">
                            You got this comprehension check question wrong. You have {triesLeft} try left. Please carefully reread the instructions.

                            {/* You have failed the attention check. You have {triesLeft} tries left. Please go back and reread the instructions. */}

                            {/* Note: Once redirected, view the other pages by clicking on "Previous". If you click "Attention Check", you will come back to this Attention Check.  */}
                        </div>
                        <div className="attention-check-button-container">
                            {/* <button className="modal-button" onClick={onPrev}> 
                                Review
                            </button> */}
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