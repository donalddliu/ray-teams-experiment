import React from 'react';
import PlayerTab from './PlayerTab';

export default class MyNetwork extends React.Component {

    render() {
        const {game, stage, round, player, onOpenChat} = this.props;
        const network = player.get("neighbors");
        return (
            <div className="network-container">
                <p className="network-header"> MY NETWORK</p>
                <div className="network-all-players-container">
                {network.map((otherNodeId) => {
                    // const otherPlayerId = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId)).id;
                    return (
                        <PlayerTab game={game} otherPlayerNodeId={otherNodeId} openChat={onOpenChat} />
                    )
                })
                }
                </div>
            </div>
        )
    }
}