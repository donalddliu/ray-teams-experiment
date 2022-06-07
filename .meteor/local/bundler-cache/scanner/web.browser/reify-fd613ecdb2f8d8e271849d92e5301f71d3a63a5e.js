module.export({isDarkTheme:()=>isDarkTheme});let Classes;module.link("../",{Classes(v){Classes=v}},0);/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

function isDarkTheme(element) {
    return element.closest("." + Classes.DARK) != null;
}
//# sourceMappingURL=isDarkTheme.js.map