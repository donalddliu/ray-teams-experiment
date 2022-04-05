import "../chat/style.less";

import React from "react";
import { Chat } from "@empirica/chat";
import ChatContainer from "../chat/ChatContainer.js";
import  Message  from "../chat/Message.js";
import Footer from "../chat/Footer.js";
import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
import Slider from "meteor/empirica:slider";


export default class SocialExposure extends React.Component {
  renderSocialInteraction(otherPlayer) {
    const value = otherPlayer.round.get("value");
    return (
      <div className="alter" key={otherPlayer._id}>
        <img src={otherPlayer.get("avatar")} className="profile-avatar" />
        <div className="range">
          <Slider
            min={0}
            max={1}
            stepSize={0.01}
            value={value}
            disabled
            hideHandleOnEmpty
          />
        </div>
      </div>
    );
  }

  logIncomingMessage = (msgs, customKey) => {
    const {game, round, stage, player} = this.props;

    const messages = round.get(`${customKey}`)
    const mostRecentMsg = messages[messages.length -1];
    const receiver = mostRecentMsg.player._id;

    // TODO: Check if this only appends if player chat is open
    // onIncomingMessage logs the message for both sender and receiver
    // Only log one copy of the message
    if (player._id === receiver) {
      stage.append("log", {
        verb: "messageLog",
        subjectId: player.id,
        object: mostRecentMsg,
        at: moment(TimeSync.serverTime(null, 1000)),
      })
    }
  }

  render() {
    const { game, round, player, onCloseChat, activeChats } = this.props;

    const network = player.get("neighbors");
    // reactive time value only updates at 1000 ms
    const timeStamp = new Date(TimeSync.serverTime(null, 1000));

    if (network.length === 0) {
      return null;
    }

    return (
      <div className="all-chats-container">
        {/* <p>
          <strong>There are {network.length} other players:</strong>
        </p> */}
        {/* {otherPlayers.map(p => this.renderSocialInteraction(p))} */}
        {/* <Chat player={player} scope={round} /> */}

        {network.map(otherNodeId => {
          var pairOfPlayers = [player.get("nodeId"), parseInt(otherNodeId)];
          pairOfPlayers.sort((p1,p2) => p1 - p2);
          const otherPlayerId = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId)).id
          const chatKey = `${pairOfPlayers[0]}-${pairOfPlayers[1]}`;
          return (
            <div>
              {/* <h2>{otherPlayerId}</h2> */}
              <ChatContainer
                docked={true}
                key={otherNodeId}
                player={player}
                otherPlayer={otherPlayerId}
                scope={game}  
                timeStamp={timeStamp}
                customClassName={"ray-chat-container"}
                message={Message}
                footer={Footer}
                onIncomingMessage={this.logIncomingMessage}           
                customKey={chatKey}
                // isActive={activeChats.includes(chatKey)}
                isActive={true}
                onCloseChat={onCloseChat}
              />
           {/* <ChatContainer
            //     key={otherNodeId}
            //     player={player}
            //     scope={round}  
            //     timeStamp={timeStamp}
            //     onIncomingMessage={this.logIncomingMessage}           
            //     customKey={`${pairOfPlayers[0]}-${pairOfPlayers[1]}`}
            //   /> */}
             </div>
            )
          }
        )}




      </div>
    );
  }
}
