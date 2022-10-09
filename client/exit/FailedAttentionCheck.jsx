import React, { Component } from 'react'
import { Meteor } from "meteor/meteor";
import { Centered } from "meteor/empirica:core";

export default class FailedAttentionCheck extends Component {

    render() {
        return (
            <Centered>
                <div className="failed-attention-container">
                    <h2 className="failed-attention-text">
                        YOU FAILED THE ATTENTION CHECK, AND HAVE NOT BEEN SELECTED TO PLAY. PLEASE DO NOT TRY TO COMPLETE THE TASK AGAIN. THANK YOU FOR YOUR TIME. HERE IS YOUR COMPLETION CODE: C150JEXN
                        {/* YOU FAILED THE ATTENTION CHECK, AND HAVE NOT BEEN SELECTED TO PLAY. PLEASE DO NOT TRY TO COMPLETE THE TASK AGAIN AS YOU WILL NOT GET PAID. THANK YOU FOR YOUR TIME. */}
                    </h2>
                </div>
            </Centered>
        );
    }
}