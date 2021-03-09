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
    print(possibleLangs)
} 
