const Soup = imports.gi.Soup

function translate(sourceLang, targetLang, text){

        let URL = "https://libretranslate.com/translate";
        let request = Soup.Message.new('POST',URL);
        var POSTparams = JSON.stringify({
                "q": text,
                "source": sourceLang,
                "target": targetLang 
            });
        request.set_request('application/json', 2, POSTparams);
        var session = new Soup.Session();
        session.send_message(request);
        return request.response_body.data;
}

function getSupportedLangs(){
    let URL = "https://libretranslate.com/languages";
    let request = Soup.Message.new('POST', URL);
    request.set_request('application/json', 2, JSON.stringify({}));
    var session = new Soup.Session();
    session.send_message(request);
    return JSON.parse(request.response_body.data);
}
