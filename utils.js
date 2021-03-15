const Extension  = imports.misc.extensionUtils.getCurrentExtension();
const Translator = Extension.imports.translator;

function namesToView(possibleLangs){
    var names = []; 
    Array.prototype.forEach.call(possibleLangs, lang => {
        names.push(JSON.parse(JSON.stringify(lang)).name);
    });
    return names;
}

function getCodeForName(name) {
    possibleLangs = Translator.getSupportedLangs();
    let code = "";
    Array.prototype.forEach.call(possibleLangs, lang => {
        let ob = JSON.stringify(lang);
        if (JSON.parse(ob).name == name){
            code = JSON.parse(ob).code;
        }
    }); 
    return code;
} 
