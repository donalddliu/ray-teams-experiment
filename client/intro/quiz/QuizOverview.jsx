import React from "react";
import '../../../public/css/intro.css';

import { Centered } from "meteor/empirica:core";

export default class QuizOverview extends React.Component {
    handleSubmit = event => {
        const { hasPrev, hasNext, onNext, onPrev, game, player } = this.props;
        event.preventDefault();
        onNext();
    };

    render() {
        const {game, onPrev, player} = this.props;

        return (
            <Centered>
                <div className= "intro-heading questionnaire-heading"> Important Game Overview </div>
                    <div className="questionnaire-content-container">
                        <div className="questionnaire-body">
                            <div className="question-section">
                                <p className="questionnaire-question"> PLEASE READ THE FOLLOWING CAREFULLY </p>
                                <label className="questionnaire-question"> 
                                    1. This game may last up to <span style={{fontWeight: 'bolder'}}>  {game.treatment.maxGameTime} minutes</span>. If you cannot make this commitment, please leave and wait for the next session.
                                </label>
                                <label className="questionnaire-question">
                                    2. If you are inactive for longer than <span style={{fontWeight: 'bolder'}}>  {game.treatment.userInactivityDuration/60} minutes</span>, you will be kicked from the game. You will only get <span style={{fontWeight: 'bolder'}}> ONE warning </span> about your inactivity. If you are still inactive in the next 30 seconds, you will be kicked. If you become active, your timer will reset. Thus, actively speak with your teammates until everyone has submitted. <span style={{fontWeight: 'bolder'}}> Your inactive timer will still run after you submit. </span>
                                </label>
                                <label className="questionnaire-question">
                                    3. If a player is kicked from the game, the <span style={{fontWeight: 'bolder'}}> entire game for everyone will end </span>  after the round is finished. 
                                </label>
                                <label className="questionnaire-question">
                                    4. For each trial, there will be <span style={{fontWeight: 'bolder'}}> only 1 common symbol </span> amongst everyone. Some symbols may be the same amongst a few of you, but only one that you all share.
                                </label>
                                <label className="questionnaire-question">
                                    5. Each player will have different 1-on-1 chats with people to communicate with. You may not have the same chats as others. Some may only have one chat, while others may have more.
                                </label>
                                <label className="questionnaire-question">
                                    6. After selecting a symbol and submitting it, you are allowed to reconsider your answer if you find more information from your team.
                                </label>
                                { game.treatment.conversionRate && game.treatment.basePay ? 
                                <label className="questionnaire-question"> 
                                    7. You will receive a ${game.treatment.conversionRate} bonus each time your team correctly identifies the shared symbol. If you complete all trials of the experiment, you could earn up to an additional ${ game.treatment.numTaskRounds * game.treatment.conversionRate}.
                                </label>
                                : 
                                <label className="questionnaire-question">
                                    7. You will receive $1 bonus each time your team correctly identifies the shared symbol. If you complete all trials of the experiment, you could earn up to ${ game.treatment.numTaskRounds * 1}.
                                </label>
                                }
                                {/* { game.treatment.conversionRate && game.treatment.basePay ? 
                                <label className="questionnaire-question"> 
                                    7. You will receive a flat fee of ${game.treatment.basePay} for participating. You will also receive ${game.treatment.conversionRate} bonus each time your team correctly identifies the shared symbol. If you complete all trials of the experiment, you could earn up to ${game.treatment.basePay + game.treatment.numTaskRounds * game.treatment.conversionRate}.
                                </label>
                                : 
                                <label className="questionnaire-question">
                                    7. You will receive a flat fee of $2 for participating. You will also receive $1 bonus each time your team correctly identifies the shared symbol. If you complete all trials of the experiment, you could earn up to ${2 + game.treatment.numTaskRounds * 1}.
                                </label>
                                } */}
                                <br></br>
                            </div>
                            <form className="questionnaire-btn-container" onSubmit={this.handleSubmit}>
                                <button className="arrow-button button-submit" type="submit"> Proceed </button> 
                            </form>
                            
                        </div>
                    </div>
            </Centered>
        )

    }
}