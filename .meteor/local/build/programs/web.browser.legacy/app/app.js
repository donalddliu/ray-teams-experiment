var require = meteorInstall({"client":{"exit":{"final-mid-survey":{"FinalMidSurvey1.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/exit/final-mid-survey/FinalMidSurvey1.jsx                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return FinalMidSurveyOne;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 1);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 2);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 3);

var Radio = function (_ref) {
  var selected = _ref.selected,
      name = _ref.name,
      value = _ref.value,
      label = _ref.label,
      playerIsOnline = _ref.playerIsOnline,
      onChange = _ref.onChange;
  return /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-radio"
  }, /*#__PURE__*/React.createElement("input", {
    className: "quiz-button",
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange
  }), label, " ", playerIsOnline ? "" : " (offline)");
};

var FinalMidSurveyOne = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(FinalMidSurveyOne, _React$Component);

  var _super = _createSuper(FinalMidSurveyOne);

  function FinalMidSurveyOne() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {};

    _this.handleChange = function (event) {
      var _this$setState;

      var player = _this.props.player;
      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));

      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player,
          stage = _this$props.stage;
      event.preventDefault(); // TODO: log player response to survey question

      player.set("final_survey_1", _this.state);
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

      _this.props.onSubmit(_this.state);
    };

    return _this;
  }

  var _proto = FinalMidSurveyOne.prototype;

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          game = _this$props2.game,
          round = _this$props2.round,
          stage = _this$props2.stage,
          player = _this$props2.player;
      var response = this.state.response;
      var network = player.get("neighbors");
      var surveyNumber = 1;
      var completedWidth = 590 / 5 * surveyNumber;
      var uncompletedWidth = 590 - completedWidth;
      var offset = 590 / 5 * 0.5;
      var stageNumPosition = completedWidth - offset;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " To complete the challenge, please fill in the following questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-heading",
        style: {
          marginLeft: stageNumPosition
        }
      }, " ", surveyNumber, " "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color-dark.png",
        width: uncompletedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, " Did your group have a leader? If so, who?"), network.map(function (otherNodeId) {
        var otherPlayer = game.players.find(function (p) {
          return p.get("nodeId") === parseInt(otherNodeId);
        });
        var otherPlayerId = otherPlayer.get("anonymousName"); // const playerIsOnline = otherPlayer.online === true && !otherPlayer.get("inactive");

        var playerIsOnline = !otherPlayer.get("inactive");
        return /*#__PURE__*/React.createElement(Radio, {
          selected: response,
          key: otherPlayerId,
          name: "response",
          value: otherPlayerId,
          label: otherPlayerId,
          playerIsOnline: playerIsOnline,
          onChange: _this2.handleChange
        });
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "myself",
        label: "Myself",
        playerIsOnline: true,
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "team",
        label: "We worked as a team",
        playerIsOnline: true,
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "none",
        label: "Our team did not have a leader",
        playerIsOnline: true,
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: !response ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !response,
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return FinalMidSurveyOne;
}(React.Component);

FinalMidSurveyOne.stepName = "FinalMidSurveyOne";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FinalMidSurvey2.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/exit/final-mid-survey/FinalMidSurvey2.jsx                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return FinalMidSurveyTwo;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Slider;
module.link("meteor/empirica:slider", {
  "default": function (v) {
    Slider = v;
  }
}, 1);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 2);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 3);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 4);

var FinalMidSurveyTwo = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(FinalMidSurveyTwo, _React$Component);

  var _super = _createSuper(FinalMidSurveyTwo);

  function FinalMidSurveyTwo() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {};

    _this.renderLabels = function (val) {
      if (val === 0) {
        // Min value
        return val + " Unhappy";
      } else if (val === 3) {
        return val + " Neutral";
      } else if (val === 6) {
        // Max value
        return val + " Happy";
      }

      return "";
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player,
          stage = _this$props.stage;
      event.preventDefault(); // TODO: log player response to survey question

      player.set("final_survey_2", _this.state);
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

      _this.props.onSubmit(_this.state);
    };

    return _this;
  }

  var _proto = FinalMidSurveyTwo.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var _this2 = this;

      var _this$props2 = this.props,
          game = _this$props2.game,
          round = _this$props2.round,
          stage = _this$props2.stage,
          player = _this$props2.player;
      player.get("neighbors").forEach(function (otherNodeId) {
        var _this2$setState;

        var otherPlayerId = game.players.find(function (p) {
          return p.get("nodeId") === parseInt(otherNodeId);
        }).get("anonymousName");

        _this2.setState((_this2$setState = {}, _this2$setState[otherPlayerId] = 0, _this2$setState));
      });
    }

    return componentDidMount;
  }();

  _proto.render = function () {
    function render() {
      var _this3 = this;

      var _this$props3 = this.props,
          game = _this$props3.game,
          round = _this$props3.round,
          stage = _this$props3.stage,
          player = _this$props3.player;
      var network = player.get("neighbors");
      var surveyNumber = 2;
      var completedWidth = 590 / 5 * surveyNumber;
      var uncompletedWidth = 590 - completedWidth;
      var offset = 590 / 5 * 0.5;
      var stageNumPosition = completedWidth - offset;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " To complete the challenge, please fill in the following questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-heading",
        style: {
          marginLeft: stageNumPosition
        }
      }, " ", surveyNumber, " "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color-dark.png",
        width: uncompletedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, " Please rate how well you have been working with each teammate in the recent trials?"), network.map(function (otherNodeId) {
        var otherPlayer = game.players.find(function (p) {
          return p.get("nodeId") === parseInt(otherNodeId);
        });
        var otherPlayerId = otherPlayer.get("anonymousName"); // const playerIsOnline = otherPlayer.online === true && !otherPlayer.get("inactive");

        var playerIsOnline = !otherPlayer.get("inactive");

        var handleSliderChange = function (num) {
          var _this3$setState;

          // Rounding the number to 2 decimals max
          _this3.setState((_this3$setState = {}, _this3$setState[otherPlayerId] = num, _this3$setState));

          player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
        };

        return /*#__PURE__*/React.createElement("div", {
          className: "player-slider-container"
        }, /*#__PURE__*/React.createElement("div", {
          className: "player-label"
        }, " ", otherPlayerId, " ", playerIsOnline ? "" : " (offline)", " "), /*#__PURE__*/React.createElement(Slider, {
          key: otherNodeId,
          min: 0,
          max: 6,
          stepSize: 1,
          disabled: false,
          showTrackFill: false,
          name: otherPlayerId,
          value: _this3.state[otherPlayerId],
          labelRenderer: _this3.renderLabels,
          onChange: handleSliderChange
        }), /*#__PURE__*/React.createElement("div", {
          className: "slider-value-container",
          style: {
            width: "15%"
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "slider-value"
        }, _this3.state[otherPlayerId], " ")));
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: "arrow-button button-submit",
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return FinalMidSurveyTwo;
}(React.Component);

FinalMidSurveyTwo.stepName = "FinalMidSurveyTwo";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FinalMidSurvey3.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/exit/final-mid-survey/FinalMidSurvey3.jsx                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return FinalMidSurveyThree;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Slider;
module.link("meteor/empirica:slider", {
  "default": function (v) {
    Slider = v;
  }
}, 1);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 2);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 3);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 4);

var FinalMidSurveyThree = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(FinalMidSurveyThree, _React$Component);

  var _super = _createSuper(FinalMidSurveyThree);

  function FinalMidSurveyThree() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      sliderValue: 0
    };

    _this.handleSliderChange = function (num) {
      var _this$props = _this.props,
          stage = _this$props.stage,
          player = _this$props.player; // Rounding the number to 2 decimals max

      _this.setState({
        sliderValue: num
      });

      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    };

    _this.renderLabels = function (val) {
      if (val === 0) {
        // Min value
        return val + " Unhappy";
      } else if (val === 3) {
        return val + " Neutral";
      } else if (val === 6) {
        // Max value
        return val + " Happy";
      }

      return "";
    };

    _this.handleSubmit = function (event) {
      var _this$props2 = _this.props,
          onNext = _this$props2.onNext,
          player = _this$props2.player,
          stage = _this$props2.stage;
      event.preventDefault(); // TODO: log player response to survey question

      player.set("final_survey_3", _this.state);
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

      _this.props.onSubmit(_this.state);
    };

    return _this;
  }

  var _proto = FinalMidSurveyThree.prototype;

  _proto.render = function () {
    function render() {
      var _this$props3 = this.props,
          game = _this$props3.game,
          round = _this$props3.round,
          stage = _this$props3.stage,
          player = _this$props3.player;
      var response = this.state.response;
      var surveyNumber = 3;
      var completedWidth = 590 / 5 * surveyNumber;
      var uncompletedWidth = 590 - completedWidth;
      var offset = 590 / 5 * 0.5;
      var stageNumPosition = completedWidth - offset;
      var sliderValue = this.state.sliderValue;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " To complete the challenge, please fill in the following questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-heading",
        style: {
          marginLeft: stageNumPosition
        }
      }, " ", surveyNumber, " "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color-dark.png",
        width: uncompletedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, " How did you like your job in the team during the recent trials? "), /*#__PURE__*/React.createElement(Slider, {
        min: 0,
        max: 6,
        stepSize: 1,
        disabled: false,
        showTrackFill: false,
        value: sliderValue,
        labelRenderer: this.renderLabels,
        onChange: this.handleSliderChange
      }), /*#__PURE__*/React.createElement("div", {
        className: "slider-value-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "slider-value"
      }, sliderValue, " "))), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: "arrow-button button-submit",
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return FinalMidSurveyThree;
}(React.Component);

FinalMidSurveyThree.stepName = "FinalMidSurveyThree";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FinalMidSurvey4.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/exit/final-mid-survey/FinalMidSurvey4.jsx                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return FinalMidSurveyFour;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Slider;
module.link("meteor/empirica:slider", {
  "default": function (v) {
    Slider = v;
  }
}, 1);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 2);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 3);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 4);

var FinalMidSurveyFour = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(FinalMidSurveyFour, _React$Component);

  var _super = _createSuper(FinalMidSurveyFour);

  function FinalMidSurveyFour() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      sliderValue: 0
    };

    _this.handleSliderChange = function (num) {
      var _this$props = _this.props,
          stage = _this$props.stage,
          player = _this$props.player; // Rounding the number to 2 decimals max

      _this.setState({
        sliderValue: num
      });

      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    };

    _this.renderLabels = function (val) {
      if (val === 0) {
        // Min value
        return val + " Poor";
      } else if (val === 3) {
        return val + " Neutral";
      } else if (val === 6) {
        // Max value
        return val + " Great";
      }

      return "";
    };

    _this.handleSubmit = function (event) {
      var _this$props2 = _this.props,
          onNext = _this$props2.onNext,
          player = _this$props2.player,
          stage = _this$props2.stage;
      event.preventDefault(); // TODO: log player response to survey question

      player.set("final_survey_4", _this.state);
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

      _this.props.onSubmit(_this.state);
    };

    return _this;
  }

  var _proto = FinalMidSurveyFour.prototype;

  _proto.render = function () {
    function render() {
      var _this$props3 = this.props,
          game = _this$props3.game,
          round = _this$props3.round,
          stage = _this$props3.stage,
          player = _this$props3.player;
      var response = this.state.response;
      var surveyNumber = 4;
      var completedWidth = 590 / 5 * surveyNumber;
      var uncompletedWidth = 590 - completedWidth;
      var offset = 590 / 5 * 0.5;
      var stageNumPosition = completedWidth - offset;
      var sliderValue = this.state.sliderValue;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " To complete the challenge, please fill in the following questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-heading",
        style: {
          marginLeft: stageNumPosition
        }
      }, " ", surveyNumber, " "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color-dark.png",
        width: uncompletedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, " On the scale below, rate how your team has been working in the recent trials "), /*#__PURE__*/React.createElement(Slider, {
        min: 0,
        max: 6,
        stepSize: 1,
        disabled: false,
        showTrackFill: false,
        value: sliderValue,
        labelRenderer: this.renderLabels,
        onChange: this.handleSliderChange
      }), /*#__PURE__*/React.createElement("div", {
        className: "slider-value-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "slider-value"
      }, sliderValue, " "))), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: "arrow-button button-submit",
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return FinalMidSurveyFour;
}(React.Component);

FinalMidSurveyFour.stepName = "FinalMidSurveyFour";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FinalMidSurvey5.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/exit/final-mid-survey/FinalMidSurvey5.jsx                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return FinalMidSurveyFive;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Slider;
module.link("meteor/empirica:slider", {
  "default": function (v) {
    Slider = v;
  }
}, 1);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 2);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 3);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 4);

var FinalMidSurveyFive = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(FinalMidSurveyFive, _React$Component);

  var _super = _createSuper(FinalMidSurveyFive);

  function FinalMidSurveyFive() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      response: ""
    };

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSliderChange = function (num) {
      var _this$props = _this.props,
          stage = _this$props.stage,
          player = _this$props.player; // Rounding the number to 2 decimals max

      _this.setState({
        sliderValue: num
      });
    };

    _this.renderLabels = function (val) {
      if (val === 0) {
        // Min value
        return val + " Unhappy";
      } else if (val === 3) {
        return val + " Neutral";
      } else if (val === 6) {
        // Max value
        return val + " Happy";
      }

      return "";
    };

    _this.handleSubmit = function (event) {
      var _this$props2 = _this.props,
          onNext = _this$props2.onNext,
          player = _this$props2.player,
          stage = _this$props2.stage;
      event.preventDefault(); // TODO: log player response to survey question

      player.set("final_survey_5", _this.state);
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

      _this.props.onSubmit(_this.state);
    };

    return _this;
  }

  var _proto = FinalMidSurveyFive.prototype;

  _proto.render = function () {
    function render() {
      var _this$props3 = this.props,
          game = _this$props3.game,
          round = _this$props3.round,
          stage = _this$props3.stage,
          player = _this$props3.player;
      var response = this.state.response;
      var surveyNumber = 5;
      var completedWidth = 590 / 5 * surveyNumber;
      var uncompletedWidth = 590 - completedWidth;
      var offset = 590 / 5 * 0.5;
      var stageNumPosition = completedWidth - offset;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " To complete the challenge, please fill in the following questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-heading",
        style: {
          marginLeft: stageNumPosition
        }
      }, " ", surveyNumber, " "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color-dark.png",
        width: uncompletedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, " Do you think your group could improve its efficiency? If so, how? "), /*#__PURE__*/React.createElement("textarea", {
        className: "survey-textarea",
        dir: "auto",
        id: "response",
        name: "response",
        value: response,
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: !response ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !response,
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return FinalMidSurveyFive;
}(React.Component);

FinalMidSurveyFive.stepName = "FinalMidSurveyFive";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"ExitSurvey.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/exit/ExitSurvey.jsx                                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return ExitSurvey;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var Radio = function (_ref) {
  var selected = _ref.selected,
      name = _ref.name,
      value = _ref.value,
      label = _ref.label,
      onChange = _ref.onChange,
      required = _ref.required;
  return /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange,
    required: required ? "required" : ""
  }), label);
};

var GenderButtonSet = function (_ref2) {
  var color = _ref2.color,
      genderSelected = _ref2.genderSelected,
      handleGenderSelect = _ref2.handleGenderSelect;
  var genders = ["Male", "Female", "Not Enough Information"];
  return /*#__PURE__*/React.createElement("div", {
    className: "gender-input-row"
  }, /*#__PURE__*/React.createElement("label", {
    className: "gender-input-label"
  }, " ", color, " "), /*#__PURE__*/React.createElement("div", {
    className: "gender-input-buttons-container"
  }, genders.map(function (gender, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: color + "-" + gender,
      className: gender === genderSelected ? "network-relationship-button selected" : "network-relationship-button",
      onClick: function () {
        return handleGenderSelect(color, gender);
      },
      style: {
        margin: "0px 10px"
      }
    }, " ", gender, " ");
  })));
};

var ExitSurvey = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ExitSurvey, _React$Component);

  var _super = _createSuper(ExitSurvey);

  function ExitSurvey(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleGenderSelect = function (color, genderSelected) {
      var _this$setState2;

      _this.setState((_this$setState2 = {}, _this$setState2[color] = genderSelected, _this$setState2));
    };

    _this.handleSubmit = function (event) {
      event.preventDefault();

      _this.props.onSubmit(_this.state);
    };

    _this.state = {
      age: "",
      gender: "",
      strength: "",
      fair: "",
      feedback: ""
    };

    var network = _this.props.player.get("neighbors");

    console.log(network);
    network.map(function (otherNodeId) {
      var otherPlayer = _this.props.game.players.find(function (p) {
        return p.get("nodeId") === parseInt(otherNodeId);
      });

      var otherPlayerColor = otherPlayer.get("anonymousName");
      _this.state[otherPlayerColor] = "";
    });
    return _this;
  }

  var _proto = ExitSurvey.prototype;

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var _this$props = this.props,
          player = _this$props.player,
          game = _this$props.game;
      var _this$state = this.state,
          age = _this$state.age,
          gender = _this$state.gender,
          strength = _this$state.strength,
          fair = _this$state.fair,
          feedback = _this$state.feedback,
          education = _this$state.education;
      var basePay = game.treatment.basePay;
      var conversionRate = game.treatment.conversionRate;
      var network = player.get("neighbors"); // Checks if every key in this.state has a non-empty value

      var filledOut = Object.values(this.state).every(function (val) {
        return val !== '';
      });
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "exit-survey"
      }, /*#__PURE__*/React.createElement("h1", null, " Exit Survey "), /*#__PURE__*/React.createElement("p", null, "Please submit the following code to receive your bonus:", " ", /*#__PURE__*/React.createElement("strong", null, " C1FLL9CG "), "."), /*#__PURE__*/React.createElement("p", null, player.exitReason === "minPlayerCountNotMaintained" ? "Unfortunately, there were too few players active in this game and the game had to be cancelled. To be fair to other players that complete the entire session, please return your submission and we will compensate you for the time you played today." : ""), /*#__PURE__*/React.createElement("p", null, "Your team got a total of ", /*#__PURE__*/React.createElement("strong", null, player.get("score")), " correct.", basePay && conversionRate ? " You will receive an additional performance bonus of " + player.get("score") + " x $" + conversionRate + "." : " You will receive a base pay of $2 and an additional performance bonus of " + player.get("score") + " x 1, for a total of " + (2 + parseInt(player.get("score")) * 1) + "."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Please answer the following short survey."), /*#__PURE__*/React.createElement("form", {
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("div", {
        className: "form-line"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "age"
      }, "Age"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
        id: "age",
        type: "number",
        min: "0",
        max: "150",
        step: "1",
        dir: "auto",
        name: "age",
        value: age,
        onChange: this.handleChange,
        required: true
      }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "gender"
      }, "Gender"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
        id: "gender",
        type: "text",
        dir: "auto",
        name: "gender",
        value: gender,
        onChange: this.handleChange,
        required: true,
        autoComplete: "off"
      })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Highest Education Qualification"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Radio, {
        selected: education,
        name: "education",
        value: "high-school",
        label: "High School",
        onChange: this.handleChange,
        required: true
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: education,
        name: "education",
        value: "bachelor",
        label: "US Bachelor's Degree",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: education,
        name: "education",
        value: "master",
        label: "Master's or higher",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: education,
        name: "education",
        value: "other",
        label: "Other",
        onChange: this.handleChange
      }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "strength"
      }, "What gender do you think your teammates were?"), network.map(function (otherNodeId) {
        var otherPlayer = game.players.find(function (p) {
          return p.get("nodeId") === parseInt(otherNodeId);
        });
        var otherPlayerColor = otherPlayer.get("anonymousName");
        return /*#__PURE__*/React.createElement(GenderButtonSet, {
          key: otherPlayerColor,
          color: otherPlayerColor,
          genderSelected: _this2.state[otherPlayerColor],
          handleGenderSelect: _this2.handleGenderSelect
        });
      })), /*#__PURE__*/React.createElement("div", {
        className: "form-line thirds"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "strength"
      }, "How would you describe your strength in the game?"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
        dir: "auto",
        id: "strength",
        name: "strength",
        value: strength,
        onChange: this.handleChange,
        required: true
      }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "fair"
      }, "Do you feel the pay was fair?"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
        dir: "auto",
        id: "fair",
        name: "fair",
        value: fair,
        onChange: this.handleChange,
        required: true
      }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "feedback"
      }, "Feedback, including problems you encountered."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
        dir: "auto",
        id: "feedback",
        name: "feedback",
        value: feedback,
        onChange: this.handleChange,
        required: true
      })))), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        type: "submit",
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut
      }, " Submit")))));
    }

    return render;
  }();

  return ExitSurvey;
}(React.Component);

ExitSurvey.stepName = "ExitSurvey";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FailedAttentionCheck.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/exit/FailedAttentionCheck.jsx                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return FailedAttentionCheck;
  }
});
var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 1);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 2);

var FailedAttentionCheck = /*#__PURE__*/function (_Component) {
  _inheritsLoose(FailedAttentionCheck, _Component);

  var _super = _createSuper(FailedAttentionCheck);

  function FailedAttentionCheck() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = FailedAttentionCheck.prototype;

  _proto.render = function () {
    function render() {
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "failed-attention-container"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "failed-attention-text"
      }, "YOU FAILED THE ATTENTION CHECK, AND HAVE NOT BEEN SELECTED TO PLAY. PLEASE DO NOT TRY TO COMPLETE THE TASK AGAIN. THANK YOU FOR YOUR TIME. PLEASE RETURN YOUR SUBMISSION BY CLOSING THE SURVEY AND CLICKING 'STOP WITHOUT COMLPETING' ON PROLIFIC.\"")));
    }

    return render;
  }();

  return FailedAttentionCheck;
}(Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PreQualExitSurvey.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/exit/PreQualExitSurvey.jsx                                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return PreQualExitSurvey;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var Radio = function (_ref) {
  var selected = _ref.selected,
      name = _ref.name,
      value = _ref.value,
      label = _ref.label,
      onChange = _ref.onChange,
      required = _ref.required;
  return /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange,
    required: required ? "required" : ""
  }), label);
};

var PreQualExitSurvey = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(PreQualExitSurvey, _React$Component);

  var _super = _createSuper(PreQualExitSurvey);

  function PreQualExitSurvey() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      age: "",
      gender: "",
      feedback: ""
    };

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      event.preventDefault();

      _this.props.onSubmit(_this.state);
    };

    return _this;
  }

  var _proto = PreQualExitSurvey.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          player = _this$props.player,
          game = _this$props.game;
      var _this$state = this.state,
          age = _this$state.age,
          gender = _this$state.gender,
          feedback = _this$state.feedback,
          education = _this$state.education;
      var basePay = game.treatment.basePay;
      var conversionRate = game.treatment.conversionRate;
      var filledOut = Object.values(this.state).every(function (val) {
        return val !== '';
      });
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "exit-survey"
      }, /*#__PURE__*/React.createElement("h1", null, " Exit Survey "), /*#__PURE__*/React.createElement("p", null, "Please submit the following code:", " ", /*#__PURE__*/React.createElement("strong", null, " CZ586HD9 ")), /*#__PURE__*/React.createElement("p", null, player.exitReason === "minPlayerCountNotMaintained" ? "Unfortunately, there were too few players active in this game and the game had to be cancelled." : ""), /*#__PURE__*/React.createElement("p", null, "Thank you for taking time to take this pre-qualification survey ! We will finish screening all the players and send out a date and time to those that qualify for our future game.", basePay && conversionRate ? " You will receive a base pay of $" + basePay + " for taking this pre-qualification." : " You will receive a base pay of $2 for taking this pre-qualification."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Please answer the following short survey."), /*#__PURE__*/React.createElement("form", {
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("div", {
        className: "form-line"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "age"
      }, "Age"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
        id: "age",
        type: "number",
        min: "0",
        max: "150",
        step: "1",
        dir: "auto",
        name: "age",
        value: age,
        onChange: this.handleChange,
        required: true
      }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "gender"
      }, "Gender"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
        id: "gender",
        type: "text",
        dir: "auto",
        name: "gender",
        value: gender,
        onChange: this.handleChange,
        required: true,
        autoComplete: "off"
      })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Highest Education Qualification"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Radio, {
        selected: education,
        name: "education",
        value: "high-school",
        label: "High School",
        onChange: this.handleChange,
        required: true
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: education,
        name: "education",
        value: "bachelor",
        label: "US Bachelor's Degree",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: education,
        name: "education",
        value: "master",
        label: "Master's or higher",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: education,
        name: "education",
        value: "other",
        label: "Other",
        onChange: this.handleChange
      }))), /*#__PURE__*/React.createElement("div", {
        className: "form-line thirds"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "feedback"
      }, "Feedback, including problems you encountered."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
        dir: "auto",
        id: "feedback",
        name: "feedback",
        value: feedback,
        onChange: this.handleChange,
        required: true
      })))), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        type: "submit",
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut
      }, " Submit")))));
    }

    return render;
  }();

  return PreQualExitSurvey;
}(React.Component);

PreQualExitSurvey.stepName = "ExitSurvey";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Sorry.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/exit/Sorry.jsx                                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return Sorry;
  }
});
var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 1);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 2);
var FailedAttentionCheck;
module.link("./FailedAttentionCheck", {
  "default": function (v) {
    FailedAttentionCheck = v;
  }
}, 3);

var Sorry = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Sorry, _Component);

  var _super = _createSuper(Sorry);

  function Sorry() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = Sorry.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          player = _this$props.player,
          game = _this$props.game;
      var msg;

      switch (player.exitStatus) {
        case "gameFull":
          msg = "All games you are eligible for have filled up too fast... Sorry, there will be no more games in the near future.";
          break;

        case "gameLobbyTimedOut":
          msg = "There were NOT enough players for the game to start... Thank you for participating in this game."; // msg = "There were NOT enough players for the game to start... Thank you for participating in this game, you will still get paid the base amount for passing the attention check. Please submit your MTurk Worker Id to the HIT and we will make sure you get paid accordingly.";

          break;

        case "playerEndedLobbyWait":
          msg = "You decided to stop waiting, we are sorry it was too long a wait.";
          break;

        default:
          msg = "Unfortunately, the Game was cancelled... Either there were not enough players or there was a technical issue with the game. If it was the latter, please contact us and we can restart the game."; // msg = "Unfortunately, the Game was cancelled... Thank you for participating in this game, please submit your MTurk Worker ID to the HIT and we will make sure you get paid accordingly.";

          break;
      }

      if (player.exitReason === "failedQuestion") {
        return /*#__PURE__*/React.createElement(FailedAttentionCheck, null);
      }

      if (player.exitReason === "returnSubmission") {
        msg = "You did not consent to participating for the whole duration of our future games. Please return your submission by closing the survey and clicking 'Stop Without Completing' on Prolific.";
      }

      if (player.exitReason === "inactive") {
        msg = "You were inactive for too long, and we had to end the game. Thank you for participating in this game, you will still get paid including any bonuses for the rounds you successfully passed. Please submit the following completion code: C1FLL9CG"; // msg = "You were inactive for too long, and we had to end the game. Thank you for participating in this game, you will still get paid the base amount including any bonuses for the rounds you successfully passed. Please submit your MTurk Worker Id to the HIT and we will make sure you get paid accordingly.";
      }

      if (player.exitReason === "someoneInactive") {
        msg = "A player was inactive for too long, and we had to end the game. Thank you for participating in this game, you will still get paid including any bonuses for the rounds you successfully passed. Please submit the following completion code: C1FLL9CG"; // msg = "A player was inactive for too long, and we had to end the game. Thank you for participating in this game, you will get paid the base amount including any bonuses for the rounds you successfully passed. Please submit your MTurk Worker ID to the HIT and we will make sure you get paid accordingly. ";
      }

      if (player.exitReason === "failedEnglishScreen") {
        // msg = "You did not pass English Screening. For this game, we require strong communication skills and English fluency. Thank you for taking your time and participating in this game."
        msg = "You did not pass English Screening. For this game, we require strong communication skills and English fluency. Thank you for taking your time and participating in this survey. Please return your submission by closing the survey and clicking 'Stop Without Completing' on Prolific.";
      }

      if (player.exitReason === "minPlayerCountNotMaintained") {
        msg = "Unfortunately, there were too few players active in this game and the game had to be cancelled. Thank you for participating in this game, please submit the following completion code: C1FLL9CG"; // msg = `Unfortunately, there were too few players active in this game and the game had to be cancelled. Thank you for participating in this game, please submit the follow code ${player._id} to the HIT and we will make sure you get paid accordingly. `
      } // Only for dev


      if (!game && Meteor.isDevelopment) {
        msg = "Unfortunately the Game was cancelled because of failed to init Game (only visible in development, check the logs).";
      }

      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Sorry!"), /*#__PURE__*/React.createElement("p", null, "Sorry, you were not able to play today! ", msg), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Please contact the researcher to see if there are more games available."))));
    }

    return render;
  }();

  return Sorry;
}(Component);

Sorry.stepName = "Sorry";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Thanks.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/exit/Thanks.jsx                                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return Thanks;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 1);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 2);

var Thanks = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Thanks, _React$Component);

  var _super = _createSuper(Thanks);

  function Thanks() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Thanks.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          player = _this$props.player,
          game = _this$props.game;
      var basePay = game.treatment.basePay;
      var conversionRate = game.treatment.conversionRate;
      return /*#__PURE__*/React.createElement("div", {
        className: "finished"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Finished!"), player.exitReason === "preQualSuccess" ?
      /*#__PURE__*/
      // TODO: mturk
      // <p>Thank you for participating! Please submit the following code to receive your bonus 
      // { basePay && conversionRate ? ` of $${basePay} : ` : " "} 
      // <strong>{player._id}</strong>
      // </p> 
      // TODO: Prolific
      React.createElement("p", null, "Thank you for participating! Please submit the following code: CZ586HD9") : /*#__PURE__*/React.createElement("p", null, "Thank you for participating! Please submit the following code: C1FLL9CG"))));
    }

    return render;
  }();

  return Thanks;
}(React.Component);

Thanks.stepName = "Thanks";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"game":{"mid-survey":{"MidSurvey1.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/mid-survey/MidSurvey1.jsx                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return MidSurveyOne;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 1);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 2);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 3);

var Radio = function (_ref) {
  var selected = _ref.selected,
      name = _ref.name,
      value = _ref.value,
      label = _ref.label,
      playerIsOnline = _ref.playerIsOnline,
      onChange = _ref.onChange;
  return /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-radio"
  }, /*#__PURE__*/React.createElement("input", {
    className: "quiz-button",
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange
  }), label, " ", playerIsOnline ? "" : " (offline)");
};

var MidSurveyOne = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(MidSurveyOne, _React$Component);

  var _super = _createSuper(MidSurveyOne);

  function MidSurveyOne() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {};

    _this.handleChange = function (event) {
      var _this$setState;

      var player = _this.props.player;
      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));

      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player,
          stage = _this$props.stage;
      var surveyNumber = player.get("surveyNumber");
      event.preventDefault(); // TODO: log player response to survey question

      player.round.set("survey_" + surveyNumber, _this.state);
      stage.append("log", {
        verb: "survey_" + surveyNumber,
        subjectId: player.id,
        object: _this.state,
        at: moment(TimeSync.serverTime(null, 1000))
      });
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
      onNext();
    };

    return _this;
  }

  var _proto = MidSurveyOne.prototype;

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          game = _this$props2.game,
          round = _this$props2.round,
          stage = _this$props2.stage,
          player = _this$props2.player;
      var response = this.state.response;
      var network = player.get("neighbors");
      var surveyNumber = player.get("surveyNumber");
      var completedWidth = 590 / 5 * surveyNumber;
      var uncompletedWidth = 590 - completedWidth;
      var offset = 590 / 5 * 0.5;
      var stageNumPosition = completedWidth - offset;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " To complete the challenge, please fill in the following questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-heading",
        style: {
          marginLeft: stageNumPosition
        }
      }, " ", surveyNumber, " "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color-dark.png",
        width: uncompletedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, " Did your group have a leader? If so, who?"), network.map(function (otherNodeId) {
        var otherPlayer = game.players.find(function (p) {
          return p.get("nodeId") === parseInt(otherNodeId);
        });
        var otherPlayerId = otherPlayer.get("anonymousName"); // const playerIsOnline = otherPlayer.online === true && !otherPlayer.get("inactive");

        var playerIsOnline = !otherPlayer.get("inactive");
        return /*#__PURE__*/React.createElement(Radio, {
          selected: response,
          key: otherPlayerId,
          name: "response",
          value: otherPlayerId,
          label: otherPlayerId,
          playerIsOnline: playerIsOnline,
          onChange: _this2.handleChange
        });
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "myself",
        label: "Myself",
        playerIsOnline: true,
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "team",
        label: "We worked as a team",
        playerIsOnline: true,
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "none",
        label: "Our team did not have a leader",
        playerIsOnline: true,
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: !response ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !response,
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return MidSurveyOne;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MidSurvey2.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/mid-survey/MidSurvey2.jsx                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return MidSurveyTwo;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Slider;
module.link("meteor/empirica:slider", {
  "default": function (v) {
    Slider = v;
  }
}, 1);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 2);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 3);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 4);

var MidSurveyTwo = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(MidSurveyTwo, _React$Component);

  var _super = _createSuper(MidSurveyTwo);

  function MidSurveyTwo() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {};

    _this.renderLabels = function (val) {
      if (val === 0) {
        // Min value
        return val + " Unhappy";
      } else if (val === 3) {
        return val + " Neutral";
      } else if (val === 6) {
        // Max value
        return val + " Happy";
      }

      return "";
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player,
          stage = _this$props.stage;
      var surveyNumber = player.get("surveyNumber");
      event.preventDefault(); // TODO: log player response to survey question

      player.round.set("survey_" + surveyNumber, _this.state);
      stage.append("log", {
        verb: "survey_" + surveyNumber,
        subjectId: player.id,
        object: _this.state,
        at: moment(TimeSync.serverTime(null, 1000))
      });
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
      onNext();
    };

    return _this;
  }

  var _proto = MidSurveyTwo.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var _this2 = this;

      var _this$props2 = this.props,
          game = _this$props2.game,
          round = _this$props2.round,
          stage = _this$props2.stage,
          player = _this$props2.player;
      player.get("neighbors").forEach(function (otherNodeId) {
        var _this2$setState;

        var otherPlayerId = game.players.find(function (p) {
          return p.get("nodeId") === parseInt(otherNodeId);
        }).get("anonymousName");

        _this2.setState((_this2$setState = {}, _this2$setState[otherPlayerId] = 0, _this2$setState));
      });
    }

    return componentDidMount;
  }();

  _proto.render = function () {
    function render() {
      var _this3 = this;

      var _this$props3 = this.props,
          game = _this$props3.game,
          round = _this$props3.round,
          stage = _this$props3.stage,
          player = _this$props3.player;
      var response = this.state.response;
      var network = player.get("neighbors");
      var surveyNumber = player.get("surveyNumber");
      var completedWidth = 590 / 5 * surveyNumber;
      var uncompletedWidth = 590 - completedWidth;
      var offset = 590 / 5 * 0.5;
      var stageNumPosition = completedWidth - offset;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " To complete the challenge, please fill in the following questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-heading",
        style: {
          marginLeft: stageNumPosition
        }
      }, " ", surveyNumber, " "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color-dark.png",
        width: uncompletedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, " Please rate how well you have been working with each teammate in the recent trials?"), network.map(function (otherNodeId) {
        var otherPlayer = game.players.find(function (p) {
          return p.get("nodeId") === parseInt(otherNodeId);
        });
        var otherPlayerId = otherPlayer.get("anonymousName"); // const playerIsOnline = otherPlayer.online === true && !otherPlayer.get("inactive");

        var playerIsOnline = !otherPlayer.get("inactive");

        var handleSliderChange = function (num) {
          var _this3$setState;

          // Rounding the number to 2 decimals max
          _this3.setState((_this3$setState = {}, _this3$setState[otherPlayerId] = num, _this3$setState));

          player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
        };

        return /*#__PURE__*/React.createElement("div", {
          className: "player-slider-container"
        }, /*#__PURE__*/React.createElement("div", {
          className: "player-label"
        }, " ", otherPlayerId, " ", playerIsOnline ? "" : " (offline)", " "), /*#__PURE__*/React.createElement(Slider, {
          key: otherNodeId,
          min: 0,
          max: 6,
          stepSize: 1,
          disabled: false,
          showTrackFill: false,
          name: otherPlayerId,
          value: _this3.state[otherPlayerId],
          labelRenderer: _this3.renderLabels,
          onChange: handleSliderChange
        }), /*#__PURE__*/React.createElement("div", {
          className: "slider-value-container",
          style: {
            width: "15%"
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "slider-value"
        }, _this3.state[otherPlayerId], " ")));
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: "arrow-button button-submit",
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return MidSurveyTwo;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MidSurvey3.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/mid-survey/MidSurvey3.jsx                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return MidSurveyThree;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Slider;
module.link("meteor/empirica:slider", {
  "default": function (v) {
    Slider = v;
  }
}, 1);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 2);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 3);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 4);

var MidSurveyThree = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(MidSurveyThree, _React$Component);

  var _super = _createSuper(MidSurveyThree);

  function MidSurveyThree() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      sliderValue: 0
    };

    _this.handleSliderChange = function (num) {
      var _this$props = _this.props,
          stage = _this$props.stage,
          player = _this$props.player; // Rounding the number to 2 decimals max

      _this.setState({
        sliderValue: num
      });

      player.stage.set("sliderValue", num);
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    };

    _this.renderLabels = function (val) {
      if (val === 0) {
        // Min value
        return val + " Unhappy";
      } else if (val === 3) {
        return val + " Neutral";
      } else if (val === 6) {
        // Max value
        return val + " Happy";
      }

      return "";
    };

    _this.handleSubmit = function (event) {
      var _this$props2 = _this.props,
          onNext = _this$props2.onNext,
          player = _this$props2.player,
          stage = _this$props2.stage;
      var surveyNumber = player.get("surveyNumber");
      event.preventDefault(); // TODO: log player response to survey question

      player.round.set("survey_" + surveyNumber, _this.state);
      stage.append("log", {
        verb: "survey_" + surveyNumber,
        subjectId: player.id,
        object: _this.state,
        at: moment(TimeSync.serverTime(null, 1000))
      });
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
      onNext();
    };

    return _this;
  }

  var _proto = MidSurveyThree.prototype;

  _proto.render = function () {
    function render() {
      var _this$props3 = this.props,
          game = _this$props3.game,
          round = _this$props3.round,
          stage = _this$props3.stage,
          player = _this$props3.player;
      var response = this.state.response;
      var surveyNumber = player.get("surveyNumber");
      var completedWidth = 590 / 5 * surveyNumber;
      var uncompletedWidth = 590 - completedWidth;
      var offset = 590 / 5 * 0.5;
      var stageNumPosition = completedWidth - offset;
      var sliderValue = this.state.sliderValue;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " To complete the challenge, please fill in the following questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-heading",
        style: {
          marginLeft: stageNumPosition
        }
      }, " ", surveyNumber, " "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color-dark.png",
        width: uncompletedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, " How did you like your job in the team during the recent trials? "), /*#__PURE__*/React.createElement(Slider, {
        min: 0,
        max: 6,
        stepSize: 1,
        disabled: false,
        showTrackFill: false,
        value: sliderValue,
        labelRenderer: this.renderLabels,
        onChange: this.handleSliderChange
      }), /*#__PURE__*/React.createElement("div", {
        className: "slider-value-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "slider-value"
      }, sliderValue, " "))), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: "arrow-button button-submit",
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return MidSurveyThree;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MidSurvey4.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/mid-survey/MidSurvey4.jsx                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return MidSurveyFour;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Slider;
module.link("meteor/empirica:slider", {
  "default": function (v) {
    Slider = v;
  }
}, 1);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 2);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 3);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 4);

var MidSurveyFour = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(MidSurveyFour, _React$Component);

  var _super = _createSuper(MidSurveyFour);

  function MidSurveyFour() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      sliderValue: 0
    };

    _this.handleSliderChange = function (num) {
      var _this$props = _this.props,
          stage = _this$props.stage,
          player = _this$props.player; // Rounding the number to 2 decimals max

      _this.setState({
        sliderValue: num
      });

      player.stage.set("sliderValue", num);
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    };

    _this.renderLabels = function (val) {
      if (val === 0) {
        // Min value
        return val + " Poor";
      } else if (val === 3) {
        return val + " Neutral";
      } else if (val === 6) {
        // Max value
        return val + " Great";
      }

      return "";
    };

    _this.handleSubmit = function (event) {
      var _this$props2 = _this.props,
          onNext = _this$props2.onNext,
          player = _this$props2.player,
          stage = _this$props2.stage;
      var surveyNumber = player.get("surveyNumber");
      event.preventDefault(); // TODO: log player response to survey question

      player.round.set("survey_" + surveyNumber, _this.state);
      stage.append("log", {
        verb: "survey_" + surveyNumber,
        subjectId: player.id,
        object: _this.state,
        at: moment(TimeSync.serverTime(null, 1000))
      });
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
      onNext();
    };

    return _this;
  }

  var _proto = MidSurveyFour.prototype;

  _proto.render = function () {
    function render() {
      var _this$props3 = this.props,
          game = _this$props3.game,
          round = _this$props3.round,
          stage = _this$props3.stage,
          player = _this$props3.player;
      var response = this.state.response;
      var surveyNumber = player.get("surveyNumber");
      var completedWidth = 590 / 5 * surveyNumber;
      var uncompletedWidth = 590 - completedWidth;
      var offset = 590 / 5 * 0.5;
      var stageNumPosition = completedWidth - offset;
      var sliderValue = this.state.sliderValue;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " To complete the challenge, please fill in the following questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-heading",
        style: {
          marginLeft: stageNumPosition
        }
      }, " ", surveyNumber, " "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color-dark.png",
        width: uncompletedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, " On the scale below, rate how your team has been working in the recent trials "), /*#__PURE__*/React.createElement(Slider, {
        min: 0,
        max: 6,
        stepSize: 1,
        disabled: false,
        showTrackFill: false,
        value: sliderValue,
        labelRenderer: this.renderLabels,
        onChange: this.handleSliderChange
      }), /*#__PURE__*/React.createElement("div", {
        className: "slider-value-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "slider-value"
      }, sliderValue, " "))), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: "arrow-button button-submit",
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return MidSurveyFour;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MidSurvey5.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/mid-survey/MidSurvey5.jsx                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return MidSurveyFive;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Slider;
module.link("meteor/empirica:slider", {
  "default": function (v) {
    Slider = v;
  }
}, 1);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 2);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 3);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 4);

var MidSurveyFive = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(MidSurveyFive, _React$Component);

  var _super = _createSuper(MidSurveyFive);

  function MidSurveyFive() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      response: ""
    };
    _this.updateLastActive = _.throttle(function (player) {
      return player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    }, 5000, {
      leading: true
    });

    _this.handleChange = function (event) {
      var _this$setState;

      var player = _this.props.player;
      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));

      _this.updateLastActive(player);
    };

    _this.handleSliderChange = function (num) {
      var _this$props = _this.props,
          stage = _this$props.stage,
          player = _this$props.player; // Rounding the number to 2 decimals max

      _this.setState({
        sliderValue: num
      });

      player.stage.set("sliderValue", num);
    };

    _this.renderLabels = function (val) {
      if (val === 0) {
        // Min value
        return val + " Unhappy";
      } else if (val === 3) {
        return val + " Neutral";
      } else if (val === 6) {
        // Max value
        return val + " Happy";
      }

      return "";
    };

    _this.handleSubmit = function (event) {
      var _this$props2 = _this.props,
          onNext = _this$props2.onNext,
          player = _this$props2.player,
          stage = _this$props2.stage;
      var surveyNumber = player.get("surveyNumber");
      event.preventDefault(); // TODO: log player response to survey question

      player.round.set("survey_" + surveyNumber, _this.state);
      stage.append("log", {
        verb: "survey_" + surveyNumber,
        subjectId: player.id,
        object: _this.state,
        at: moment(TimeSync.serverTime(null, 1000))
      });
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
      player.set("submitted", true);
    };

    return _this;
  }

  var _proto = MidSurveyFive.prototype;

  _proto.render = function () {
    function render() {
      var _this$props3 = this.props,
          game = _this$props3.game,
          round = _this$props3.round,
          stage = _this$props3.stage,
          player = _this$props3.player;
      var response = this.state.response;
      var submitted = player.get("submitted");
      var surveyNumber = player.get("surveyNumber");
      var completedWidth = 590 / 5 * surveyNumber;
      var uncompletedWidth = 590 - completedWidth;
      var offset = 590 / 5 * 0.5;
      var stageNumPosition = completedWidth - offset;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " To complete the challenge, please fill in the following questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-bar"
      }, /*#__PURE__*/React.createElement("div", {
        className: "completed-heading",
        style: {
          marginLeft: stageNumPosition
        }
      }, " ", surveyNumber, " "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color-dark.png",
        width: uncompletedWidth + " px",
        height: "7px"
      })), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, " Do you think your group could improve its efficiency? If so, how? "), /*#__PURE__*/React.createElement("textarea", {
        className: "survey-textarea",
        dir: "auto",
        id: "response",
        name: "response",
        value: response,
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: !response ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !response,
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return MidSurveyFive;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"About.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/About.jsx                                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return About;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);

var About = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(About, _React$Component);

  var _super = _createSuper(About);

  function About() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = About.prototype;

  _proto.render = function () {
    function render() {
      return /*#__PURE__*/React.createElement("div", null, "Here be the presentation of the experiement(ers).");
    }

    return render;
  }();

  return About;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"GameTimer.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/GameTimer.jsx                                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
var StageTimeWrapper;
module.link("meteor/empirica:core", {
  StageTimeWrapper: function (v) {
    StageTimeWrapper = v;
  }
}, 0);
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 1);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 2);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 3);

var timer = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(timer, _React$Component);

  var _super = _createSuper(timer);

  function timer() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = timer.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          remainingSeconds = _this$props.remainingSeconds,
          game = _this$props.game;
      var classes = ["timer"];

      if (remainingSeconds <= 5) {
        classes.push("lessThan5");
      } else if (remainingSeconds <= 10) {
        classes.push("lessThan10");
      }

      var gameStartTime = moment(game.get("gameStartTime"));
      var gameEndTime = moment(game.get("maxGameEndTime"));
      var currentTime = moment(TimeSync.serverTime(null, 1000));
      var timeDiff = gameEndTime.diff(currentTime, 'seconds');
      var activePlayers = game.players.filter(function (p) {
        return !p.get("inactive");
      });

      if (timeDiff < 0) {
        activePlayers.forEach(function (p) {
          p.exit("maxGameTimeReached");
        });
      }

      return /*#__PURE__*/React.createElement("div", {
        className: classes.join(" "),
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
        className: "results-text",
        style: {
          margin: "0px 0px"
        }
      }, "Total Game Time Left: ", timeDiff)));
    }

    return render;
  }();

  return timer;
}(React.Component);

module.exportDefault(GameTimer = StageTimeWrapper(timer));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"InactiveTimer.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/InactiveTimer.jsx                                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Timer;
module.link("./Timer.jsx", {
  "default": function (v) {
    Timer = v;
  }
}, 1);
var StageTimeWrapper;
module.link("meteor/empirica:core", {
  StageTimeWrapper: function (v) {
    StageTimeWrapper = v;
  }
}, 2);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 3);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 4);
var Modal;
module.link("./Modal", {
  "default": function (v) {
    Modal = v;
  }
}, 5);

var _;

module.link("lodash", {
  "default": function (v) {
    _ = v;
  }
}, 6);

var inactiveTimer = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(inactiveTimer, _React$Component);

  var _super = _createSuper(inactiveTimer);

  function inactiveTimer(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.onOpenModal = function () {
      _this.setState({
        modalIsOpen: true
      });
    };

    _this.onCloseModal = function () {
      var _this$props = _this.props,
          player = _this$props.player,
          game = _this$props.game;
      var inactiveDuration = game.treatment.userInactivityDuration;
      var extra30Seconds = inactiveDuration - game.treatment.idleWarningTime;

      if (!player.get("inactiveWarningUsed")) {
        player.set("lastActive", moment(TimeSync.serverTime(null, 1000)).subtract(extra30Seconds, 'seconds'));
        player.set("inactiveWarningUsed", true);
      }

      _this.setState({
        modalIsOpen: false
      });
    };

    _this.onPlayerInactive = function (player, game) {
      if (player.get("inactive") === false) {
        player.set("inactive", true);
        player.set("submitted", false);
        game.set("checkForSimilarSymbol", true);
      }
    };

    _this.checkEveryoneLastActive = _.throttle(function (game, player) {
      var currentTime = moment(TimeSync.serverTime(null, 1000));
      var inactiveDuration = game.treatment.userInactivityDuration;
      var inactiveDurationPlus30 = inactiveDuration + game.treatment.idleWarningTime;
      var activePlayers = game.players.filter(function (p) {
        return !p.get("inactive");
      });
      activePlayers.forEach(function (p) {
        var playerLastActive = p.get("lastActive");
        var timeDiff = currentTime.diff(playerLastActive, 'seconds');

        if (!p.get("inactiveWarningUsed")) {
          if (timeDiff >= inactiveDurationPlus30) {
            _this.onPlayerInactive(p, game);

            p.exit("inactive");
          } else if (timeDiff >= inactiveDuration) {
            if (!_this.state.modalIsOpen && p._id === player._id) {
              _this.onOpenModal();
            }
          }
        } else {
          if (timeDiff >= inactiveDuration) {
            _this.onPlayerInactive(p, game);

            p.exit("inactive");
          }
        }
      });
    }, 1000, {
      leading: true
    });
    _this.state = {
      modalIsOpen: false
    };
    return _this;
  }

  var _proto = inactiveTimer.prototype;

  _proto.render = function () {
    function render() {
      var _this$props2 = this.props,
          game = _this$props2.game,
          round = _this$props2.round,
          stage = _this$props2.stage,
          player = _this$props2.player;
      this.checkEveryoneLastActive(game, player); // const currentTime = moment(TimeSync.serverTime(null, 1000));
      // const inactiveDuration = game.treatment.userInactivityDuration;
      // const inactiveDurationPlus30 = inactiveDuration + game.treatment.idleWarningTime;
      // const activePlayers = game.players.filter(p => !p.get("inactive"));
      // activePlayers.forEach((p) => {
      //     console.log("checking");
      //     const playerLastActive = p.get("lastActive");
      //     const timeDiff = currentTime.diff(playerLastActive, 'seconds');
      //     if (!p.get("inactiveWarningUsed")) {
      //         if (timeDiff >= inactiveDurationPlus30) {
      //             this.onPlayerInactive(p,game);
      //             p.exit("inactive");
      //         }
      //         else if (timeDiff >= inactiveDuration) {
      //             if (!this.state.modalIsOpen && p._id === player._id){
      //                 this.onOpenModal();
      //             }
      //         }
      //     } else {
      //         if (timeDiff >= inactiveDuration) {
      //             this.onPlayerInactive(p,game);
      //             p.exit("inactive");
      //         }
      //     }
      // })
      // const playerLastActive = player.get("lastActive");
      // const inactiveDuration = game.treatment.userInactivityDuration;
      // const timeDiff = currentTime.diff(playerLastActive, 'seconds');
      // if (timeDiff >= inactiveDuration) {
      //     this.onPlayerInactive();
      //     player.exit("inactive");
      //     // this.onPlayerInactive();
      // } else if (timeDiff > inactiveDuration - game.treatment.idleWarningTime) {
      //     if (!this.state.modalIsOpen) {
      //         this.onOpenModal();
      //     }
      // }

      var currentTime = moment(TimeSync.serverTime(null, 1000));
      var playerLastActive = player.get("lastActive");
      var timeDiffForMe = currentTime.diff(playerLastActive, 'seconds');
      return /*#__PURE__*/React.createElement("div", null, this.state.modalIsOpen && /*#__PURE__*/React.createElement(Modal, {
        game: game,
        player: player,
        onCloseModal: this.onCloseModal
      }), "Last Active: ", timeDiffForMe);
    }

    return render;
  }();

  return inactiveTimer;
}(React.Component);

module.exportDefault(InactiveTimer = StageTimeWrapper(inactiveTimer));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Modal.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/Modal.jsx                                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return Modal;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);

var Modal = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Modal, _React$Component);

  var _super = _createSuper(Modal);

  function Modal() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Modal.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          game = _this$props.game,
          player = _this$props.player,
          onCloseModal = _this$props.onCloseModal;
      return /*#__PURE__*/React.createElement("div", {
        className: "dark-bg",
        onClick: onCloseModal
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal-centered"
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal"
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal-content"
      }, "Warning, you seem to be inactive. This was your ONE warning. Next time, you will be kicked without a warning. If you are still inactive in the next ", game.treatment.idleWarningTime, " seconds, you will be kicked. Do you understand?"), /*#__PURE__*/React.createElement("button", {
        className: "modal-button",
        onClick: onCloseModal
      }, "Yes"))));
    }

    return render;
  }();

  return Modal;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MyNetwork.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/MyNetwork.jsx                                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return MyNetwork;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var PlayerTab;
module.link("./PlayerTab", {
  "default": function (v) {
    PlayerTab = v;
  }
}, 1);

var MyNetwork = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(MyNetwork, _React$Component);

  var _super = _createSuper(MyNetwork);

  function MyNetwork() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = MyNetwork.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          game = _this$props.game,
          stage = _this$props.stage,
          round = _this$props.round,
          player = _this$props.player,
          onOpenChat = _this$props.onOpenChat;
      var network = player.get("neighbors");
      return /*#__PURE__*/React.createElement("div", {
        className: "network-container"
      }, /*#__PURE__*/React.createElement("p", {
        className: "network-header"
      }, " MY NETWORK"), /*#__PURE__*/React.createElement("div", {
        className: "network-all-players-container"
      }, network.map(function (otherNodeId) {
        // const otherPlayerId = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId)).id;
        return /*#__PURE__*/React.createElement(PlayerTab, {
          game: game,
          otherPlayerNodeId: otherNodeId,
          openChat: onOpenChat
        });
      })));
    }

    return render;
  }();

  return MyNetwork;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PlayerProfile.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/PlayerProfile.jsx                                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return PlayerProfile;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Timer;
module.link("./Timer.jsx", {
  "default": function (v) {
    Timer = v;
  }
}, 1);

var PlayerProfile = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(PlayerProfile, _React$Component);

  var _super = _createSuper(PlayerProfile);

  function PlayerProfile() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = PlayerProfile.prototype;

  _proto.renderProfile = function () {
    function renderProfile() {
      var player = this.props.player;
      return /*#__PURE__*/React.createElement("div", {
        className: "profile-score"
      }, /*#__PURE__*/React.createElement("h3", null, "Your Profile"), /*#__PURE__*/React.createElement("img", {
        src: player.get("avatar"),
        className: "profile-avatar"
      }));
    }

    return renderProfile;
  }();

  _proto.renderScore = function () {
    function renderScore() {
      var player = this.props.player;
      return /*#__PURE__*/React.createElement("div", {
        className: "profile-score"
      }, /*#__PURE__*/React.createElement("h4", null, "Total score"), /*#__PURE__*/React.createElement("span", null, (player.get("score") || 0).toFixed(2)));
    }

    return renderScore;
  }();

  _proto.render = function () {
    function render() {
      var stage = this.props.stage;
      return /*#__PURE__*/React.createElement("aside", {
        className: "player-profile"
      }, this.renderProfile(), this.renderScore(), /*#__PURE__*/React.createElement(Timer, {
        stage: stage
      }));
    }

    return render;
  }();

  return PlayerProfile;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PlayerTab.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/PlayerTab.jsx                                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return PlayerTab;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);

var PlayerTab = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(PlayerTab, _React$Component);

  var _super = _createSuper(PlayerTab);

  function PlayerTab() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.handleOpenChat = function () {
      var _this$props = _this.props,
          otherPlayerNodeId = _this$props.otherPlayerNodeId,
          openChat = _this$props.openChat;
      openChat(otherPlayerNodeId);
    };

    return _this;
  }

  var _proto = PlayerTab.prototype;

  _proto.render = function () {
    function render() {
      var _this$props2 = this.props,
          game = _this$props2.game,
          otherPlayerNodeId = _this$props2.otherPlayerNodeId,
          openChat = _this$props2.openChat;
      var otherPlayerId = game.players.find(function (p) {
        return p.get("nodeId") === parseInt(otherPlayerNodeId);
      }).id;
      return /*#__PURE__*/React.createElement("div", {
        className: "network-player-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "network-name-container",
        onClick: this.handleOpenChat
      }, otherPlayerId), /*#__PURE__*/React.createElement("div", {
        className: "network-avatar-container"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/icon-profile-white.png",
        width: "25px",
        height: "25px"
      })));
    }

    return render;
  }();

  return PlayerTab;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Results.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/Results.jsx                                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return Round;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Timer;
module.link("./Timer.jsx", {
  "default": function (v) {
    Timer = v;
  }
}, 1);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 2);

var Round = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Round, _React$Component);

  var _super = _createSuper(Round);

  function Round() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Round.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          stage = _this$props.stage,
          round = _this$props.round,
          game = _this$props.game;
      var result = round.get("result");
      var correctMessage = "Your team was correct, congratulations!";
      var incorrectMessage = "Your team was not correct, better luck on the next one.";
      return /*#__PURE__*/React.createElement("div", {
        className: "results-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "results-content"
      }, /*#__PURE__*/React.createElement("h1", {
        className: "results-text"
      }, " ", result ? correctMessage : incorrectMessage, " "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: "200px",
        height: "3px"
      }), /*#__PURE__*/React.createElement(Timer, {
        stage: stage
      })));
    }

    return render;
  }();

  return Round;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Round.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/Round.jsx                                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _extends;

module.link("@babel/runtime/helpers/extends", {
  default: function (v) {
    _extends = v;
  }
}, 0);

var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 1);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 2);
module.export({
  "default": function () {
    return Round;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var PlayerProfile;
module.link("./PlayerProfile.jsx", {
  "default": function (v) {
    PlayerProfile = v;
  }
}, 1);
var SocialExposure;
module.link("./SocialExposure.jsx", {
  "default": function (v) {
    SocialExposure = v;
  }
}, 2);
var MyNetwork;
module.link("./MyNetwork.jsx", {
  "default": function (v) {
    MyNetwork = v;
  }
}, 3);
var RoundMetaData;
module.link("./RoundMetaData.jsx", {
  "default": function (v) {
    RoundMetaData = v;
  }
}, 4);
var Results;
module.link("./Results.jsx", {
  "default": function (v) {
    Results = v;
  }
}, 5);
var Task;
module.link("./Task.jsx", {
  "default": function (v) {
    Task = v;
  }
}, 6);
var MidSurveyOne;
module.link("./mid-survey/MidSurvey1", {
  "default": function (v) {
    MidSurveyOne = v;
  }
}, 7);
var MidSurveyTwo;
module.link("./mid-survey/MidSurvey2", {
  "default": function (v) {
    MidSurveyTwo = v;
  }
}, 8);
var MidSurveyThree;
module.link("./mid-survey/MidSurvey3", {
  "default": function (v) {
    MidSurveyThree = v;
  }
}, 9);
var MidSurveyFour;
module.link("./mid-survey/MidSurvey4", {
  "default": function (v) {
    MidSurveyFour = v;
  }
}, 10);
var MidSurveyFive;
module.link("./mid-survey/MidSurvey5", {
  "default": function (v) {
    MidSurveyFive = v;
  }
}, 11);
var InactiveTimer;
module.link("./InactiveTimer.jsx", {
  "default": function (v) {
    InactiveTimer = v;
  }
}, 12);
var Modal;
module.link("./Modal", {
  "default": function (v) {
    Modal = v;
  }
}, 13);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 14);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 15);
var GameTimer;
module.link("./GameTimer.jsx", {
  "default": function (v) {
    GameTimer = v;
  }
}, 16);

var Round = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Round, _React$Component);

  var _super = _createSuper(Round);

  function Round(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.audio = new Audio("sounds/Game Start Countdown Sound.wav");

    _this.onOpenModal = function () {
      _this.setState({
        modalIsOpen: true
      });
    };

    _this.onCloseModal = function () {
      var player = _this.props.player;

      _this.setState({
        modalIsOpen: false
      });

      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    };

    _this.onNext = function () {
      var player = _this.props.player;
      var curSurveyNumber = player.get("surveyNumber");
      player.set("surveyNumber", curSurveyNumber + 1);
    };

    _this.renderSurvey = function () {
      var _this$props = _this.props,
          game = _this$props.game,
          player = _this$props.player;
      var submitted = player.get("submitted");

      if (submitted) {
        return _this.renderSubmitted();
      }

      var surveyNumber = player.get("surveyNumber");

      if (surveyNumber === 1) {
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MidSurveyOne, _extends({}, _this.props, {
          onNext: _this.onNext
        })), /*#__PURE__*/React.createElement(InactiveTimer, {
          game: game,
          player: player
        }));
      } else if (surveyNumber === 2) {
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MidSurveyTwo, _extends({}, _this.props, {
          onNext: _this.onNext
        })), /*#__PURE__*/React.createElement(InactiveTimer, {
          game: game,
          player: player
        }));
      } else if (surveyNumber === 3) {
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MidSurveyThree, _extends({}, _this.props, {
          onNext: _this.onNext
        })), /*#__PURE__*/React.createElement(InactiveTimer, {
          game: game,
          player: player
        }));
      } else if (surveyNumber === 4) {
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MidSurveyFour, _extends({}, _this.props, {
          onNext: _this.onNext
        })), /*#__PURE__*/React.createElement(InactiveTimer, {
          game: game,
          player: player
        }));
      } else if (surveyNumber === 5) {
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MidSurveyFive, _extends({}, _this.props, {
          onNext: _this.onNext
        })), /*#__PURE__*/React.createElement(InactiveTimer, {
          game: game,
          player: player
        }));
      }
    };

    _this.state = {
      // activeChats : [],
      modalIsOpen: false
    };
    return _this;
  }

  var _proto = Round.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var _this$props2 = this.props,
          round = _this$props2.round,
          stage = _this$props2.stage,
          player = _this$props2.player; // Set the player's first activity at the start of the round

      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

      if (round.index === 0 && stage.index === 0) {
        // Play game start sound cue
        this.audio.play();
      }
    }

    return componentDidMount;
  }();

  _proto.renderSubmitted = function () {
    function renderSubmitted() {
      var _this$props3 = this.props,
          stage = _this$props3.stage,
          round = _this$props3.round,
          player = _this$props3.player,
          game = _this$props3.game; // Create a list of dots to show how many players submitted
      // const completedWidth = 590/game.players.length * round.get("numPlayersSubmitted");
      // const uncompletedWidth = 590 - completedWidth;

      var windowOffset = 75; // const numActivePlayers = game.players.filter(p => p.online === true && !p.get("inactive")).length;

      var numActivePlayers = game.players.filter(function (p) {
        return !p.get("inactive");
      }).length;
      var completedWidth = window.innerWidth / numActivePlayers * round.get("numPlayersSubmitted");
      var uncompletedWidth = window.innerWidth - completedWidth;
      completedWidth -= windowOffset;
      uncompletedWidth -= windowOffset; // <div className="completed-bar">
      //     <img src={`images/hr-color.png`} width={`${completedWidth} px`} height="7px" />
      // </div>

      var currentTime = moment(TimeSync.serverTime(null, 1000));
      var playerLastActive = player.get("lastActive");
      var timeDiff = currentTime.diff(playerLastActive, 'seconds');

      if (timeDiff > 10) {
        player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "survey-wait-container"
      }, /*#__PURE__*/React.createElement("img", {
        className: "survey-wait-static-image",
        src: "images/title-please-hold.png"
      }), /*#__PURE__*/React.createElement("div", {
        className: "survey-wait-content"
      }, /*#__PURE__*/React.createElement("h1", {
        className: "results-text"
      }, "Waiting for all members "), /*#__PURE__*/React.createElement("div", {
        className: "progress-bar"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "3px"
      }), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-white.png",
        width: uncompletedWidth + " px",
        height: "3px"
      }))));
    }

    return renderSubmitted;
  }();

  _proto.render = function () {
    function render() {
      var _this$props4 = this.props,
          stage = _this$props4.stage,
          round = _this$props4.round,
          player = _this$props4.player,
          game = _this$props4.game; // const numActivePlayers = game.players.filter(p => p.online === true && !p.get("inactive")).length;

      var numActivePlayers = game.players.filter(function (p) {
        return !p.get("inactive");
      }).length;

      if (stage.name === "Result") {
        return /*#__PURE__*/React.createElement("div", {
          className: "round"
        }, /*#__PURE__*/React.createElement(Results, {
          game: game,
          round: round,
          stage: stage
        }));
      } else if (stage.name === "Survey") {
        return this.renderSurvey();
      } else {
        // Load the round
        return /*#__PURE__*/React.createElement("div", {
          className: "round"
        }, /*#__PURE__*/React.createElement("div", {
          className: "content"
        }, /*#__PURE__*/React.createElement("div", {
          className: "round-task-container"
        }, /*#__PURE__*/React.createElement(RoundMetaData, {
          game: game,
          round: round,
          stage: stage,
          player: player
        }), /*#__PURE__*/React.createElement(Task, {
          game: game,
          round: round,
          stage: stage,
          player: player
        })), /*#__PURE__*/React.createElement(SocialExposure, {
          game: game,
          round: round,
          stage: stage,
          player: player // onOpenChat = {(otherPlayerNodeId) => this.onOpenChat(otherPlayerNodeId)} 
          // onCloseChat={(customKey) => this.onCloseChat(customKey)} 
          ,
          activeChats: this.state.activeChats
        })));
      }
    }

    return render;
  }();

  return Round;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"RoundMetaData.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/RoundMetaData.jsx                                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return RoundMetaData;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Timer;
module.link("./Timer.jsx", {
  "default": function (v) {
    Timer = v;
  }
}, 1);
var TaskTimer;
module.link("./TaskTimer.jsx", {
  "default": function (v) {
    TaskTimer = v;
  }
}, 2);
var InactiveTimer;
module.link("./InactiveTimer", {
  "default": function (v) {
    InactiveTimer = v;
  }
}, 3);

var RoundMetaData = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(RoundMetaData, _React$Component);

  var _super = _createSuper(RoundMetaData);

  function RoundMetaData() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = RoundMetaData.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          game = _this$props.game,
          round = _this$props.round,
          stage = _this$props.stage,
          player = _this$props.player;
      var taskWarningTime = game.treatment.taskWarningTime;
      var playerId = player.id;
      var taskName = stage.displayName;
      var totalTaskRounds = game.treatment.numTaskRounds;
      var playerScore = player.get("score"); // const allSymbols = [];
      // game.players.forEach(player => {
      //     const taskSymbols = 
      // })

      return /*#__PURE__*/React.createElement("div", {
        className: "metadata-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "round-number-container"
      }, /*#__PURE__*/React.createElement("div", null, " ", taskName, " of ", totalTaskRounds, " "), /*#__PURE__*/React.createElement("div", null, " Current Score : ", playerScore, " ")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }
      }, game.treatment.maxGameTime && /*#__PURE__*/React.createElement(GameTimer, {
        game: game
      }), /*#__PURE__*/React.createElement("p", null, "Your player name is ", player.get("anonymousName"))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column"
        }
      }, taskWarningTime && /*#__PURE__*/React.createElement(TaskTimer, {
        game: game,
        stage: stage,
        player: player
      }), /*#__PURE__*/React.createElement(InactiveTimer, {
        game: game,
        player: player
      })));
    }

    return render;
  }();

  return RoundMetaData;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SocialExposure.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/SocialExposure.jsx                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _toConsumableArray;

module.link("@babel/runtime/helpers/toConsumableArray", {
  default: function (v) {
    _toConsumableArray = v;
  }
}, 0);

var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 1);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 2);
module.export({
  "default": function () {
    return SocialExposure;
  }
});
module.link("../chat/style.less");
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Chat;
module.link("@empirica/chat", {
  Chat: function (v) {
    Chat = v;
  }
}, 1);
var ChatContainer;
module.link("../chat/ChatContainer.js", {
  "default": function (v) {
    ChatContainer = v;
  }
}, 2);
var Message;
module.link("../chat/Message.js", {
  "default": function (v) {
    Message = v;
  }
}, 3);
var Footer;
module.link("../chat/Footer.js", {
  "default": function (v) {
    Footer = v;
  }
}, 4);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 5);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 6);
var Slider;
module.link("meteor/empirica:slider", {
  "default": function (v) {
    Slider = v;
  }
}, 7);

var SocialExposure = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(SocialExposure, _React$Component);

  var _super = _createSuper(SocialExposure);

  function SocialExposure(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.onOpenChat = function (customKey) {
      var player = _this.props.player;

      if (!_this.state.activeChats.includes(customKey)) {
        _this.state.activeChats.push(customKey);

        player.set("activeChats", _this.state.activeChats);
      }
    };

    _this.onCloseChat = function (customKey) {
      var player = _this.props.player;

      var newActiveChats = _this.state.activeChats.filter(function (chat) {
        return chat !== customKey;
      });

      _this.setState({
        activeChats: newActiveChats
      });

      player.set("activeChats", newActiveChats);
    };

    _this.audio = new Audio("sounds/notification-sound-7062.mp3");

    _this.logIncomingMessage = function (msgs, customKey) {
      var _this$props = _this.props,
          game = _this$props.game,
          round = _this$props.round,
          stage = _this$props.stage,
          player = _this$props.player;
      var messages = round.get("" + customKey);
      var mostRecentMsg = messages[messages.length - 1];
      var sender = mostRecentMsg.player._id; // TODO: Check if this only appends if player chat is open
      // onIncomingMessage logs the message for both sender and receiver
      // Only log one copy of the message

      if (player._id === sender) {
        var pairOfPlayers = customKey.split("-");
        var receiverId = pairOfPlayers.filter(function (id) {
          return parseInt(id) !== player.get("nodeId");
        });
        var receiver = game.players.find(function (p) {
          return p.get("nodeId") === parseInt(receiverId);
        });
        var receiverChats = receiver.get("activeChats");

        if (!receiverChats.includes(customKey)) {
          var newReceiverChats = [].concat(_toConsumableArray(receiverChats), [customKey]);
          receiver.set("activeChats", newReceiverChats);
          receiver.set("getNotified", true);
        }
      }

      if (player._id !== sender) {
        stage.append("log", {
          verb: "messageLog",
          subjectId: player.id,
          object: mostRecentMsg,
          at: moment(TimeSync.serverTime(null, 1000))
        });
        var activeChats = player.get("activeChats");

        if (!activeChats.includes(customKey)) {
          console.log("Chat closed but message delivered");
        }

        _this.audio.play();
      }
    };

    _this.state = {
      activeChats: []
    };
    return _this;
  }

  var _proto = SocialExposure.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var player = this.props.player; // Set the player's first activity at the start of the round

      var activeChats = player.get("activeChats");
      this.setState({
        activeChats: activeChats
      });
    }

    return componentDidMount;
  }();

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          game = _this$props2.game,
          round = _this$props2.round,
          player = _this$props2.player,
          activeChats = _this$props2.activeChats;
      var network = player.get("neighbors"); // reactive time value only updates at 1000 ms

      var timeStamp = new Date(TimeSync.serverTime(null, 1000));

      if (player.get("getNotified")) {
        this.audio.play();
        player.set("getNotified", false);
      }

      if (network.length === 0) {
        return null;
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "all-chats-container"
      }, network.map(function (otherNodeId) {
        var pairOfPlayers = [player.get("nodeId"), parseInt(otherNodeId)];
        pairOfPlayers.sort(function (p1, p2) {
          return p1 - p2;
        });
        var otherPlayer = game.players.find(function (p) {
          return p.get("nodeId") === parseInt(otherNodeId);
        });
        var otherPlayerId = otherPlayer.get("anonymousName"); // const playerIsOnline = otherPlayer.online === true && !otherPlayer.get("inactive");

        var playerIsOnline = !otherPlayer.get("inactive");
        var chatKey = pairOfPlayers[0] + "-" + pairOfPlayers[1];
        var activeChats = player.get("activeChats");
        return (
          /*#__PURE__*/
          // <div style={{height: "80%"}}>
          React.createElement(ChatContainer, {
            docked: true,
            key: otherNodeId,
            player: player,
            otherPlayer: otherPlayerId,
            scope: round,
            timeStamp: timeStamp,
            customClassName: "ray-chat-container",
            message: Message,
            footer: Footer,
            onIncomingMessage: _this2.logIncomingMessage,
            customKey: chatKey // isActive={activeChats.includes(chatKey)}
            ,
            isOpen: activeChats.includes(chatKey),
            playerIsOnline: playerIsOnline,
            onOpenChat: function (customKey) {
              return _this2.onOpenChat(customKey);
            },
            onCloseChat: function (customKey) {
              return _this2.onCloseChat(customKey);
            }
          }) // </div>

        );
      }));
    }

    return render;
  }();

  return SocialExposure;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SymbolButton.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/SymbolButton.jsx                                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return SymbolButton;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);

var SymbolButton = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(SymbolButton, _React$Component);

  var _super = _createSuper(SymbolButton);

  /* 
    @prop id - id of the symbol
    @prop name - name of the symbol (TESTING PURPOSES)
  */
  function SymbolButton(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleClick = function () {
      var _this$props = _this.props,
          game = _this$props.game,
          player = _this$props.player,
          stage = _this$props.stage,
          name = _this$props.name,
          handleButtonSelect = _this$props.handleButtonSelect;

      if (!player.get("submitted")) {
        player.set("symbolSelected", name);
        handleButtonSelect(name);
      }
    };

    return _this;
  } // When button is selected, player sets the id of the button he selected


  var _proto = SymbolButton.prototype;

  _proto.render = function () {
    function render() {
      var _this$props2 = this.props,
          game = _this$props2.game,
          stage = _this$props2.stage,
          player = _this$props2.player,
          name = _this$props2.name,
          selected = _this$props2.selected,
          totalSymbols = _this$props2.totalSymbols;
      var size = 100 / totalSymbols;
      return /*#__PURE__*/React.createElement("div", {
        className: "symbol-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: (selected ? "symbolButtonSelected" : "symbolButtonUnselected") + " " + (player.get("submitted") ? "noHover" : ""),
        onClick: this.handleClick
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/symbols/tangrams/" + name + ".png",
        style: {
          maxWidth: "100%",
          maxHeight: "100%"
        }
      })));
    }

    return render;
  }();

  return SymbolButton;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Task.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/Task.jsx                                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return Task;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var TaskResponse;
module.link("./TaskResponse", {
  "default": function (v) {
    TaskResponse = v;
  }
}, 1);

var Task = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Task, _React$Component);

  var _super = _createSuper(Task);

  function Task() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Task.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          stage = _this$props.stage,
          player = _this$props.player,
          game = _this$props.game;
      return /*#__PURE__*/React.createElement("div", {
        className: "task-container"
      }, /*#__PURE__*/React.createElement(TaskResponse, this.props));
    }

    return render;
  }();

  return Task;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TaskResponse.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/TaskResponse.jsx                                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return TaskResponse;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Slider;
module.link("meteor/empirica:slider", {
  "default": function (v) {
    Slider = v;
  }
}, 1);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 2);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 3);
var SymbolButton;
module.link("./SymbolButton.jsx", {
  "default": function (v) {
    SymbolButton = v;
  }
}, 4);

var TaskResponse = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(TaskResponse, _React$Component);

  var _super = _createSuper(TaskResponse);

  function TaskResponse(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          stage = _this$props.stage,
          player = _this$props.player,
          game = _this$props.game;
      event.preventDefault();
      stage.append("log", {
        verb: "playerSubmitted",
        subjectId: player.id,
        object: true,
        at: moment(TimeSync.serverTime(null, 1000))
      });
      player.set("submitted", true);
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    };

    _this.handleReconsider = function (event) {
      var _this$props2 = _this.props,
          stage = _this$props2.stage,
          player = _this$props2.player,
          game = _this$props2.game;
      event.preventDefault();
      player.set("submitted", false);
      stage.append("log", {
        verb: "playerReconsidered",
        subjectId: player.id,
        object: true,
        at: moment(TimeSync.serverTime(null, 1000))
      });
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000))); // this.setState({selectedButton: ""});
    };

    _this.handleButtonSelect = function (symbolName) {
      var _this$props3 = _this.props,
          stage = _this$props3.stage,
          player = _this$props3.player,
          game = _this$props3.game; // stage.set("selectedButton", symbolName);

      _this.setState({
        selectedButton: symbolName
      });

      stage.append("log", {
        verb: "selectingSymbol",
        subjectId: player.id,
        object: symbolName,
        at: moment(TimeSync.serverTime(null, 1000))
      });
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    };

    _this.state = {
      selectedButton: props.player.get("symbolSelected") | ""
    };
    return _this;
  }

  var _proto = TaskResponse.prototype;

  _proto.renderSubmitted = function () {
    function renderSubmitted() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, "Waiting on other players..."), "Please wait until all players are ready. If you would like to reconsider your answer, click on the reconsider button.");
    }

    return renderSubmitted;
  }();

  _proto.renderSlider = function () {
    function renderSlider() {
      var player = this.props.player;
      var value = player.round.get("value");
      return /*#__PURE__*/React.createElement(Slider, {
        min: 0,
        max: 1,
        stepSize: 0.01,
        labelStepSize: 0.25,
        onChange: this.handleChange,
        value: value,
        hideHandleOnEmpty: true
      });
    }

    return renderSlider;
  }();

  _proto.renderButton = function () {
    function renderButton() {
      var _this2 = this;

      var _this$props4 = this.props,
          stage = _this$props4.stage,
          player = _this$props4.player,
          game = _this$props4.game; // const task = stage.get("task");

      var selectedSymbol = player.get("symbolSelected");
      var task = player.get("" + stage.displayName);
      return task.map(function (symbol) {
        return /*#__PURE__*/React.createElement(SymbolButton, {
          key: symbol,
          name: symbol,
          handleButtonSelect: function (symbolName) {
            return _this2.handleButtonSelect(symbolName);
          },
          selected: selectedSymbol === symbol,
          stage: stage,
          game: game,
          player: player,
          totalSymbols: task.length
        });
      });
    }

    return renderButton;
  }();

  _proto.render = function () {
    function render() {
      var _this$props5 = this.props,
          stage = _this$props5.stage,
          round = _this$props5.round,
          player = _this$props5.player,
          game = _this$props5.game;
      var selected = player.get("symbolSelected");
      var submitted = player.get("submitted"); // Create a list of dots to show how many players submitted

      var playersSubmitted = round.get("numPlayersSubmitted"); // const numActivePlayers = game.players.filter(p => p.online === true && !p.get("inactive")).length;

      var numActivePlayers = game.players.filter(function (p) {
        return !p.get("inactive");
      }).length;
      var playersNotSubmitted = numActivePlayers - playersSubmitted;
      var filledDots = [];
      var unfilledDots = [];

      for (var i = 0; i < playersSubmitted; i++) {
        filledDots.push( /*#__PURE__*/React.createElement("span", {
          className: "filled-dot"
        }));
      }

      for (var _i = 0; _i < playersNotSubmitted; _i++) {
        unfilledDots.push( /*#__PURE__*/React.createElement("span", {
          className: "empty-dot"
        }));
      } // If the player already submitted, don't show the slider or submit button


      var disabled = player.get("submitted");
      return /*#__PURE__*/React.createElement("div", {
        className: "task-response-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "task-response-header"
      }, /*#__PURE__*/React.createElement("p", {
        className: "header"
      }, " MY CARD"), /*#__PURE__*/React.createElement("div", {
        className: "submission-dots-container"
      }, /*#__PURE__*/React.createElement("p", {
        className: "header"
      }, " SUBMITTED ANSWERS "), filledDots, unfilledDots)), /*#__PURE__*/React.createElement("div", {
        className: "task-response-body"
      }, /*#__PURE__*/React.createElement("div", {
        className: "task-response"
      }, this.renderButton())), /*#__PURE__*/React.createElement("div", {
        className: "button-container"
      }, /*#__PURE__*/React.createElement("form", {
        onSubmit: this.handleSubmit,
        style: {
          opacity: submitted ? 0 : 1
        }
      }, /*#__PURE__*/React.createElement("button", {
        className: !selected || submitted ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !selected || submitted ? true : false,
        type: "submit"
      }, " Submit ")), /*#__PURE__*/React.createElement("form", {
        onSubmit: this.handleReconsider,
        style: {
          opacity: !submitted ? 0 : 1
        }
      }, /*#__PURE__*/React.createElement("button", {
        className: !submitted ? "arrow-button button-reconsider-disabled" : "arrow-button button-reconsider",
        disabled: !submitted ? true : false
      }, " Reconsider "))));
    }

    return render;
  }();

  return TaskResponse;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TaskTimer.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/TaskTimer.jsx                                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Timer;
module.link("./Timer.jsx", {
  "default": function (v) {
    Timer = v;
  }
}, 1);
var StageTimeWrapper;
module.link("meteor/empirica:core", {
  StageTimeWrapper: function (v) {
    StageTimeWrapper = v;
  }
}, 2);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 3);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 4);
var TaskWarningModal;
module.link("./TaskWarningModal", {
  "default": function (v) {
    TaskWarningModal = v;
  }
}, 5);

var taskTimer = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(taskTimer, _React$Component);

  var _super = _createSuper(taskTimer);

  function taskTimer(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.onOpenModal = function () {
      _this.setState({
        modalIsOpen: true,
        warningShown: true
      });
    };

    _this.onCloseModal = function () {
      var player = _this.props.player;

      _this.setState({
        modalIsOpen: false
      });

      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    };

    _this.state = {
      modalIsOpen: false,
      warningShown: false
    };
    return _this;
  }

  var _proto = taskTimer.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          game = _this$props.game,
          round = _this$props.round,
          stage = _this$props.stage,
          player = _this$props.player,
          remainingSeconds = _this$props.remainingSeconds;
      var taskWarningTime = game.treatment.taskWarningTime;
      var classes = ["timer"];

      if (remainingSeconds <= 5) {
        classes.push("lessThan5");
      } else if (remainingSeconds <= 10) {
        classes.push("lessThan10");
      }

      if (remainingSeconds <= taskWarningTime && !this.state.modalIsOpen && !this.state.warningShown) {
        this.onOpenModal();
      }

      return /*#__PURE__*/React.createElement("div", {
        className: classes.join(" "),
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
        className: "results-text",
        style: {
          margin: "0px 0px"
        }
      }, "Time Left for Task: ", remainingSeconds)), this.state.modalIsOpen && /*#__PURE__*/React.createElement(TaskWarningModal, {
        game: game,
        player: player,
        onCloseModal: this.onCloseModal
      }));
    }

    return render;
  }();

  return taskTimer;
}(React.Component);

module.exportDefault(TaskTimer = StageTimeWrapper(taskTimer));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TaskWarningModal.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/TaskWarningModal.jsx                                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return TaskWarningModal;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);

var TaskWarningModal = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(TaskWarningModal, _React$Component);

  var _super = _createSuper(TaskWarningModal);

  function TaskWarningModal() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = TaskWarningModal.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          game = _this$props.game,
          player = _this$props.player,
          onCloseModal = _this$props.onCloseModal;
      return /*#__PURE__*/React.createElement("div", {
        className: "dark-bg",
        onClick: onCloseModal
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal-centered"
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal"
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal-content"
      }, "Warning, this round is ending in 30 seconds. Please submit your final answer."), /*#__PURE__*/React.createElement("button", {
        className: "modal-button",
        onClick: onCloseModal
      }, "Okay"))));
    }

    return render;
  }();

  return TaskWarningModal;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Timer.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/game/Timer.jsx                                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
var StageTimeWrapper;
module.link("meteor/empirica:core", {
  StageTimeWrapper: function (v) {
    StageTimeWrapper = v;
  }
}, 0);
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 1);

var timer = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(timer, _React$Component);

  var _super = _createSuper(timer);

  function timer() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = timer.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          remainingSeconds = _this$props.remainingSeconds,
          stage = _this$props.stage;
      var classes = ["timer"];

      if (remainingSeconds <= 5) {
        classes.push("lessThan5");
      } else if (remainingSeconds <= 10) {
        classes.push("lessThan10");
      }

      return /*#__PURE__*/React.createElement("div", {
        className: classes.join(" "),
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }
      }, stage.name === "Result" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
        className: "results-text"
      }, "Next Round In"), /*#__PURE__*/React.createElement("h1", {
        className: "results-text",
        style: {
          margin: "0px 0px"
        }
      }, remainingSeconds)) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
        className: "results-text",
        style: {
          margin: "0px 0px"
        }
      }, "Time Left for Task: ", remainingSeconds)));
    }

    return render;
  }();

  return timer;
}(React.Component);

module.exportDefault(Timer = StageTimeWrapper(timer));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"intro":{"english-screening":{"EnglishQuestions.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/english-screening/EnglishQuestions.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  englishScreeningQuestions: function () {
    return englishScreeningQuestions;
  }
});
var englishScreeningQuestions = [{
  passage: "The car salesman was trying to remember who he promised the special deal this morning.",
  question: "Was the car salesman trying to remember the price of the new car?",
  answer: "No",
  question_number: "1"
}, {
  passage: "The prosecutor had no idea who the lawyer would bring as the expert witness.",
  question: "Was the prosecutor clueless about the identity of the expert witness?",
  answer: "Yes",
  question_number: "2"
}, {
  passage: "The dean tried to figure out why the professor persistently recommended the lecturer who was not qualified for the job.",
  question: "Was the dean puzzled by the professor's recommendation?",
  answer: "Yes",
  question_number: "3"
}, {
  passage: "The surgeon tried to figure out who was assisting the pathologist during the lab tests.",
  question: "Did the surgeon want to know the identity of the pathologist's assistant?",
  answer: "Yes",
  question_number: "4"
}, {
  passage: "The psychology student tried to remember who demonstrated what when.",
  question: "Did the psychology student try to demonstrate something?",
  answer: "No",
  question_number: "5"
}, {
  passage: "The dancer could not figure out what annoyed the choreographer so much recently.",
  question: "Was the dancer annoyed recently?",
  answer: "No",
  question_number: "6"
}, {
  passage: "The statistician tried to figure out who won what.",
  question: "Did the statistician try to win something?",
  answer: "No",
  question_number: "7"
}, {
  passage: "The seamstress tried to remember when she promised the client to finish the dress.",
  question: "Did the seamstress try to remember when the deadline for an order was?",
  answer: "Yes",
  question_number: "8"
}, {
  passage: "The athlete was asking his doctor about what medicine he should take for the pain and how often.",
  question: "Was the doctor asking the athlete about the frequency of his pains?",
  answer: "No",
  question_number: "9"
}, {
  passage: "The trainer could not understand why the tigers were misbehaving.",
  question: "Was the trainer puzzled by the tigers' behavior?",
  answer: "Yes",
  question_number: "10"
} // {
//   passage: "The house owner came downstairs to find out what made such a racket but she didn't see anything suspicious.",
//   question: "Did the house owner make a racket?",
//   answer: "No",
//   question_number: "11",
// },
// {
//   passage: "The students could not wait to find out what surprise the teacher was talking about in class.",
//   question: "Were the students preparing a surprise for the teacher?",
//   answer: "No",
//   question_number: "12",
// },
// {
//   passage: "The secretary for the clinic tried to figure out who prescribed what.",
//   question: "Did the secretary try to prescribe something?",
//   answer: "No",
//   question_number: "13",
// },
// {
//   passage: "The film director could not remember who played the lead role in the film his colleague just finished shooting.",
//   question: "Was the film director trying to remember something about his colleague's film?",
//   answer: "Yes",
//   question_number: "14",
// },
// {
//   passage: "The general was trying to decide when would be the best time to attack.",
//   question: "Was the general planning an attack?",
//   answer: "Yes",
//   question_number: "15",
// },
// {
//   passage: "The writer could not decide who the main character would marry in the end of the novel.",
//   question: "Was the writer trying to figure out the ending of the novel?",
//   answer: "Yes",
//   question_number: "16",
// },
// {
//   passage: "The student tried to find out why he got a bad grade on the test.",
//   question: "Did the student want to know the reason for a bad grade?",
//   answer: "Yes",
//   question_number: "17",
// },
// {
//   passage: "The telemarketer asked who the head of the household was, and the man just hung up the phone.",
//   question: "Did the telemarketer hang up the phone?",
//   answer: "No",
//   question_number: "18",
// },
// {
//   passage: "The administrator tried to remember what who donated to whom.",
//   question: "Did the administrator try to donate something?",
//   answer: "No",
//   question_number: "19",
// },
// {
//   passage: "The farmer was trying to decide what achievement to submit to the fair this year.",
//   question: "Did the farmer decide not to go to the fair this year?",
//   answer: "No",
//   question_number: "20",
// },
];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"EnglishScreen.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/english-screening/EnglishScreen.jsx                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return EnglishScreen;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var englishScreeningQuestions;
module.link("./EnglishQuestions", {
  englishScreeningQuestions: function (v) {
    englishScreeningQuestions = v;
  }
}, 1);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 2);

var Question = function (_ref) {
  var selected = _ref.selected,
      passage = _ref.passage,
      question = _ref.question,
      question_number = _ref.question_number,
      name = _ref.name,
      onChange = _ref.onChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "question-section"
  }, /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-question"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: "bold"
    }
  }, "Sentence ", question_number, ": "), passage), /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-question"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: "bold"
    }
  }, "Question ", question_number, ": "), question), /*#__PURE__*/React.createElement("div", {
    className: "english-screening-buttons"
  }, /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-radio",
    style: {
      marginRight: "15px"
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "quiz-button",
    type: "radio",
    name: name,
    value: "Yes",
    checked: selected === "Yes",
    onChange: onChange
  }), "Yes"), /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-radio"
  }, /*#__PURE__*/React.createElement("input", {
    className: "quiz-button",
    type: "radio",
    name: name,
    value: "No",
    checked: selected === "No",
    onChange: onChange
  }), "No")), /*#__PURE__*/React.createElement("p", null, "----------------------------------------------------------------------------------------------------"));
};

var EnglishScreen = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(EnglishScreen, _React$Component);

  var _super = _createSuper(EnglishScreen);

  function EnglishScreen() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      q8: "",
      q9: "",
      q10: ""
    };

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.passCorrectThreshold = function () {
      var player = _this.props.player;
      var numCorrect = 0;
      var totalNumQuestions = englishScreeningQuestions.length;
      englishScreeningQuestions.forEach(function (questionSet) {
        var passage = questionSet.passage,
            question = questionSet.question,
            answer = questionSet.answer,
            question_number = questionSet.question_number;

        if (_this.state["q" + question_number] === answer) {
          numCorrect += 1;
        }
      });
      player.set("englishScreenPercentage", numCorrect / totalNumQuestions);
      return numCorrect / totalNumQuestions >= 0.8;
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game,
          player = _this$props.player;
      event.preventDefault();
      player.set("name", player.id);

      if (_this.passCorrectThreshold()) {
        player.set("englishScreenPassed", _this.state);
        onNext();
      } else {
        player.set("englishScreenFailed", _this.state);
        player.exit("failedEnglishScreen");
      }
    };

    return _this;
  }

  var _proto = EnglishScreen.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var player = this.props.player;
      player.set("passedPreQual", false);
    }

    return componentDidMount;
  }();

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var allSelected = Object.keys(this.state).every(function (key) {
        return _this2.state[key] !== "";
      });
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " Questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("h2", null, " This game will require heavy communication in English with other players. Thus, we will begin with a quick questionnaire to test your English fluency. "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "Instructions:"), /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("p", null, "1. Read the target sentence")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("p", null, "2. Answer the question immediately following"))), /*#__PURE__*/React.createElement("div", null, "Because some users answer questions randomly, we will reject users with error rates of 25% or larger. Consequently, if you cannot answer 75% of the questions correctly, please do not fill out the survey."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", null, "Note: ", /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, "Please read the sentence "), " before answering the question!"), englishScreeningQuestions.map(function (questionSet) {
        var passage = questionSet.passage,
            question = questionSet.question,
            answer = questionSet.answer,
            question_number = questionSet.question_number;
        return /*#__PURE__*/React.createElement(Question, {
          key: question_number,
          selected: _this2.state["q" + question_number],
          name: "q" + question_number,
          passage: passage,
          question: question,
          question_number: question_number,
          onChange: _this2.handleChange
        });
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: !allSelected ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !allSelected,
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return EnglishScreen;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"network-survey":{"NetworkSurveyContactsEC.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/network-survey/NetworkSurveyContactsEC.jsx                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return NetworkSurveyContactsEC;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);
var HTMLSelect;
module.link("@blueprintjs/core", {
  HTMLSelect: function (v) {
    HTMLSelect = v;
  }
}, 2);

var DropdownSelect = function (_ref) {
  var id = _ref.id,
      name = _ref.name,
      handleChange = _ref.handleChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "bp4-html-select"
  }, /*#__PURE__*/React.createElement("select", {
    className: "dropdown-select-input",
    defaultValue: "",
    id: id,
    name: name,
    onChange: handleChange,
    required: true
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disbaled: "true",
    hidden: true
  }), /*#__PURE__*/React.createElement("option", {
    value: "EC"
  }, "Especially Close"), /*#__PURE__*/React.createElement("option", {
    value: "S"
  }, "Strangers"), /*#__PURE__*/React.createElement("option", {
    value: "M"
  }, "Neither")));
};

var NetworkSurveyContactsEC = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NetworkSurveyContactsEC, _React$Component);

  var _super = _createSuper(NetworkSurveyContactsEC);

  function NetworkSurveyContactsEC(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player;
      event.preventDefault();
      var _this$state = _this.state,
          tie12 = _this$state.tie12,
          tie13 = _this$state.tie13,
          tie14 = _this$state.tie14,
          tie15 = _this$state.tie15,
          tie23 = _this$state.tie23,
          tie24 = _this$state.tie24,
          tie25 = _this$state.tie25,
          tie34 = _this$state.tie34,
          tie35 = _this$state.tie35,
          tie45 = _this$state.tie45;
      var networkSurveyResponse = {
        tie12: tie12,
        tie13: tie13,
        tie14: tie14,
        tie15: tie15,
        tie23: tie23,
        tie24: tie24,
        tie25: tie25,
        tie34: tie34,
        tie35: tie35,
        tie45: tie45
      };
      player.set("networkResponseContactsEC", networkSurveyResponse); // TODO: log player response to survey question

      onNext();
    };

    var _this$props$player$ge = _this.props.player.get("networkResponse1"),
        name1 = _this$props$player$ge.name1,
        name2 = _this$props$player$ge.name2,
        name3 = _this$props$player$ge.name3,
        name4 = _this$props$player$ge.name4,
        name5 = _this$props$player$ge.name5;

    _this.state = {
      tie12: "",
      tie13: "",
      tie14: "",
      tie15: "",
      tie23: "",
      tie24: "",
      tie25: "",
      tie34: "",
      tie35: "",
      tie45: "",
      name1: name1,
      name2: name2,
      name3: name3,
      name4: name4,
      name5: name5
    };
    return _this;
  }

  var _proto = NetworkSurveyContactsEC.prototype;

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          game = _this$props2.game,
          round = _this$props2.round,
          stage = _this$props2.stage,
          player = _this$props2.player;
      var _this$state2 = this.state,
          tie12 = _this$state2.tie12,
          tie13 = _this$state2.tie13,
          tie14 = _this$state2.tie14,
          tie15 = _this$state2.tie15,
          tie23 = _this$state2.tie23,
          tie24 = _this$state2.tie24,
          tie25 = _this$state2.tie25,
          tie34 = _this$state2.tie34,
          tie35 = _this$state2.tie35,
          tie45 = _this$state2.tie45;
      var filledOut = tie12 && tie13 && tie14 && tie15 && tie23 && tie24 && tie25 && tie34 && tie35 && tie45;
      var _this$state3 = this.state,
          name1 = _this$state3.name1,
          name2 = _this$state3.name2,
          name3 = _this$state3.name3,
          name4 = _this$state3.name4,
          name5 = _this$state3.name5;
      return /*#__PURE__*/React.createElement("div", {
        className: "network-survey-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "network-survey-header"
      }, /*#__PURE__*/React.createElement("p", null, "THIS QUESTION ASKS FOR YOUR VIEW OF CONNECTIONS AMONG THE PEOPLE YOU NAMED. YOU ARE ALMOST FINISHED.")), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png"
      }), /*#__PURE__*/React.createElement("div", {
        className: "network-survey-body"
      }, /*#__PURE__*/React.createElement("p", null, "The people you cited on the previous page are listed in the table below. Next, please think about connections between the people you mentioned. Some of them can be total strangers in the sense that they wouldn't recognize the other person if they bumped into one other on the street. Some of them can be especially close, as close or closer to each other as they are to you. Please select the appropriate box to describe how close the people you know are with each other."), /*#__PURE__*/React.createElement("ul", {
        className: "network-list"
      }, /*#__PURE__*/React.createElement("li", null, "\u201CEspecially Close\u201D indicates this is one of your closest personal contacts."), /*#__PURE__*/React.createElement("li", null, "\"Strangers\" indicates that they rarely work together, are total strangers as far as you know, or do not enjoy one another's company."), /*#__PURE__*/React.createElement("li", null, "\u201CNeither\" indicates this is someone you don't mind working with, but have no wish to develop a friendship.")), /*#__PURE__*/React.createElement("form", {
        className: "network-form",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("table", {
        className: "name-matrix-table"
      }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "How close is __ with __ ?"), /*#__PURE__*/React.createElement("th", null, name2), /*#__PURE__*/React.createElement("th", null, name3), /*#__PURE__*/React.createElement("th", null, name4), /*#__PURE__*/React.createElement("th", null, name5)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " ", name1), _.times(4, function (i) {
        return (
          /*#__PURE__*/
          // tie12, tie13, tie14, tie15
          React.createElement("td", {
            key: "tie1" + (i + 2)
          }, /*#__PURE__*/React.createElement(DropdownSelect, {
            id: "tie1" + (i + 2),
            name: "tie1" + (i + 2),
            handleChange: _this2.handleChange
          }), " ")
        );
      })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " ", name2), _.times(4, function (i) {
        // tie23, tie24, tie25
        return i > 0 ? /*#__PURE__*/React.createElement("td", {
          key: "tie2" + (i + 2)
        }, /*#__PURE__*/React.createElement(DropdownSelect, {
          id: "tie2" + (i + 2),
          name: "tie2" + (i + 2),
          handleChange: _this2.handleChange
        }), " ") : /*#__PURE__*/React.createElement("td", null);
      })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " ", name3), _.times(4, function (i) {
        // tie34, tie35
        return i > 1 ? /*#__PURE__*/React.createElement("td", {
          key: "tie3" + (i + 2)
        }, /*#__PURE__*/React.createElement(DropdownSelect, {
          id: "tie3" + (i + 2),
          name: "tie3" + (i + 2),
          handleChange: _this2.handleChange
        }), " ") : /*#__PURE__*/React.createElement("td", null);
      })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " ", name4), _.times(4, function (i) {
        // tie45
        return i > 2 ? /*#__PURE__*/React.createElement("td", {
          key: "tie4" + (i + 2)
        }, /*#__PURE__*/React.createElement(DropdownSelect, {
          id: "tie4" + (i + 2),
          name: "tie4" + (i + 2),
          handleChange: _this2.handleChange
        }), " ") : /*#__PURE__*/React.createElement("td", null);
      })))), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut,
        type: "submit"
      }, " Submit")))));
    }

    return render;
  }();

  return NetworkSurveyContactsEC;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"NetworkSurveyContactsFrequency.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/network-survey/NetworkSurveyContactsFrequency.jsx                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return NetworkSurveyContactsFrequency;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);
var HTMLSelect;
module.link("@blueprintjs/core", {
  HTMLSelect: function (v) {
    HTMLSelect = v;
  }
}, 2);

var DropdownSelect = function (_ref) {
  var id = _ref.id,
      name = _ref.name,
      handleChange = _ref.handleChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "bp4-html-select"
  }, /*#__PURE__*/React.createElement("select", {
    className: "dropdown-select-input",
    defaultValue: "",
    id: id,
    name: name,
    onChange: handleChange,
    required: true
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disbaled: "true",
    hidden: true
  }), /*#__PURE__*/React.createElement("option", {
    value: "daily"
  }, "Daily"), /*#__PURE__*/React.createElement("option", {
    value: "weekly"
  }, "Weekly"), /*#__PURE__*/React.createElement("option", {
    value: "lessoften"
  }, "Less often")));
};

var NetworkSurveyContactsFrequency = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NetworkSurveyContactsFrequency, _React$Component);

  var _super = _createSuper(NetworkSurveyContactsFrequency);

  function NetworkSurveyContactsFrequency(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player;
      event.preventDefault();
      var _this$state = _this.state,
          tie12 = _this$state.tie12,
          tie13 = _this$state.tie13,
          tie14 = _this$state.tie14,
          tie15 = _this$state.tie15,
          tie23 = _this$state.tie23,
          tie24 = _this$state.tie24,
          tie25 = _this$state.tie25,
          tie34 = _this$state.tie34,
          tie35 = _this$state.tie35,
          tie45 = _this$state.tie45;
      var networkSurveyResponse = {
        tie12: tie12,
        tie13: tie13,
        tie14: tie14,
        tie15: tie15,
        tie23: tie23,
        tie24: tie24,
        tie25: tie25,
        tie34: tie34,
        tie35: tie35,
        tie45: tie45
      };
      player.set("networkResponseContactsFrequency", networkSurveyResponse);
      player.set("networkResponse3", networkSurveyResponse); // TODO: log player response to survey question

      onNext();
    };

    var _this$props$player$ge = _this.props.player.get("networkResponse1"),
        name1 = _this$props$player$ge.name1,
        name2 = _this$props$player$ge.name2,
        name3 = _this$props$player$ge.name3,
        name4 = _this$props$player$ge.name4,
        name5 = _this$props$player$ge.name5;

    _this.state = {
      tie12: "",
      tie13: "",
      tie14: "",
      tie15: "",
      tie23: "",
      tie24: "",
      tie25: "",
      tie34: "",
      tie35: "",
      tie45: "",
      name1: name1,
      name2: name2,
      name3: name3,
      name4: name4,
      name5: name5
    };
    return _this;
  }

  var _proto = NetworkSurveyContactsFrequency.prototype;

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          game = _this$props2.game,
          round = _this$props2.round,
          stage = _this$props2.stage,
          player = _this$props2.player;
      var _this$state2 = this.state,
          tie12 = _this$state2.tie12,
          tie13 = _this$state2.tie13,
          tie14 = _this$state2.tie14,
          tie15 = _this$state2.tie15,
          tie23 = _this$state2.tie23,
          tie24 = _this$state2.tie24,
          tie25 = _this$state2.tie25,
          tie34 = _this$state2.tie34,
          tie35 = _this$state2.tie35,
          tie45 = _this$state2.tie45;
      var filledOut = tie12 && tie13 && tie14 && tie15 && tie23 && tie24 && tie25 && tie34 && tie35 && tie45;
      var _this$state3 = this.state,
          name1 = _this$state3.name1,
          name2 = _this$state3.name2,
          name3 = _this$state3.name3,
          name4 = _this$state3.name4,
          name5 = _this$state3.name5;
      return /*#__PURE__*/React.createElement("div", {
        className: "network-survey-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "network-survey-header"
      }, /*#__PURE__*/React.createElement("p", null, "THIS QUESTION ASKS FOR YOUR VIEW OF CONNECTIONS AMONG THE PEOPLE YOU NAMED. YOU ARE ALMOST FINISHED.")), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png"
      }), /*#__PURE__*/React.createElement("div", {
        className: "network-survey-body"
      }, /*#__PURE__*/React.createElement("p", null, "The people you cited on the previous page are listed in the table below. The task is to indicate how often the people you know communicate with each other."), /*#__PURE__*/React.createElement("ul", {
        className: "network-list"
      }, /*#__PURE__*/React.createElement("li", null, "\u201CDaily\u201D means that to the best of your knowledge, the two people communicate daily."), /*#__PURE__*/React.createElement("li", null, "\u201CWeekly\u201D indicates the two people usually interact and communicate on a weekly basis."), /*#__PURE__*/React.createElement("li", null, "\u201CLess often\u201D indicates, again, as best you know, that the two people communicate infrequently or not at all.")), /*#__PURE__*/React.createElement("form", {
        className: "network-form",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("table", {
        className: "name-matrix-table"
      }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "How often does __ communicate with __ ?"), /*#__PURE__*/React.createElement("th", null, name2), /*#__PURE__*/React.createElement("th", null, name3), /*#__PURE__*/React.createElement("th", null, name4), /*#__PURE__*/React.createElement("th", null, name5)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " ", name1), _.times(4, function (i) {
        return (
          /*#__PURE__*/
          // tie12, tie13, tie14, tie15
          React.createElement("td", {
            key: "tie1" + (i + 2)
          }, /*#__PURE__*/React.createElement(DropdownSelect, {
            id: "tie1" + (i + 2),
            name: "tie1" + (i + 2),
            handleChange: _this2.handleChange
          }), " ")
        );
      })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " ", name2), _.times(4, function (i) {
        // tie23, tie24, tie25
        return i > 0 ? /*#__PURE__*/React.createElement("td", {
          key: "tie2" + (i + 2)
        }, /*#__PURE__*/React.createElement(DropdownSelect, {
          id: "tie2" + (i + 2),
          name: "tie2" + (i + 2),
          handleChange: _this2.handleChange
        }), " ") : /*#__PURE__*/React.createElement("td", null);
      })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " ", name3), _.times(4, function (i) {
        // tie34, tie35
        return i > 1 ? /*#__PURE__*/React.createElement("td", {
          key: "tie3" + (i + 2)
        }, /*#__PURE__*/React.createElement(DropdownSelect, {
          id: "tie3" + (i + 2),
          name: "tie3" + (i + 2),
          handleChange: _this2.handleChange
        }), " ") : /*#__PURE__*/React.createElement("td", null);
      })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " ", name4), _.times(4, function (i) {
        // tie45
        return i > 2 ? /*#__PURE__*/React.createElement("td", {
          key: "tie4" + (i + 2)
        }, /*#__PURE__*/React.createElement(DropdownSelect, {
          id: "tie4" + (i + 2),
          name: "tie4" + (i + 2),
          handleChange: _this2.handleChange
        }), " ") : /*#__PURE__*/React.createElement("td", null);
      })))), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut,
        type: "submit"
      }, " Submit")))));
    }

    return render;
  }();

  return NetworkSurveyContactsFrequency;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"NetworkSurveyGenderInterpreter.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/network-survey/NetworkSurveyGenderInterpreter.jsx                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return NetworkSurveyGenderInterpreter;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var _;

module.link("lodash", {
  "default": function (v) {
    _ = v;
  }
}, 2);

var GenderButtonSet = function (_ref) {
  var contactName = _ref.contactName,
      tie = _ref.tie,
      genders = _ref.genders,
      genderSelected = _ref.genderSelected,
      handleGenderSelect = _ref.handleGenderSelect;
  return /*#__PURE__*/React.createElement("div", {
    className: "relationship-input-row",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "relationship-input-label",
    htmlFor: tie
  }, " ", /*#__PURE__*/React.createElement("p", null, contactName), " "), /*#__PURE__*/React.createElement("div", {
    className: "relationship-buttons-container"
  }, genders.map(function (gender, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: contactName + "-" + gender,
      className: gender === genderSelected ? "network-relationship-button selected" : "network-relationship-button",
      onClick: function () {
        return handleGenderSelect(tie, gender);
      }
    }, " ", gender, " ");
  })));
}; // This section asks the user what their personal emotional closeness is to the listed 5 people.


var NetworkSurveyGenderInterpreter = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NetworkSurveyGenderInterpreter, _React$Component);

  var _super = _createSuper(NetworkSurveyGenderInterpreter);

  function NetworkSurveyGenderInterpreter(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleGenderSelect = function (tie, gender) {
      _this.state[tie] = gender;
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player;
      var networkSurveyResponse = {
        tie1: _this.state.tie1,
        tie2: _this.state.tie2,
        tie3: _this.state.tie3,
        tie4: _this.state.tie4,
        tie5: _this.state.tie5
      };
      event.preventDefault(); // TODO: log player response to survey question

      player.set("networkResponseGenderInterpreter", networkSurveyResponse);
      onNext();
    };

    var _this$props$player$ge = _this.props.player.get("networkResponse1"),
        name1 = _this$props$player$ge.name1,
        name2 = _this$props$player$ge.name2,
        name3 = _this$props$player$ge.name3,
        name4 = _this$props$player$ge.name4,
        name5 = _this$props$player$ge.name5;

    _this.state = {
      tie1: "",
      tie2: "",
      tie3: "",
      tie4: "",
      tie5: "",
      name1: name1,
      name2: name2,
      name3: name3,
      name4: name4,
      name5: name5
    };
    return _this;
  }

  var _proto = NetworkSurveyGenderInterpreter.prototype;

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var player = this.props.player;
      var filledOut = this.state.tie1 && this.state.tie2 && this.state.tie3 && this.state.tie4 && this.state.tie5;
      var _this$state = this.state,
          name1 = _this$state.name1,
          name2 = _this$state.name2,
          name3 = _this$state.name3,
          name4 = _this$state.name4,
          name5 = _this$state.name5;
      var names = [name1, name2, name3, name4, name5];
      var genders = ["Male", "Female", "N/A"];
      return /*#__PURE__*/React.createElement("div", {
        className: "network-survey-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "network-survey-header"
      }, /*#__PURE__*/React.createElement("p", null, "WHAT ARE THE GENDERS OF THE PEOPLE IN YOUR NETWORK?")), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png"
      }), /*#__PURE__*/React.createElement("div", {
        className: "network-survey-body"
      }, /*#__PURE__*/React.createElement("p", null, "The people you cited on the previous page are listed in the table below. Please select the option next to each name that best describes each listed person's gender. "), /*#__PURE__*/React.createElement("ul", {
        className: "network-list"
      }), /*#__PURE__*/React.createElement("form", {
        className: "network-form",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("p", null, " What is the gender of each person? "), names.map(function (name, i) {
        return /*#__PURE__*/React.createElement(GenderButtonSet, {
          key: i,
          contactName: name,
          tie: "tie" + (i + 1),
          genders: genders,
          genderSelected: _this2.state["tie" + (i + 1)],
          handleGenderSelect: _this2.handleGenderSelect
        });
      }), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut,
        type: "submit"
      }, " Next Page")))));
    }

    return render;
  }();

  return NetworkSurveyGenderInterpreter;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"NetworkSurveyPersonalQuestions.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/network-survey/NetworkSurveyPersonalQuestions.jsx                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return NetworkSurveyPersonalQuestions;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var _;

module.link("lodash", {
  "default": function (v) {
    _ = v;
  }
}, 2);
var elevationClass;
module.link("@blueprintjs/core/lib/esm/common/classes", {
  elevationClass: function (v) {
    elevationClass = v;
  }
}, 3);

var Radio = function (_ref) {
  var selected = _ref.selected,
      name = _ref.name,
      value = _ref.value,
      label = _ref.label,
      onChange = _ref.onChange;
  return /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange,
    required: true,
    style: {
      marginRight: "5px"
    }
  }), label);
};

var AgeQuestionSet = function (_ref2) {
  var ageValue = _ref2.ageValue,
      handleAgeChange = _ref2.handleAgeChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "personal-input-container-row"
  }, /*#__PURE__*/React.createElement("p", null, " What is your age? "), /*#__PURE__*/React.createElement("input", {
    id: "age",
    type: "number",
    min: "0",
    max: "150",
    step: "1",
    dir: "auto",
    name: "age",
    value: ageValue,
    onChange: handleAgeChange,
    style: {
      height: "fit-content",
      margin: "0em 1em"
    },
    required: true
  }));
};

var GenderButtonSet = function (_ref3) {
  var genderSelected = _ref3.genderSelected,
      handleGenderSelect = _ref3.handleGenderSelect;
  var genders = ["Male", "Female", "N/A"];
  return /*#__PURE__*/React.createElement("div", {
    className: "personal-input-container-row"
  }, /*#__PURE__*/React.createElement("p", null, " What is your gender? "), /*#__PURE__*/React.createElement("div", {
    className: "relationship-buttons-container",
    style: {
      width: "30%"
    }
  }, genders.map(function (gender, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: "" + index,
      name: "gender",
      value: gender,
      className: gender === genderSelected ? "network-relationship-button selected" : "network-relationship-button",
      onClick: function () {
        return handleGenderSelect(gender);
      }
    }, " ", gender, " ");
  })));
};

var HispanicQuestionSet = function (_ref4) {
  var selected = _ref4.selected,
      handleIsHispanicChange = _ref4.handleIsHispanicChange;
  var options = ["No, not Spanish/Hispanic/Latino", "Yes, Mexican, Mexican-American, Chicano", "Yes, Puerto Rican", "Yes, Cuban", "Yes, other Spanish, Hispanic, or Latino"];
  return /*#__PURE__*/React.createElement("div", {
    className: "personal-input-container"
  }, /*#__PURE__*/React.createElement("p", null, "Are you Spanish, Hispanic, or Latino?"), /*#__PURE__*/React.createElement("div", {
    className: "personal-input-radio-list-container"
  }, options.map(function (option) {
    return /*#__PURE__*/React.createElement(Radio, {
      key: option,
      selected: selected,
      name: "isHispanic",
      value: option,
      label: option,
      onChange: handleIsHispanicChange
    });
  })));
};

var RaceSpecific = function (_ref5) {
  var race = _ref5.race,
      message = _ref5.message,
      textValue = _ref5.textValue,
      handleRaceChange = _ref5.handleRaceChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "personal-input-race-specific-container"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0px 0px",
      fontSize: "100%"
    }
  }, " ", message), /*#__PURE__*/React.createElement("input", {
    className: "personal-input-race-specific-input",
    id: "raceSpecific",
    type: "text",
    dir: "auto",
    name: "raceSpecific",
    value: textValue,
    onChange: handleRaceChange,
    required: true
  }));
};

var RaceQuestionSet = function (_ref6) {
  var selected = _ref6.selected,
      textValue = _ref6.textValue,
      handleRaceChange = _ref6.handleRaceChange;
  var options = ["White", "Black or African American", "Indian (American)", "Eskimo", "Aleut", "Chinese", "Filipino", "Hawaiian", "Korean", "Vietnamese", "Japanese", "Asian Indian", "Samoan", "Guamanian", "Other Asian or Pacific Islander", "Some other race", "Multiracial or biracial"];
  var askRaceSpecific = {
    "Indian (American)": "Please specify the name of the enrolled or principal tribe",
    "Other Asian or Pacific Islander": "Print race",
    "Some other race": "Print race",
    "Multiracial or biracial": "Print races"
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "personal-input-container"
  }, /*#__PURE__*/React.createElement("p", null, "What is your race/ethnicity?"), /*#__PURE__*/React.createElement("div", {
    className: "personal-input-radio-list-container"
  }, options.map(function (option) {
    return /*#__PURE__*/React.createElement("div", {
      className: "personal-input-radio-container"
    }, /*#__PURE__*/React.createElement(Radio, {
      key: option,
      selected: selected,
      name: "race",
      value: option,
      label: option,
      onChange: handleRaceChange
    }), selected in askRaceSpecific && option == selected ? /*#__PURE__*/React.createElement(RaceSpecific, {
      race: selected,
      message: askRaceSpecific[selected],
      textValue: textValue,
      handleRaceChange: handleRaceChange
    }) : null);
  })));
};

var EducationQuestionSet = function (_ref7) {
  var selected = _ref7.selected,
      handleEducationChange = _ref7.handleEducationChange;
  var options = ["High school graduate", "Some college, no degree", "Associate's degree", "Bachelor's degree", "Master's degree", "Professional degree (e.g., MD, JD)", "Doctoral degree"];
  return /*#__PURE__*/React.createElement("div", {
    className: "personal-input-container"
  }, /*#__PURE__*/React.createElement("p", null, "What is your highest education qualification?"), /*#__PURE__*/React.createElement("div", {
    className: "personal-input-radio-list-container"
  }, options.map(function (option) {
    return /*#__PURE__*/React.createElement(Radio, {
      key: option,
      selected: selected,
      name: "education",
      value: option,
      label: option,
      onChange: handleEducationChange
    });
  })));
};

var EmploymentQuestionSet = function (_ref8) {
  var selected = _ref8.selected,
      handleEmploymentChange = _ref8.handleEmploymentChange;
  var options = ["Yes", "No"];
  return /*#__PURE__*/React.createElement("div", {
    className: "personal-input-container"
  }, /*#__PURE__*/React.createElement("p", null, "Are you currently employed?"), /*#__PURE__*/React.createElement("div", {
    className: "personal-input-radio-list-container"
  }, options.map(function (option) {
    return /*#__PURE__*/React.createElement(Radio, {
      key: option,
      selected: selected,
      name: "employed",
      value: option,
      label: option,
      onChange: handleEmploymentChange
    });
  })));
};

var JobTitleQuestionSet = function (_ref9) {
  var textValue = _ref9.textValue,
      handleJobTitleChange = _ref9.handleJobTitleChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "personal-input-container"
  }, /*#__PURE__*/React.createElement("p", null, "What is your job title?"), /*#__PURE__*/React.createElement("input", {
    className: "personal-input-job-title-input",
    id: "jobTitle",
    type: "text",
    dir: "auto",
    name: "jobTitle",
    value: textValue,
    onChange: handleJobTitleChange,
    required: true
  }));
}; // This section asks the user what their personal emotional closeness is to the listed 5 people.


var NetworkSurveyPersonalQuestions = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NetworkSurveyPersonalQuestions, _React$Component);

  var _super = _createSuper(NetworkSurveyPersonalQuestions);

  function NetworkSurveyPersonalQuestions(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // Age, gender, race, level of education, employment, job title, how many people report to you

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleGenderSelect = function (gender) {
      _this.setState({
        gender: gender
      });
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player;
      var networkSurveyResponse = _this.state;
      event.preventDefault(); // TODO: log player response to survey question

      player.set("networkResponsePersonalQuestions", networkSurveyResponse);
      onNext();
    };

    _this.state = {
      age: "",
      gender: "",
      isHispanic: "",
      race: "",
      raceSpecific: "",
      education: "",
      employed: "",
      jobTitle: ""
    };
    return _this;
  }

  var _proto = NetworkSurveyPersonalQuestions.prototype;

  _proto.render = function () {
    function render() {
      var player = this.props.player;
      var filledOut = this.state.age && this.state.gender && this.state.race && this.state.education && this.state.employed;
      var _this$state = this.state,
          name1 = _this$state.name1,
          name2 = _this$state.name2,
          name3 = _this$state.name3,
          name4 = _this$state.name4,
          name5 = _this$state.name5;
      var names = [name1, name2, name3, name4, name5];
      return /*#__PURE__*/React.createElement("div", {
        className: "network-survey-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "network-survey-header"
      }, /*#__PURE__*/React.createElement("p", null, "PLEASE ANSWER SOME QUESTIONS ABOUT YOURSELF")), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png"
      }), /*#__PURE__*/React.createElement("div", {
        className: "network-survey-body"
      }, /*#__PURE__*/React.createElement("p", null, "Please answer some questions about yourself. "), /*#__PURE__*/React.createElement("ul", {
        className: "network-list"
      }), /*#__PURE__*/React.createElement("form", {
        className: "network-form",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement(AgeQuestionSet, {
        ageValue: this.state.age,
        handleAgeChange: this.handleChange
      }), /*#__PURE__*/React.createElement(GenderButtonSet, {
        genderSelected: this.state.gender,
        handleGenderSelect: this.handleGenderSelect
      }), /*#__PURE__*/React.createElement(HispanicQuestionSet, {
        selected: this.state.isHispanic,
        handleIsHispanicChange: this.handleChange
      }), /*#__PURE__*/React.createElement(RaceQuestionSet, {
        selected: this.state.race,
        textValue: this.state.raceSpecific,
        handleRaceChange: this.handleChange
      }), /*#__PURE__*/React.createElement(EducationQuestionSet, {
        selected: this.state.education,
        handleEducationChange: this.handleChange
      }), /*#__PURE__*/React.createElement(EmploymentQuestionSet, {
        selected: this.state.employed,
        handleEmploymentChange: this.handleChange
      }), this.state.employed == "Yes" && /*#__PURE__*/React.createElement(JobTitleQuestionSet, {
        textValue: this.state.jobTitle,
        handleJobTitleChange: this.handleChange
      }), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container",
        style: {
          marginTop: "2em"
        }
      }, /*#__PURE__*/React.createElement("button", {
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut,
        type: "submit"
      }, " Next Page")))));
    }

    return render;
  }();

  return NetworkSurveyPersonalQuestions;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"NetworkSurveyRelationshipInterpreter.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/network-survey/NetworkSurveyRelationshipInterpreter.jsx                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return NetworkSurveyRelationshipInterpreter;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var _;

module.link("lodash", {
  "default": function (v) {
    _ = v;
  }
}, 2);

var RelationshipButtonSet = function (_ref) {
  var contactName = _ref.contactName,
      tie = _ref.tie,
      categories = _ref.categories,
      categoriesSelected = _ref.categoriesSelected,
      handleCategorySelect = _ref.handleCategorySelect;
  return /*#__PURE__*/React.createElement("div", {
    className: "relationship-input-row",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "relationship-input-label",
    htmlFor: tie
  }, " ", /*#__PURE__*/React.createElement("p", null, contactName), " "), /*#__PURE__*/React.createElement("div", {
    className: "relationship-buttons-container"
  }, categories.map(function (category, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: contactName + "-" + category,
      className: categoriesSelected[index] ? "network-relationship-button selected" : "network-relationship-button",
      onClick: function () {
        return handleCategorySelect(tie, index);
      }
    }, " ", category, " ");
  })));
}; // This section asks the user what their personal emotional closeness is to the listed 5 people.


var NetworkSurveyRelationshipInterpreter = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NetworkSurveyRelationshipInterpreter, _React$Component);

  var _super = _createSuper(NetworkSurveyRelationshipInterpreter);

  function NetworkSurveyRelationshipInterpreter(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleCategorySelect = function (tie, category_i) {
      _this.state[tie][category_i] = !_this.state[tie][category_i];
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player;
      var networkSurveyResponse = {
        tie1: _this.state.tie1,
        tie2: _this.state.tie2,
        tie3: _this.state.tie3,
        tie4: _this.state.tie4,
        tie5: _this.state.tie5,
        categories: _this.state.categories
      };
      event.preventDefault(); // TODO: log player response to survey question

      player.set("networkResponseRelationshipInterpreter", networkSurveyResponse);
      onNext();
    };

    var _this$props$player$ge = _this.props.player.get("networkResponse1"),
        name1 = _this$props$player$ge.name1,
        name2 = _this$props$player$ge.name2,
        name3 = _this$props$player$ge.name3,
        name4 = _this$props$player$ge.name4,
        name5 = _this$props$player$ge.name5;

    _this.state = {
      tie1: [false, false, false, false],
      tie2: [false, false, false, false],
      tie3: [false, false, false, false],
      tie4: [false, false, false, false],
      tie5: [false, false, false, false],
      name1: name1,
      name2: name2,
      name3: name3,
      name4: name4,
      name5: name5,
      categories: ["Current Colleague", "Previous Colleague", "Spouse", "Other kin", "Other"]
    };
    return _this;
  }

  var _proto = NetworkSurveyRelationshipInterpreter.prototype;

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var player = this.props.player;
      var filledOut = this.state.tie1 && this.state.tie2 && this.state.tie3 && this.state.tie4 && this.state.tie5;
      var _this$state = this.state,
          name1 = _this$state.name1,
          name2 = _this$state.name2,
          name3 = _this$state.name3,
          name4 = _this$state.name4,
          name5 = _this$state.name5;
      var names = [name1, name2, name3, name4, name5];
      return /*#__PURE__*/React.createElement("div", {
        className: "network-survey-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "network-survey-header"
      }, /*#__PURE__*/React.createElement("p", null, "WHAT ARE YOUR RELATIONSHIPS TO THE PEOPLE IN YOUR NETWORK?")), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png"
      }), /*#__PURE__*/React.createElement("div", {
        className: "network-survey-body"
      }, /*#__PURE__*/React.createElement("p", null, "The people you cited on the previous page are listed in the table below. Please select the options next to each name that best describes your relationship with each listed person. For each person, you are allowed to select multiple options. "), /*#__PURE__*/React.createElement("ul", {
        className: "network-list"
      }, /*#__PURE__*/React.createElement("li", null, "\u201CCurrent Colleague\u201D indicates someone who works at the same organization you do."), /*#__PURE__*/React.createElement("li", null, "\"Previous Colleague\" indicates someone with whom you used to work with."), /*#__PURE__*/React.createElement("li", null, "\u201CSpouse\" indicates that you and this person are, or were, married, or lived together as if married at some time."), /*#__PURE__*/React.createElement("li", null, "\"Other kin\" indicates any family relative other than spouse."), /*#__PURE__*/React.createElement("li", null, "\"Other\" indicates someone that does not fall within one of the above categories")), /*#__PURE__*/React.createElement("form", {
        className: "network-form",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("p", null, " What is their relationship to you? (Select all that applies) "), names.map(function (name, i) {
        return /*#__PURE__*/React.createElement(RelationshipButtonSet, {
          key: i,
          contactName: name,
          tie: "tie" + (i + 1),
          categories: _this2.state.categories,
          categoriesSelected: _this2.state["tie" + (i + 1)],
          handleCategorySelect: _this2.handleCategorySelect
        });
      }), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut,
        type: "submit"
      }, " Next Page")))));
    }

    return render;
  }();

  return NetworkSurveyRelationshipInterpreter;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"NetworkSurveySelfContacts.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/network-survey/NetworkSurveySelfContacts.jsx                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return NetworkSurveySelfContacts;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var NetworkSurveySelfContacts = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NetworkSurveySelfContacts, _React$Component);

  var _super = _createSuper(NetworkSurveySelfContacts);

  function NetworkSurveySelfContacts() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      name1: "",
      name2: "",
      name3: "",
      name4: "",
      name5: ""
    };

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player;
      event.preventDefault();
      var networkSurveyResponse = _this.state;
      player.set("networkResponseSelfContacts", networkSurveyResponse);
      player.set("networkResponse1", networkSurveyResponse);
      onNext();
    };

    return _this;
  }

  var _proto = NetworkSurveySelfContacts.prototype;

  _proto.render = function () {
    function render() {
      var _this$state = this.state,
          name1 = _this$state.name1,
          name2 = _this$state.name2,
          name3 = _this$state.name3,
          name4 = _this$state.name4,
          name5 = _this$state.name5;
      var filledOut = name1 && name2 && name3 && name4 && name5;
      return /*#__PURE__*/React.createElement("div", {
        className: "network-survey-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "network-survey-header"
      }, /*#__PURE__*/React.createElement("p", null, "THIS EXPERIMENT IS ABOUT COMMUNICATION NETWORKS. WE BEGIN WITH A QUICK SENSE OF YOUR CURRENT NETWORK. ", /*#__PURE__*/React.createElement("br", null), "HERE IS A GENERIC QUESTION OFTEN USED IN SURVEY RESEARCH:")), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png"
      }), /*#__PURE__*/React.createElement("div", {
        className: "network-survey-body"
      }, /*#__PURE__*/React.createElement("p", null, "From time to time, most people discuss important matters with other people, people they trust. The range of important matters varies from person to person across work, leisure, family, politics, whatever. The range of relations varies across work, family, friends, and advisors. "), /*#__PURE__*/React.createElement("p", null, "If you look back over the last six months, who are the five people with whom you most discussed matters important to you? Use any symbol that identifies the person for you -- first name, initials, or any name that will let you identify the person. "), /*#__PURE__*/React.createElement("p", null, "To ensure confidentiality the names typed here will only be recorded in your local browser, and will NOT be sent to the server. It will be erased from your browser when you close or reload the tab. "), /*#__PURE__*/React.createElement("form", {
        className: "network-form",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
        className: "input-label",
        htmlFor: "name1"
      }, " Name: "), /*#__PURE__*/React.createElement("input", {
        type: "text",
        id: "name1",
        name: "name1",
        onChange: this.handleChange,
        required: true
      })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
        className: "input-label",
        htmlFor: "name2"
      }, " Name: "), /*#__PURE__*/React.createElement("input", {
        type: "text",
        id: "name2",
        name: "name2",
        onChange: this.handleChange,
        required: true
      })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
        className: "input-label",
        htmlFor: "name3"
      }, " Name: "), /*#__PURE__*/React.createElement("input", {
        type: "text",
        id: "name3",
        name: "name3",
        onChange: this.handleChange,
        required: true
      })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
        className: "input-label",
        htmlFor: "name4"
      }, " Name: "), /*#__PURE__*/React.createElement("input", {
        type: "text",
        id: "name4",
        name: "name4",
        onChange: this.handleChange,
        required: true
      })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
        className: "input-label",
        htmlFor: "name5"
      }, " Name: "), /*#__PURE__*/React.createElement("input", {
        type: "text",
        id: "name5",
        name: "name5",
        onChange: this.handleChange,
        required: true
      })), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut,
        type: "submit"
      }, " Next Page")))));
    }

    return render;
  }();

  return NetworkSurveySelfContacts;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"NetworkSurveySelfEC.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/network-survey/NetworkSurveySelfEC.jsx                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return NetworkSurveySelfEC;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);
var HTMLSelect;
module.link("@blueprintjs/core", {
  HTMLSelect: function (v) {
    HTMLSelect = v;
  }
}, 2);

var DropdownSelect = function (_ref) {
  var id = _ref.id,
      name = _ref.name,
      handleChange = _ref.handleChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "bp4-html-select"
  }, /*#__PURE__*/React.createElement("select", {
    className: "dropdown-select-input",
    defaultValue: "",
    id: id,
    name: name,
    onChange: handleChange,
    required: true
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disbaled: "true",
    hidden: true
  }), /*#__PURE__*/React.createElement("option", {
    value: "EC"
  }, "Especially Close"), /*#__PURE__*/React.createElement("option", {
    value: "C"
  }, "Close"), /*#__PURE__*/React.createElement("option", {
    value: "LTC"
  }, "Less Than Close")));
}; // This section asks the user what their personal emotional closeness is to the listed 5 people.


var NetworkSurveySelfEC = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NetworkSurveySelfEC, _React$Component);

  var _super = _createSuper(NetworkSurveySelfEC);

  function NetworkSurveySelfEC(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player;
      var networkSurveyResponse = {
        tie1: _this.state.tie1,
        tie2: _this.state.tie2,
        tie3: _this.state.tie3,
        tie4: _this.state.tie4,
        tie5: _this.state.tie5
      };
      event.preventDefault(); // TODO: log player response to survey question

      player.set("networkResponseSelfEC", networkSurveyResponse);
      onNext();
    };

    var _this$props$player$ge = _this.props.player.get("networkResponse1"),
        name1 = _this$props$player$ge.name1,
        name2 = _this$props$player$ge.name2,
        name3 = _this$props$player$ge.name3,
        name4 = _this$props$player$ge.name4,
        name5 = _this$props$player$ge.name5;

    _this.state = {
      tie1: "",
      tie2: "",
      tie3: "",
      tie4: "",
      tie5: "",
      name1: name1,
      name2: name2,
      name3: name3,
      name4: name4,
      name5: name5
    };
    return _this;
  }

  var _proto = NetworkSurveySelfEC.prototype;

  _proto.render = function () {
    function render() {
      var player = this.props.player;
      var filledOut = this.state.tie1 && this.state.tie2 && this.state.tie3 && this.state.tie4 && this.state.tie5;
      var _this$state = this.state,
          name1 = _this$state.name1,
          name2 = _this$state.name2,
          name3 = _this$state.name3,
          name4 = _this$state.name4,
          name5 = _this$state.name5;
      return /*#__PURE__*/React.createElement("div", {
        className: "network-survey-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "network-survey-header"
      }, /*#__PURE__*/React.createElement("p", null, "HOW CLOSE ARE YOU TO THE PEOPLE IN YOUR NETWORK?")), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png"
      }), /*#__PURE__*/React.createElement("div", {
        className: "network-survey-body"
      }, /*#__PURE__*/React.createElement("p", null, "The people you cited on the previous page are listed in the table below. Please select the option next to each name that best describes how close you feel with each listed person. For each person, are you \u201Cespecially close\u201D (EC), \u201Cclose\u201D (C), or \u201Cless than close\u201D (LTC)? "), /*#__PURE__*/React.createElement("ul", {
        className: "network-list"
      }, /*#__PURE__*/React.createElement("li", null, "\u201CEspecially Close\u201D indicates this is one of your closest personal contacts."), /*#__PURE__*/React.createElement("li", null, "\u201CClose\u201D indicates this is someone you enjoy, but don't count him or her among your closest personal contacts."), /*#__PURE__*/React.createElement("li", null, "\u201CLess Than Close\" indicates this is someone you don't mind working with, but have no wish to develop a friendship.")), /*#__PURE__*/React.createElement("form", {
        className: "network-form",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("p", null, " How often do you communicate with _ ? "), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "tie1"
      }, " ", /*#__PURE__*/React.createElement("p", null, name1), " "), /*#__PURE__*/React.createElement(DropdownSelect, {
        id: "tie1",
        name: "tie1",
        handleChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "tie2"
      }, " ", /*#__PURE__*/React.createElement("p", null, name2), " "), /*#__PURE__*/React.createElement(DropdownSelect, {
        id: "tie2",
        name: "tie2",
        handleChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "tie3"
      }, " ", /*#__PURE__*/React.createElement("p", null, name3), " "), /*#__PURE__*/React.createElement(DropdownSelect, {
        id: "tie3",
        name: "tie3",
        handleChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "tie4"
      }, " ", /*#__PURE__*/React.createElement("p", null, name4), " "), /*#__PURE__*/React.createElement(DropdownSelect, {
        id: "tie4",
        name: "tie4",
        handleChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "tie5"
      }, " ", /*#__PURE__*/React.createElement("p", null, name5), " "), /*#__PURE__*/React.createElement(DropdownSelect, {
        id: "tie5",
        name: "tie5",
        handleChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut,
        type: "submit"
      }, " Next Page")))));
    }

    return render;
  }();

  return NetworkSurveySelfEC;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"NetworkSurveySelfFrequency.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/network-survey/NetworkSurveySelfFrequency.jsx                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return NetworkSurveySelfFrequency;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);
var HTMLSelect;
module.link("@blueprintjs/core", {
  HTMLSelect: function (v) {
    HTMLSelect = v;
  }
}, 2);

var DropdownSelect = function (_ref) {
  var id = _ref.id,
      name = _ref.name,
      handleChange = _ref.handleChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "bp4-html-select"
  }, /*#__PURE__*/React.createElement("select", {
    className: "dropdown-select-input",
    defaultValue: "",
    id: id,
    name: name,
    onChange: handleChange,
    required: true
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disbaled: "true",
    hidden: true
  }), /*#__PURE__*/React.createElement("option", {
    value: "daily"
  }, "Daily"), /*#__PURE__*/React.createElement("option", {
    value: "weekly"
  }, "Weekly"), /*#__PURE__*/React.createElement("option", {
    value: "lessoften"
  }, "Less often")));
};

var NetworkSurveySelfFrequency = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NetworkSurveySelfFrequency, _React$Component);

  var _super = _createSuper(NetworkSurveySelfFrequency);

  function NetworkSurveySelfFrequency(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player;
      var networkSurveyResponse = {
        tie1: _this.state.tie1,
        tie2: _this.state.tie2,
        tie3: _this.state.tie3,
        tie4: _this.state.tie4,
        tie5: _this.state.tie5
      };
      event.preventDefault(); // TODO: log player response to survey question

      player.set("networkResponseSelfFrequency", networkSurveyResponse);
      player.set("networkResponse2", networkSurveyResponse);
      onNext();
    };

    var _this$props$player$ge = _this.props.player.get("networkResponse1"),
        name1 = _this$props$player$ge.name1,
        name2 = _this$props$player$ge.name2,
        name3 = _this$props$player$ge.name3,
        name4 = _this$props$player$ge.name4,
        name5 = _this$props$player$ge.name5;

    _this.state = {
      tie1: "",
      tie2: "",
      tie3: "",
      tie4: "",
      tie5: "",
      name1: name1,
      name2: name2,
      name3: name3,
      name4: name4,
      name5: name5
    };
    return _this;
  }

  var _proto = NetworkSurveySelfFrequency.prototype;

  _proto.render = function () {
    function render() {
      var player = this.props.player;
      var filledOut = this.state.tie1 && this.state.tie2 && this.state.tie3 && this.state.tie4 && this.state.tie5;
      var _this$state = this.state,
          name1 = _this$state.name1,
          name2 = _this$state.name2,
          name3 = _this$state.name3,
          name4 = _this$state.name4,
          name5 = _this$state.name5;
      return /*#__PURE__*/React.createElement("div", {
        className: "network-survey-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "network-survey-header"
      }, /*#__PURE__*/React.createElement("p", null, "HOW CLOSE ARE YOU TO THE PEOPLE IN YOUR NETWORK?")), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png"
      }), /*#__PURE__*/React.createElement("div", {
        className: "network-survey-body"
      }, /*#__PURE__*/React.createElement("p", null, "The people you cited on the previous page are listed in the table below. The task is indicate how often you communicate and interact with each of them. "), /*#__PURE__*/React.createElement("ul", {
        className: "network-list"
      }, /*#__PURE__*/React.createElement("li", null, "\u201CDaily\u201D means this is someone you communicate with daily."), /*#__PURE__*/React.createElement("li", null, "\u201CWeekly\u201D indicates this is someone you usually interact with and communicate on a weekly basis."), /*#__PURE__*/React.createElement("li", null, "\u201CLess often\u201D indicates this is someone you speak to infrequently.")), /*#__PURE__*/React.createElement("form", {
        className: "network-form",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("p", null, " How often do you communicate with _ ? "), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "tie1"
      }, " ", /*#__PURE__*/React.createElement("p", null, name1), " "), /*#__PURE__*/React.createElement(DropdownSelect, {
        id: "tie1",
        name: "tie1",
        handleChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "tie2"
      }, " ", /*#__PURE__*/React.createElement("p", null, name2), " "), /*#__PURE__*/React.createElement(DropdownSelect, {
        id: "tie2",
        name: "tie2",
        handleChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "tie3"
      }, " ", /*#__PURE__*/React.createElement("p", null, name3), " "), /*#__PURE__*/React.createElement(DropdownSelect, {
        id: "tie3",
        name: "tie3",
        handleChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "tie4"
      }, " ", /*#__PURE__*/React.createElement("p", null, name4), " "), /*#__PURE__*/React.createElement(DropdownSelect, {
        id: "tie4",
        name: "tie4",
        handleChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "tie5"
      }, " ", /*#__PURE__*/React.createElement("p", null, name5), " "), /*#__PURE__*/React.createElement(DropdownSelect, {
        id: "tie5",
        name: "tie5",
        handleChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut,
        type: "submit"
      }, " Next Page")))));
    }

    return render;
  }();

  return NetworkSurveySelfFrequency;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"quiz":{"AllQuiz.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/quiz/AllQuiz.jsx                                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return AllQuiz;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);
var AttentionCheckModal;
module.link("./AttentionCheckModal", {
  "default": function (v) {
    AttentionCheckModal = v;
  }
}, 2);

var Radio = function (_ref) {
  var selected = _ref.selected,
      name = _ref.name,
      value = _ref.value,
      label = _ref.label,
      onChange = _ref.onChange;
  return /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-radio"
  }, /*#__PURE__*/React.createElement("input", {
    className: "quiz-button",
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange
  }), label);
};

var AllQuiz = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(AllQuiz, _React$Component);

  var _super = _createSuper(AllQuiz);

  function AllQuiz() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      q1: "",
      q2: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      q8: "",
      modalIsOpen: false
    };

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.allCorrect = function () {
      return _this.state.q1 === 'yes' && _this.state.q2 === 'yes' && _this.state.q4 === 'yes' && _this.state.q5 === 'one' && _this.state.q6 === 'false' && _this.state.q7 === 'false' && _this.state.q8 === 'yes';
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game,
          player = _this$props.player;
      event.preventDefault();

      if (_this.allCorrect()) {
        var currentTriesLeft = player.get("attentionCheckTries");
        var attentionCheckAnswers = _this.state;
        player.set("attentionCheck-" + currentTriesLeft, attentionCheckAnswers);
        onNext();
      } else {
        var _currentTriesLeft = player.get("attentionCheckTries"); // Log the attention check answers


        var _attentionCheckAnswers = _this.state;
        player.set("attentionCheck-" + _currentTriesLeft, _attentionCheckAnswers); // Log how many tries they have left

        player.set("attentionCheckTries", _currentTriesLeft - 1); // If player uses all their attention check tries, they fail; otherwise show them how many tries they have left

        if (player.get("attentionCheckTries") <= 0) {
          player.exit("failedQuestion");
        } else {
          _this.onOpenModal();
        }
      }
    };

    _this.onOpenModal = function () {
      _this.setState({
        modalIsOpen: true
      });
    };

    _this.onCloseModal = function () {
      _this.setState({
        modalIsOpen: false
      });
    };

    return _this;
  }

  var _proto = AllQuiz.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var player = this.props.player;

      if (!player.get("attentionCheckTries")) {
        player.set("attentionCheckTries", 2);
      }
    }

    return componentDidMount;
  }();

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          game = _this$props2.game,
          onPrev = _this$props2.onPrev,
          player = _this$props2.player;
      var _this$state = this.state,
          q1 = _this$state.q1,
          q2 = _this$state.q2,
          q4 = _this$state.q4,
          q5 = _this$state.q5,
          q6 = _this$state.q6,
          q7 = _this$state.q7,
          q8 = _this$state.q8;
      var allSelected = Object.keys(this.state).every(function (key) {
        return _this2.state[key] !== "";
      });
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " Questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("div", {
        className: "question-section"
      }, game.treatment.isPreQualification ? /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "In the near future, are you willing to participate in an online team exercise that could last for approximately 45-", game.treatment.maxGameTime, " minutes?") : /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "Are you willing to participate in an online team exercise that could last for approximately 45-", game.treatment.maxGameTime, " minutes?"), /*#__PURE__*/React.createElement(Radio, {
        selected: q1,
        name: "q1",
        value: "yes",
        label: "Yes",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: q1,
        name: "q1",
        value: "no",
        label: "No",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "question-section"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, game.treatment.endGameIfPlayerIdle ? /*#__PURE__*/React.createElement("span", null, "If you do not interact with the application for a while, your session will timeout and the game will end for EVERYONE in your team. ", game.treatment.idleWarningTime, " seconds before the timeout you will be notified you are about to timeout, and be given ONE warning and be able to reset this timer.") : /*#__PURE__*/React.createElement("span", null, "If you do not interact with the application for a while, your session will timeout and you will be kicked out from the game. ", game.treatment.idleWarningTime, " seconds before the timeout you will be notified you are about to timeout, and be given a ONE warning and be able to reset this timer."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'bolder'
        }
      }, game.treatment.endGameIfPlayerIdle ?
      /*#__PURE__*/
      // TODO: MTurk
      // <span>NOTE: If you allow your session to timeout, your HIT will not be accepted. If a team member causes a timeout you will be sent to the end of challenge page, and your HIT will be accepted.</span> :
      // <span>NOTE: If you allow your session to timeout, your HIT will not be accepted.</span>
      // TODO: Prolific
      React.createElement("span", null, "NOTE: If you allow your session to timeout, your submission will not be accepted. If a team member causes a timeout you will be sent to the end of challenge page, and your submission will be accepted.") : /*#__PURE__*/React.createElement("span", null, "NOTE: If you allow your session to timeout, your submission will not be accepted."))), /*#__PURE__*/React.createElement(Radio, {
        selected: q2,
        name: "q2",
        value: "yes",
        label: "PROCEED",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: q2,
        name: "q2",
        value: "no",
        label: "DO NOT PROCEED",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "question-section"
      }, /*#__PURE__*/React.createElement("p", {
        className: "questionnaire-question"
      }, "Next you will be asked questions about the instruction you just read. You need to get the answers correct in order to be accepted into the exercise. ")), /*#__PURE__*/React.createElement("div", {
        className: "question-section"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "Is the following statement true or false?", game.treatment.endGameIfPlayerIdle ? /*#__PURE__*/React.createElement("span", null, " If any member of my team doesn't register a guess or communicate with a colleague for a long time, the task will end and the entire team (including myself) will be sent to the exit page of the survey.") : /*#__PURE__*/React.createElement("span", null, " If a member of my team doesn't register a guess or communicate with a colleague for a long time, the inactive player will be kicked and the task will continue for the rest of the team.")), /*#__PURE__*/React.createElement(Radio, {
        selected: q4,
        name: "q4",
        value: "yes",
        label: "Yes",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: q4,
        name: "q4",
        value: "no",
        label: "No",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "question-section"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "On any trial, how many abstract symbols will you and any member of your team have in common?"), /*#__PURE__*/React.createElement(Radio, {
        selected: q5,
        name: "q5",
        value: "one",
        label: "Only 1",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: q5,
        name: "q5",
        value: "many",
        label: "More than 1",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "question-section"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "Is the following statement true or false? I will be able to communicate with my team members using an overall group chat."), /*#__PURE__*/React.createElement(Radio, {
        selected: q6,
        name: "q6",
        value: "true",
        label: "True",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: q6,
        name: "q6",
        value: "false",
        label: "False",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "question-section"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "The reconsider button will only appear if I submit an incorrect answer."), /*#__PURE__*/React.createElement(Radio, {
        selected: q7,
        name: "q7",
        value: "true",
        label: "True",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: q7,
        name: "q7",
        value: "false",
        label: "False",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "question-section"
      }, game.treatment.isPreQualification ?
      /*#__PURE__*/
      // TODO: MTurk
      // <label className="questionnaire-question"> In the near future, if you pass all the qualifications, you may participate in this game. During that game, you will receive a flat fee of ${game.treatment.basePay} for participating. You will also receive ${game.treatment.conversionRate} bonus each time your team correctly identifies the shared symbol. If you complete all trials of the experiment, you could earn up to ${game.treatment.basePay + game.treatment.numTaskRounds * game.treatment.conversionRate}.</label>
      // TODO: Prolific
      React.createElement("label", {
        className: "questionnaire-question"
      }, " In the near future, if you pass all the qualifications, you may participate in this game. During that game, you will receive the hourly wage for participating. You will also receive a small bonus each time your team correctly identifies the shared symbol. (Amount TBD)") :
      /*#__PURE__*/
      // TODO  MTurk
      React.createElement("label", {
        className: "questionnaire-question"
      }, "If you pass the attention check, you may participate in this task. You will receive a flat fee of $", game.treatment.basePay, " for participating. You will also receive $", game.treatment.conversionRate, " bonus each time your team correctly identifies the shared symbol. If you complete all trials of the experiment, you could earn up to $", game.treatment.basePay + game.treatment.numTaskRounds * game.treatment.conversionRate, "."), /*#__PURE__*/React.createElement(Radio, {
        selected: q8,
        name: "q8",
        value: "yes",
        label: "PROCEED",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: q8,
        name: "q8",
        value: "no",
        label: "DO NOT PROCEED",
        onChange: this.handleChange
      }))), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: !allSelected ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !allSelected,
        type: "submit"
      }, " Submit ")), this.state.modalIsOpen && /*#__PURE__*/React.createElement(AttentionCheckModal, {
        player: player,
        onPrev: onPrev,
        onCloseModal: this.onCloseModal
      })));
    }

    return render;
  }();

  return AllQuiz;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"AttentionCheckModal.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/quiz/AttentionCheckModal.jsx                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return AttentionCheckModal;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);

var AttentionCheckModal = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(AttentionCheckModal, _React$Component);

  var _super = _createSuper(AttentionCheckModal);

  function AttentionCheckModal() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = AttentionCheckModal.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          player = _this$props.player,
          triesLeft = _this$props.triesLeft,
          onCloseModal = _this$props.onCloseModal;
      return /*#__PURE__*/React.createElement("div", {
        className: "dark-bg",
        onClick: onCloseModal
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal-centered"
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal"
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal-content"
      }, "You got this comprehension check question wrong. You have ", triesLeft, " try left. Please carefully reread the instructions."), /*#__PURE__*/React.createElement("div", {
        className: "attention-check-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: "modal-button",
        onClick: onCloseModal
      }, "Try Again")))));
    }

    return render;
  }();

  return AttentionCheckModal;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizFive.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/quiz/QuizFive.jsx                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return QuizFive;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);
var AttentionCheckModal;
module.link("./AttentionCheckModal", {
  "default": function (v) {
    AttentionCheckModal = v;
  }
}, 2);

var Radio = function (_ref) {
  var selected = _ref.selected,
      name = _ref.name,
      value = _ref.value,
      label = _ref.label,
      onChange = _ref.onChange;
  return /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-radio"
  }, /*#__PURE__*/React.createElement("input", {
    className: "quiz-button",
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange
  }), label);
};

var QuizFive = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(QuizFive, _React$Component);

  var _super = _createSuper(QuizFive);

  function QuizFive() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      modalIsOpen: false
    };

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game,
          player = _this$props.player;
      event.preventDefault();

      if (_this.state.response === 'one') {
        var currentTriesLeft = player.get("attentionCheck1Tries");
        var attentionCheck1Answer = _this.state.response;
        player.set("attentionCheck1-" + currentTriesLeft, attentionCheck1Answer);
        onNext();
      } else {
        var _currentTriesLeft = player.get("attentionCheck1Tries");

        var _attentionCheck1Answer = _this.state.response;
        player.set("attentionCheck1-" + _currentTriesLeft, _attentionCheck1Answer);
        player.set("attentionCheck1Tries", _currentTriesLeft - 1);

        if (_currentTriesLeft - 1 <= 0) {
          player.exit("failedQuestion");
        } else {
          _this.onOpenModal();
        }
      }
    };

    _this.onOpenModal = function () {
      _this.setState({
        modalIsOpen: true
      });
    };

    _this.onCloseModal = function () {
      _this.setState({
        modalIsOpen: false
      });
    };

    return _this;
  }

  var _proto = QuizFive.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var player = this.props.player;

      if (!player.get("attentionCheck1Tries")) {
        player.set("attentionCheck1Tries", 2);
      }
    }

    return componentDidMount;
  }();

  _proto.render = function () {
    function render() {
      var player = this.props.player;
      var response = this.state.response;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " Questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, " The task requires that members of a small network work together to identify abstract symbols for multiple trials. At the beginning of each trial, each member of your network will be assigned a set of symbols. One and only one of those symbols will be shared among you. Your job is to discover the shared symbol by communicating with the members of your network within the time allotted. Your symbols are illustrated in the \"my card\" box. When you believe you have identified the shared symbol, select it and then hit the submit answer button. If your team runs out of time, your team will be marked incorrect and you will move onto the next round.  "), /*#__PURE__*/React.createElement("p", null, "----------------------------------------------------------------------------------------------------"), /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "On any trial, how many abstract symbols will you and any member of your team have in common?"), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "zero",
        label: "0",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "one",
        label: "1",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "two",
        label: "2",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "many",
        label: "More than 2",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: !response ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !response,
        type: "submit"
      }, " Submit ")), this.state.modalIsOpen && /*#__PURE__*/React.createElement(AttentionCheckModal, {
        player: player,
        triesLeft: player.get("attentionCheck1Tries"),
        onCloseModal: this.onCloseModal
      })));
    }

    return render;
  }();

  return QuizFive;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizOne.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/quiz/QuizOne.jsx                                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return QuizOne;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var Radio = function (_ref) {
  var selected = _ref.selected,
      name = _ref.name,
      value = _ref.value,
      label = _ref.label,
      onChange = _ref.onChange;
  return /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-radio"
  }, /*#__PURE__*/React.createElement("input", {
    className: "quiz-button",
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange
  }), label);
};

var QuizOne = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(QuizOne, _React$Component);

  var _super = _createSuper(QuizOne);

  function QuizOne() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {};

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game,
          player = _this$props.player;
      event.preventDefault();

      if (_this.state.response === 'yes') {
        onNext();
      } else {
        player.exit("returnSubmission");
      }
    };

    return _this;
  }

  var _proto = QuizOne.prototype;

  _proto.render = function () {
    function render() {
      var _this$props2 = this.props,
          game = _this$props2.game,
          player = _this$props2.player;
      var response = this.state.response;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " Questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "Are you willing to participate in an online team exercise (in the future) that could last for approximately ", game.treatment.maxGameTime, " minutes?"), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "yes",
        label: "Yes",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "no",
        label: "No",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: !response ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !response,
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return QuizOne;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizOverview.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/quiz/QuizOverview.jsx                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return QuizOverview;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var QuizOverview = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(QuizOverview, _React$Component);

  var _super = _createSuper(QuizOverview);

  function QuizOverview() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game,
          player = _this$props.player;
      event.preventDefault();
      onNext();
    };

    return _this;
  }

  var _proto = QuizOverview.prototype;

  _proto.render = function () {
    function render() {
      var _this$props2 = this.props,
          game = _this$props2.game,
          onPrev = _this$props2.onPrev,
          player = _this$props2.player;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " Important Game Overview "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("div", {
        className: "question-section"
      }, /*#__PURE__*/React.createElement("p", {
        className: "questionnaire-question"
      }, " PLEASE READ THE FOLLOWING CAREFULLY "), /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "1. This game may last up to ", /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'bolder'
        }
      }, "  ", game.treatment.maxGameTime, " minutes"), ". If you cannot make this commitment, please leave and wait for the next session."), /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "2. If you are inactive for longer than ", /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'bolder'
        }
      }, "  ", game.treatment.userInactivityDuration / 60, " minutes"), ", you will be kicked from the game. You will only get ", /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'bolder'
        }
      }, " ONE warning "), " about your inactivity. If you are still inactive in the next 30 seconds, you will be kicked. If you become active, your timer will reset. Thus, actively speak with your teammates until everyone has submitted. ", /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'bolder'
        }
      }, " Your inactive timer will still run after you submit. ")), /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "3. If a player is kicked from the game, the ", /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'bolder'
        }
      }, " entire game for everyone will end "), "  after the round is finished."), /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "4. For each trial, there will be ", /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'bolder'
        }
      }, " only 1 common symbol "), " amongst everyone. Some symbols may be the same amongst a few of you, but only one that you all share."), /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "5. Each player will have different 1-on-1 chats with people to communicate with. You may not have the same chats as others. Some may only have one chat, while others may have more."), /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "6. After selecting a symbol and submitting it, you are allowed to reconsider your answer if you find more information from your team."), game.treatment.conversionRate && game.treatment.basePay ? /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "7. You will receive a $", game.treatment.conversionRate, " bonus each time your team correctly identifies the shared symbol. If you complete all trials of the experiment, you could earn up to an additional $", game.treatment.numTaskRounds * game.treatment.conversionRate, ".") : /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "7. You will receive $1 bonus each time your team correctly identifies the shared symbol. If you complete all trials of the experiment, you could earn up to $", game.treatment.numTaskRounds * 1, "."), /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: "arrow-button button-submit",
        type: "submit"
      }, " Proceed ")))));
    }

    return render;
  }();

  return QuizOverview;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizSeven.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/quiz/QuizSeven.jsx                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return QuizSeven;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);
var AttentionCheckModal;
module.link("./AttentionCheckModal", {
  "default": function (v) {
    AttentionCheckModal = v;
  }
}, 2);

var Radio = function (_ref) {
  var selected = _ref.selected,
      name = _ref.name,
      value = _ref.value,
      label = _ref.label,
      onChange = _ref.onChange;
  return /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-radio"
  }, /*#__PURE__*/React.createElement("input", {
    className: "quiz-button",
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange
  }), label);
};

var QuizSeven = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(QuizSeven, _React$Component);

  var _super = _createSuper(QuizSeven);

  function QuizSeven() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      modalIsOpen: false
    };

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game,
          player = _this$props.player;
      event.preventDefault();

      if (_this.state.response === 'self') {
        var currentTriesLeft = player.get("attentionCheck3Tries");
        var attentionCheck3Answer = _this.state.response;
        player.set("attentionCheck3-" + currentTriesLeft, attentionCheck3Answer);
        onNext();
      } else {
        var _currentTriesLeft = player.get("attentionCheck3Tries");

        var _attentionCheck3Answer = _this.state.response;
        player.set("attentionCheck3-" + _currentTriesLeft, _attentionCheck3Answer);
        player.set("attentionCheck3Tries", _currentTriesLeft - 1);

        if (_currentTriesLeft - 1 <= 0) {
          player.exit("failedQuestion");
        } else {
          _this.onOpenModal();
        }
      }
    };

    _this.onOpenModal = function () {
      _this.setState({
        modalIsOpen: true
      });
    };

    _this.onCloseModal = function () {
      _this.setState({
        modalIsOpen: false
      });
    };

    return _this;
  }

  var _proto = QuizSeven.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var player = this.props.player;

      if (!player.get("attentionCheck3Tries")) {
        player.set("attentionCheck3Tries", 2);
      }
    }

    return componentDidMount;
  }();

  _proto.render = function () {
    function render() {
      var player = this.props.player;
      var response = this.state.response;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " Questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "You guess the symbol by selecting it and then selecting the submit answer button. While you are waiting for your team members to submit an answer, you will have an opportunity to reconsider your choice. The reconsider button does not indicate you have made an incorrect choice. "), /*#__PURE__*/React.createElement("p", null, "----------------------------------------------------------------------------------------------------"), /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "When will the reconsider button appear?"), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "incorrect",
        label: "After I submit an incorrect answer",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "self",
        label: "After I submit my symbol",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "team",
        label: "After all my teammates submit a symbol",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: !response ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !response,
        type: "submit"
      }, " Submit ")), this.state.modalIsOpen && /*#__PURE__*/React.createElement(AttentionCheckModal, {
        player: player,
        triesLeft: player.get("attentionCheck3Tries"),
        onCloseModal: this.onCloseModal
      })));
    }

    return render;
  }();

  return QuizSeven;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizSix.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/quiz/QuizSix.jsx                                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return QuizSix;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);
var AttentionCheckModal;
module.link("./AttentionCheckModal", {
  "default": function (v) {
    AttentionCheckModal = v;
  }
}, 2);

var Radio = function (_ref) {
  var selected = _ref.selected,
      name = _ref.name,
      value = _ref.value,
      label = _ref.label,
      onChange = _ref.onChange;
  return /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-radio"
  }, /*#__PURE__*/React.createElement("input", {
    className: "quiz-button",
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange
  }), label);
};

var QuizSix = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(QuizSix, _React$Component);

  var _super = _createSuper(QuizSix);

  function QuizSix() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      modalIsOpen: false
    };

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game,
          player = _this$props.player;
      event.preventDefault();

      if (_this.state.response === 'individual') {
        var currentTriesLeft = player.get("attentionCheck2Tries");
        var attentionCheck2Answer = _this.state.response;
        player.set("attentionCheck2-" + currentTriesLeft, attentionCheck2Answer);
        onNext();
      } else {
        var _currentTriesLeft = player.get("attentionCheck2Tries");

        var _attentionCheck2Answer = _this.state.response;
        player.set("attentionCheck2-" + _currentTriesLeft, _attentionCheck2Answer);
        player.set("attentionCheck2Tries", _currentTriesLeft - 1);

        if (_currentTriesLeft - 1 <= 0) {
          player.exit("failedQuestion");
        } else {
          _this.onOpenModal();
        }
      }
    };

    _this.onOpenModal = function () {
      _this.setState({
        modalIsOpen: true
      });
    };

    _this.onCloseModal = function () {
      _this.setState({
        modalIsOpen: false
      });
    };

    return _this;
  }

  var _proto = QuizSix.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var player = this.props.player;

      if (!player.get("attentionCheck2Tries")) {
        player.set("attentionCheck2Tries", 2);
      }
    }

    return componentDidMount;
  }();

  _proto.render = function () {
    function render() {
      var player = this.props.player;
      var response = this.state.response;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " Questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "Each player will have a network of people they can talk to through individual chats. Each member of your network has an unique dialogue box and you can have multiple dialogue boxes open on your screen as you communicate during a trial. You can open or close a box. You can also scroll up and down within a box to view the messages you have exchanged with a specific contact. There will be no overall team chat where you can talk to everyone at once. "), /*#__PURE__*/React.createElement("p", null, "----------------------------------------------------------------------------------------------------"), /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "How will I communicate with my team members?"), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "individual",
        label: "1-on-1 chats",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "group",
        label: "Overall team group chat",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "none",
        label: "There is no communication",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: !response ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !response,
        type: "submit"
      }, " Submit ")), this.state.modalIsOpen && /*#__PURE__*/React.createElement(AttentionCheckModal, {
        player: player,
        triesLeft: player.get("attentionCheck2Tries"),
        onCloseModal: this.onCloseModal
      })));
    }

    return render;
  }();

  return QuizSix;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizTwo.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/quiz/QuizTwo.jsx                                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return QuizTwo;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);
var AttentionCheckModal;
module.link("./AttentionCheckModal", {
  "default": function (v) {
    AttentionCheckModal = v;
  }
}, 2);

var Radio = function (_ref) {
  var selected = _ref.selected,
      name = _ref.name,
      value = _ref.value,
      label = _ref.label,
      onChange = _ref.onChange;
  return /*#__PURE__*/React.createElement("label", {
    className: "questionnaire-radio"
  }, /*#__PURE__*/React.createElement("input", {
    className: "quiz-button",
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange
  }), label);
};

var QuizTwo = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(QuizTwo, _React$Component);

  var _super = _createSuper(QuizTwo);

  function QuizTwo() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      modalIsOpen: false
    };

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game,
          player = _this$props.player;
      event.preventDefault();

      if (_this.state.response === 'end') {
        var currentTriesLeft = player.get("attentionCheck4Tries");
        var attentionCheck4Answer = _this.state.response;
        player.set("attentionCheck4-" + currentTriesLeft, attentionCheck4Answer);
        onNext();
      } else {
        var _currentTriesLeft = player.get("attentionCheck4Tries");

        var _attentionCheck4Answer = _this.state.response;
        player.set("attentionCheck4-" + _currentTriesLeft, _attentionCheck4Answer);
        player.set("attentionCheck4Tries", _currentTriesLeft - 1);

        if (_currentTriesLeft - 1 <= 0) {
          player.exit("failedQuestion");
        } else {
          _this.onOpenModal();
        }
      }
    };

    _this.onOpenModal = function () {
      _this.setState({
        modalIsOpen: true
      });
    };

    _this.onCloseModal = function () {
      _this.setState({
        modalIsOpen: false
      });
    };

    return _this;
  }

  var _proto = QuizTwo.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var player = this.props.player;

      if (!player.get("attentionCheck4Tries")) {
        player.set("attentionCheck4Tries", 2);
      }
    }

    return componentDidMount;
  }();

  _proto.render = function () {
    function render() {
      var _this$props2 = this.props,
          player = _this$props2.player,
          game = _this$props2.game;
      var response = this.state.response;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " Questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "If you do not interact within the game for a while, you will be kicked and the game will end for EVERYONE in your team. You will be given ONE warning the first time you reach the inactivity limit. If you still are not active within ", game.treatment.idleWarningTime, " seconds, you will be kicked. If you are active, your inactivity timer will reset."), /*#__PURE__*/React.createElement("p", null, "----------------------------------------------------------------------------------------------------"), /*#__PURE__*/React.createElement("label", null, "After receiving an inactivity warning, if I still do not interact within the game for a while, what will happen?"), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "warning",
        label: "I will get another inactivity warning",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "continue",
        label: "I will be kicked but the game will continue without me",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "end",
        label: "I will be kicked and the game will end for everyone in my team",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "nothing",
        label: "Nothing will happen",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("button", {
        className: !response ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !response,
        type: "submit"
      }, " Submit ")), this.state.modalIsOpen && /*#__PURE__*/React.createElement(AttentionCheckModal, {
        player: player,
        triesLeft: player.get("attentionCheck4Tries"),
        onCloseModal: this.onCloseModal
      })));
    }

    return render;
  }();

  return QuizTwo;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"tutorial":{"TutorialPageFour.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/tutorial/TutorialPageFour.jsx                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return TutorialPageFour;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var TutorialPageFour = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(TutorialPageFour, _React$Component);

  var _super = _createSuper(TutorialPageFour);

  function TutorialPageFour() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = TutorialPageFour.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game;
      return /*#__PURE__*/React.createElement("div", {
        className: "tutorial-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "title-static-image"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/title-tut3.png"
      })), /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "two-col"
      }, /*#__PURE__*/React.createElement("div", {
        className: "tutorial-static-image"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/tut3-slide4.png",
        width: "100%"
      })), /*#__PURE__*/React.createElement("div", {
        className: "tutorial-info"
      }, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading"
      }, " RECONSIDER"), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: "180px",
        height: "2px"
      }), /*#__PURE__*/React.createElement("div", {
        className: "tutorial-body"
      }, "You guess the symbol by selecting it and then selecting the submit answer button. While you are waiting for your team members to submit an answer, you will have an opportunity to reconsider your choice. The reconsider button does not indicate you have made an incorrect choice.")))), hasPrev && /*#__PURE__*/React.createElement("button", {
        className: "arrow-button tutorial-prev-btn",
        type: "button",
        onClick: onPrev,
        disabled: !hasPrev
      }, "Previous"), hasNext && /*#__PURE__*/React.createElement("button", {
        className: "arrow-button tutorial-next-btn",
        type: "button",
        onClick: onNext,
        disabled: !hasNext
      }, "Attention Check"));
    }

    return render;
  }();

  return TutorialPageFour;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TutorialPageOne.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/tutorial/TutorialPageOne.jsx                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return TutorialPageOne;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var TutorialPageOne = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(TutorialPageOne, _React$Component);

  var _super = _createSuper(TutorialPageOne);

  function TutorialPageOne() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = TutorialPageOne.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game;
      return /*#__PURE__*/React.createElement("div", {
        className: "tutorial-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "title-static-image"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/title-tut3.png"
      })), /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "two-col"
      }, /*#__PURE__*/React.createElement("div", {
        className: "tutorial-static-image"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/tut3-slide1.png",
        width: "100%"
      })), /*#__PURE__*/React.createElement("div", {
        className: "tutorial-info"
      }, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading"
      }, " THIS IS MY CARD "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: "180px",
        height: "2px"
      }), /*#__PURE__*/React.createElement("div", {
        className: "tutorial-body"
      }, "This is an experiment on effective communication. The task requires that members of a small network work together to identify abstract symbols for multiple trials. At the beginning of each trial, each member of your network will be assigned a set of symbols. One and only one of those symbols will be shared among you. Your job is to discover the shared symbol by communicating with the members of your network within the time allotted. Your symbols are illustrated in the \"my card\" box. When you believe you have identified the shared symbol, select it and then hit the submit answer button. If your team runs out of time, your team will be marked incorrect and you will move onto the next round.")))), hasNext && /*#__PURE__*/React.createElement("button", {
        className: "arrow-button tutorial-next-btn",
        type: "button",
        onClick: onNext,
        disabled: !hasNext
      }, "Next"));
    }

    return render;
  }();

  return TutorialPageOne;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TutorialPageThree.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/tutorial/TutorialPageThree.jsx                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return TutorialPageThree;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var TutorialPageThree = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(TutorialPageThree, _React$Component);

  var _super = _createSuper(TutorialPageThree);

  function TutorialPageThree() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = TutorialPageThree.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game;
      return /*#__PURE__*/React.createElement("div", {
        className: "tutorial-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "title-static-image"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/title-tut3.png"
      })), /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "two-col"
      }, /*#__PURE__*/React.createElement("div", {
        className: "tutorial-static-image"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/tut3-slide3.png",
        width: "100%"
      })), /*#__PURE__*/React.createElement("div", {
        className: "tutorial-info"
      }, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading"
      }, " NETWORK CONVERSATIONS "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: "180px",
        height: "2px"
      }), /*#__PURE__*/React.createElement("div", {
        className: "tutorial-body"
      }, "Each player will have a network of people they can talk to through individual chats. Each member of your network has an unique dialogue box and you can have multiple dialogue boxes open on your screen as you communicate during a trial. You can open or close a box. You can also scroll up and down within a box to view the messages you have exchanged with a specific contact. There will be no overall team chat where you can talk to everyone at once.")))), hasPrev && /*#__PURE__*/React.createElement("button", {
        className: "arrow-button tutorial-prev-btn",
        type: "button",
        onClick: onPrev,
        disabled: !hasPrev
      }, "Previous"), hasNext && /*#__PURE__*/React.createElement("button", {
        className: "arrow-button tutorial-next-btn",
        type: "button",
        onClick: onNext,
        disabled: !hasNext
      }, "Next"));
    }

    return render;
  }();

  return TutorialPageThree;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TutorialPageTwo.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/tutorial/TutorialPageTwo.jsx                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return TutorialPageTwo;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var TutorialPageTwo = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(TutorialPageTwo, _React$Component);

  var _super = _createSuper(TutorialPageTwo);

  function TutorialPageTwo() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = TutorialPageTwo.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          hasPrev = _this$props.hasPrev,
          hasNext = _this$props.hasNext,
          onNext = _this$props.onNext,
          onPrev = _this$props.onPrev,
          game = _this$props.game;
      return /*#__PURE__*/React.createElement("div", {
        className: "tutorial-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "title-static-image"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/title-tut3.png"
      })), /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "two-col"
      }, /*#__PURE__*/React.createElement("div", {
        className: "tutorial-static-image"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/tut3-slide2.png",
        width: "100%"
      })), /*#__PURE__*/React.createElement("div", {
        className: "tutorial-info"
      }, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading"
      }, " THIS IS MY NETWORK "), /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: "180px",
        height: "2px"
      }), /*#__PURE__*/React.createElement("div", {
        className: "tutorial-body"
      }, "The members of your communication network are indicated in the \u201Cmy network\u201D box. You can communicate with a member of your network by selecting that individual\u2019s name in the \u201Cmy network\u201D box. A communication box will open on your screen. Type the message you would like to send and when you hit return the message will be sent to the contact you selected.")))), hasPrev && /*#__PURE__*/React.createElement("button", {
        className: "arrow-button tutorial-prev-btn",
        type: "button",
        onClick: onPrev,
        disabled: !hasPrev
      }, "Previous"), hasNext && /*#__PURE__*/React.createElement("button", {
        className: "arrow-button tutorial-next-btn",
        type: "button",
        onClick: onNext,
        disabled: !hasNext
      }, "Next"));
    }

    return render;
  }();

  return TutorialPageTwo;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"Consent.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/Consent.jsx                                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return Consent;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Centered, ConsentButton;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  },
  ConsentButton: function (v) {
    ConsentButton = v;
  }
}, 1);

var Consent = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Consent, _React$Component);

  var _super = _createSuper(Consent);

  function Consent() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Consent.prototype;

  _proto.render = function () {
    function render() {
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "consent"
      }, /*#__PURE__*/React.createElement("h1", null, " Consent Form "), /*#__PURE__*/React.createElement("p", null, "This experiment is part of a MIT scientific project. Your decision to participate in this experiment is entirely voluntary. There are no known or anticipated risks to participating in this experiment. There is no way for us to identify you. The only information we will have, in addition to your responses, is the timestamps of your interactions with our site. The results of our research may be presented at scientific meetings or published in scientific journals. Clicking on the \"AGREE\" button indicates that you are at least 18 years of age, and agree to participate voluntary."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(ConsentButton, {
        text: "I AGREE"
      })));
    }

    return render;
  }();

  return Consent;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"DescribeSymbolQuestion.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/DescribeSymbolQuestion.jsx                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return DescribeSymbolQuestion;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("../../public/css/intro.css");
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var DescribeSymbolQuestion = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DescribeSymbolQuestion, _React$Component);

  var _super = _createSuper(DescribeSymbolQuestion);

  function DescribeSymbolQuestion() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      response: ""
    };

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player,
          stage = _this$props.stage;
      event.preventDefault(); // TODO: log player response to survey question

      player.set("symbolDescription", _this.state.response);
      onNext();
    };

    return _this;
  }

  var _proto = DescribeSymbolQuestion.prototype;

  _proto.render = function () {
    function render() {
      var response = this.state.response;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "intro-heading questionnaire-heading"
      }, " Questionnaire "), /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-content-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "questionnaire-body"
      }, /*#__PURE__*/React.createElement("h2", null, " Please describe the following symbol below as if you were trying to explain it to another player. Try to be more descriptive than not.", /*#__PURE__*/React.createElement("br", null), "Note: If there are too many participants filling out the survey at once, there may be some server delays. If you click submit and you do not immediately proceed to the next page, please be patient as it will eventually submit."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
        className: "symbol-container",
        style: {
          width: "100%",
          backgroundColor: "#051A46",
          borderRadius: "0%",
          display: "flex",
          justifyContent: "center"
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/symbols/tangrams/t7.png"
      })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("form", {
        className: "questionnaire-btn-container",
        style: {
          flexDirection: "column",
          width: "100%"
        },
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("textarea", {
        className: "survey-textarea",
        dir: "auto",
        id: "response",
        name: "response",
        value: response,
        onChange: this.handleChange,
        required: true
      }), /*#__PURE__*/React.createElement("button", {
        className: response === "" ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: response === "",
        style: {
          marginLeft: "auto"
        },
        type: "submit"
      }, " Submit")))));
    }

    return render;
  }();

  return DescribeSymbolQuestion;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"NewPlayer.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/NewPlayer.jsx                                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return NewPlayer;
  }
});
var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var NewPlayer = /*#__PURE__*/function (_Component) {
  _inheritsLoose(NewPlayer, _Component);

  var _super = _createSuper(NewPlayer);

  function NewPlayer() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.state = {
      id: ""
    };

    _this.handleUpdate = function (event) {
      var _this$setState;

      var _event$currentTarget = event.currentTarget,
          value = _event$currentTarget.value,
          name = _event$currentTarget.name;

      _this.setState((_this$setState = {}, _this$setState[name] = value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      event.preventDefault();
      var handleNewPlayer = _this.props.handleNewPlayer;
      var id = _this.state.id;
      handleNewPlayer(id);
    };

    return _this;
  }

  var _proto = NewPlayer.prototype;

  _proto.render = function () {
    function render() {
      var id = this.state.id;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("h1", null, "Identification"), /*#__PURE__*/React.createElement("p", null, "Please enter your Prolific ID:"), /*#__PURE__*/React.createElement("input", {
        dir: "auto",
        type: "text",
        name: "id",
        id: "id",
        value: id,
        onChange: this.handleUpdate,
        required: true,
        autoComplete: "off"
      }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("button", {
        type: "submit"
      }, "Submit")))));
    }

    return render;
  }();

  return NewPlayer;
}(Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Schedule.jsx":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/intro/Schedule.jsx                                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default: function (v) {
    _objectSpread = v;
  }
}, 0);

var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 1);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 2);
module.export({
  "default": function () {
    return Schedule;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Checkbox;
module.link("@blueprintjs/core", {
  Checkbox: function (v) {
    Checkbox = v;
  }
}, 1);

var Schedule = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Schedule, _React$Component);

  var _super = _createSuper(Schedule);

  function Schedule(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.handleChange = function (event) {
      var _objectSpread2;

      var el = event.currentTarget;

      _this.setState({
        availability: _objectSpread({}, _this.state.availability, (_objectSpread2 = {}, _objectSpread2[el.name] = !_this.state.availability[el.name], _objectSpread2))
      });
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player;
      event.preventDefault();
      player.set("timeAvailabilities", _this.state.availability);
      player.set("passedPreQual", true);
      player.exit("preQualSuccess");
    };

    _this.state = {
      availability: {},
      dates: ['3/10/23', '3/11/23', '3/12/23'],
      times: ['9-10 AM', '10-11 AM', '11-12 PM', '12-1 PM', '1-2 PM', '2-3 PM', '3-4 PM', '4-5 PM', '5-6 PM', '6-7 PM', ' 7-8 PM', '8-9 PM', '9-10 PM']
    };

    _this.state.dates.forEach(function (date) {
      _this.state.times.forEach(function (time) {
        _this.state.availability[date + " " + time] = false;
      });
    });

    return _this;
  }

  var _proto = Schedule.prototype;

  _proto.render = function () {
    function render() {
      var _this2 = this;

      return /*#__PURE__*/React.createElement("div", {
        className: "network-survey-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "network-survey-header"
      }, /*#__PURE__*/React.createElement("p", null, "Please fill out all the times you will be available to play this game.", /*#__PURE__*/React.createElement("br", null), "The time with the most overlapping players will be chosen.", /*#__PURE__*/React.createElement("br", null), "Note: If there are too many participants filling out the survey at once, there may be some server delays. If you click submit and you do not immediately proceed to the exit page, please be patient as it will eventually submit.")), /*#__PURE__*/React.createElement("form", {
        className: "network-form",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("table", {
        className: "name-matrix-table"
      }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
        style: {
          textAlign: "right"
        }
      }, " Time (EST) "), /*#__PURE__*/React.createElement("th", null, " 3/10/23 (Fri) "), /*#__PURE__*/React.createElement("th", null, " 3/11/23 (Sat) "), /*#__PURE__*/React.createElement("th", null, " 3/12/23 (Sun) ")), this.state.times.map(function (time) {
        return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
          style: {
            textAlign: "right"
          }
        }, " ", time, " "), _this2.state.dates.map(function (date) {
          return /*#__PURE__*/React.createElement("td", {
            style: {
              textAlign: "center"
            }
          }, /*#__PURE__*/React.createElement(Checkbox // checked={this.state[`${date} ${time}`]}
          , {
            key: date + " " + time,
            checked: _this2.state.availability[date + " " + time],
            name: date + " " + time,
            onChange: _this2.handleChange
          }));
        }));
      }))), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container",
        style: {
          justifyContent: "flex-end"
        }
      }, /*#__PURE__*/React.createElement("button", {
        className: "arrow-button button-submit",
        type: "submit"
      }, " Submit"))));
    }

    return render;
  }();

  return Schedule;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"chat":{"ChatContainer.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/chat/ChatContainer.js                                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _extends;

module.link("@babel/runtime/helpers/extends", {
  default: function (v) {
    _extends = v;
  }
}, 0);

var _objectWithoutProperties;

module.link("@babel/runtime/helpers/objectWithoutProperties", {
  default: function (v) {
    _objectWithoutProperties = v;
  }
}, 1);

var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 2);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 3);
module.export({
  "default": function () {
    return ChatContainer;
  }
});
module.link("./style.less");
var PropTypes;
module.link("prop-types", {
  "default": function (v) {
    PropTypes = v;
  }
}, 0);
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 1);
var Footer;
module.link("./Footer", {
  "default": function (v) {
    Footer = v;
  }
}, 2);
var Message;
module.link("./Message", {
  "default": function (v) {
    Message = v;
  }
}, 3);
var Messages;
module.link("./Messages", {
  "default": function (v) {
    Messages = v;
  }
}, 4);
var ChatHeader;
module.link("./ChatHeader", {
  "default": function (v) {
    ChatHeader = v;
  }
}, 5);
var ErrorBoundary;
module.link("./ErrorBoundary", {
  "default": function (v) {
    ErrorBoundary = v;
  }
}, 6);

var ChatContainer = /*#__PURE__*/function (_React$PureComponent) {
  _inheritsLoose(ChatContainer, _React$PureComponent);

  var _super = _createSuper(ChatContainer);

  function ChatContainer() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;

    _this.onTitleClick = function () {
      var _this$props = _this.props,
          isOpen = _this$props.isOpen,
          customKey = _this$props.customKey,
          onOpenChat = _this$props.onOpenChat,
          onCloseChat = _this$props.onCloseChat;

      if (!isOpen) {
        onOpenChat(customKey);
      } else {
        onCloseChat(customKey);
      } // this.setState({ isOpen: !this.state.isOpen});

    };

    _this.onNewMessage = function (msg) {
      var _this$props2 = _this.props,
          onNewMessage = _this$props2.onNewMessage,
          scope = _this$props2.scope,
          customKey = _this$props2.customKey;

      if (onNewMessage) {
        msg = onNewMessage(msg);

        if (!msg) {
          return;
        }
      }

      scope.append(customKey, msg);
    };

    _this.componentDidMount = function () {
      var _this$props3 = _this.props,
          dockStartOpen = _this$props3.dockStartOpen,
          docked = _this$props3.docked;

      if (docked && !dockStartOpen) {}
    };

    return _this;
  }

  var _proto = ChatContainer.prototype;

  _proto.render = function () {
    function render() {
      var _this$props4 = this.props,
          player = _this$props4.player,
          scope = _this$props4.scope,
          customKey = _this$props4.customKey,
          customClassName = _this$props4.customClassName,
          docked = _this$props4.docked,
          onIncomingMessage = _this$props4.onIncomingMessage,
          filter = _this$props4.filter,
          timeStamp = _this$props4.timeStamp,
          otherPlayer = _this$props4.otherPlayer,
          HeaderComp = _this$props4.header,
          MessageComp = _this$props4.message,
          FooterComp = _this$props4.footer,
          isOpen = _this$props4.isOpen,
          playerIsOnline = _this$props4.playerIsOnline,
          onOpenChat = _this$props4.onOpenChat,
          onCloseChat = _this$props4.onCloseChat,
          rest = _objectWithoutProperties(_this$props4, ["player", "scope", "customKey", "customClassName", "docked", "onIncomingMessage", "filter", "timeStamp", "otherPlayer", "header", "message", "footer", "isOpen", "playerIsOnline", "onOpenChat", "onCloseChat"]);

      var common = {
        player: player,
        scope: scope,
        customKey: customKey,
        otherPlayer: otherPlayer
      };
      return /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement("div", {
        className: (customClassName ? customClassName : "empirica-chat-container") + " " + (docked ? "undocked" : "undocked") + " " + (isOpen ? "open" : "closed")
      }, /*#__PURE__*/React.createElement("div", {
        className: "chat " + (isOpen ? "open" : "closed")
      }, docked && /*#__PURE__*/React.createElement(HeaderComp, _extends({}, common, {
        onTitleClick: this.onTitleClick,
        onXClick: this.onXClick,
        isOpen: isOpen,
        playerIsOnline: playerIsOnline
      })), isOpen ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Messages, _extends({}, common, {
        messageComp: MessageComp,
        filter: filter,
        onIncomingMessage: onIncomingMessage
      }, rest)), /*#__PURE__*/React.createElement(FooterComp, _extends({}, common, {
        timeStamp: timeStamp,
        onNewMessage: this.onNewMessage
      }))) : "")));
    }

    return render;
  }();

  return ChatContainer;
}(React.PureComponent);

ChatContainer.defaultProps = {
  customKey: "chat",
  docked: false,
  customClassName: "",
  dockStartOpen: true,
  hideAvatar: false,
  hideName: false,
  svgAvatar: false,
  hideNotificiationBadge: false,
  // header: ({ onClick, isOpen }) => (
  //   <div className="header">
  //     <span className="title">CHAT </span>
  //     <span className="close-button" onClick={onClick}>
  //       {isOpen ? "-" : "+"}
  //     </span>
  //   </div>
  // ),
  header: ChatHeader,
  message: Message,
  footer: Footer
};
ChatContainer.propTypes = {
  player: PropTypes.object.isRequired,
  scope: PropTypes.object.isRequired,
  customKey: PropTypes.string.isRequired,
  timeStamp: PropTypes.instanceOf(Date),
  docked: PropTypes.bool,
  dockStartOpen: PropTypes.bool,
  hideAvatar: PropTypes.bool,
  hideName: PropTypes.bool,
  svgAvatar: PropTypes.bool,
  customClassName: PropTypes.string,
  onNewMessage: PropTypes.func,
  onIncomingMessage: PropTypes.func,
  filter: PropTypes.func,
  header: PropTypes.elementType.isRequired,
  message: PropTypes.elementType.isRequired,
  footer: PropTypes.elementType.isRequired
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ChatHeader.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/chat/ChatHeader.js                                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return ChatHeader;
  }
});
module.link("./style.less");
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);

var ChatHeader = /*#__PURE__*/function (_React$PureComponent) {
  _inheritsLoose(ChatHeader, _React$PureComponent);

  var _super = _createSuper(ChatHeader);

  function ChatHeader() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = ChatHeader.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          otherPlayer = _this$props.otherPlayer,
          onTitleClick = _this$props.onTitleClick,
          onXClick = _this$props.onXClick,
          playerIsOnline = _this$props.playerIsOnline;
      return /*#__PURE__*/React.createElement("div", {
        className: "header " + otherPlayer.toLowerCase()
      }, /*#__PURE__*/React.createElement("span", {
        className: "title",
        onClick: onTitleClick
      }, " ", otherPlayer, " ", playerIsOnline ? "" : " (offline)"), /*#__PURE__*/React.createElement("span", {
        className: "close-button",
        onClick: onXClick
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/icon-net-window-close.png",
        width: "17px",
        height: "17px"
      })));
    }

    return render;
  }();

  return ChatHeader;
}(React.PureComponent);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ErrorBoundary.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/chat/ErrorBoundary.js                                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return ErrorBoundary;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);

var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ErrorBoundary, _React$Component);

  var _super = _createSuper(ErrorBoundary);

  function ErrorBoundary(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      hasError: false
    };
    return _this;
  }

  ErrorBoundary.getDerivedStateFromError = function () {
    function getDerivedStateFromError(error) {
      return {
        hasError: true
      };
    }

    return getDerivedStateFromError;
  }();

  var _proto = ErrorBoundary.prototype;

  _proto.componentDidCatch = function () {
    function componentDidCatch(error, errorInfo) {
      console.error("error on chat package ", error);
      console.error("error on chat package:info ", errorInfo);
    }

    return componentDidCatch;
  }();

  _proto.render = function () {
    function render() {
      if (this.state.hasError) {
        return /*#__PURE__*/React.createElement("h1", null, "Something went wrong.");
      }

      return this.props.children;
    }

    return render;
  }();

  return ErrorBoundary;
}(React.Component);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Footer.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/chat/Footer.js                                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default: function (v) {
    _objectSpread = v;
  }
}, 0);

var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 1);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 2);
module.export({
  "default": function () {
    return Footer;
  }
});
module.link("./style.less");
var PropTypes;
module.link("prop-types", {
  "default": function (v) {
    PropTypes = v;
  }
}, 0);
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 1);
var TimeSync;
module.link("meteor/mizzao:timesync", {
  TimeSync: function (v) {
    TimeSync = v;
  }
}, 2);
var moment;
module.link("moment", {
  "default": function (v) {
    moment = v;
  }
}, 3);

var _;

module.link("lodash", {
  "default": function (v) {
    _ = v;
  }
}, 4);

var Footer = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Footer, _React$Component);

  var _super = _createSuper(Footer);

  function Footer() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      comment: "",
      rows: 1,
      minRows: 1,
      maxRows: 5,
      buttonHeight: 30
    };
    _this.updateLastActive = _.throttle(function (player) {
      return player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    }, 5000, {
      leading: true
    });

    _this.handleSubmit = function (e) {
      e.preventDefault();

      var text = _this.state.comment.trim();

      if (text === "") {
        return;
      }

      var _this$props = _this.props,
          player = _this$props.player,
          onNewMessage = _this$props.onNewMessage,
          timeStamp = _this$props.timeStamp;
      var msg = {
        text: text,
        player: {
          _id: player._id,
          avatar: player.get("avatar"),
          name: player.get("name") || player._id
        }
      };

      if (timeStamp) {
        msg = _objectSpread({}, msg, {
          timeStamp: timeStamp
        });
      }

      onNewMessage(msg);
      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));

      _this.setState({
        comment: ""
      });
    };

    _this.handleChange = function (e) {
      var _this$setState;

      var player = _this.props.player;
      var el = e.currentTarget;
      var textareaLineHeight = 24;
      var _this$state = _this.state,
          minRows = _this$state.minRows,
          maxRows = _this$state.maxRows;
      var previousRows = e.target.rows;
      e.target.rows = minRows; // reset number of rows in textarea

      var currentRows = ~~(e.target.scrollHeight / textareaLineHeight);

      if (currentRows === previousRows) {
        e.target.rows = currentRows;
      }

      if (currentRows >= maxRows) {
        e.target.rows = maxRows;
        e.target.scrollTop = e.target.scrollHeight;
      }

      var usedRows = currentRows < maxRows ? currentRows : maxRows;

      _this.updateLastActive(player);

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState.rows = usedRows, _this$setState), function () {
        _this.setState({
          buttonHeight: document.getElementById("chat-input").offsetHeight
        });
      });
    };

    return _this;
  }

  var _proto = Footer.prototype;

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var _this$state2 = this.state,
          comment = _this$state2.comment,
          rows = _this$state2.rows,
          buttonHeight = _this$state2.buttonHeight;
      return /*#__PURE__*/React.createElement("form", {
        className: "chat-footer-form",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("div", {
        className: "chat-footer"
      }, /*#__PURE__*/React.createElement("textarea", {
        id: "chat-input",
        name: "comment",
        className: "chat-input",
        placeholder: "My message",
        value: comment,
        onKeyPress: function (e) {
          if (e.key === "Enter") {
            _this2.handleSubmit(e);
          }
        },
        rows: rows,
        onChange: this.handleChange,
        autoComplete: "off"
      })), /*#__PURE__*/React.createElement("button", {
        type: "submit",
        form: "chat-input",
        className: "chat-button-send",
        disabled: !comment,
        onClick: this.handleSubmit
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/icon-enter.png",
        width: "15px",
        height: "17px"
      })));
    }

    return render;
  }();

  return Footer;
}(React.Component);

Footer.propTypes = {
  player: PropTypes.object.isRequired,
  scope: PropTypes.object.isRequired,
  customKey: PropTypes.string.isRequired,
  onNewMessage: PropTypes.func,
  timeStamp: PropTypes.instanceOf(Date)
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Message.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/chat/Message.js                                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 0);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 1);
module.export({
  "default": function () {
    return Message;
  }
});
var PropTypes;
module.link("prop-types", {
  "default": function (v) {
    PropTypes = v;
  }
}, 0);
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 1);
var isString;
module.link("lodash", {
  isString: function (v) {
    isString = v;
  }
}, 2);

var Message = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Message, _React$Component);

  var _super = _createSuper(Message);

  function Message() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.renderTime = function (timeStamp) {
      var hours = new Date(timeStamp).getHours();
      var minutes = new Date(timeStamp).getMinutes();

      if (!hours || !minutes) {
        return null;
      }

      var time = hours.toString().padStart(2, 0) + ":" + minutes.toString().padStart(2, 0);
      return /*#__PURE__*/React.createElement("div", {
        className: "timeStamp"
      }, time);
    };

    _this.renderName = function (isSelf, name) {
      return /*#__PURE__*/React.createElement("div", {
        className: "name"
      }, isSelf ? "You" : name);
    };

    return _this;
  }

  var _proto = Message.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          message = _this$props.message,
          player = _this$props.player,
          hideName = _this$props.hideName,
          hideAvatar = _this$props.hideAvatar,
          svgAvatar = _this$props.svgAvatar,
          avatar = _this$props.avatar;
      var msgPlayer = message.player,
          text = message.text,
          timeStamp = message.timeStamp;
      var isSelf = player._id == msgPlayer._id;
      var avatarImg;
      var useAvatar = !hideAvatar && (svgAvatar || avatar);

      if (useAvatar && avatar) {
        if (isString(avatar)) {
          console.warn("Deprecation: avatar should be an object containing a src or svg property");
          avatarImg = /*#__PURE__*/React.createElement("img", {
            className: "avatar",
            alt: '',
            src: avatar
          });
        } else {
          var avatarSrc = avatar.svg || avatar.src;

          if (avatar.svg) {
            avatarImg = /*#__PURE__*/React.createElement("div", {
              dangerouslySetInnerHTML: {
                __html: avatarSrc
              },
              className: "avatar"
            });
          } else {
            avatarImg = /*#__PURE__*/React.createElement("img", {
              className: "avatar",
              alt: avatar.alt,
              src: avatar.src
            });
          }
        }
      }

      return /*#__PURE__*/React.createElement("div", null, !isSelf ? /*#__PURE__*/React.createElement("div", {
        className: "message"
      }, /*#__PURE__*/React.createElement("div", {
        className: "other-message-tick-container"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/net-bubble.png",
        width: "15px",
        height: "10px"
      })), /*#__PURE__*/React.createElement("div", {
        className: "text-container-other"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text"
      }, text))) : /*#__PURE__*/React.createElement("div", {
        className: "message"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-container-self"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text"
      }, text)), /*#__PURE__*/React.createElement("div", {
        className: "self-message-tick-container"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/my-bubble.png",
        width: "15px",
        height: "10px"
      }))));
    }

    return render;
  }();

  return Message;
}(React.Component);

Message.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    player: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string
    })
  }).isRequired,
  self: PropTypes.bool,
  hideAvatar: PropTypes.bool,
  hideName: PropTypes.bool,
  svgAvatar: PropTypes.bool,
  avatar: PropTypes.shape({
    svg: PropTypes.string,
    src: PropTypes.string,
    alt: PropTypes.string
  })
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Messages.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/chat/Messages.js                                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _objectWithoutProperties;

module.link("@babel/runtime/helpers/objectWithoutProperties", {
  default: function (v) {
    _objectWithoutProperties = v;
  }
}, 0);

var _extends;

module.link("@babel/runtime/helpers/extends", {
  default: function (v) {
    _extends = v;
  }
}, 1);

var _toConsumableArray;

module.link("@babel/runtime/helpers/toConsumableArray", {
  default: function (v) {
    _toConsumableArray = v;
  }
}, 2);

var _createSuper;

module.link("@babel/runtime/helpers/createSuper", {
  default: function (v) {
    _createSuper = v;
  }
}, 3);

var _inheritsLoose;

module.link("@babel/runtime/helpers/inheritsLoose", {
  default: function (v) {
    _inheritsLoose = v;
  }
}, 4);
var PropTypes;
module.link("prop-types", {
  "default": function (v) {
    PropTypes = v;
  }
}, 0);
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 1);

function filteredMessages(WrappedComponent) {
  return /*#__PURE__*/function (_React$Component) {
    _inheritsLoose(_class, _React$Component);

    var _super = _createSuper(_class);

    function _class() {
      return _React$Component.apply(this, arguments) || this;
    }

    var _proto = _class.prototype;

    _proto.render = function () {
      function render() {
        var _this$props = this.props,
            scope = _this$props.scope,
            customKey = _this$props.customKey,
            filter = _this$props.filter;
        var messages = scope.get(customKey) || [];

        if (filter) {
          messages = filter(messages);
        }

        return /*#__PURE__*/React.createElement(WrappedComponent, _extends({
          messages: _toConsumableArray(messages)
        }, this.props));
      }

      return render;
    }();

    return _class;
  }(React.Component);
}

var Messages = /*#__PURE__*/function (_React$Component2) {
  _inheritsLoose(Messages, _React$Component2);

  var _super2 = _createSuper(Messages);

  function Messages(props) {
    var _this;

    _this = _React$Component2.call(this, props) || this;
    _this.messagesEl = React.createRef();
    _this.state = {
      messageLength: 0
    };
    return _this;
  }

  var _proto2 = Messages.prototype;

  _proto2.componentDidMount = function () {
    function componentDidMount() {
      this.messagesEl.current.scrollTop = this.messagesEl.current.scrollHeight;
      this.setState({
        messageLength: this.props.messages.length
      });
    }

    return componentDidMount;
  }();

  _proto2.componentDidUpdate = function () {
    function componentDidUpdate(prevProps) {
      var _this2 = this;

      var messageLength = this.state.messageLength;
      var _this$props2 = this.props,
          currentMessages = _this$props2.messages,
          onIncomingMessage = _this$props2.onIncomingMessage,
          customKey = _this$props2.customKey;

      if (this.messagesEl.current !== null && currentMessages.length > messageLength) {
        this.setState({
          messageLength: currentMessages.length
        }, function () {
          if (onIncomingMessage) {
            onIncomingMessage(currentMessages.splice(_this2.state.messageLength), customKey);
          }

          _this2.messagesEl.current.scrollTop = _this2.messagesEl.current.scrollHeight;
        });
      }
    }

    return componentDidUpdate;
  }();

  _proto2.render = function () {
    function render() {
      var _this$props3 = this.props,
          player = _this$props3.player,
          messages = _this$props3.messages,
          MessageComp = _this$props3.messageComp,
          otherPlayer = _this$props3.otherPlayer,
          rest = _objectWithoutProperties(_this$props3, ["player", "messages", "messageComp", "otherPlayer"]);

      return /*#__PURE__*/React.createElement("div", {
        className: "messages",
        ref: this.messagesEl
      }, messages.length === 0 ? /*#__PURE__*/React.createElement("div", {
        className: "empty"
      }, "No messages yet...") : null, messages.map(function (message, i) {
        return /*#__PURE__*/React.createElement(MessageComp, _extends({
          key: i,
          message: message,
          player: player
        }, rest));
      }));
    }

    return render;
  }();

  return Messages;
}(React.Component);

Messages.propTypes = {
  player: PropTypes.object,
  messageComp: PropTypes.elementType,
  filter: PropTypes.func,
  onIncomingMessage: PropTypes.func,
  hideAvatar: PropTypes.bool,
  hideName: PropTypes.bool,
  svgAvatar: PropTypes.bool,
  customKey: PropTypes.string
};
module.exportDefault(filteredMessages(Messages));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"style.less":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/chat/style.less                                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// These styles have already been applied to the document.

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"main.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// client/main.js                                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Empirica;
module.link("meteor/empirica:core", {
  "default": function (v) {
    Empirica = v;
  }
}, 0);
var render;
module.link("react-dom", {
  render: function (v) {
    render = v;
  }
}, 1);
var ExitSurvey;
module.link("./exit/ExitSurvey", {
  "default": function (v) {
    ExitSurvey = v;
  }
}, 2);
var PreQualExitSurvey;
module.link("./exit/PreQualExitSurvey", {
  "default": function (v) {
    PreQualExitSurvey = v;
  }
}, 3);
var FinalMidSurveyOne;
module.link("./exit/final-mid-survey/FinalMidSurvey1", {
  "default": function (v) {
    FinalMidSurveyOne = v;
  }
}, 4);
var FinalMidSurveyTwo;
module.link("./exit/final-mid-survey/FinalMidSurvey2", {
  "default": function (v) {
    FinalMidSurveyTwo = v;
  }
}, 5);
var FinalMidSurveyThree;
module.link("./exit/final-mid-survey/FinalMidSurvey3", {
  "default": function (v) {
    FinalMidSurveyThree = v;
  }
}, 6);
var FinalMidSurveyFour;
module.link("./exit/final-mid-survey/FinalMidSurvey4", {
  "default": function (v) {
    FinalMidSurveyFour = v;
  }
}, 7);
var FinalMidSurveyFive;
module.link("./exit/final-mid-survey/FinalMidSurvey5", {
  "default": function (v) {
    FinalMidSurveyFive = v;
  }
}, 8);
var Thanks;
module.link("./exit/Thanks", {
  "default": function (v) {
    Thanks = v;
  }
}, 9);
var Sorry;
module.link("./exit/Sorry", {
  "default": function (v) {
    Sorry = v;
  }
}, 10);
var About;
module.link("./game/About", {
  "default": function (v) {
    About = v;
  }
}, 11);
var Round;
module.link("./game/Round", {
  "default": function (v) {
    Round = v;
  }
}, 12);
var Consent;
module.link("./intro/Consent", {
  "default": function (v) {
    Consent = v;
  }
}, 13);
var NetworkSurveySelfContacts;
module.link("./intro/network-survey/NetworkSurveySelfContacts", {
  "default": function (v) {
    NetworkSurveySelfContacts = v;
  }
}, 14);
var NetworkSurveySelfEC;
module.link("./intro/network-survey/NetworkSurveySelfEC", {
  "default": function (v) {
    NetworkSurveySelfEC = v;
  }
}, 15);
var NetworkSurveyContactsEC;
module.link("./intro/network-survey/NetworkSurveyContactsEC", {
  "default": function (v) {
    NetworkSurveyContactsEC = v;
  }
}, 16);
var NetworkSurveySelfFrequency;
module.link("./intro/network-survey/NetworkSurveySelfFrequency", {
  "default": function (v) {
    NetworkSurveySelfFrequency = v;
  }
}, 17);
var NetworkSurveyContactsFrequency;
module.link("./intro/network-survey/NetworkSurveyContactsFrequency", {
  "default": function (v) {
    NetworkSurveyContactsFrequency = v;
  }
}, 18);
var NetworkSurveyRelationshipInterpreter;
module.link("./intro/network-survey/NetworkSurveyRelationshipInterpreter", {
  "default": function (v) {
    NetworkSurveyRelationshipInterpreter = v;
  }
}, 19);
var NetworkSurveyGenderInterpreter;
module.link("./intro/network-survey/NetworkSurveyGenderInterpreter", {
  "default": function (v) {
    NetworkSurveyGenderInterpreter = v;
  }
}, 20);
var NetworkSurveyPersonalQuestions;
module.link("./intro/network-survey/NetworkSurveyPersonalQuestions", {
  "default": function (v) {
    NetworkSurveyPersonalQuestions = v;
  }
}, 21);
var TutorialPageOne;
module.link("./intro/tutorial/TutorialPageOne", {
  "default": function (v) {
    TutorialPageOne = v;
  }
}, 22);
var TutorialPageTwo;
module.link("./intro/tutorial/TutorialPageTwo", {
  "default": function (v) {
    TutorialPageTwo = v;
  }
}, 23);
var TutorialPageThree;
module.link("./intro/tutorial/TutorialPageThree", {
  "default": function (v) {
    TutorialPageThree = v;
  }
}, 24);
var TutorialPageFour;
module.link("./intro/tutorial/TutorialPageFour", {
  "default": function (v) {
    TutorialPageFour = v;
  }
}, 25);
var AllQuiz;
module.link("./intro/quiz/AllQuiz", {
  "default": function (v) {
    AllQuiz = v;
  }
}, 26);
var QuizFive;
module.link("./intro/quiz/QuizFive", {
  "default": function (v) {
    QuizFive = v;
  }
}, 27);
var QuizSix;
module.link("./intro/quiz/QuizSix", {
  "default": function (v) {
    QuizSix = v;
  }
}, 28);
var QuizSeven;
module.link("./intro/quiz/QuizSeven", {
  "default": function (v) {
    QuizSeven = v;
  }
}, 29);
var QuizTwo;
module.link("./intro/quiz/QuizTwo", {
  "default": function (v) {
    QuizTwo = v;
  }
}, 30);
var QuizOne;
module.link("./intro/quiz/QuizOne", {
  "default": function (v) {
    QuizOne = v;
  }
}, 31);
var QuizOverview;
module.link("./intro/quiz/QuizOverview", {
  "default": function (v) {
    QuizOverview = v;
  }
}, 32);
var EnglishScreen;
module.link("./intro/english-screening/EnglishScreen", {
  "default": function (v) {
    EnglishScreen = v;
  }
}, 33);
var DescribeSymbolQuestion;
module.link("./intro/DescribeSymbolQuestion", {
  "default": function (v) {
    DescribeSymbolQuestion = v;
  }
}, 34);
var Schedule;
module.link("./intro/Schedule", {
  "default": function (v) {
    Schedule = v;
  }
}, 35);
var NewPlayer;
module.link("./intro/NewPlayer", {
  "default": function (v) {
    NewPlayer = v;
  }
}, 36);
// Get rid of Breadcrumb component
Empirica.breadcrumb(function () {
  return null;
}); // Set the About Component you want to use for the About dialog (optional).

Empirica.about(About); // Set the Consent Component you want to present players (optional).

Empirica.consent(Consent); // Set the component for getting the player id (optional)

Empirica.newPlayer(NewPlayer); // Introduction pages to show before they play the game (optional).
// At this point they have been assigned a treatment. You can return
// different instruction steps depending on the assigned treatment.

Empirica.introSteps(function (game, treatment) {
  // MidSurveyFive, MidSurveyFour, MidSurveyThree, MidSurveyTwo, MidSurveyOne,
  var durationConsent = [QuizOne];
  var englishScreen = [EnglishScreen];
  var networkSurvey = [NetworkSurveySelfContacts, NetworkSurveySelfEC, NetworkSurveySelfFrequency, NetworkSurveyContactsEC, NetworkSurveyRelationshipInterpreter, NetworkSurveyGenderInterpreter, NetworkSurveyPersonalQuestions];
  var tutorialSteps = [TutorialPageOne, TutorialPageThree, TutorialPageFour];
  var symbolDescription = [DescribeSymbolQuestion]; // const quizSteps = [QuizOne, QuizTwo, QuizThree, QuizFour, QuizFive, QuizSix, QuizSeven, QuizEight,];
  // const quizSteps = [AllQuiz];

  var quizSteps = [QuizFive, QuizSix, QuizSeven, QuizTwo];
  var quizOverview = [QuizOverview];
  var schedule = [Schedule];
  var steps;

  if (game.treatment.isPreQualification) {
    steps = durationConsent.concat(englishScreen, tutorialSteps, quizSteps, symbolDescription, networkSurvey, schedule); // steps = englishScreen.concat(networkSurvey,tutorialSteps,quizSteps, symbolDescription, schedule);
    // steps = quizSteps.concat(symbolDescription);
  } else {
    steps = tutorialSteps.concat(quizOverview);
  }

  if (treatment.skipIntro) {
    return [];
  }

  return steps;
}); // The Round component containing the game UI logic.
// This is where you will be doing the most development.
// See client/game/Round.jsx to learn more.

Empirica.round(Round); // End of Game pages. These may vary depending on player or game information.
// For example we can show the score of the user, or we can show them a
// different message if they actually could not participate the game (timed
// out), etc.
// The last step will be the last page shown to user and will be shown to the
// user if they come back to the website.
// If you don't return anything, or do not define this function, a default
// exit screen will be shown.

Empirica.exitSteps(function (game, player) {
  if (player.exitStatus && player.exitStatus === "custom" && (player.exitReason === "maxGameTimeReached" || player.exitReason === "minPlayerCountNotMaintained")) {
    return [FinalMidSurveyOne, FinalMidSurveyTwo, FinalMidSurveyThree, FinalMidSurveyFour, FinalMidSurveyFive, ExitSurvey, Thanks];
  }

  if (player.exitStatus && player.exitStatus === "custom" && player.exitReason === "preQualSuccess") {
    return [PreQualExitSurvey, Thanks];
  }

  if (!game || player.exitStatus && player.exitStatus !== "finished" && player.exitReason !== "playerQuit") {
    return [Sorry];
  }

  return [ExitSurvey, Thanks];
}); // Start the app render tree.
// NB: This must be called after any other Empirica calls (Empirica.round(),
// Empirica.introSteps(), ...).
// It is required and usually does not need changing.

Meteor.startup(function () {
  render(Empirica.routes(), document.getElementById("app"));
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"public":{"css":{"intro.css":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// public/css/intro.css                                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = require("meteor/modules").addStyles(
  "/* Network Survey */\n.network-survey-container {\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n    height: 100%;\n    justify-content: center;\n    align-items: center;\n    text-align: center;\n    font-family: \"Palatino Linotype\", \"Book Antiqua\", \"Palatino\", serif;\n}\n\n.network-survey-container p {\n    display: flex;\n    margin-block-start: 1em;\n    margin-block-end: 1em;\n    margin-inline-start: 0px;\n    margin-inline-end: 0px;\n}\n\n.network-survey-header p {\n    font-weight: bold;\n    text-transform: uppercase;\n    color: var(--darkblue);\n    font-size: 16px;\n    padding: 2em;\n}\n\n.network-survey-body {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    padding: 2em;\n    width: 70%;\n    margin: auto;\n}\n\n.network-survey-body p  {\n    text-transform: none;\n    font-weight: normal;\n    color: var(--darkblue);\n    font-size: 16px;\n}\n\n.network-form {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    padding: 2em;\n    width: 100%;\n}\n\n.input-row {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    width: 50%;\n}\n\n.dropdown-input-label {\n    display: flex;\n    width: 70%;\n    align-items: center;\n    justify-content: center;\n}\n\n.input-label {\n    display: flex;\n    margin-right: 10px;\n}\n\n.relationship-input-row {\n    display: flex;\n    width: 100%;\n    align-items: center;\n    justify-content: center;\n}\n\n.relationship-input-label {\n    display: flex;\n    width: 40%;\n    align-items: center;\n    justify-content: center;\n}\n\n.relationship-buttons-container {\n    display: flex;\n    width: 60%;\n    justify-content: space-evenly;\n}\n\n.network-relationship-button {\n    display: flex;\n    font-family: \"Palatino Linotype\", \"Book Antiqua\", Palatino, serif;\n    font-size: 16px;\n    align-items: center;\n    padding: 0.25em 1em;\n    border: 1px solid black;\n    border-radius: 5px;\n\n    background-color: transparent;\n}\n\n.network-relationship-button:hover {\n    background-color: rgb(142, 209, 205);\n}\n\n.network-relationship-button.selected {\n    text-decoration-color: white;\n    background-color: var(--turquoise);\n}\n\n.network-relationship-button.selected:hover {\n    background: #03a5a7;\n}\n\n.network-button-container {\n    display: flex;\n    width: 100%;\n    justify-content: flex-start;\n    margin-top: 23px;\n}\n\n.personal-input-container {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: flex-start;\n    width: 100%;\n}\n\n.personal-input-container-row {\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-start;\n    align-items: center;\n    width: 100%;\n}\n\n.personal-input-radio-list-container {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    justify-content: flex-start;\n    padding-left: 1em;\n}\n\n.personal-input-radio-container{\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    justify-content: flex-start;\n}\n\n.personal-input-race-specific-container {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    justify-content: flex-start;\n    margin-left: 1em;\n}\n\n.personal-input-race-specific-input {\n    font-size: \"10px\";\n    margin-bottom: 1em;\n    overflow: auto;\n}\n\n.personal-input-job-title-input {\n    font-size: \"10px\";\n    margin-left: 1em;\n    overflow: auto\n}\n\n.network-list {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    text-transform: none;\n    max-width: 75%;\n    margin: auto;\n}\n\n.network-list li {\n    display: list-item;\n    margin-left: 10px;\n    list-style-type: disc;\n    width: 100%;\n    padding: 1em 2em;\n    text-transform: none;\n    font-style: italic;\n    font-weight: normal;\n    color: var(--darkblue);\n    font-size: 16px;\n}\n\n.dropdown-select-input {\n    font-size: 14px;\n    color: var(--darkblue);\n    margin: 2px;\n    border-radius: 5px;\n}\n\n.name-matrix-table {\n    width: 60%;\n    margin: 0px auto 2em;\n    font-size: 16px;\n}\n\nthead, tbody, tfoot { vertical-align: middle } /* add this rule*/\ntd, th, tr { vertical-align: inherit } /* add this rule */\n\n/* Tutorial */\n\n.tutorial-container {\n    display: flex;\n    flex-direction: column;\n}\n\n.title-static-image {\n    display: flex;\n    justify-content: flex-start;\n    padding: 30px 15px;\n}\n\n.two-col {\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n    width: 60%;\n}\n\n.tutorial-content {\n    display: flex;\n    flex-direction: column;\n}\n\n.tutorial-static-image {\n    display:flex;\n    margin-right: 40px;\n    width: 45%;\n    justify-content: center;\n    align-items: center;\n}\n\n.tutorial-info {\n    width: 50%;\n}\n\n.intro-heading {\n    font-family:\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif; \n    font-style:italic; \n    text-transform:uppercase; \n    font-weight:normal;\n    margin: 0px 0px;\n    font-size: 26px;\n    color: var(--darkblue);\n}\n\n.tutorial-body {\n    font-size: 16px;\n    word-spacing: 0.3em;\n    margin-top: 1rem;\n    color: var(--darkblue);\n}\n\n/* BUTTON STYLING AND POSITIONING */\n\n.tutorial-next-btn {\n    position: fixed;\n    top: 50%;\n    right: 0;\n    text-align:left;\n    background: var(--turquoise); \n\n}\n\n.tutorial-next-btn:hover {\n    margin-right: 20px;\n    background:var(--periwinkle)\n}\n\n.tutorial-next-btn:after {border-left:21px solid var(--turquoise); transition:.35s ease; -moz-transition:.35s ease; -webkit-transition:.35s ease}\n.tutorial-next-btn:hover:after {border-left:21px solid var(--periwinkle)}\n\n.tutorial-prev-btn {\n    position: fixed;\n    top: 50%;\n    left: 0;\n    text-align:right;\n    background: var(--turquoise); \n}\n\n.tutorial-prev-btn:hover {\n    margin-left: 20px;\n    background:var(--periwinkle)\n}\n\n.tutorial-prev-btn:before {border-right:21px solid var(--turquoise); transition:.35s ease; -moz-transition:.35s ease; -webkit-transition:.35s ease}\n.tutorial-prev-btn:hover:before {border-right:21px solid var(--periwinkle)}\n\n\n\n\n/* QUESTIONNAIRE STYLING */\n\n.questionnaire-radio {\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n    align-items: center;\n\n}\n\n.questionnaire-radio .quiz-button {\n    margin-right: 5px;\n    cursor: pointer;\n}\n\n.english-screening-buttons {\n    display: flex;\n    flex-direction: row;\n}\n\n.english-screening-horizontal-bar {\n    display: flex;\n}\n\n.questionnaire-heading {\n    margin: 10% auto 5% auto;\n    display: flex;\n    justify-content: center;\n    width: 590px;\n    text-align: center;\n}\n\n.question-section {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    margin-top: 15px;\n}\n\n.questionnaire-question {\n    padding-bottom: 20px;\n}\n\n.questionnaire-content-container {\n    display:flex;\n    flex-direction:column;\n    align-items: flex-start;\n    width: 590px;\n}\n\n.questionnaire-body {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    background-color: white;\n    font-family: \"Trebuchet MS\", Arial, Helvetica, sans-serif;\n    color: var(--darkblue);\n    width: 100%;\n    font-size: 15px;\n    padding: 25px;\n}\n\n.questionnaire-btn-container {\n    display: flex;\n}\n\n.progress-bar {\n    display: flex;\n    flex-direction:row;\n    align-items: flex-end;\n}\n\n.completed-heading {\n    font-family: \"Trebuchet MS\", Arial, Helvetica, sans-serif;\n    color: var(--turquoise);\n    font-size: 20px;\n    font-weight: bold;\n}\n\n.completed-bar {\n    display: flex;\n    flex-direction: column;\n}\n\n.slider-value-container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    width: 100%;\n}\n\n.slider-value {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border: 1px solid lightgrey;\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n    background-color: lightgrey;\n}\n\n/* Customizing SLIDER */\n\n.player-slider-container {\n    display: flex;\n    flex-direction: row;\n    width: 100%;\n    padding: 15px 0px;\n}\n\n.player-label {\n    display: flex;\n    width: 25%;\n    padding: 5px 5px;\n    overflow-wrap: anywhere;\n}\n\n.empirica-slider {\n    width: 100%;\n}\n\n.bp3-slider-axis {\n    display: flex;\n    justify-content: space-between;\n}\n\n.bp3-slider-label {\n    transform: translate(0%, 20px);\n    display: flex;\n    position: static;\n    padding: 2px 5px;\n    vertical-align: top;\n    line-height: 1;\n    font-size: 12px;\n}\n\n.bp3-slider-track {\n    background-color: var(--darkblue);\n}\n\n.bp3-slider-handle {\n    background-color: var(--turquoise);\n    border: 1px solid var(--turquoise);\n    border-radius: 50%;\n    background-image: none;\n    box-shadow: none;\n    width: 20px;\n    height: 20px;\n}\n\n/* Turn off label that appears below slider handle */\n.bp3-slider-handle .bp3-slider-label {\n    display: none;\n}\n\n\n.survey-textarea {\n    width: 100%;\n    resize: vertical;\n    padding: 5px 5px 5px 5px;\n    margin-bottom: 30px;\n}\n\n\n\n"
);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".less",
    ".css",
    ".mjs",
    ".jsx"
  ]
});

var exports = require("/client/main.js");