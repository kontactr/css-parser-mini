const parser = require("./parser/CssOuterParser");
const selectorParser = require("./parser/SelectorParser");

const css = `


h1 , h2 .main #id{
    prop1: value2;
    prop2 : value4;
}

* {
    pass:pass;
}


h1 {
    prop1: value;
    prop2: valu2;
}

h2 h3 {
    propq: value1;
    prop2: value1 value2;
}


@media only screen(maxWidth: 500px) and (min-width: 700px){
    h1{
        prop1: value2;
        prop3: value2 value4;
    }
}

`;

console.log(selectorParser.selectorParser(parser.cssOuterParser(css)));