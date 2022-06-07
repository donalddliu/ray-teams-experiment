module.export({ManagerReferenceNodeContext:()=>ManagerReferenceNodeContext,ManagerReferenceNodeSetterContext:()=>ManagerReferenceNodeSetterContext,default:()=>Manager});let _assertThisInitialized;module.link("@babel/runtime/helpers/assertThisInitialized",{default(v){_assertThisInitialized=v}},0);let _inheritsLoose;module.link("@babel/runtime/helpers/inheritsLoose",{default(v){_inheritsLoose=v}},1);let _defineProperty;module.link("@babel/runtime/helpers/defineProperty",{default(v){_defineProperty=v}},2);let React;module.link('react',{"*"(v){React=v}},3);let createContext;module.link('create-react-context',{default(v){createContext=v}},4);




var ManagerReferenceNodeContext = createContext();
var ManagerReferenceNodeSetterContext = createContext();

var Manager =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Manager, _React$Component);

  function Manager() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "referenceNode", void 0);

    _defineProperty(_assertThisInitialized(_this), "setReferenceNode", function (newReferenceNode) {
      if (newReferenceNode && _this.referenceNode !== newReferenceNode) {
        _this.referenceNode = newReferenceNode;

        _this.forceUpdate();
      }
    });

    return _this;
  }

  var _proto = Manager.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.referenceNode = null;
  };

  _proto.render = function render() {
    return React.createElement(ManagerReferenceNodeContext.Provider, {
      value: this.referenceNode
    }, React.createElement(ManagerReferenceNodeSetterContext.Provider, {
      value: this.setReferenceNode
    }, this.props.children));
  };

  return Manager;
}(React.Component);

