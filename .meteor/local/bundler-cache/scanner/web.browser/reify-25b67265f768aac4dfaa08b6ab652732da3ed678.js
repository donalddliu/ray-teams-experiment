module.export({Tab:()=>Tab});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */





var Tab = /** @class */ (function (_super) {
    tslib_1.__extends(Tab, _super);
    function Tab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // this component is never rendered directly; see Tabs#renderTabPanel()
    /* istanbul ignore next */
    Tab.prototype.render = function () {
        var _a = this.props, className = _a.className, panel = _a.panel;
        return (React.createElement("div", { className: classNames(Classes.TAB_PANEL, className), role: "tablist" }, panel));
    };
    Tab.defaultProps = {
        disabled: false,
        id: undefined,
    };
    Tab.displayName = DISPLAYNAME_PREFIX + ".Tab";
    return Tab;
}(React.PureComponent));

//# sourceMappingURL=tab.js.map