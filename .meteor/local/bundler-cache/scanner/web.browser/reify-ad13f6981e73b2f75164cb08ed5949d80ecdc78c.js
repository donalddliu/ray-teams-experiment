module.export({H1:()=>H1,H2:()=>H2,H3:()=>H3,H4:()=>H4,H5:()=>H5,H6:()=>H6,Blockquote:()=>Blockquote,Code:()=>Code,Pre:()=>Pre,Label:()=>Label,OL:()=>OL,UL:()=>UL});let __assign,__rest;module.link("tslib",{__assign(v){__assign=v},__rest(v){__rest=v}},0);let classNames;module.link("classnames",{default(v){classNames=v}},1);let React;module.link("react",{"*"(v){React=v}},2);let BLOCKQUOTE,CODE,CODE_BLOCK,HEADING,LABEL,LIST;module.link("../../common/classes",{BLOCKQUOTE(v){BLOCKQUOTE=v},CODE(v){CODE=v},CODE_BLOCK(v){CODE_BLOCK=v},HEADING(v){HEADING=v},LABEL(v){LABEL=v},LIST(v){LIST=v}},3);/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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




function htmlElement(tagName, tagClassName) {
    /* eslint-disable-next-line react/display-name */
    return function (props) {
        var className = props.className, elementRef = props.elementRef, htmlProps = __rest(props, ["className", "elementRef"]);
        return React.createElement(tagName, __assign(__assign({}, htmlProps), { className: classNames(tagClassName, className), ref: elementRef }));
    };
}
// the following components are linted by blueprint-html-components because
// they should rarely be used without the Blueprint classes/styles:
var H1 = htmlElement("h1", HEADING);
var H2 = htmlElement("h2", HEADING);
var H3 = htmlElement("h3", HEADING);
var H4 = htmlElement("h4", HEADING);
var H5 = htmlElement("h5", HEADING);
var H6 = htmlElement("h6", HEADING);
var Blockquote = htmlElement("blockquote", BLOCKQUOTE);
var Code = htmlElement("code", CODE);
var Pre = htmlElement("pre", CODE_BLOCK);
var Label = htmlElement("label", LABEL);
// these two are not linted by blueprint-html-components because there are valid
// uses of these elements without Blueprint styles:
var OL = htmlElement("ol", LIST);
var UL = htmlElement("ul", LIST);
//# sourceMappingURL=html.js.map