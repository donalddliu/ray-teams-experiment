module.export({default:()=>Reference});let _extends;module.link('babel-runtime/helpers/extends',{default(v){_extends=v}},0);let _classCallCheck;module.link('babel-runtime/helpers/classCallCheck',{default(v){_classCallCheck=v}},1);let _possibleConstructorReturn;module.link('babel-runtime/helpers/possibleConstructorReturn',{default(v){_possibleConstructorReturn=v}},2);let _inherits;module.link('babel-runtime/helpers/inherits',{default(v){_inherits=v}},3);let React;module.link('react',{"*"(v){React=v}},4);let warning;module.link('warning',{default(v){warning=v}},5);let ManagerContext;module.link('./Manager',{ManagerContext(v){ManagerContext=v}},6);let safeInvoke,unwrapArray;module.link('./utils',{safeInvoke(v){safeInvoke=v},unwrapArray(v){unwrapArray=v}},7);








var InnerReference = function (_React$Component) {
  _inherits(InnerReference, _React$Component);

  function InnerReference() {
    var _temp, _this, _ret;

    _classCallCheck(this, InnerReference);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.refHandler = function (node) {
      safeInvoke(_this.props.innerRef, node);
      safeInvoke(_this.props.getReferenceRef, node);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  InnerReference.prototype.render = function render() {
    warning(this.props.getReferenceRef, '`Reference` should not be used outside of a `Manager` component.');
    return unwrapArray(this.props.children)({ ref: this.refHandler });
  };

  return InnerReference;
}(React.Component);

function Reference(props) {
  return React.createElement(
    ManagerContext.Consumer,
    null,
    function (_ref) {
      var getReferenceRef = _ref.getReferenceRef;
      return React.createElement(InnerReference, _extends({ getReferenceRef: getReferenceRef }, props));
    }
  );
}