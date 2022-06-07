module.export({capitalCaseTransform:()=>capitalCaseTransform,capitalCase:()=>capitalCase});let __assign;module.link("tslib",{__assign(v){__assign=v}},0);let noCase;module.link("no-case",{noCase(v){noCase=v}},1);let upperCaseFirst;module.link("upper-case-first",{upperCaseFirst(v){upperCaseFirst=v}},2);


function capitalCaseTransform(input) {
    return upperCaseFirst(input.toLowerCase());
}
function capitalCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, __assign({ delimiter: " ", transform: capitalCaseTransform }, options));
}
//# sourceMappingURL=index.js.map