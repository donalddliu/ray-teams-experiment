module.export({default:()=>Reference});let _extends;module.link("@babel/runtime/helpers/extends",{default(v){_extends=v}},0);let _assertThisInitialized;module.link("@babel/runtime/helpers/assertThisInitialized",{default(v){_assertThisInitialized=v}},1);let _inheritsLoose;module.link("@babel/runtime/helpers/inheritsLoose",{default(v){_inheritsLoose=v}},2);let _defineProperty;module.link("@babel/runtime/helpers/defineProperty",{default(v){_defineProperty=v}},3);let React;module.link('react',{"*"(v){React=v}},4);let warning;module.link('warning',{default(v){warning=v}},5);let ManagerReferenceNodeSetterContext;module.link('./Manager',{ManagerReferenceNodeSetterContext(v){ManagerReferenceNodeSetterContext=v}},6);let safeInvoke,unwrapArray,setRef;module.link('./utils',{safeInvoke(v){safeInvoke=v},unwrapArray(v){unwrapArray=v},setRef(v){setRef=v}},7);








var InnerReference =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(InnerReference, _React$Component);

  function InnerReference() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "refHandler", function (node) {
      setRef(_this.props.innerRef, node);
      safeInvoke(_this.props.setReferenceNode, node);
    });

    return _this;
  }

  var _proto = InnerReference.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {
    setRef(this.props.innerRef, null);
  };

  _proto.render = function render() {
    warning(Boolean(this.props.setReferenceNode), '`Reference` should not be used outside of a `Manager` component.');
    return unwrapArray(this.props.children)({
      ref: this.refHandler
    });
  };

  return InnerReference;
}(React.Component);

function Reference(props) {
  return React.createElement(ManagerReferenceNodeSetterContext.Consumer, null, function (setReferenceNode) {
    return React.createElement(InnerReference, _extends({
      setReferenceNode: setReferenceNode
    }, props));
  });
}