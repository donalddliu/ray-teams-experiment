module.export({Breadcrumb:()=>Breadcrumb});let classNames;module.link("classnames",{default(v){classNames=v}},0);let React;module.link("react",{"*"(v){React=v}},1);let Classes;module.link("../../common/classes",{"*"(v){Classes=v}},2);/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */



var Breadcrumb = function (breadcrumbProps) {
    var classes = classNames(Classes.BREADCRUMB, (_a = {},
        _a[Classes.DISABLED] = breadcrumbProps.disabled,
        _a), breadcrumbProps.className);
    return (React.createElement("a", { className: classes, href: breadcrumbProps.href, onClick: breadcrumbProps.disabled ? null : breadcrumbProps.onClick, tabIndex: breadcrumbProps.disabled ? null : 0, target: breadcrumbProps.target }, breadcrumbProps.text));
    var _a;
};
//# sourceMappingURL=breadcrumb.js.map