module.export({TabTitle:()=>TabTitle,generateTabPanelId:()=>generateTabPanelId,generateTabTitleId:()=>generateTabTitleId});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */





var TabTitle = /** @class */ (function (_super) {
    tslib_1.__extends(TabTitle, _super);
    function TabTitle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (e) { return _this.props.onClick(_this.props.id, e); };
        return _this;
    }
    TabTitle.prototype.render = function () {
        var _a = this.props, disabled = _a.disabled, id = _a.id, parentId = _a.parentId, selected = _a.selected;
        return (React.createElement("div", { "aria-controls": generateTabPanelId(parentId, id), "aria-disabled": disabled, "aria-expanded": selected, "aria-selected": selected, className: classNames(Classes.TAB, this.props.className), "data-tab-id": id, id: generateTabTitleId(parentId, id), onClick: disabled ? undefined : this.handleClick, role: "tab", tabIndex: disabled ? undefined : 0 },
            this.props.title,
            this.props.children));
    };
    TabTitle.displayName = DISPLAYNAME_PREFIX + ".TabTitle";
    return TabTitle;
}(React.PureComponent));

function generateTabPanelId(parentId, tabId) {
    return Classes.TAB_PANEL + "_" + parentId + "_" + tabId;
}
function generateTabTitleId(parentId, tabId) {
    return Classes.TAB + "-title_" + parentId + "_" + tabId;
}
//# sourceMappingURL=tabTitle.js.map