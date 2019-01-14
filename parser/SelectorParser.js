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

    function previousOperationSettled(resultObject , type , queryCache , stack){
        console.log(type);
        switch(type){
            case 'child':{
                let newObject = {}
                newObject.children = [];
                newObject.tag = queryCache;
                newObject["class"] = [];
                newObject["id"] = "";
                newObject["pOneSelector"] = [];
                newObject["pSecondSelector"] = [];
                resultObject.children.push(newObject);
                stack.push(newObject);
                return {"object":newObject , "stack":stack};
            }
            case 'class':{
                resultObject["class"].push(queryCache);
                return {"object":resultObject , "stack":stack};
            }
            case 'id':{
                resultObject["id"] = queryCache;
                return {"object":resultObject , "stack":stack};
            }
            case 'comma':{
                let temp  = stack.pop();
                let answer = previousOperationSettled(stack[stack.length - 1] , "child" , queryCache , stack);
                //console.log(answer);
                return {"object": answer["object"] , "stack":answer["stack"]};
            }
        }

    }


    function internalParser(queryString , queryObject){

        let queryCache = '';
        let operatorSpotted = false;
        let stack = [];
        let type = "child";
        let operatorSet = [",",".","#","+","~",":"];

        queryObject["selectorObject"] = {};


        stack.push(queryObject["selectorObject"]);
        let currentObject = queryObject["selectorObject"];
        currentObject.children = [];

        queryString = preprocessed(queryString);
        console.log(queryString);

        for(let character of queryString){

            if(character === " "){
                let answer = previousOperationSettled(currentObject , type , queryCache , stack);
                currentObject = answer["object"];
                stack = answer["stack"];
                type = "child";
                queryCache = "";
            }

            else if(character === "."){
                let answer = previousOperationSettled(currentObject , type , queryCache , stack);
                currentObject = answer["object"];
                stack = answer["stack"];
                type = "class";
                queryCache = "";
            }

            else if(character === "#"){
                let answer = previousOperationSettled(currentObject , type , queryCache , stack);
                currentObject = answer["object"];
                stack = answer["stack"];
                type = "id";
                queryCache = "";
            }

            else if(character === ","){
                let answer = previousOperationSettled(currentObject , type , queryCache , stack);
                currentObject = answer["object"];
                stack = answer["stack"];
                type = "comma";
                queryCache = "";
            }

            else if(alphanumeric(character)){
                queryCache += character;
            }
            else if(!operatorSet.includes(character)){
                queryCache += character;
            }
            
            
        }
        previousOperationSettled(currentObject , type , queryCache , stack);
        return stack[0];
        //console.log(queryCache);
    }


    function roundTrip(cssObject){
        for (let cssSelector of cssObject){
            
            if(cssSelector.directiveSelector){
                 roundTrip(cssSelector.cssArrayObjects);
                 continue;
            }
            
            internalParser(cssSelector.selector , cssSelector);
            //cssSelector["parsedSelector"] = parsedSelector;
            console.log(cssSelector.selectorObject);
            

        }
    }
    roundTrip(cssObject);
    
}

module.exports = {
    selectorParser
}