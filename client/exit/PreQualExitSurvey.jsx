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

export default class PreQualExitSurvey extends React.Component {
  static stepName = "ExitSurvey";
  state = { age: "", gender: "", feedback: "" };

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    const { player, game } = this.props;
    const { age, gender, feedback, education} = this.state;
    const basePay = game.treatment.basePay;
    const conversionRate = game.treatment.conversionRate;

    const filledOut = Object.values(this.state).every(val => val !== '');

    return (
      <Centered>
        <div className="exit-survey">
          <h1> Exit Survey </h1>
          <p>
            {/* Please submit the following code to receive your bonus:{" "} */}
            Please submit the following code:{" "}

            <strong> CZ586HD9 </strong>
            {/* <strong>{player._id}</strong>. */}
          </p>
          <p>
          {player.exitReason === "minPlayerCountNotMaintained" ? 
            "Unfortunately, there were too few players active in this game and the game had to be cancelled." : ""
          }
          </p>
          <p>
            Thank you for taking time to take this pre-qualification survey ! We will finish screening all the players and send out a date and time to those that qualify for our future game.
            {basePay && conversionRate ? 
              ` You will receive a base pay of $${basePay} for taking this pre-qualification.`
              : ` You will receive a base pay of $2 for taking this pre-qualification.`
            }
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

            <div className="form-line thirds">
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
