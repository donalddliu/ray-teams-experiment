module.export({FocusStyleManager:()=>FocusStyleManager});let FOCUS_DISABLED;module.link("../common/classes",{FOCUS_DISABLED(v){FOCUS_DISABLED=v}},0);let InteractionModeEngine;module.link("../common/interactionMode",{InteractionModeEngine(v){InteractionModeEngine=v}},1);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */


/* istanbul ignore next */
var fakeFocusEngine = {
    isActive: function () { return true; },
    start: function () { return true; },
    stop: function () { return true; },
};
var focusEngine = typeof document !== "undefined"
    ? new InteractionModeEngine(document.documentElement, FOCUS_DISABLED)
    : fakeFocusEngine;
var FocusStyleManager = {
    alwaysShowFocus: function () { return focusEngine.stop(); },
    isActive: function () { return focusEngine.isActive(); },
    onlyShowFocusOnTabs: function () { return focusEngine.start(); },
};
//# sourceMappingURL=focusStyleManager.js.map