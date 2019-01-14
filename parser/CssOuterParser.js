

function cssOuterParser(query){

    const queryLength = query.length;

    let queryCache = '';
    let previousCache = '';
    let skipSpace = true;
    let inSelector = false;

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
            if(skipSpace){
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
                newObject["selector"] = queryCache;
                queryCache = "";
            }else{
                newObject["selecor"] = "";
                queryCache = "";
            }
            resultObject.cssArrayObjects.push(newObject);
            stack.push(newObject);
            return internalParser(newObject , queryIndex+1 , stack , 3);

        }

        else if(query[queryIndex] === "}"){
            let temp = stack.pop();
            return internalParser(
                stack[stack.length - 1],
                queryIndex + 1,
                stack , 5
            );
        }

        else if(query[queryIndex] === ":"){
            skipSpace = false;
            if(queryCache){
                previousCache = queryCache;
                queryCache = '';
            }
            return internalParser(
                resultObject , queryIndex + 1,
                stack , 6
            );
        }

        else if(query[queryIndex] === ";"){
            if(previousCache){
                skipSpace = true;
                resultObject[previousCache] = queryCache;
                previousCache = '';
                queryCache = '';
            }
            return internalParser(resultObject , 
                queryIndex + 1 , stack , 7
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
    console.log(internalParser(newObject , 0 , [newObject] , 0));

}

module.exports = {
    cssOuterParser
}