module.export({HTMLTable:()=>HTMLTable});let tslib_1;module.link("tslib",{"*"(v){tslib_1=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let CONDENSED,HTML_TABLE,HTML_TABLE_BORDERED,HTML_TABLE_STRIPED,INTERACTIVE,SMALL;module.link("../../common/classes",{CONDENSED(v){CONDENSED=v},HTML_TABLE(v){HTML_TABLE=v},HTML_TABLE_BORDERED(v){HTML_TABLE_BORDERED=v},HTML_TABLE_STRIPED(v){HTML_TABLE_STRIPED=v},INTERACTIVE(v){INTERACTIVE=v},SMALL(v){SMALL=v}},3);/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */




// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var HTMLTable = /** @class */ (function (_super) {
    tslib_1.__extends(HTMLTable, _super);
    function HTMLTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLTable.prototype.render = function () {
        var _a = this.props, bordered = _a.bordered, className = _a.className, condensed = _a.condensed, elementRef = _a.elementRef, interactive = _a.interactive, small = _a.small, striped = _a.striped, htmlProps = tslib_1.__rest(_a, ["bordered", "className", "condensed", "elementRef", "interactive", "small", "striped"]);
        var classes = classNames(HTML_TABLE, (_b = {},
            _b[CONDENSED] = condensed,
            _b[HTML_TABLE_BORDERED] = bordered,
            _b[HTML_TABLE_STRIPED] = striped,
            _b[INTERACTIVE] = interactive,
            _b[SMALL] = small,
            _b), className);
        // tslint:disable-next-line:blueprint-html-components
        return React.createElement("table", tslib_1.__assign({}, htmlProps, { ref: elementRef, className: classes }));
        var _b;
    };
    return HTMLTable;
}(React.PureComponent));

//# sourceMappingURL=htmlTable.js.map