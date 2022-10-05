import React from "react";

export default class Modal extends React.Component {

    render() {
        const {game, player, onCloseModal} = this.props;

        return (
            <div className="dark-bg" onClick={onCloseModal}>
                <div className="modal-centered">
                    <div className="modal">
                        <div className="modal-content">
                            Warning, you seem to be inactive. This was your ONE warning. Next time, you will be kicked without a warning. If you are still inactive in the next {game.treatment.idleWarningTime} seconds, you will be kicked. Do you understand?
                        </div>
                        <button className="modal-button" onClick={onCloseModal}>
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}