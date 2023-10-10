import React from "react";


import { Centered } from "meteor/empirica:core";

export default class NetworkSurveySelfContacts extends React.Component {
  state = {
    name1 : "", 
    name2 : "",
    name3 : "",
    name4 : "",
    name5 : "",
};

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    const { onNext, player } = this.props;
    event.preventDefault();

    const networkSurveyResponse = this.state;
    player.set("networkResponseSelfContacts", networkSurveyResponse);
    player.set("networkResponse1", networkSurveyResponse);
    
    onNext();
  };

  render() {
    const { name1, name2, name3, name4, name5 } = this.state;
    
    const filledOut = name1 && name2 && name3 && name4 && name5;
    return (
          <div className="network-survey-container">
                <div className="network-survey-header">
                    <p>
                        THIS EXPERIMENT IS ABOUT COMMUNICATION NETWORKS. WE BEGIN WITH A QUICK SENSE OF YOUR CURRENT NETWORK. <br/>
                        HERE IS A GENERIC QUESTION OFTEN USED IN SURVEY RESEARCH:
                    </p>
                </div>
                <img src={`images/hr-color.png`} />
                <div className="network-survey-body">
                    <p>From time to time, most people discuss important matters with other people, people they trust. The range of important matters varies from person to person across work, leisure, family, politics, whatever. The range of relations varies across work, family, friends, and advisors. </p>
                    <p>If you look back over the last six months, who are the five people with whom you most discussed matters important to you? Use any symbol that identifies the person for you -- first name, initials, or any name that will let you identify the person. </p>
                    <p>To ensure confidentiality the names typed here will only be recorded in your local browser, and will NOT be sent to the server. It will be erased from your browser when you close or reload the tab. </p>
                
                    <form className="network-form" onSubmit={this.handleSubmit}>
                        <p>
                            <label className="input-label" htmlFor="name1"> Name: </label>
                            <input type="text" id="name1" name="name1" onChange={this.handleChange} required/>
                        </p>
                        <p>
                            <label className="input-label" htmlFor="name2"> Name: </label>
                            <input type="text" id="name2" name="name2" onChange={this.handleChange} required/>
                        </p>
                        <p>
                            <label className="input-label" htmlFor="name3"> Name: </label>
                            <input type="text" id="name3" name="name3" onChange={this.handleChange} required/>
                        </p>
                        <p>
                            <label className="input-label" htmlFor="name4"> Name: </label>
                            <input type="text" id="name4" name="name4" onChange={this.handleChange} required/>
                        </p>
                        <p>
                            <label className="input-label" htmlFor="name5"> Name: </label>
                            <input type="text" id="name5" name="name5" onChange={this.handleChange} required/>
                        </p>
                        <div className="network-button-container">
                            <button 
                                className={!filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}
                                disabled={!filledOut} 
                                type="submit"> Next Page
                            </button> 
                        </div>
                    </form>
                </div>
          </div>
    );
  }
}
