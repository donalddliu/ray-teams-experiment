import React from 'react';

export default class PlayerTab extends React.Component {

    handleOpenChat = () => {
        const {otherPlayerNodeId, openChat} = this.props;
        openChat(otherPlayerNodeId);
    }

    render() {
        const {game, otherPlayerNodeId, openChat} = this.props;
        const otherPlayerId = game.players.find(p => p.get("nodeId") === parseInt(otherPlayerNodeId)).id;


        return (
            <div className="network-player-container">
                <div className="network-name-container" onClick={this.handleOpenChat}>
                    {otherPlayerId}
                </div>
                <div className="network-avatar-container">
                    <img src={`images/icon-profile-white.png`} width="25px" height="25px" />
                </div>
            </div>
        )
    }
}