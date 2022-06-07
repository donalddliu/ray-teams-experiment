module.export({BACKSPACE:()=>BACKSPACE,TAB:()=>TAB,ENTER:()=>ENTER,SHIFT:()=>SHIFT,ESCAPE:()=>ESCAPE,SPACE:()=>SPACE,ARROW_LEFT:()=>ARROW_LEFT,ARROW_UP:()=>ARROW_UP,ARROW_RIGHT:()=>ARROW_RIGHT,ARROW_DOWN:()=>ARROW_DOWN,DELETE:()=>DELETE,isKeyboardClick:()=>isKeyboardClick});/*
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
var BACKSPACE = 8;
var TAB = 9;
var ENTER = 13;
var SHIFT = 16;
var ESCAPE = 27;
var SPACE = 32;
var ARROW_LEFT = 37;
var ARROW_UP = 38;
var ARROW_RIGHT = 39;
var ARROW_DOWN = 40;
var DELETE = 46;
/** Returns whether the key code is `enter` or `space`, the two keys that can click a button. */
function isKeyboardClick(keyCode) {
    return keyCode === ENTER || keyCode === SPACE;
}
//# sourceMappingURL=keys.js.map