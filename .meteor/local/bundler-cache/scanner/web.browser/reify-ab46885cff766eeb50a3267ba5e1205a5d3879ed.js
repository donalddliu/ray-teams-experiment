module.export({Callout:()=>Callout});let __assign,__extends,__rest;module.link("tslib",{__assign(v){__assign=v},__extends(v){__extends=v},__rest(v){__rest=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let AbstractPureComponent2,Classes,DISPLAYNAME_PREFIX,Intent;module.link("../../common",{AbstractPureComponent2(v){AbstractPureComponent2=v},Classes(v){Classes=v},DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v},Intent(v){Intent=v}},3);let H4;module.link("../html/html",{H4(v){H4=v}},4);let Icon,IconSize;module.link("../icon/icon",{Icon(v){Icon=v},IconSize(v){IconSize=v}},5);/*
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






var Callout = /** @class */ (function (_super) {
    __extends(Callout, _super);
    function Callout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Callout.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, children = _b.children, icon = _b.icon, intent = _b.intent, title = _b.title, htmlProps = __rest(_b, ["className", "children", "icon", "intent", "title"]);
        var iconName = this.getIconName(icon, intent);
        var classes = classNames(Classes.CALLOUT, Classes.intentClass(intent), (_a = {}, _a[Classes.CALLOUT_ICON] = iconName != null, _a), className);
        return (React.createElement("div", __assign({ className: classes }, htmlProps),
            iconName && React.createElement(Icon, { icon: iconName, size: IconSize.LARGE, "aria-hidden": true, tabIndex: -1 }),
            title && React.createElement(H4, null, title),
            children));
    };
    Callout.prototype.getIconName = function (icon, intent) {
        // 1. no icon
        if (icon === null) {
            return undefined;
        }
        // 2. defined iconName prop
        if (icon !== undefined) {
            return icon;
        }
        // 3. default intent icon
        switch (intent) {
            case Intent.DANGER:
                return "error";
            case Intent.PRIMARY:
                return "info-sign";
            case Intent.WARNING:
                return "warning-sign";
            case Intent.SUCCESS:
                return "tick";
            default:
                return undefined;
        }
    };
    Callout.displayName = "".concat(DISPLAYNAME_PREFIX, ".Callout");
    return Callout;
}(AbstractPureComponent2));

//# sourceMappingURL=callout.js.map