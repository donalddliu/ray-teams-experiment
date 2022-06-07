module.export({TabTitle:()=>TabTitle,generateTabPanelId:()=>generateTabPanelId,generateTabTitleId:()=>generateTabTitleId});let __assign,__extends,__rest;module.link("tslib",{__assign(v){__assign=v},__extends(v){__extends=v},__rest(v){__rest=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let AbstractPureComponent2,Classes;module.link("../../common",{AbstractPureComponent2(v){AbstractPureComponent2=v},Classes(v){Classes=v}},3);let DISPLAYNAME_PREFIX,removeNonHTMLProps;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v},removeNonHTMLProps(v){removeNonHTMLProps=v}},4);/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */





var TabTitle = /** @class */ (function (_super) {
    __extends(TabTitle, _super);
    function TabTitle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (e) { return _this.props.onClick(_this.props.id, e); };
        return _this;
    }
    TabTitle.prototype.render = function () {
        var _a = this.props, className = _a.className, children = _a.children, disabled = _a.disabled, id = _a.id, parentId = _a.parentId, selected = _a.selected, title = _a.title, htmlProps = __rest(_a, ["className", "children", "disabled", "id", "parentId", "selected", "title"]);
        return (React.createElement("div", __assign({}, removeNonHTMLProps(htmlProps), { "aria-controls": generateTabPanelId(parentId, id), "aria-disabled": disabled, "aria-expanded": selected, "aria-selected": selected, className: classNames(Classes.TAB, className), "data-tab-id": id, id: generateTabTitleId(parentId, id), onClick: disabled ? undefined : this.handleClick, role: "tab", tabIndex: disabled ? undefined : selected ? 0 : -1 }),
            title,
            children));
    };
    TabTitle.displayName = "".concat(DISPLAYNAME_PREFIX, ".TabTitle");
    return TabTitle;
}(AbstractPureComponent2));

function generateTabPanelId(parentId, tabId) {
    return "".concat(Classes.TAB_PANEL, "_").concat(parentId, "_").concat(tabId);
}
function generateTabTitleId(parentId, tabId) {
    return "".concat(Classes.TAB, "-title_").concat(parentId, "_").concat(tabId);
}
//# sourceMappingURL=tabTitle.js.map