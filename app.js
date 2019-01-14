const parser = require("./parser/CssOuterParser");

const css = `

h1 {
    prop1: value;
    prop2: valu2;
}

h2 {
    propq: value1;
    prop2: value1 value2;
}

h1,h2 .main #id{
    prop1: value2;
    prop2 : value4;
}

`;

console.log(parser.cssOuterParser(css));