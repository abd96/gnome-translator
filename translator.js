const Soup = imports.gi.Soup

function translate(sourceLang, targetLang, text){

        let url = "https://libretranslate.com/translate";
        let request = Soup.Message.new('POST',url);
        var POSTparams = JSON.stringify({
                "q": text,
                "source": sourceLang,
                "target": targetLang 
            });
        request.set_request('application/json', 2, POSTparams);
        var session = new Soup.Session();
        print(request.toString())
        session.send_message(request);
        print(request.response_body.data)
}
