module.export({NavbarGroup:()=>NavbarGroup});let __assign,__extends,__rest;module.link("tslib",{__assign(v){__assign=v},__extends(v){__extends=v},__rest(v){__rest=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let AbstractPureComponent2,Alignment,Classes;module.link("../../common",{AbstractPureComponent2(v){AbstractPureComponent2=v},Alignment(v){Alignment=v},Classes(v){Classes=v}},3);let DISPLAYNAME_PREFIX;module.link("../../common/props",{DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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





// this component is simple enough that tests would be purely tautological.
/* istanbul ignore next */
var NavbarGroup = /** @class */ (function (_super) {
    __extends(NavbarGroup, _super);
    function NavbarGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavbarGroup.prototype.render = function () {
        var _a = this.props, align = _a.align, children = _a.children, className = _a.className, htmlProps = __rest(_a, ["align", "children", "className"]);
        var classes = classNames(Classes.NAVBAR_GROUP, Classes.alignmentClass(align), className);
        return (React.createElement("div", __assign({ className: classes }, htmlProps), children));
    };
    NavbarGroup.displayName = "".concat(DISPLAYNAME_PREFIX, ".NavbarGroup");
    NavbarGroup.defaultProps = {
        align: Alignment.LEFT,
    };
    return NavbarGroup;
}(AbstractPureComponent2));

//# sourceMappingURL=navbarGroup.js.map