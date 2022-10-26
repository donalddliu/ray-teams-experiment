import React from "react";
import '../../../public/css/intro.css'

import { Centered } from "meteor/empirica:core";

export default class TutorialPageFour extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev, game } = this.props;

    return (
      <div className="tutorial-container">
        <div className="title-static-image">
          <img src={`images/title-tut3.png`} />
        </div>
        <Centered>
          <div className="two-col">
            <div className="tutorial-static-image">
              <img src={`images/tut3-slide4.png`} width="100%" />
            </div>
            <div className="tutorial-info">
              <div className="intro-heading"> RECONSIDER</div>
              <img src={`images/hr-color.png`} width="180px" height="2px"/>
              <div className="tutorial-body">
                You guess the symbol by selecting it and then selecting the submit answer button. While you are waiting for your team members to submit an answer, you will have an opportunity to reconsider your choice. The reconsider button does not indicate you have made an incorrect choice.
              </div>
            </div>
          </div>
        </Centered>
        {hasPrev && <button className="arrow-button tutorial-prev-btn" type="button" onClick={onPrev} disabled={!hasPrev}>
          Previous
        </button>}
        
        {hasNext &&
        <button className="arrow-button tutorial-next-btn" type="button" onClick={onNext} disabled={!hasNext}>
          Attention Check
        </button>
        }
      </div>
    );
  }
}
