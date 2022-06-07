module.export({PanelStack:()=>PanelStack});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let CSSTransition,TransitionGroup;module.link("react-transition-group",{CSSTransition(v){CSSTransition=v},TransitionGroup(v){TransitionGroup=v}},3);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},4);let safeInvoke;module.link("../../common/utils",{safeInvoke(v){safeInvoke=v}},5);let PanelView;module.link("./panelView",{PanelView(v){PanelView=v}},6);/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */







var PanelStack = /** @class */ (function (_super) {
    tslib_1.__extends(PanelStack, _super);
    function PanelStack() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            direction: "push",
            stack: [_this.props.initialPanel],
        };
        _this.handlePanelClose = function (panel) {
            var stack = _this.state.stack;
            // only remove this panel if it is at the top and not the only one.
            if (stack[0] !== panel || stack.length <= 1) {
                return;
            }
            safeInvoke(_this.props.onClose, panel);
            _this.setState(function (state) { return ({
                direction: "pop",
                stack: state.stack.filter(function (p) { return p !== panel; }),
            }); });
        };
        _this.handlePanelOpen = function (panel) {
            safeInvoke(_this.props.onOpen, panel);
            _this.setState(function (state) { return ({
                direction: "push",
                stack: [panel].concat(state.stack),
            }); });
        };
        return _this;
    }
    PanelStack.prototype.render = function () {
        var classes = classNames(Classes.PANEL_STACK, Classes.PANEL_STACK + "-" + this.state.direction, this.props.className);
        return (React.createElement(TransitionGroup, { className: classes, component: "div" }, this.renderCurrentPanel()));
    };
    PanelStack.prototype.renderCurrentPanel = function () {
        var stack = this.state.stack;
        if (stack.length === 0) {
            return null;
        }
        var activePanel = stack[0], previousPanel = stack[1];
        return (React.createElement(CSSTransition, { classNames: Classes.PANEL_STACK, key: stack.length, timeout: 400 },
            React.createElement(PanelView, { onClose: this.handlePanelClose, onOpen: this.handlePanelOpen, panel: activePanel, previousPanel: previousPanel })));
    };
    return PanelStack;
}(React.PureComponent));

//# sourceMappingURL=panelStack.js.map