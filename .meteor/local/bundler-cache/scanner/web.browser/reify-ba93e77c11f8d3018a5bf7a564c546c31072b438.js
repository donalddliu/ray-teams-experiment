module.export({dotCase:()=>dotCase});let __assign;module.link("tslib",{__assign(v){__assign=v}},0);let noCase;module.link("no-case",{noCase(v){noCase=v}},1);

function dotCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, __assign({ delimiter: "." }, options));
}
//# sourceMappingURL=index.js.map