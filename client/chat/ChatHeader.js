import "./style.less";
import React from "react";

export default class ChatHeader extends React.PureComponent {


    render() {
        const {otherPlayer, onTitleClick, onXClick, playerIsOnline} = this.props;
        
        return (
            <div className={`header ${otherPlayer.toLowerCase()}`}>
                <span className="title" onClick={onTitleClick}> {otherPlayer} {playerIsOnline ? "" : " (offline)"}</span>
                <span className="close-button" onClick={onXClick}> 
                    <img src={`images/icon-net-window-close.png`} width="17px" height="17px"/>
                </span>
            </div>
        )
    }
}