module.export({IconSize:()=>IconSize,Icon:()=>Icon});let __assign,__extends,__rest;module.link("tslib",{__assign(v){__assign=v},__extends(v){__extends=v},__rest(v){__rest=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let IconSvgPaths16,IconSvgPaths20,iconNameToPathsRecordKey;module.link("@blueprintjs/icons",{IconSvgPaths16(v){IconSvgPaths16=v},IconSvgPaths20(v){IconSvgPaths20=v},iconNameToPathsRecordKey(v){iconNameToPathsRecordKey=v}},3);let AbstractPureComponent2,Classes,DISPLAYNAME_PREFIX;module.link("../../common",{AbstractPureComponent2(v){AbstractPureComponent2=v},Classes(v){Classes=v},DISPLAYNAME_PREFIX(v){DISPLAYNAME_PREFIX=v}},4);/*
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





var IconSize;
(function (IconSize) {
    IconSize[IconSize["STANDARD"] = 16] = "STANDARD";
    IconSize[IconSize["LARGE"] = 20] = "LARGE";
})(IconSize || (module.runSetters(IconSize = {})));
var Icon = /** @class */ (function (_super) {
    __extends(Icon, _super);
    function Icon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Icon.prototype.render = function () {
        var icon = this.props.icon;
        if (icon == null || typeof icon === "boolean") {
            return null;
        }
        else if (typeof icon !== "string") {
            return icon;
        }
        var _a = this.props, className = _a.className, color = _a.color, htmlTitle = _a.htmlTitle, 
        // eslint-disable-next-line deprecation/deprecation
        iconSize = _a.iconSize, intent = _a.intent, _b = _a.size, size = _b === void 0 ? iconSize !== null && iconSize !== void 0 ? iconSize : IconSize.STANDARD : _b, title = _a.title, _c = _a.tagName, tagName = _c === void 0 ? "span" : _c, htmlprops = __rest(_a, ["className", "color", "htmlTitle", "iconSize", "intent", "size", "title", "tagName"]);
        // choose which pixel grid is most appropriate for given icon size
        var pixelGridSize = size >= IconSize.LARGE ? IconSize.LARGE : IconSize.STANDARD;
        // render path elements, or nothing if icon name is unknown.
        var paths = this.renderSvgPaths(pixelGridSize, icon);
        var classes = classNames(Classes.ICON, Classes.iconClass(icon), Classes.intentClass(intent), className);
        var viewBox = "0 0 ".concat(pixelGridSize, " ").concat(pixelGridSize);
        return React.createElement(tagName, __assign(__assign({}, htmlprops), { "aria-hidden": title ? undefined : true, className: classes, title: htmlTitle }), React.createElement("svg", { fill: color, "data-icon": icon, width: size, height: size, viewBox: viewBox },
            title && React.createElement("desc", null, title),
            paths));
    };
    /** Render `<path>` elements for the given icon name. Returns `null` if name is unknown. */
    Icon.prototype.renderSvgPaths = function (pathsSize, iconName) {
        var svgPathsRecord = pathsSize === IconSize.STANDARD ? IconSvgPaths16 : IconSvgPaths20;
        var paths = svgPathsRecord[iconNameToPathsRecordKey(iconName)];
        if (paths == null) {
            return null;
        }
        return paths.map(function (path, i) { return React.createElement("path", { key: i, d: path, fillRule: "evenodd" }); });
    };
    Icon.displayName = "".concat(DISPLAYNAME_PREFIX, ".Icon");
    return Icon;
}(AbstractPureComponent2));

//# sourceMappingURL=icon.js.map