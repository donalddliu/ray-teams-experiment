module.export({IconNames:()=>IconNames});let __assign;module.link("tslib",{__assign(v){__assign=v}},0);let pascalCase,snakeCase;module.link("change-case",{pascalCase(v){pascalCase=v},snakeCase(v){snakeCase=v}},1);let BlueprintIcons_16;module.link("./generated/16px/blueprint-icons-16",{BlueprintIcons_16(v){BlueprintIcons_16=v}},2);/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

/* eslint-disable camelcase */


var IconNamesNew = {};
var IconNamesLegacy = {};
for (var _i = 0, _a = Object.values(BlueprintIcons_16); _i < _a.length; _i++) {
    var name_1 = _a[_i];
    IconNamesNew[pascalCase(name_1)] = name_1;
    IconNamesLegacy[snakeCase(name_1).toUpperCase()] = name_1;
}
var IconNames = __assign(__assign({}, IconNamesNew), IconNamesLegacy);
//# sourceMappingURL=iconNames.js.map