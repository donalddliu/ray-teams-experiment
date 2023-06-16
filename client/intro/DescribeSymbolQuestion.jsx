import React from "react";
import '../../public/css/intro.css';
import { Centered } from "meteor/empirica:core";


export default class DescribeSymbolQuestion extends React.Component {
    state = {response: ""};

    handleChange = event => {
        const el = event.currentTarget;
        this.setState({ [el.name]: el.value });
    };

    
    handleSubmit = event => {
        const { onNext, player, stage } = this.props;

        event.preventDefault();
        // TODO: log player response to survey question
        player.set(`symbolDescription`, this.state.response);

        onNext();
    };
    

    render() {
        const { response } = this.state;
    
        return (
          <Centered>
            <div className="intro-heading questionnaire-heading"> Questionnaire </div>
                  <div className="questionnaire-content-container">
                      <div className="questionnaire-body">
                            <h2> Please describe the following symbol below as if you were trying to explain it to another player. Try to be more descriptive than not.
                                <br></br>
                                Note: If there are too many participants filling out the survey at once, there may be some server delays. If you click submit and you do not immediately proceed to the next page, please be patient as it will eventually submit.
                            </h2>
                            <br></br>
                            <div className="symbol-container" style = {{width: "100%", backgroundColor:"#051A46", borderRadius: "0%", display: "flex", justifyContent: "center"}}>
                                <img src={`images/symbols/tangrams/t7.png`} />
                            </div>
                            <br></br>
                            <form className="questionnaire-btn-container" style={{flexDirection: "column", width: "100%"}} onSubmit={this.handleSubmit}>
                                <textarea
                                    className="survey-textarea"
                                    dir="auto"
                                    id="response"
                                    name="response"
                                    value={response}
                                    onChange={this.handleChange}
                                    required
                                />
                                <button 
                                    className={response === "" ? "arrow-button button-submit-disabled" : "arrow-button button-submit"} 
                                    disabled={response === ""}
                                    style={{marginLeft: "auto"}}
                                    type="submit"> Submit 
                                </button> 
                            </form>
                      </div>
      
                  </div>
          </Centered>
        );
      }
    }
    