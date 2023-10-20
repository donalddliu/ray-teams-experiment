import React from "react";

import { Centered } from "meteor/empirica:core";

const Radio = ({ selected, name, value, label, onChange, required }) => (
  <label>
    <input
      type="radio"
      name={name}
      value={value}
      checked={selected === value}
      onChange={onChange}
      required={required ? "required" : ""}
    />
    {label}
  </label>
);

const GenderButtonSet = ({color, genderSelected, handleGenderSelect}) => {
  const genders = ["Male", "Female", "Not Enough Information"];

  return(    
      <div className="gender-input-row">
          <label className="gender-input-label"> {color} </label>
          <div className="gender-input-buttons-container">
          {genders.map((gender, index) => {
              return (
                  <div key={`${color}-${gender}`} className={gender === genderSelected ? "network-relationship-button selected" : "network-relationship-button"} onClick={() => handleGenderSelect(color, gender)} style={{margin:"0px 10px"}}> {gender} </div>
              )
          })
          }
          </div>
      </div>
  )

}

export default class ExitSurvey extends React.Component {
  static stepName = "ExitSurvey";

  constructor(props){
    super(props);
    this.state = { 
      age: "", 
      gender: "", 
      strength: "", 
      fair: "", 
      feedback: "",
    };
    const network = this.props.player.get("neighbors");
    console.log(network);
    network.map(otherNodeId => {
      const otherPlayer = this.props.game.players.find(p => p.get("nodeId") === parseInt(otherNodeId));
      const otherPlayerColor = otherPlayer.get("anonymousName");

      this.state[otherPlayerColor] = "";
    })
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleGenderSelect = (color, genderSelected) => {
    this.setState({ [color]: genderSelected });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    const { player, game } = this.props;
    const { age, gender, strength, fair, feedback, education } = this.state;
    const basePay = game.treatment.basePay;
    const conversionRate = game.treatment.conversionRate;

    const network = player.get("neighbors");

    // Checks if every key in this.state has a non-empty value
    const filledOut = Object.values(this.state).every(val => val !== '');

    return (
      <Centered>
        <div className="exit-survey">
          <h1> Exit Survey </h1>
          <p>
            Please submit the following code to receive your bonus:{" "}
            <strong> C1FLL9CG </strong>.

            {/* <strong>{player._id}</strong>. */}
          </p>
          <p>
          {player.exitReason === "minPlayerCountNotMaintained" ? 
            "Unfortunately, there were too few players active in this game and the game had to be cancelled. To be fair to other players that complete the entire session, please return your submission and we will compensate you for the time you played today." : ""
          }
          </p>
          <p>
            Your team got a total of <strong>{player.get("score")}</strong> correct.
            {basePay && conversionRate ? 
              ` You will receive an additional performance bonus of ${player.get("score")} x $${conversionRate}.`
              : ` You will receive a base pay of $2 and an additional performance bonus of ${player.get("score")} x 1, for a total of ${2 + parseInt(player.get("score"))*1}.`
            }

            {/* {basePay && conversionRate ? 
              ` You will receive a base pay of $${basePay} and an additional performance bonus of ${player.get("score")} x $${conversionRate}, for a total of $${basePay + parseInt(player.get("score")*conversionRate)}.`
              : ` You will receive a base pay of $2 and an additional performance bonus of ${player.get("score")} x 1, for a total of ${2 + parseInt(player.get("score"))*1}.`
            } */}
          </p>
          <br />
          <p>
            Please answer the following short survey.
          </p>
          <form onSubmit={this.handleSubmit}>
            <div className="form-line">
              <div>
                <label htmlFor="age">Age</label>
                <div>
                  <input
                    id="age"
                    type="number"
                    min="0"
                    max="150"
                    step="1"
                    dir="auto"
                    name="age"
                    value={age}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="gender">Gender</label>
                <div>
                  <input
                    id="gender"
                    type="text"
                    dir="auto"
                    name="gender"
                    value={gender}
                    onChange={this.handleChange}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div>
              <label>Highest Education Qualification</label>
              <div>
                <Radio
                  selected={education}
                  name="education"
                  value="high-school"
                  label="High School"
                  onChange={this.handleChange}
                  required={true}
                />
                <Radio
                  selected={education}
                  name="education"
                  value="bachelor"
                  label="US Bachelor's Degree"
                  onChange={this.handleChange}
                />
                <Radio
                  selected={education}
                  name="education"
                  value="master"
                  label="Master's or higher"
                  onChange={this.handleChange}
                />
                <Radio
                  selected={education}
                  name="education"
                  value="other"
                  label="Other"
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="strength">
                  What gender do you think your teammates were?
              </label>
              {network.map(otherNodeId => {
                const otherPlayer = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId));
                const otherPlayerColor = otherPlayer.get("anonymousName");

                return (
                  <GenderButtonSet key={otherPlayerColor} color={otherPlayerColor} genderSelected={this.state[otherPlayerColor]} handleGenderSelect={this.handleGenderSelect} />
                )
              })}
            </div>



            <div className="form-line thirds">
              <div>
                <label htmlFor="strength">
                  How would you describe your strength in the game?
                </label>
                <div>
                  <textarea
                    dir="auto"
                    id="strength"
                    name="strength"
                    value={strength}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="fair">Do you feel the pay was fair?</label>
                <div>
                  <textarea
                    dir="auto"
                    id="fair"
                    name="fair"
                    value={fair}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="feedback">
                  Feedback, including problems you encountered.
                </label>
                <div>
                  <textarea
                    dir="auto"
                    id="feedback"
                    name="feedback"
                    value={feedback}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="network-button-container">
              <button 
                type="submit" className={!filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}      
                disabled={!filledOut}> Submit
              </button>
            </div>
          </form>
        </div>
      </Centered>
    );
  }
}
