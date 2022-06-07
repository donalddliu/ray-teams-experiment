(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"empirica:slider":{"slider.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/empirica_slider/slider.js                                //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
let _extends;

module.link("@babel/runtime/helpers/extends", {
  default(v) {
    _extends = v;
  }

}, 0);

let _objectWithoutProperties;

module.link("@babel/runtime/helpers/objectWithoutProperties", {
  default(v) {
    _objectWithoutProperties = v;
  }

}, 1);
module.export({
  default: () => EmpiricaSlider
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let Slider;
module.link("@blueprintjs/core", {
  Slider(v) {
    Slider = v;
  }

}, 1);

class EmpiricaSlider extends React.Component {
  render() {
    const _this$props = this.props,
          {
      hideHandleOnEmpty,
      showTrackFill,
      value
    } = _this$props,
          rest = _objectWithoutProperties(_this$props, ["hideHandleOnEmpty", "showTrackFill", "value"]); // Blueprint's Slider does not like a null value, it's fine with undefined.


    const val = value === null ? undefined : value; // We want to add an "empty" class to the slider to hide the handle if no
    // value is given and the option is activated.

    const emptyClass = hideHandleOnEmpty && val === undefined ? "empty" : ""; // Default to showTrackFill = false if not set by parent.

    let showTrackFillVar = showTrackFill;

    if (showTrackFillVar === undefined) {
      showTrackFillVar = false;
    }

    return /*#__PURE__*/React.createElement("div", {
      className: "empirica-slider ".concat(emptyClass)
    }, /*#__PURE__*/React.createElement(Slider, _extends({
      value: val,
      showTrackFill: showTrackFillVar
    }, rest)));
  }

}
///////////////////////////////////////////////////////////////////////

},"node_modules":{"react":{"package.json":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// node_modules/meteor/empirica_slider/node_modules/react/package.js //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.exports = {
  "name": "react",
  "version": "16.5.2",
  "main": "index.js"
};

///////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// node_modules/meteor/empirica_slider/node_modules/react/index.js   //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.useNode();
///////////////////////////////////////////////////////////////////////

}},"@blueprintjs":{"core":{"package.json":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// node_modules/meteor/empirica_slider/node_modules/@blueprintjs/cor //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.exports = {
  "name": "@blueprintjs/core",
  "version": "3.6.1",
  "main": "lib/cjs/index.js"
};

///////////////////////////////////////////////////////////////////////

},"lib":{"cjs":{"index.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// node_modules/meteor/empirica_slider/node_modules/@blueprintjs/cor //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.useNode();
///////////////////////////////////////////////////////////////////////

}}}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/empirica:slider/slider.js");

/* Exports */
Package._define("empirica:slider", exports);

})();

//# sourceURL=meteor://💻app/packages/empirica_slider.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6c2xpZGVyL3NsaWRlci5qcyJdLCJuYW1lcyI6WyJfZXh0ZW5kcyIsIm1vZHVsZSIsImxpbmsiLCJkZWZhdWx0IiwidiIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsImV4cG9ydCIsIkVtcGlyaWNhU2xpZGVyIiwiUmVhY3QiLCJTbGlkZXIiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJwcm9wcyIsImhpZGVIYW5kbGVPbkVtcHR5Iiwic2hvd1RyYWNrRmlsbCIsInZhbHVlIiwicmVzdCIsInZhbCIsInVuZGVmaW5lZCIsImVtcHR5Q2xhc3MiLCJzaG93VHJhY2tGaWxsVmFyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxRQUFKOztBQUFhQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxnQ0FBWixFQUE2QztBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSixZQUFRLEdBQUNJLENBQVQ7QUFBVzs7QUFBdkIsQ0FBN0MsRUFBc0UsQ0FBdEU7O0FBQXlFLElBQUlDLHdCQUFKOztBQUE2QkosTUFBTSxDQUFDQyxJQUFQLENBQVksZ0RBQVosRUFBNkQ7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0MsNEJBQXdCLEdBQUNELENBQXpCO0FBQTJCOztBQUF2QyxDQUE3RCxFQUFzRyxDQUF0RztBQUFuSEgsTUFBTSxDQUFDSyxNQUFQLENBQWM7QUFBQ0gsU0FBTyxFQUFDLE1BQUlJO0FBQWIsQ0FBZDtBQUE0QyxJQUFJQyxLQUFKO0FBQVVQLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLE9BQVosRUFBb0I7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0ksU0FBSyxHQUFDSixDQUFOO0FBQVE7O0FBQXBCLENBQXBCLEVBQTBDLENBQTFDO0FBQTZDLElBQUlLLE1BQUo7QUFBV1IsTUFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ08sUUFBTSxDQUFDTCxDQUFELEVBQUc7QUFBQ0ssVUFBTSxHQUFDTCxDQUFQO0FBQVM7O0FBQXBCLENBQWhDLEVBQXNELENBQXREOztBQUcvRixNQUFNRyxjQUFOLFNBQTZCQyxLQUFLLENBQUNFLFNBQW5DLENBQTZDO0FBQzFEQyxRQUFNLEdBQUc7QUFDUCx3QkFBNkQsS0FBS0MsS0FBbEU7QUFBQSxVQUFNO0FBQUVDLHVCQUFGO0FBQXFCQyxtQkFBckI7QUFBb0NDO0FBQXBDLEtBQU47QUFBQSxVQUFvREMsSUFBcEQsMEZBRE8sQ0FHUDs7O0FBQ0EsVUFBTUMsR0FBRyxHQUFHRixLQUFLLEtBQUssSUFBVixHQUFpQkcsU0FBakIsR0FBNkJILEtBQXpDLENBSk8sQ0FNUDtBQUNBOztBQUNBLFVBQU1JLFVBQVUsR0FBR04saUJBQWlCLElBQUlJLEdBQUcsS0FBS0MsU0FBN0IsR0FBeUMsT0FBekMsR0FBbUQsRUFBdEUsQ0FSTyxDQVVQOztBQUNBLFFBQUlFLGdCQUFnQixHQUFHTixhQUF2Qjs7QUFDQSxRQUFJTSxnQkFBZ0IsS0FBS0YsU0FBekIsRUFBb0M7QUFDbENFLHNCQUFnQixHQUFHLEtBQW5CO0FBQ0Q7O0FBRUQsd0JBQ0U7QUFBSyxlQUFTLDRCQUFxQkQsVUFBckI7QUFBZCxvQkFDRSxvQkFBQyxNQUFEO0FBQVEsV0FBSyxFQUFFRixHQUFmO0FBQW9CLG1CQUFhLEVBQUVHO0FBQW5DLE9BQXlESixJQUF6RCxFQURGLENBREY7QUFLRDs7QUF0QnlELEMiLCJmaWxlIjoiL3BhY2thZ2VzL2VtcGlyaWNhX3NsaWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFNsaWRlciB9IGZyb20gXCJAYmx1ZXByaW50anMvY29yZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbXBpcmljYVNsaWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGhpZGVIYW5kbGVPbkVtcHR5LCBzaG93VHJhY2tGaWxsLCB2YWx1ZSwgLi4ucmVzdCB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIEJsdWVwcmludCdzIFNsaWRlciBkb2VzIG5vdCBsaWtlIGEgbnVsbCB2YWx1ZSwgaXQncyBmaW5lIHdpdGggdW5kZWZpbmVkLlxuICAgIGNvbnN0IHZhbCA9IHZhbHVlID09PSBudWxsID8gdW5kZWZpbmVkIDogdmFsdWU7XG5cbiAgICAvLyBXZSB3YW50IHRvIGFkZCBhbiBcImVtcHR5XCIgY2xhc3MgdG8gdGhlIHNsaWRlciB0byBoaWRlIHRoZSBoYW5kbGUgaWYgbm9cbiAgICAvLyB2YWx1ZSBpcyBnaXZlbiBhbmQgdGhlIG9wdGlvbiBpcyBhY3RpdmF0ZWQuXG4gICAgY29uc3QgZW1wdHlDbGFzcyA9IGhpZGVIYW5kbGVPbkVtcHR5ICYmIHZhbCA9PT0gdW5kZWZpbmVkID8gXCJlbXB0eVwiIDogXCJcIjtcblxuICAgIC8vIERlZmF1bHQgdG8gc2hvd1RyYWNrRmlsbCA9IGZhbHNlIGlmIG5vdCBzZXQgYnkgcGFyZW50LlxuICAgIGxldCBzaG93VHJhY2tGaWxsVmFyID0gc2hvd1RyYWNrRmlsbDtcbiAgICBpZiAoc2hvd1RyYWNrRmlsbFZhciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzaG93VHJhY2tGaWxsVmFyID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgZW1waXJpY2Etc2xpZGVyICR7ZW1wdHlDbGFzc31gfT5cbiAgICAgICAgPFNsaWRlciB2YWx1ZT17dmFsfSBzaG93VHJhY2tGaWxsPXtzaG93VHJhY2tGaWxsVmFyfSB7Li4ucmVzdH0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==
