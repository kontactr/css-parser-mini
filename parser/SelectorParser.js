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

    function previousOperationSettled(resultObject , type , queryCache , stack , settings){
        console.log(type , "Qqqqq" , settings);
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
                return {"object":newObject , "stack":stack , "settings":settings};
            }
            case 'class':{
                resultObject["class"].push(queryCache);
                return {"object":resultObject , "stack":stack,"settings":settings};
            }
            case 'id':{
                resultObject["id"] = queryCache;
                return {"object":resultObject , "stack":stack,"settings":settings};
            }
            case 'comma':{
                let temp  = stack.pop();
                let answer = previousOperationSettled(stack[stack.length - 1] , "child" , queryCache , stack , settings);
                //console.log(answer);
                return {"object": answer["object"] , "stack":answer["stack"],"settings":settings};
            }
            case 'single colon':{
                resultObject["pOneSelector"].push(queryCache);
                settings["colonedStatus"] = 0;
                return {"object":resultObject , "stack":stack , settings:settings};
            }
            case 'Double colon':{
                resultObject["pSecondSelector"].push(queryCache);
                settings["colonedStatus"] = 0;
                return {"object":resultObject , "stack":stack , settings:settings};
            }
            default:{
                return{"object":resultObject , "stack":stack , "settings":settings};
            }
        }

    }


    function internalParser(queryString , queryObject){

        let queryCache = '';
        let operatorSpotted = false;
        let stack = [];
        let type = "child";
        let operatorSet = [",",".","#","+","~",":"];
         
        let settings = {
            colonedStatus : 0
        }

        queryObject["selectorObject"] = {};


        stack.push(queryObject["selectorObject"]);
        let currentObject = queryObject["selectorObject"];
        currentObject.children = [];

        queryString = preprocessed(queryString);
        console.log(queryString);

        for(let character of queryString){

            if(character === " "){
                let answer = previousOperationSettled(currentObject , type , queryCache , stack , settings);
                currentObject = answer["object"];
                stack = answer["stack"];
                settings = answer["settings"];
                type = "child";
                queryCache = "";
            }

            else if(character === "."){
                let answer = previousOperationSettled(currentObject , type , queryCache , stack , settings);
                currentObject = answer["object"];
                stack = answer["stack"];
                settings = answer["settings"];
                type = "class";
                queryCache = "";
            }

            else if(character === "#"){
                let answer = previousOperationSettled(currentObject , type , queryCache , stack , settings);
                currentObject = answer["object"];
                stack = answer["stack"];
                settings = answer["settings"];
                type = "id";
                queryCache = "";
            }

            else if(character === ","){
                let answer = previousOperationSettled(currentObject , type , queryCache , stack , settings);
                currentObject = answer["object"];
                stack = answer.stack;
                settings = answer.settings;
                type = "comma";
                queryCache = "";
            }

            else if(character === ":"){
                if(settings.colonedStatus == 0){
                    let answer = previousOperationSettled(currentObject , type , queryCache ,stack , settings);
                    settings.colonedStatus = 1;
                    currentObject = answer.object;
                    stack = answer.stack;
                    settings = answer.settings;
                    queryCache = "";
                    type = "single colon";
                }else if(settings.colonedStatus == 1){
                    colonedStatus = 2;
                    type = "Double colon";
                    queryCache = '';
                }
            }

            

            else if(alphanumeric(character)){
                queryCache += character;
            }
            else if(!operatorSet.includes(character)){
                queryCache += character;
            }
            
            
        }
        previousOperationSettled(currentObject , type , queryCache , stack , settings);
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
        return cssObject;
    }
    return roundTrip(cssObject);
    
}

module.exports = {
    selectorParser
}