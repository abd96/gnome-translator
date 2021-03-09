
function namesToView(possibleLangs){
    var names = []; 
    Array.prototype.forEach.call(possibleLangs, lang => {
        names.push(JSON.parse(JSON.stringify(lang)).name);
    });
    return names;
}

function addAvailableLangs(subMenuItem, PossibleLangs) {
        
} 
