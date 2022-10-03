import React from 'react';
import Timer from "./Timer.jsx";
import TaskTimer from './TaskTimer.jsx';

import InactiveTimer from './InactiveTimer';

export default class RoundMetaData extends React.Component {

    render() {
        const {game, round, stage, player} = this.props; 
        const taskWarningTime = game.treatment.taskWarningTime;

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
                <div style={{display: "flex", flexDirection:"column", alignItems: "center"}}>
                    {game.treatment.maxGameTime && <GameTimer game={game}/>}
                    <p>
                        Your player name is {player.get("anonymousName")}
                    </p>
                </div>
                <div style={{display: "flex", flexDirection:"column"}}>
                    {taskWarningTime && <TaskTimer game={game} stage={stage} player={player}/>}
                    <InactiveTimer game={game} player={player} />
                </div>
            </div>
        )
    }
}
