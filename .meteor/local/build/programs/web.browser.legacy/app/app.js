var require = meteorInstall({"client":{"game":{"mid-survey":{"MidSurvey1.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/mid-survey/MidSurvey1.jsx                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
          player = _this$props.player;
      var surveyNumber = player.get("surveyNumber");
      event.preventDefault(); // TODO: log player response to survey question

      player.round.set("survey_" + surveyNumber, _this.state);
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MidSurvey2.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/mid-survey/MidSurvey2.jsx                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
          player = _this$props.player;
      var surveyNumber = player.get("surveyNumber");
      event.preventDefault(); // TODO: log player response to survey question

      player.round.set("survey_" + surveyNumber, _this.state);
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MidSurvey3.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/mid-survey/MidSurvey3.jsx                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
          player = _this$props2.player;
      var surveyNumber = player.get("surveyNumber");
      event.preventDefault(); // TODO: log player response to survey question

      player.round.set("survey_" + surveyNumber, _this.state);
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MidSurvey4.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/mid-survey/MidSurvey4.jsx                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
          player = _this$props2.player;
      var surveyNumber = player.get("surveyNumber");
      event.preventDefault(); // TODO: log player response to survey question

      player.round.set("survey_" + surveyNumber, _this.state);
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MidSurvey5.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/mid-survey/MidSurvey5.jsx                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
var PlayerTab;
module.link("../PlayerTab", {
  "default": function (v) {
    PlayerTab = v;
  }
}, 5);

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
          player = _this$props2.player;
      var surveyNumber = player.get("surveyNumber");
      event.preventDefault(); // TODO: log player response to survey question

      player.round.set("survey_" + surveyNumber, _this.state);
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
        className: "arrow-button button-submit",
        type: "submit"
      }, " Submit "))));
    }

    return render;
  }();

  return MidSurveyFive;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"About.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/About.jsx                                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"InactiveTimer.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/InactiveTimer.jsx                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      var player = _this.props.player;

      _this.setState({
        modalIsOpen: false
      });

      player.set("lastActive", moment(TimeSync.serverTime(null, 1000)));
    };

    _this.onPlayerInactive = function (player) {
      if (player.get("inactive") === false) {
        player.set("inactive", true);
        player.set("submitted", false);
      }
    };

    _this.state = {
      modalIsOpen: false
    };
    return _this;
  }

  var _proto = inactiveTimer.prototype;

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var _this$props = this.props,
          game = _this$props.game,
          round = _this$props.round,
          stage = _this$props.stage,
          player = _this$props.player;
      var currentTime = moment(TimeSync.serverTime(null, 1000));
      var inactiveDuration = game.treatment.userInactivityDuration;
      var activePlayers = game.players.filter(function (p) {
        return !p.get("inactive");
      });
      console.log(activePlayers);
      activePlayers.forEach(function (p) {
        var playerLastActive = p.get("lastActive");
        var timeDiff = currentTime.diff(playerLastActive, 'seconds');

        if (timeDiff >= inactiveDuration) {
          _this2.onPlayerInactive(p);

          p.exit("inactive"); // this.onPlayerInactive();
        } else if (timeDiff > inactiveDuration - game.treatment.idleWarningTime) {
          if (!_this2.state.modalIsOpen && p._id === player._id) {
            _this2.onOpenModal();
          }
        }
      }); // const playerLastActive = player.get("lastActive");
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

      return /*#__PURE__*/React.createElement("div", null, this.state.modalIsOpen && /*#__PURE__*/React.createElement(Modal, {
        game: game,
        player: player,
        onCloseModal: this.onCloseModal
      }));
    }

    return render;
  }();

  return inactiveTimer;
}(React.Component);

module.exportDefault(InactiveTimer = StageTimeWrapper(inactiveTimer));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Modal.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/Modal.jsx                                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      }, "Warning, you seem to be inactive. You have ", game.treatment.idleWarningTime, " seconds before you will be kicked due to inactivity. Are you still here?"), /*#__PURE__*/React.createElement("button", {
        className: "modal-button",
        onClick: onCloseModal
      }, "Yes"))));
    }

    return render;
  }();

  return Modal;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MyNetwork.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/MyNetwork.jsx                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PlayerProfile.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/PlayerProfile.jsx                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PlayerTab.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/PlayerTab.jsx                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Results.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/Results.jsx                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Round.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/Round.jsx                                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      uncompletedWidth -= windowOffset;

      /*#__PURE__*/
      React.createElement("div", {
        className: "completed-bar"
      }, /*#__PURE__*/React.createElement("img", {
        src: "images/hr-color.png",
        width: completedWidth + " px",
        height: "7px"
      }));
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"RoundMetaData.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/RoundMetaData.jsx                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
var InactiveTimer;
module.link("./InactiveTimer", {
  "default": function (v) {
    InactiveTimer = v;
  }
}, 2);

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
      var playerId = player.id;
      var taskName = stage.displayName;
      var totalTaskRounds = game.treatment.numTaskRounds; // const allSymbols = [];
      // game.players.forEach(player => {
      //     const taskSymbols = 
      // })

      return /*#__PURE__*/React.createElement("div", {
        className: "metadata-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "round-number-container"
      }, taskName, " of ", totalTaskRounds), /*#__PURE__*/React.createElement("p", null, "Your player name is ", player.get("anonymousName")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column"
        }
      }, /*#__PURE__*/React.createElement(Timer, {
        stage: stage
      }), /*#__PURE__*/React.createElement(InactiveTimer, {
        game: game,
        player: player
      })));
    }

    return render;
  }();

  return RoundMetaData;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SocialExposure.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/SocialExposure.jsx                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SymbolButton.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/SymbolButton.jsx                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Task.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/Task.jsx                                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TaskResponse.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/TaskResponse.jsx                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Timer.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game/Timer.jsx                                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      }, "Time Left: ", remainingSeconds)));
    }

    return render;
  }();

  return timer;
}(React.Component);

module.exportDefault(Timer = StageTimeWrapper(timer));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"intro":{"network-survey":{"NetworkSurvey1.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/network-survey/NetworkSurvey1.jsx                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    return NetworkSurveyOne;
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

var NetworkSurveyOne = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NetworkSurveyOne, _React$Component);

  var _super = _createSuper(NetworkSurveyOne);

  function NetworkSurveyOne() {
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
      event.preventDefault(); // TODO: log player response to survey question

      var networkSurveyResponse = _this.state;
      player.set("name", player.id);
      player.set("networkResponse1", networkSurveyResponse);
      onNext();
    };

    return _this;
  }

  var _proto = NetworkSurveyOne.prototype;

  _proto.render = function () {
    function render() {
      var _this$props2 = this.props,
          game = _this$props2.game,
          round = _this$props2.round,
          stage = _this$props2.stage,
          player = _this$props2.player;
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
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
        className: "input-label",
        htmlFor: "name2"
      }, " Name: "), /*#__PURE__*/React.createElement("input", {
        type: "text",
        id: "name2",
        name: "name2",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
        className: "input-label",
        htmlFor: "name3"
      }, " Name: "), /*#__PURE__*/React.createElement("input", {
        type: "text",
        id: "name3",
        name: "name3",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
        className: "input-label",
        htmlFor: "name4"
      }, " Name: "), /*#__PURE__*/React.createElement("input", {
        type: "text",
        id: "name4",
        name: "name4",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
        className: "input-label",
        htmlFor: "name5"
      }, " Name: "), /*#__PURE__*/React.createElement("input", {
        type: "text",
        id: "name5",
        name: "name5",
        onChange: this.handleChange
      })), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut,
        type: "submit"
      }, " Next Page"))))) //   <Centered>
      //     <div>
      //         <div className="network-survey-container">
      //             <p className="network-survey-intro">
      //                 THIS EXPERIMENT IS ABOUT COMMUNICATION NETWORKS. WE BEGIN WITH A QUICK SENSE OF YOUR CURRENT NETWORK.
      //                 <br/>
      //                 HERE IS A GENERIC QUESTION OFTEN USED IN SURVEY RESEARCH:
      //             </p>
      //             <div className="network-survey-body">
      //                 <p>From time to time, most people discuss important matters with other people, people they trust. The range of important matters varies from person to person across work, leisure, family, politics, whatever. The range of relations varies across work, family, friends, and advisors. </p>
      //                 <p> If you look back over the last six months, who are the five people with whom you most discussed matters important to you? Use any symbol that identifies the person for you -- first name, initials, or any name that will let you identify the person. </p>
      //                 <p/>To ensure confidentiality the names typed here will only be recorded in your local browser, and will NOT be sent to the server. It will be erased from your browser when you close or reload the tab. </p>
      //             </div>
      //     </div>
      //     </div>
      // <div className="questionnaire-content-container">
      //     <div className="progress-bar">
      //         <div className="completed-bar">
      //             <div className="completed-heading" style={{marginLeft: stageNumPosition }}> {surveyNumber} </div>
      //             <img src={`images/hr-color.png`} width={`${completedWidth} px`} height="7px" />
      //         </div>
      //         <img src={`images/hr-color-dark.png`} width={`${uncompletedWidth} px`} height="7px" />
      //     </div>
      //     <div className="questionnaire-body">
      //         <label className="questionnaire-question"> Did your group have a leader? If so, who?</label>
      //         {network.map(otherNodeId => {
      //             const otherPlayerId = game.players.find(p => p.get("nodeId") === parseInt(otherNodeId)).id
      //             return (
      //                 <input
      //                     selected={response}
      //                     key={otherPlayerId}
      //                     name="response"
      //                     value={otherPlayerId}
      //                     label={otherPlayerId}
      //                     onChange={this.handleChange}
      //                 />
      //             )
      //             })
      //         }
      //     </div>
      //     <form className="questionnaire-btn-container" onSubmit={this.handleSubmit}>
      //         <button 
      //             className={!response ? "arrow-button button-submit-disabled" : "arrow-button button-submit"}
      //             disabled={!response} type="submit"> Submit </button> 
      //     </form>
      // </div>
      //   </Centered>
      ;
    }

    return render;
  }();

  return NetworkSurveyOne;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"NetworkSurvey2.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/network-survey/NetworkSurvey2.jsx                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    return NetworkSurveyTwo;
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

var DropdownSelect = function () {
  return /*#__PURE__*/React.createElement("div", {
    className: "bp4-html-select"
  }, /*#__PURE__*/React.createElement("select", {
    className: "dropdown-select-input",
    defaultValue: ""
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

var NetworkSurveyTwo = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NetworkSurveyTwo, _React$Component);

  var _super = _createSuper(NetworkSurveyTwo);

  function NetworkSurveyTwo() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.handleChange = function (event) {
      var _this$setState;

      var el = event.currentTarget;

      _this.setState((_this$setState = {}, _this$setState[el.name] = el.value, _this$setState));
    };

    _this.handleSubmit = function (event) {
      var _this$props = _this.props,
          onNext = _this$props.onNext,
          player = _this$props.player;
      var networkSurveyResponse = _this.state;
      event.preventDefault(); // TODO: log player response to survey question

      player.set("networkResponse2", networkSurveyResponse);
      onNext();
    };

    return _this;
  }

  var _proto = NetworkSurveyTwo.prototype;

  _proto.render = function () {
    function render() {
      var _this$props2 = this.props,
          game = _this$props2.game,
          round = _this$props2.round,
          stage = _this$props2.stage,
          player = _this$props2.player;
      var filledOut = true;

      var _player$get = player.get("networkResponse1"),
          name1 = _player$get.name1,
          name2 = _player$get.name2,
          name3 = _player$get.name3,
          name4 = _player$get.name4,
          name5 = _player$get.name5;

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
        htmlFor: "name1"
      }, " ", /*#__PURE__*/React.createElement("p", null, name1), " "), /*#__PURE__*/React.createElement(DropdownSelect, null)), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "name2"
      }, " ", /*#__PURE__*/React.createElement("p", null, name2), " "), /*#__PURE__*/React.createElement(DropdownSelect, null)), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "name3"
      }, " ", /*#__PURE__*/React.createElement("p", null, name3), " "), /*#__PURE__*/React.createElement(DropdownSelect, null)), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "name4"
      }, " ", /*#__PURE__*/React.createElement("p", null, name4), " "), /*#__PURE__*/React.createElement(DropdownSelect, null)), /*#__PURE__*/React.createElement("div", {
        className: "input-row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "dropdown-input-label",
        htmlFor: "name5"
      }, " ", /*#__PURE__*/React.createElement("p", null, name5), " "), /*#__PURE__*/React.createElement(DropdownSelect, null)), /*#__PURE__*/React.createElement("div", {
        className: "network-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: !filledOut ? "arrow-button button-submit-disabled" : "arrow-button button-submit",
        disabled: !filledOut,
        type: "submit"
      }, " Next Page")))));
    }

    return render;
  }();

  return NetworkSurveyTwo;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"NetworkSurvey3.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/network-survey/NetworkSurvey3.jsx                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    return NetworkSurveyThree;
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

var DropdownSelect = function () {
  return /*#__PURE__*/React.createElement("div", {
    className: "bp4-html-select"
  }, /*#__PURE__*/React.createElement("select", {
    className: "dropdown-select-input",
    defaultValue: ""
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

var NetworkSurveyThree = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NetworkSurveyThree, _React$Component);

  var _super = _createSuper(NetworkSurveyThree);

  function NetworkSurveyThree() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

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
      player.set("networkResponse3", networkSurveyResponse); // TODO: log player response to survey question

      onNext();
    };

    return _this;
  }

  var _proto = NetworkSurveyThree.prototype;

  _proto.render = function () {
    function render() {
      var _this$props2 = this.props,
          game = _this$props2.game,
          round = _this$props2.round,
          stage = _this$props2.stage,
          player = _this$props2.player; // const { name1, name2, name3, name4, name5 } = {name1: "w", name2: "a", name3: "s", name4: "d", name5:"f"};

      var filledOut = true;

      var _player$get = player.get("networkResponse1"),
          name1 = _player$get.name1,
          name2 = _player$get.name2,
          name3 = _player$get.name3,
          name4 = _player$get.name4,
          name5 = _player$get.name5;

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
        return /*#__PURE__*/React.createElement("td", {
          key: i
        }, /*#__PURE__*/React.createElement(DropdownSelect, null), " ");
      })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " ", name2), _.times(4, function (i) {
        return i > 0 ? /*#__PURE__*/React.createElement("td", {
          key: i
        }, /*#__PURE__*/React.createElement(DropdownSelect, null), " ") : /*#__PURE__*/React.createElement("td", null);
      })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " ", name3), _.times(4, function (i) {
        return i > 1 ? /*#__PURE__*/React.createElement("td", {
          key: i
        }, /*#__PURE__*/React.createElement(DropdownSelect, null), " ") : /*#__PURE__*/React.createElement("td", null);
      })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " ", name4), _.times(4, function (i) {
        return i > 2 ? /*#__PURE__*/React.createElement("td", {
          key: i
        }, /*#__PURE__*/React.createElement(DropdownSelect, null), " ") : /*#__PURE__*/React.createElement("td", null);
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

  return NetworkSurveyThree;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"quiz":{"AllQuiz.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/quiz/AllQuiz.jsx                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

        player.set("attentionCheckTries", _currentTriesLeft - 1);
        console.log("You have " + player.get("attentionCheckTries") + " tries left."); // If player uses all their attention check tries, they fail; otherwise show them how many tries they have left

        if (player.get("attentionCheckTries") === 0) {
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
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "Are you willing to participate in an online team exercise that could last for approximately 60 minutes?"), /*#__PURE__*/React.createElement(Radio, {
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
      }, game.treatment.endGameIfPlayerIdle ? /*#__PURE__*/React.createElement("span", null, "If you do not interact with the application for a while, your session will timeout and the experiment will end for EVERYONE in your team. 1 minute before the timeout you will be notified you are about to timeout, and be given a chance to reset this timer.") : /*#__PURE__*/React.createElement("span", null, "If you do not interact with the application for a while, your session will timeout and you will be kicked out from the game. 1 minute before the timeout you will be notified you are about to timeout, and be given a chance to reset this timer."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 'bolder'
        }
      }, game.treatment.endGameIfPlayerIdle ? /*#__PURE__*/React.createElement("span", null, "NOTE: If you allow your session to timeout, your HIT will not be accepted. If a team member causes a timeout you will be sent to the end of challenge page, and your HIT will be accepted.") : /*#__PURE__*/React.createElement("span", null, "NOTE: If you allow your session to timeout, your HIT will not be accepted."))), /*#__PURE__*/React.createElement(Radio, {
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
      }, "Is the following statement true or false?", game.treatment.endGameIfPlayerIdle ? /*#__PURE__*/React.createElement("span", null, " If any member of my team doesn't register a guess or communicate with a colleague for long time, the task will end and the entire team (including myself) will be sent to the exit page of the survey.") : /*#__PURE__*/React.createElement("span", null, " If a member of my team doesn't register a guess or communicate with a colleague for long time, the inactive player will be kicked and the task will continue for the rest of the team.")), /*#__PURE__*/React.createElement(Radio, {
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
      }, /*#__PURE__*/React.createElement("label", {
        className: "questionnaire-question"
      }, "If you pass the attention check, you may participate in this task. You will receive a flat fee of $2 for participating. You will also receive $1 bonus each time your team correctly identifies the shared symbol. If you complete all trials of the experiment, you could earn up to $8."), /*#__PURE__*/React.createElement(Radio, {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"AttentionCheckModal.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/quiz/AttentionCheckModal.jsx                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
          onPrev = _this$props.onPrev,
          onCloseModal = _this$props.onCloseModal;
      var triesLeft = player.get("attentionCheckTries");
      return /*#__PURE__*/React.createElement("div", {
        className: "dark-bg",
        onClick: onCloseModal
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal-centered"
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal"
      }, /*#__PURE__*/React.createElement("div", {
        className: "modal-content"
      }, "You have failed the attention check. You have ", triesLeft, " tries left. Please go back and reread the instructions."), /*#__PURE__*/React.createElement("div", {
        className: "attention-check-button-container"
      }, /*#__PURE__*/React.createElement("button", {
        className: "modal-button",
        onClick: onPrev
      }, "Review")))));
    }

    return render;
  }();

  return AttentionCheckModal;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizEight.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/quiz/QuizEight.jsx                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    return QuizEight;
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

var QuizEight = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(QuizEight, _React$Component);

  var _super = _createSuper(QuizEight);

  function QuizEight() {
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
        player.exit("failedQuestion");
      }
    };

    return _this;
  }

  var _proto = QuizEight.prototype;

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
      }, "You have been selected to participate in the task. You will receive a flat fee of $2 for participating. You will also receive $1 bonus each time your team correctly identifies the shared symbol. If you complete all 15 trials of the experiment, you could earn up to $17."), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "yes",
        label: "PROCEED",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "no",
        label: "DO NOT PROCEED",
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

  return QuizEight;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizFive.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/quiz/QuizFive.jsx                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

      if (_this.state.response === 'one') {
        onNext();
      } else {
        player.exit("failedQuestion");
      }
    };

    return _this;
  }

  var _proto = QuizFive.prototype;

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
      }, "On any trial, how many abstract symbols will you and any member of your team have in common?"), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "one",
        label: "Only 1",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "many",
        label: "More than 1",
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

  return QuizFive;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizFour.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/quiz/QuizFour.jsx                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    return QuizFour;
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

var QuizFour = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(QuizFour, _React$Component);

  var _super = _createSuper(QuizFour);

  function QuizFour() {
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
        player.exit("failedQuestion");
      }
    };

    return _this;
  }

  var _proto = QuizFour.prototype;

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
      }, "Is the following statement true or false? If any member of my team doesn't register a guess or communicate with a colleague for five minutes, the task will end and the entire 5-person team (including myself) will be sent to the exit page of the survey."), /*#__PURE__*/React.createElement(Radio, {
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

  return QuizFour;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizOne.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/quiz/QuizOne.jsx                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        player.exit("failedQuestion");
      }
    };

    return _this;
  }

  var _proto = QuizOne.prototype;

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
      }, "Are you willing to participate in an online team exercise that could last for approximately 60 minutes?"), /*#__PURE__*/React.createElement(Radio, {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizSeven.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/quiz/QuizSeven.jsx                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

      if (_this.state.response === 'false') {
        onNext();
      } else {
        player.exit("failedQuestion");
      }
    };

    return _this;
  }

  var _proto = QuizSeven.prototype;

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
      }, "The reconsider button will only appear if I submit an incorrect answer."), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "true",
        label: "True",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "false",
        label: "False",
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

  return QuizSeven;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizSix.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/quiz/QuizSix.jsx                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

      if (_this.state.response === 'false') {
        onNext();
      } else {
        player.exit("failedQuestion");
      }
    };

    return _this;
  }

  var _proto = QuizSix.prototype;

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
      }, "Is the following statement true or false? I will be able to communicate with my team members using a group chat and I will always be able to communicate with every member of my team."), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "true",
        label: "True",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "false",
        label: "False",
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

  return QuizSix;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizThree.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/quiz/QuizThree.jsx                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    return QuizThree;
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

var QuizThree = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(QuizThree, _React$Component);

  var _super = _createSuper(QuizThree);

  function QuizThree() {
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
        player.exit("failedQuestion");
      }
    };

    return _this;
  }

  var _proto = QuizThree.prototype;

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
      }, "Next you will be asked questions about the instruction you just read. You need to get the answers correct in order to be accepted into the exercise. "), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "yes",
        label: "PROCEED",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "no",
        label: "DO NOT PROCEED",
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

  return QuizThree;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"QuizTwo.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/quiz/QuizTwo.jsx                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        player.exit("failedQuestion");
      }
    };

    return _this;
  }

  var _proto = QuizTwo.prototype;

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
      }, "If you do not interact with the application for 5 minutes your session will timeout, and the experiment will end for everyone in your team. 1 minute before the timeout you will be notified you are about to timeout, and be given a chance to reset this timer. If you allow your session to timeout your HIT will not be accepted. If a team member causes a timeout you will be sent to the end of challenge page, and your HIT will be accepted."), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "yes",
        label: "PROCEED",
        onChange: this.handleChange
      }), /*#__PURE__*/React.createElement(Radio, {
        selected: response,
        name: "response",
        value: "no",
        label: "DO NOT PROCEED",
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

  return QuizTwo;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"Consent.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/Consent.jsx                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"NewPlayer.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/NewPlayer.jsx                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      }, /*#__PURE__*/React.createElement("h1", null, "Identification"), /*#__PURE__*/React.createElement("p", null, "Please enter your Mechanical Turk Worker ID:"), /*#__PURE__*/React.createElement("input", {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TutorialPageFour.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/TutorialPageFour.jsx                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
module.link("../../public/css/intro.css");
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
      }, "Next"));
    }

    return render;
  }();

  return TutorialPageFour;
}(React.Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TutorialPageOne.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/TutorialPageOne.jsx                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
module.link("../../public/css/intro.css");
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TutorialPageThree.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/TutorialPageThree.jsx                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
module.link("../../public/css/intro.css");
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TutorialPageTwo.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/intro/TutorialPageTwo.jsx                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
module.link("../../public/css/intro.css");
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"chat":{"ChatContainer.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/chat/ChatContainer.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
          console.log("new");
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
        customKey: customKey
      };
      return /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement("div", {
        className: (customClassName ? customClassName : "empirica-chat-container") + " " + (docked ? "undocked" : "undocked") + " " + (isOpen ? "open" : "closed")
      }, /*#__PURE__*/React.createElement("div", {
        className: "chat " + (isOpen ? "open" : "closed")
      }, docked && /*#__PURE__*/React.createElement(HeaderComp, _extends({}, common, {
        otherPlayer: otherPlayer,
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ChatHeader.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/chat/ChatHeader.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        className: "header"
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ErrorBoundary.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/chat/ErrorBoundary.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Footer.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/chat/Footer.js                                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Message.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/chat/Message.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Messages.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/chat/Messages.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
          rest = _objectWithoutProperties(_this$props3, ["player", "messages", "messageComp"]);

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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"style.less":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/chat/style.less                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// These styles have already been applied to the document.

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"exit":{"ExitSurvey.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/exit/ExitSurvey.jsx                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      onChange = _ref.onChange;
  return /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: selected === value,
    onChange: onChange
  }), label);
};

var ExitSurvey = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ExitSurvey, _React$Component);

  var _super = _createSuper(ExitSurvey);

  function ExitSurvey() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.state = {
      age: "",
      gender: "",
      strength: "",
      fair: "",
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

  var _proto = ExitSurvey.prototype;

  _proto.render = function () {
    function render() {
      var player = this.props.player;
      var _this$state = this.state,
          age = _this$state.age,
          gender = _this$state.gender,
          strength = _this$state.strength,
          fair = _this$state.fair,
          feedback = _this$state.feedback,
          education = _this$state.education;
      return /*#__PURE__*/React.createElement(Centered, null, /*#__PURE__*/React.createElement("div", {
        className: "exit-survey"
      }, /*#__PURE__*/React.createElement("h1", null, " Exit Survey "), /*#__PURE__*/React.createElement("p", null, "Please submit the following code to receive your bonus:", " ", /*#__PURE__*/React.createElement("strong", null, player._id), "."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Please answer the following short survey. You do not have to provide any information you feel uncomfortable with."), /*#__PURE__*/React.createElement("form", {
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
        onChange: this.handleChange
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
      })))), /*#__PURE__*/React.createElement("button", {
        type: "submit"
      }, "Submit"))));
    }

    return render;
  }();

  return ExitSurvey;
}(React.Component);

ExitSurvey.stepName = "ExitSurvey";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FailedAttentionCheck.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/exit/FailedAttentionCheck.jsx                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      }, "YOU FAILED THE ATTENTION CHECK, AND HAVE NOT BEEN SELECTED TO PLAY. PLEASE DO NOT TRY TO COMPLETE THE TASK AGAIN AS YOU WILL NOT GET PAID. THANK YOU FOR YOUR TIME.")));
    }

    return render;
  }();

  return FailedAttentionCheck;
}(Component);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Sorry.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/exit/Sorry.jsx                                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
          msg = "There were NOT enough players for the game to start... Thank you for participating in this game, you will still get paid the base amount for passing the attention check. Please submit your MTurk Worker Id to the HIT and we will make sure you get paid accordingly.";
          break;

        case "playerEndedLobbyWait":
          msg = "You decided to stop waiting, we are sorry it was too long a wait.";
          break;

        default:
          msg = "Unfortunately the Game was cancelled... Thank you for participating in this game, please submit your MTurk Worker ID to the HIT and we will make sure you get paid accordingly.";
          break;
      }

      if (player.exitReason === "failedQuestion") {
        return /*#__PURE__*/React.createElement(FailedAttentionCheck, null);
      }

      if (player.exitReason === "inactive") {
        msg = "You were inactive for too long, and we had to end the game. Thank you for participating in this game, you will still get paid the base amount including any bonuses for the rounds you successfully passed. Please submit your MTurk Worker Id to the HIT and we will make sure you get paid accordingly.";
      }

      if (player.exitReason === "someoneInactive") {
        msg = "A player was inactive for too long, and we had to end the game. Thank you for participating in this game, you will get paid the base amount including any bonuses for the rounds you successfully passed. Please submit your MTurk Worker ID to the HIT and we will make sure you get paid accordingly. ";
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Thanks.jsx":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/exit/Thanks.jsx                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
var Centered;
module.link("meteor/empirica:core", {
  Centered: function (v) {
    Centered = v;
  }
}, 1);

var Thanks = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Thanks, _React$Component);

  var _super = _createSuper(Thanks);

  function Thanks() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Thanks.prototype;

  _proto.render = function () {
    function render() {
      return /*#__PURE__*/React.createElement("div", {
        className: "finished"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Finished!"), /*#__PURE__*/React.createElement("p", null, "Thank you for participating! If you missed the code from the previous page, please submit your MTurk Worker ID to the HIT and we will make sure you get paid accordingly.")));
    }

    return render;
  }();

  return Thanks;
}(React.Component);

Thanks.stepName = "Thanks";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"main.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
var Thanks;
module.link("./exit/Thanks", {
  "default": function (v) {
    Thanks = v;
  }
}, 3);
var Sorry;
module.link("./exit/Sorry", {
  "default": function (v) {
    Sorry = v;
  }
}, 4);
var About;
module.link("./game/About", {
  "default": function (v) {
    About = v;
  }
}, 5);
var Round;
module.link("./game/Round", {
  "default": function (v) {
    Round = v;
  }
}, 6);
var Consent;
module.link("./intro/Consent", {
  "default": function (v) {
    Consent = v;
  }
}, 7);
var NetworkSurveyOne;
module.link("./intro/network-survey/NetworkSurvey1", {
  "default": function (v) {
    NetworkSurveyOne = v;
  }
}, 8);
var NetworkSurveyTwo;
module.link("./intro/network-survey/NetworkSurvey2", {
  "default": function (v) {
    NetworkSurveyTwo = v;
  }
}, 9);
var NetworkSurveyThree;
module.link("./intro/network-survey/NetworkSurvey3", {
  "default": function (v) {
    NetworkSurveyThree = v;
  }
}, 10);
var TutorialPageOne;
module.link("./intro/TutorialPageOne", {
  "default": function (v) {
    TutorialPageOne = v;
  }
}, 11);
var TutorialPageTwo;
module.link("./intro/TutorialPageTwo", {
  "default": function (v) {
    TutorialPageTwo = v;
  }
}, 12);
var TutorialPageThree;
module.link("./intro/TutorialPageThree", {
  "default": function (v) {
    TutorialPageThree = v;
  }
}, 13);
var TutorialPageFour;
module.link("./intro/TutorialPageFour", {
  "default": function (v) {
    TutorialPageFour = v;
  }
}, 14);
var AllQuiz;
module.link("./intro/quiz/AllQuiz", {
  "default": function (v) {
    AllQuiz = v;
  }
}, 15);
var QuizOne;
module.link("./intro/quiz/QuizOne", {
  "default": function (v) {
    QuizOne = v;
  }
}, 16);
var QuizTwo;
module.link("./intro/quiz/QuizTwo", {
  "default": function (v) {
    QuizTwo = v;
  }
}, 17);
var QuizThree;
module.link("./intro/quiz/QuizThree", {
  "default": function (v) {
    QuizThree = v;
  }
}, 18);
var QuizFour;
module.link("./intro/quiz/QuizFour", {
  "default": function (v) {
    QuizFour = v;
  }
}, 19);
var QuizFive;
module.link("./intro/quiz/QuizFive", {
  "default": function (v) {
    QuizFive = v;
  }
}, 20);
var QuizSix;
module.link("./intro/quiz/QuizSix", {
  "default": function (v) {
    QuizSix = v;
  }
}, 21);
var QuizSeven;
module.link("./intro/quiz/QuizSeven", {
  "default": function (v) {
    QuizSeven = v;
  }
}, 22);
var QuizEight;
module.link("./intro/quiz/QuizEight", {
  "default": function (v) {
    QuizEight = v;
  }
}, 23);
var MidSurveyOne;
module.link("./game/mid-survey/MidSurvey1", {
  "default": function (v) {
    MidSurveyOne = v;
  }
}, 24);
var MidSurveyTwo;
module.link("./game/mid-survey/MidSurvey2", {
  "default": function (v) {
    MidSurveyTwo = v;
  }
}, 25);
var MidSurveyThree;
module.link("./game/mid-survey/MidSurvey3", {
  "default": function (v) {
    MidSurveyThree = v;
  }
}, 26);
var MidSurveyFour;
module.link("./game/mid-survey/MidSurvey4", {
  "default": function (v) {
    MidSurveyFour = v;
  }
}, 27);
var MidSurveyFive;
module.link("./game/mid-survey/MidSurvey5", {
  "default": function (v) {
    MidSurveyFive = v;
  }
}, 28);
var NewPlayer;
module.link("./intro/NewPlayer", {
  "default": function (v) {
    NewPlayer = v;
  }
}, 29);
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
  var networkSurvey = [NetworkSurveyOne, NetworkSurveyTwo, NetworkSurveyThree];
  var tutorialSteps = [TutorialPageOne, TutorialPageThree, TutorialPageFour]; // const quizSteps = [QuizOne, QuizTwo, QuizThree, QuizFour, QuizFive, QuizSix, QuizSeven, QuizEight,];

  var quizSteps = [AllQuiz];
  var steps = networkSurvey.concat(tutorialSteps, quizSteps);

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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"public":{"css":{"intro.css":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// public/css/intro.css                                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = require("meteor/modules").addStyles(
  "/* Network Survey */\n.network-survey-container {\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n    height: 100%;\n    justify-content: center;\n    align-items: center;\n    text-align: center;\n    font-family: \"Palatino Linotype\", \"Book Antiqua\", \"Palatino\", serif;\n}\n\n.network-survey-container p {\n    display: flex;\n    margin-block-start: 1em;\n    margin-block-end: 1em;\n    margin-inline-start: 0px;\n    margin-inline-end: 0px;\n}\n\n.network-survey-header p {\n    font-weight: bold;\n    text-transform: uppercase;\n    color: var(--darkblue);\n    font-size: 16px;\n    padding: 2em;\n}\n\n.network-survey-body {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    padding: 2em;\n    width: 60%;\n    margin: auto;\n}\n\n.network-survey-body p  {\n    text-transform: none;\n    font-weight: normal;\n    color: var(--darkblue);\n    font-size: 16px;\n}\n\n.network-form {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    padding: 2em;\n    width: 100%;\n}\n\n.input-row {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    width: 50%;\n}\n\n.dropdown-input-label {\n    display: flex;\n    width: 70%;\n    align-items: center;\n    justify-content: center;\n}\n\n.input-label {\n    display: flex;\n    margin-right: 10px;\n}\n\n.network-button-container {\n    display: flex;\n    width: 100%;\n    justify-content: flex-start;\n    margin-top: 23px;\n}\n\n.network-list {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    text-transform: none;\n    max-width: 75%;\n    margin: auto;\n}\n\n.network-list li {\n    display: list-item;\n    margin-left: 10px;\n    list-style-type: disc;\n    width: 100%;\n    padding: 1em 2em;\n    text-transform: none;\n    font-style: italic;\n    font-weight: normal;\n    color: var(--darkblue);\n    font-size: 16px;\n}\n\n.dropdown-select-input {\n    font-size: 14px;\n    color: var(--darkblue);\n    margin: 2px;\n    border-radius: 5px;\n}\n\n.name-matrix-table {\n    width: 60%;\n    margin: 0px auto 2em;\n    font-size: 16px;\n}\n\nthead, tbody, tfoot { vertical-align: middle } /* add this rule*/\ntd, th, tr { vertical-align: inherit } /* add this rule */\n\n/* Tutorial */\n\n.tutorial-container {\n    display: flex;\n    flex-direction: column;\n}\n\n.title-static-image {\n    display: flex;\n    justify-content: flex-start;\n    padding: 30px 15px;\n}\n\n.two-col {\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n    width: 60%;\n}\n\n.tutorial-content {\n    display: flex;\n    flex-direction: column;\n}\n\n.tutorial-static-image {\n    display:flex;\n    margin-right: 40px;\n    width: 45%;\n    justify-content: center;\n    align-items: center;\n}\n\n.tutorial-info {\n    width: 50%;\n}\n\n.intro-heading {\n    font-family:\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif; \n    font-style:italic; \n    text-transform:uppercase; \n    font-weight:normal;\n    margin: 0px 0px;\n    font-size: 26px;\n    color: var(--darkblue);\n}\n\n.tutorial-body {\n    font-size: 16px;\n    word-spacing: 0.3em;\n    margin-top: 1rem;\n    color: var(--darkblue);\n}\n\n/* BUTTON STYLING AND POSITIONING */\n\n.tutorial-next-btn {\n    position: fixed;\n    top: 50%;\n    right: 0;\n    text-align:left;\n    background: var(--turquoise); \n\n}\n\n.tutorial-next-btn:hover {\n    margin-right: 20px;\n    background:var(--periwinkle)\n}\n\n.tutorial-next-btn:after {border-left:21px solid var(--turquoise); transition:.35s ease; -moz-transition:.35s ease; -webkit-transition:.35s ease}\n.tutorial-next-btn:hover:after {border-left:21px solid var(--periwinkle)}\n\n.tutorial-prev-btn {\n    position: fixed;\n    top: 50%;\n    left: 0;\n    text-align:right;\n    background: var(--turquoise); \n}\n\n.tutorial-prev-btn:hover {\n    margin-left: 20px;\n    background:var(--periwinkle)\n}\n\n.tutorial-prev-btn:before {border-right:21px solid var(--turquoise); transition:.35s ease; -moz-transition:.35s ease; -webkit-transition:.35s ease}\n.tutorial-prev-btn:hover:before {border-right:21px solid var(--periwinkle)}\n\n\n\n\n/* QUESTIONNAIRE STYLING */\n\n.questionnaire-radio {\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n    align-items: center;\n\n}\n\n.questionnaire-radio .quiz-button {\n    margin-right: 5px;\n    cursor: pointer;\n}\n\n.questionnaire-heading {\n    margin: 10% auto 5% auto;\n    display: flex;\n    justify-content: center;\n    width: 590px;\n    text-align: center;\n}\n\n.question-section {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    margin-top: 15px;\n}\n\n.questionnaire-question {\n    padding-bottom: 20px;\n}\n\n.questionnaire-content-container {\n    display:flex;\n    flex-direction:column;\n    align-items: flex-start;\n    width: 590px;\n}\n\n.questionnaire-body {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    background-color: white;\n    font-family: \"Trebuchet MS\", Arial, Helvetica, sans-serif;\n    color: var(--darkblue);\n    width: 100%;\n    font-size: 15px;\n    padding: 25px;\n}\n\n.questionnaire-btn-container {\n    display: flex;\n}\n\n.progress-bar {\n    display: flex;\n    flex-direction:row;\n    align-items: flex-end;\n}\n\n.completed-heading {\n    font-family: \"Trebuchet MS\", Arial, Helvetica, sans-serif;\n    color: var(--turquoise);\n    font-size: 20px;\n    font-weight: bold;\n}\n\n.completed-bar {\n    display: flex;\n    flex-direction: column;\n}\n\n.slider-value-container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    width: 100%;\n}\n\n.slider-value {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border: 1px solid lightgrey;\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n    background-color: lightgrey;\n}\n\n/* Customizing SLIDER */\n\n.player-slider-container {\n    display: flex;\n    flex-direction: row;\n    width: 100%;\n    padding: 15px 0px;\n}\n\n.player-label {\n    display: flex;\n    width: 25%;\n    padding: 5px 5px;\n    overflow-wrap: anywhere;\n}\n\n.empirica-slider {\n    width: 100%;\n}\n\n.bp3-slider-axis {\n    display: flex;\n    justify-content: space-between;\n}\n\n.bp3-slider-label {\n    transform: translate(0%, 20px);\n    display: flex;\n    position: static;\n    padding: 2px 5px;\n    vertical-align: top;\n    line-height: 1;\n    font-size: 12px;\n}\n\n.bp3-slider-track {\n    background-color: var(--darkblue);\n}\n\n.bp3-slider-handle {\n    background-color: var(--turquoise);\n    border: 1px solid var(--turquoise);\n    border-radius: 50%;\n    background-image: none;\n    box-shadow: none;\n    width: 20px;\n    height: 20px;\n}\n\n/* Turn off label that appears below slider handle */\n.bp3-slider-handle .bp3-slider-label {\n    display: none;\n}\n\n\n.survey-textarea {\n    width: 100%;\n    resize: vertical;\n    padding: 5px 5px 5px 5px;\n    margin-bottom: 30px;\n}\n\n\n\n"
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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