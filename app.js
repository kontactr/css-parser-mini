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

h1::n-th-of-type(5n){
    p1:p1;
}

h2:n-p{
    errr:errr;
}

* {
    pass:pass;
}

@media only screen(maxWidth: 500px) and (min-width: 700px){
    h1{
        prop1: value2;
    }
}

`;

console.log(parser.cssOuterParser(css));