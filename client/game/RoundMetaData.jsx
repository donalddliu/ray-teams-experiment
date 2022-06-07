import React from 'react';
import Timer from "./Timer.jsx";

import InactiveTimer from './InactiveTimer';

export default class RoundMetaData extends React.Component {

    render() {
        const {game, round, stage, player} = this.props; 

        const playerId = player.id;
        const taskName = stage.displayName;
        const totalTaskRounds = game.treatment.numTaskRounds;

        // const allSymbols = [];
        // game.players.forEach(player => {
        //     const taskSymbols = 
        // })

        
        return(
            <div className="metadata-container">
                {/* <div className="player-avatar-container">
                    {player.get("avatar") ? 
                    <img src={player.get("avatar")} width="100px" height="100px"/> : 
                    <img src={`images/icon-profile-white.png`} width="100px" height="100px" />
                    }
                </div>
                <div className="player-name-container">
                    {playerId}
                </div> */}
                <div className="round-number-container">
                    {taskName} of {totalTaskRounds}
                </div>
                <p>
                    Your player name is {player.get("anonymousName")}
                </p>
                <div style={{display: "flex", flexDirection:"column"}}>
                    <Timer stage={stage}/>
                    <InactiveTimer game={game} player={player} />
                </div>
            </div>
        )
    }
}
