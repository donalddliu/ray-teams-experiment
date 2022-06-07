module.export({ManagerContext:()=>ManagerContext});let _extends;module.link("babel-runtime/helpers/extends",{default(v){_extends=v}},0);let _classCallCheck;module.link("babel-runtime/helpers/classCallCheck",{default(v){_classCallCheck=v}},1);let _possibleConstructorReturn;module.link("babel-runtime/helpers/possibleConstructorReturn",{default(v){_possibleConstructorReturn=v}},2);let _inherits;module.link("babel-runtime/helpers/inherits",{default(v){_inherits=v}},3);let React;module.link("react",{"*"(v){React=v}},4);let createContext;module.link("create-react-context",{default(v){createContext=v}},5);






var ManagerContext = createContext({ getReferenceRef: undefined, referenceNode: undefined });

var Manager = function (_React$Component) {
  _inherits(Manager, _React$Component);

  function Manager() {
    _classCallCheck(this, Manager);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this));

    _this.getReferenceRef = function (referenceNode) {
      return _this.setState(function (_ref) {
        var context = _ref.context;
        return {
          context: _extends({}, context, { referenceNode: referenceNode })
        };
      });
    };

    _this.state = {
      context: {
        getReferenceRef: _this.getReferenceRef,
        referenceNode: undefined
      }
    };
    return _this;
  }

  Manager.prototype.render = function render() {
    return React.createElement(
      ManagerContext.Provider,
      { value: this.state.context },
      this.props.children
    );
  };

  return Manager;
}(React.Component);

module.exportDefault(Manager);