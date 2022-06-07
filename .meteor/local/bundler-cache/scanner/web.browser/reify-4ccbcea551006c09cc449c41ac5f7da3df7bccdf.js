module.export({camelCaseTransform:()=>camelCaseTransform,camelCaseTransformMerge:()=>camelCaseTransformMerge,camelCase:()=>camelCase});let __assign;module.link("tslib",{__assign(v){__assign=v}},0);let pascalCase,pascalCaseTransform,pascalCaseTransformMerge;module.link("pascal-case",{pascalCase(v){pascalCase=v},pascalCaseTransform(v){pascalCaseTransform=v},pascalCaseTransformMerge(v){pascalCaseTransformMerge=v}},1);

function camelCaseTransform(input, index) {
    if (index === 0)
        return input.toLowerCase();
    return pascalCaseTransform(input, index);
}
function camelCaseTransformMerge(input, index) {
    if (index === 0)
        return input.toLowerCase();
    return pascalCaseTransformMerge(input);
}
function camelCase(input, options) {
    if (options === void 0) { options = {}; }
    return pascalCase(input, __assign({ transform: camelCaseTransform }, options));
}
//# sourceMappingURL=index.js.map