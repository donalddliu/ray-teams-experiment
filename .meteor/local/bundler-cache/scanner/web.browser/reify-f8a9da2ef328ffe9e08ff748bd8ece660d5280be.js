module.export({HotkeysTarget2:()=>HotkeysTarget2});let React;module.link("react",{"*"(v){React=v}},0);let Errors;module.link("../../common/errors",{"*"(v){Errors=v}},1);let isNodeEnv;module.link("../../common/utils",{isNodeEnv(v){isNodeEnv=v}},2);let useHotkeys;module.link("../../hooks",{useHotkeys(v){useHotkeys=v}},3);/*
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




/**
 * Utility component which allows consumers to use the new `useHotkeys` hook inside
 * React component classes. The implementation simply passes through to the hook.
 */
var HotkeysTarget2 = function (_a) {
    var children = _a.children, hotkeys = _a.hotkeys, options = _a.options;
    var _b = useHotkeys(hotkeys, options), handleKeyDown = _b.handleKeyDown, handleKeyUp = _b.handleKeyUp;
    // run props validation
    React.useEffect(function () {
        if (!isNodeEnv("production")) {
            if (typeof children !== "function" && hotkeys.some(function (h) { return !h.global; })) {
                console.error(Errors.HOTKEYS_TARGET2_CHILDREN_LOCAL_HOTKEYS);
            }
        }
    }, [hotkeys]);
    if (typeof children === "function") {
        return children({ handleKeyDown: handleKeyDown, handleKeyUp: handleKeyUp });
    }
    else {
        return children;
    }
};
//# sourceMappingURL=hotkeysTarget2.js.map