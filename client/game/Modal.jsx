import React from "react";

export default class Modal extends React.Component {

    render() {
        const {game, player, onCloseModal} = this.props;

        return (
            <div className="dark-bg" onClick={onCloseModal}>
                <div className="modal-centered">
                    <div className="modal">
                        <div className="modal-content">
                            Warning, you seem to be inactive. You have {game.treatment.idleWarningTime} seconds before you will be kicked due to inactivity. Are you still here?
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