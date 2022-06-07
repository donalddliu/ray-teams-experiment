module.export({headerCase:()=>headerCase});let __assign;module.link("tslib",{__assign(v){__assign=v}},0);let capitalCase;module.link("capital-case",{capitalCase(v){capitalCase=v}},1);

function headerCase(input, options) {
    if (options === void 0) { options = {}; }
    return capitalCase(input, __assign({ delimiter: "-" }, options));
}
//# sourceMappingURL=index.js.map