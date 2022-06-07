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
  constructor(props) {
    super(props);
    this.state = {
      activeChats: [],
    }
  }

  componentDidMount() {
    const {player} = this.props;
    // Set the player's first activity at the start of the round
    const activeChats = player.get("activeChats");
    this.setState({activeChats: activeChats});
  }

  onOpenChat = (customKey) => {
    const {player} = this.props;
    // var pairOfPlayers = [player.get("nodeId"), parseInt(otherPlayerNodeId)];
    // pairOfPlayers.sort((p1,p2) => p1 - p2);
    // var customKey = `${pairOfPlayers[0]}-${pairOfPlayers[1]}`;
    // console.log(this.state);
    // console.log(this.state.activeChats);
    if (!this.state.activeChats.includes(customKey)) {
      this.state.activeChats.push(customKey);
      player.set("activeChats", this.state.activeChats);
    }
    console.log("Open Chat");
  }

  onCloseChat = (customKey) => {
    const {player} = this.props;
    const newActiveChats = this.state.activeChats.filter((chat) => chat !== customKey);
    this.setState({activeChats : newActiveChats});
    player.set("activeChats", newActiveChats);
    console.log("Close chat");
    console.log(this.state);
  }


  audio = new Audio(`sounds/notification-sound-7062.mp3`);


  logIncomingMessage = (msgs, customKey) => {
    const {game, round, stage, player} = this.props;

    const messages = round.get(`${customKey}`)
    const mostRecentMsg = messages[messages.length -1];
    console.log(mostRecentMsg);
    const sender = mostRecentMsg.player._id;

    // TODO: Check if this only appends if player chat is open
    // onIncomingMessage logs the message for both sender and receiver
    // Only log one copy of the message
    if (player._id === sender) {

      console.log(customKey);
      const pairOfPlayers = customKey.split("-");
      console.log(customKey);
      console.log(pairOfPlayers);
      console.log(`My nodeId = ${player.get("nodeId")}`);
      const receiverId = pairOfPlayers.filter((id) => parseInt(id) !== player.get("nodeId")); 
      const receiver = game.players.find(p => p.get("nodeId") === parseInt(receiverId));
      console.log(receiver);
      const receiverChats = receiver.get("activeChats");
      console.log(`Receiver Chats: ${receiverChats}`);
      console.log(`custom Key : ${customKey}`);
      if (!receiverChats.includes(customKey)) {
        const newReceiverChats = [...receiverChats, customKey];
        // const newReceiverChats = receiverChats.push(customKey);
        console.log(newReceiverChats);
        receiver.set("activeChats", newReceiverChats);
        receiver.set("getNotified", true);
      }
      
      console.log(receiver.id);
      console.log(receiver.get("activeChats"));
    }

    if (player._id !== sender) {
      stage.append("log", {
        verb: "messageLog",
        subjectId: player.id,
        object: mostRecentMsg,
        at: moment(TimeSync.serverTime(null, 1000)),
      })
      console.log("Message was sent");
      const activeChats = player.get("activeChats");

      if (!activeChats.includes(customKey)) {
        console.log("Chat closed but message delivered");
      }

      this.audio.play();

    }
  }

  render() {
    const { game, round, player, activeChats } = this.props;

    const network = player.get("neighbors");
    // reactive time value only updates at 1000 ms
    const timeStamp = new Date(TimeSync.serverTime(null, 1000));


    const colors = ["Green", "Red", "Yellow", "Blue", "Purlpe", "White", "Black"]

    if (player.get("getNotified")) {
      this.audio.play();
      player.set("getNotified", false);
    }

    if (network.length === 0) {
      return null;
    }

    return (
      <div className="all-chats-container">
        {/* <p>
          <strong>There are {network.length} other players:</strong>
        </p> */}
        {/* <Chat player={player} scope={round} /> */}

        {network.map(otherNodeId => {
          var pairOfPlayers = [player.get("nodeId"), parseInt(otherNodeId)];
          pairOfPlayers.sort((p1,p2) => p1 - p2);
          const otherPlayer = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId));
          const otherPlayerId = otherPlayer.get("anonymousName");
          const playerIsOnline = otherPlayer.online === true && !otherPlayer.get("inactive");
          const chatKey = `${pairOfPlayers[0]}-${pairOfPlayers[1]}`;
          const activeChats = player.get("activeChats");

          return (
            // <div style={{height: "80%"}}>
              <ChatContainer
                docked={true}
                key={otherNodeId}
                player={player}
                otherPlayer={otherPlayerId}
                scope={round}  
                timeStamp={timeStamp}
                customClassName={"ray-chat-container"}
                message={Message}
                footer={Footer}
                onIncomingMessage={this.logIncomingMessage}           
                customKey={chatKey}
                // isActive={activeChats.includes(chatKey)}
                isOpen={activeChats.includes(chatKey)}
                playerIsOnline={playerIsOnline}
                onOpenChat = {(customKey) => this.onOpenChat(customKey)} 
                onCloseChat={(customKey) => this.onCloseChat(customKey)} 
              />
              // </div>
            )
          }
        )}




      </div>
    );
  }
}
