module.export({paramCase:()=>paramCase});let __assign;module.link("tslib",{__assign(v){__assign=v}},0);let dotCase;module.link("dot-case",{dotCase(v){dotCase=v}},1);

function paramCase(input, options) {
    if (options === void 0) { options = {}; }
    return dotCase(input, __assign({ delimiter: "-" }, options));
}
//# sourceMappingURL=index.js.map