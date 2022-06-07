module.export({CollapsibleList:()=>CollapsibleList});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let Boundary;module.link("../../common/boundary",{Boundary(v){Boundary=v}},3);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},4);let Errors;module.link("../../common/errors",{"*"(v){Errors=v}},5);let Position;module.link("../../common/position",{Position(v){Position=v}},6);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},7);let isElementOfType;module.link("../../common/utils",{isElementOfType(v){isElementOfType=v}},8);let Menu;module.link("../menu/menu",{Menu(v){Menu=v}},9);let MenuItem;module.link("../menu/menuItem",{MenuItem(v){MenuItem=v}},10);let Popover;module.link("../popover/popover",{Popover(v){Popover=v}},11);/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */












/** @deprecated use `<OverflowList>` for automatic overflow based on available space. */
var CollapsibleList = /** @class */ (function (_super) {
    tslib_1.__extends(CollapsibleList, _super);
    function CollapsibleList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollapsibleList.prototype.render = function () {
        var _this = this;
        var collapseFrom = this.props.collapseFrom;
        var childrenLength = React.Children.count(this.props.children);
        var _a = this.partitionChildren(), visibleChildren = _a[0], collapsedChildren = _a[1];
        var visibleItems = visibleChildren.map(function (child, index) {
            var absoluteIndex = collapseFrom === Boundary.START ? childrenLength - 1 - index : index;
            return (React.createElement("li", { className: _this.props.visibleItemClassName, key: absoluteIndex }, _this.props.visibleItemRenderer(child.props, absoluteIndex)));
        });
        if (collapseFrom === Boundary.START) {
            // reverse START list so separators appear before items
            visibleItems.reverse();
        }
        // construct dropdown menu for collapsed items
        var collapsedPopover;
        if (collapsedChildren.length > 0) {
            var position = collapseFrom === Boundary.END ? Position.BOTTOM_RIGHT : Position.BOTTOM_LEFT;
            collapsedPopover = (React.createElement("li", { className: this.props.visibleItemClassName },
                React.createElement(Popover, tslib_1.__assign({ content: React.createElement(Menu, null, collapsedChildren), position: position }, this.props.dropdownProps), this.props.dropdownTarget)));
        }
        return (React.createElement("ul", { className: classNames(Classes.COLLAPSIBLE_LIST, this.props.className) },
            collapseFrom === Boundary.START ? collapsedPopover : null,
            visibleItems,
            collapseFrom === Boundary.END ? collapsedPopover : null));
    };
    // splits the list of children into two arrays: visible and collapsed
    CollapsibleList.prototype.partitionChildren = function () {
        if (this.props.children == null) {
            return [[], []];
        }
        var childrenArray = React.Children.map(this.props.children, function (child, index) {
            if (!isElementOfType(child, MenuItem)) {
                throw new Error(Errors.COLLAPSIBLE_LIST_INVALID_CHILD);
            }
            return React.cloneElement(child, { key: "visible-" + index });
        });
        if (this.props.collapseFrom === Boundary.START) {
            // reverse START list so we can always slice visible items from the front of the list
            childrenArray.reverse();
        }
        var visibleItemCount = this.props.visibleItemCount;
        return [childrenArray.slice(0, visibleItemCount), childrenArray.slice(visibleItemCount)];
    };
    CollapsibleList.displayName = DISPLAYNAME_PREFIX + ".CollapsibleList";
    CollapsibleList.defaultProps = {
        collapseFrom: Boundary.START,
        dropdownTarget: null,
        visibleItemCount: 3,
        visibleItemRenderer: null,
    };
    return CollapsibleList;
}(React.Component));

//# sourceMappingURL=collapsibleList.js.map