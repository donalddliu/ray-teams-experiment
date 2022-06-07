module.export({constantCase:()=>constantCase});let __assign;module.link("tslib",{__assign(v){__assign=v}},0);let noCase;module.link("no-case",{noCase(v){noCase=v}},1);let upperCase;module.link("upper-case",{upperCase(v){upperCase=v}},2);


function constantCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, __assign({ delimiter: "_", transform: upperCase }, options));
}
//# sourceMappingURL=index.js.map