module.export({PanelView:()=>PanelView});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let React;module.link("react",{"*"(v){React=v}},1);let Classes;module.link("../../common",{Classes(v){Classes=v}},2);let Button;module.link("../button/buttons",{Button(v){Button=v}},3);let Text;module.link("../text/text",{Text(v){Text=v}},4);/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */





var PanelView = /** @class */ (function (_super) {
    tslib_1.__extends(PanelView, _super);
    function PanelView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClose = function () { return _this.props.onClose(_this.props.panel); };
        return _this;
    }
    PanelView.prototype.render = function () {
        var _a = this.props, panel = _a.panel, onOpen = _a.onOpen;
        // two <span> tags in header ensure title is centered as long as
        // possible, due to `flex: 1` magic.
        return (React.createElement("div", { className: Classes.PANEL_STACK_VIEW },
            React.createElement("div", { className: Classes.PANEL_STACK_HEADER },
                React.createElement("span", null, this.maybeRenderBack()),
                React.createElement(Text, { className: Classes.HEADING, ellipsize: true }, panel.title),
                React.createElement("span", null)),
            React.createElement(panel.component, tslib_1.__assign({ openPanel: onOpen, closePanel: this.handleClose }, panel.props))));
    };
    PanelView.prototype.maybeRenderBack = function () {
        if (this.props.previousPanel === undefined) {
            return null;
        }
        return (React.createElement(Button, { className: Classes.PANEL_STACK_HEADER_BACK, icon: "chevron-left", minimal: true, onClick: this.handleClose, small: true, text: this.props.previousPanel.title }));
    };
    return PanelView;
}(React.PureComponent));

//# sourceMappingURL=panelView.js.map