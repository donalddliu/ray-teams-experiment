import React from "react";

import { Centered } from "meteor/empirica:core";

export default class Thanks extends React.Component {
  static stepName = "Thanks";
  render() {
    return (
      <div className="finished">
        <div>
          <h4>Finished!</h4>
          <p>Thank you for participating! If you missed the code from the previous page, please submit your MTurk Worker ID to the HIT and we will make sure you get paid accordingly.</p>
        </div>
      </div>
    );
  }
}
