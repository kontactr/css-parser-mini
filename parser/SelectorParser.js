function selectorParser(cssObject){

    function alphanumeric(inputtxt)
    { 
        var letters = /^[0-9a-zA-Z]+$/;
        if(inputtxt.match(letters))
            return true;
        else
            return false;
    }

    function preprocessed(queryString){
        let newQueryString = ""
        let spaceBuffered = false;
        let operatorBuffered = false;
        let operatorSet = [",",".","#","+","~",":"]
        for (let character of queryString){
            if(character === " "){
                spaceBuffered = true;
            }else if(operatorSet.includes(character)){
                newQueryString += character;
                spaceBuffered = false;
                operatorBuffered = true;
            }else {
                if(spaceBuffered && !operatorBuffered){
                    newQueryString += " ";
                    spaceBuffered = false;
                    operatorBuffered = false;
                }
                newQueryString += character;
            }
        }
        return newQueryString;
    }

    function internalParser(queryString , queryObject){

        
        let queryCache = '';
        let spaceEncountered = false;
        let stack = [];
        let type = "";

        queryObject["selectorObject"] = {};

        stack.push(queryObject["selectorObject"]);
        let currentObject = queryObject["selectorObject"];
        currentObject.children = [];

        queryString = preprocessed(queryString);
        console.log(queryString);

        for(let character of queryString){
                break;

            
        }
    }


    function roundTrip(cssObject){
        for (let cssSelector of cssObject){
            
            if(cssSelector.directiveSelector){
                 roundTrip(cssSelector.cssArrayObjects);
                 continue;
            }
            internalParser(cssSelector.selector , cssSelector);
        }
    }
    roundTrip(cssObject);
    
}

module.exports = {
    selectorParser
}