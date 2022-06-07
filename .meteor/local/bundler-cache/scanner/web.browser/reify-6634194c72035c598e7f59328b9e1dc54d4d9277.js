module.export({sentenceCaseTransform:()=>sentenceCaseTransform,sentenceCase:()=>sentenceCase});let __assign;module.link("tslib",{__assign(v){__assign=v}},0);let noCase;module.link("no-case",{noCase(v){noCase=v}},1);let upperCaseFirst;module.link("upper-case-first",{upperCaseFirst(v){upperCaseFirst=v}},2);


function sentenceCaseTransform(input, index) {
    var result = input.toLowerCase();
    if (index === 0)
        return upperCaseFirst(result);
    return result;
}
function sentenceCase(input, options) {
    if (options === void 0) { options = {}; }
    return noCase(input, __assign({ delimiter: " ", transform: sentenceCaseTransform }, options));
}
//# sourceMappingURL=index.js.map