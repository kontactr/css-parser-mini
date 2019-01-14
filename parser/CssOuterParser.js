

function cssOuterParser(query){

    const queryLength = query.length;

    let queryCache = '';
    let previousCache = '';
    let skipSpace = true;
    let directiveSelector = false;
    let outerSelectorFlag = true;

    function internalParser(resultObject , queryIndex , stack , flag){

        if(queryIndex >= queryLength){
            return stack[0];
        }


        if(query[queryIndex].charCodeAt(0) === 10){
            if(!skipSpace){
                if(previousCache){
                    resultObject[previousCache] = queryCache;
                    queryCache = '';
                    previousCache = '';
                    skipSpace = true;
                }
            }
            return internalParser(resultObject , queryIndex + 1 , stack , 0);
        }

        else if(query[queryIndex] === ' '){
            if(outerSelectorFlag){
                queryCache += query[queryIndex];
                return internalParser(resultObject , queryIndex + 1 , stack , 2);
            }
            else if(skipSpace && !directiveSelector){
                return internalParser(resultObject , queryIndex + 1 , stack , 1);
            }
            else{
                queryCache += query[queryIndex];
                return internalParser(resultObject , queryIndex + 1 , stack , 2);
            }
        }

        else if(query[queryIndex] === '{') {
            let newObject = {}
            if(queryCache){
                newObject["selector"] = queryCache.trim();
                newObject["cssArrayObjects"] = [];
                queryCache = "";
            }else{
                newObject["selecor"] = "";
                newObject["cssArrayObjects"] = [];
                queryCache = "";
            }
            if(directiveSelector){
                newObject["directiveSelector"] = true;
            }

            directiveSelector = false;
            skipSpace = true;
            outerSelectorFlag = false;
            resultObject.cssArrayObjects.push(newObject);
            stack.push(newObject);
            return internalParser(newObject , queryIndex+1 , stack , 3);

        }

        else if(query[queryIndex] === "}"){
            let temp = stack.pop();
            outerSelectorFlag = true;
            return internalParser(
                stack[stack.length - 1],
                queryIndex + 1,
                stack , 5
            );
        }

        else if(query[queryIndex] === ":"){
            skipSpace = false;

            if(directiveSelector){
                queryCache += query[queryIndex];
                return internalParser(
                    resultObject , queryIndex+1,
                    stack , 10
                );

                }else if(outerSelectorFlag){
                    queryCache += query[queryIndex];
                    return internalParser(
                        resultObject , queryIndex+1 ,
                        stack , 11
                    );
            }else{

            if(queryCache){
                previousCache = queryCache;
                queryCache = '';
            }
            return internalParser(
                resultObject , queryIndex + 1,
                stack , 6
            );
            }
        }

        else if(query[queryIndex] === ";"){
            if(previousCache){
                skipSpace = true;
                resultObject[previousCache] = queryCache.trim();
                previousCache = '';
                queryCache = '';
            }
            return internalParser(resultObject , 
                queryIndex + 1 , stack , 7
                );
        }

        else if(query[queryIndex] === '@'){
            directiveSelector = true;
            return internalParser(
                resultObject,
                queryIndex + 1,
                stack ,
                8
            );
        }


        else {
            queryCache += query[queryIndex];
            return internalParser(resultObject , queryIndex+1 ,
                stack , 8
                );
        }

    }

    let newObject = {
        cssArrayObjects: []

    }
    newObject =  internalParser(newObject , 0 , [newObject] , 0);
    return newObject.cssArrayObjects;

}

module.exports = {
    cssOuterParser
}