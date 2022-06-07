module.export({InputGroup:()=>InputGroup});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},3);let DISPLAYNAME_PREFIX,removeNonHTMLProps;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v},removeNonHTMLProps(v){removeNonHTMLProps=v}},4);let Icon;module.link("../icon/icon",{Icon(v){Icon=v}},5);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */






var DEFAULT_RIGHT_ELEMENT_WIDTH = 10;
var InputGroup = /** @class */ (function (_super) {
    tslib_1.__extends(InputGroup, _super);
    function InputGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            rightElementWidth: DEFAULT_RIGHT_ELEMENT_WIDTH,
        };
        _this.refHandlers = {
            rightElement: function (ref) { return (_this.rightElement = ref); },
        };
        return _this;
    }
    InputGroup.prototype.render = function () {
        var _a = this.props, className = _a.className, intent = _a.intent, large = _a.large, leftIcon = _a.leftIcon, round = _a.round;
        var classes = classNames(Classes.INPUT_GROUP, Classes.intentClass(intent), (_b = {},
            _b[Classes.DISABLED] = this.props.disabled,
            _b[Classes.LARGE] = large,
            _b[Classes.ROUND] = round,
            _b), className);
        var style = tslib_1.__assign({}, this.props.style, { paddingRight: this.state.rightElementWidth });
        return (React.createElement("div", { className: classes },
            React.createElement(Icon, { icon: leftIcon }),
            React.createElement("input", tslib_1.__assign({ type: "text" }, removeNonHTMLProps(this.props), { className: Classes.INPUT, ref: this.props.inputRef, style: style })),
            this.maybeRenderRightElement()));
        var _b;
    };
    InputGroup.prototype.componentDidMount = function () {
        this.updateInputWidth();
    };
    InputGroup.prototype.componentDidUpdate = function () {
        this.updateInputWidth();
    };
    InputGroup.prototype.maybeRenderRightElement = function () {
        var rightElement = this.props.rightElement;
        if (rightElement == null) {
            return undefined;
        }
        return (React.createElement("span", { className: Classes.INPUT_ACTION, ref: this.refHandlers.rightElement }, rightElement));
    };
    InputGroup.prototype.updateInputWidth = function () {
        if (this.rightElement != null) {
            var clientWidth = this.rightElement.clientWidth;
            // small threshold to prevent infinite loops
            if (Math.abs(clientWidth - this.state.rightElementWidth) > 2) {
                this.setState({ rightElementWidth: clientWidth });
            }
        }
        else {
            this.setState({ rightElementWidth: DEFAULT_RIGHT_ELEMENT_WIDTH });
        }
    };
    InputGroup.displayName = DISPLAYNAME_PREFIX + ".InputGroup";
    return InputGroup;
}(React.PureComponent));

//# sourceMappingURL=inputGroup.js.map