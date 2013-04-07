d3.game.wordToEnglish = (function($, _){
    var dictionary;

    function setDictionary(dict) {
        dictionary = dict;
    }

    function getDictionary() {
        if (typeof dictionary == 'undefined') {
            dictionary = d3.dictionary;
        }

        return dictionary;
    }

    function run() {
        return true;
    }

    return {
        run: run,
        importance: 30,
        setDictionary: setDictionary
    };
})(jQuery, _);