define(
    ['gui', 'games', 'stat', 'timer', 'dictionary', 'vendor/jquery', 'vendor/underscore'],
    function(gui, games, stat, timer, dictionary, $, _){
        var importanceList, currentGame, currentAnswer, canReRun = false;

        /**
         *
         * @return {Number}
         */
        function getGamesSum() {
            var result;

            importanceList = {};

            _.each(games, function(game, key){
                importanceList[key] = game.getImportance();
            });

            result = _.reduce(importanceList, function(memo, importance){return parseInt(memo) + parseInt(importance);}, 0);

            return result;
        }

        /**
         *
         * @return {Boolean|Object}
         */
        function getRandomGame() {
            var sum, rand, game = null;

            sum = getGamesSum();
            rand = _.random(sum);

            _.every(importanceList, function(value, key){
                rand = rand - value;
                if (rand <= 0) {
                    game = key;
                    return false;
                }
                return true;
            });

            if (game) {
                return games[game];
            }

            return false;
        }

        /**
         *
         * @return {Boolean|Object}
         */
        function run() {
            var game, html, submit;

            timer.start('game.init');
            game = getRandomGame();

            canReRun = false;
            currentGame = game;
            currentAnswer = null;

            if (game && game.create()) {
                displayGame(game);
            }

            timer.end('game.init');

            return game;
        }

        /**
         *
         * @param {Object} game
         */
        function displayGame(game) {
            var html = $(game.getHtml());

            $('#submit', html).click(checkResult);

            timer.start('game.display');
            gui.displayGame(html);
            gui.displayHelp(game.getHelp(), game.getUsedWords());
            timer.end('game.display');
        }

        /**
         *
         * @param {Object} event
         */
        function checkResult(event) {
            var radioBtns, answer;

            event.preventDefault();

            radioBtns = $('.options input');
            answer = $('span', radioBtns.filter(':checked').parent());
            currentAnswer = answer;

            if (answer.length) {
                radioBtns.attr('disabled', true);
                if (currentGame.checkResult(answer.text())) {
                    handleSuccess(answer);
                } else {
                    handleFailure(answer, radioBtns);
                }
            }

            updateStats();
        }

        /**
         *
         * @param {Object} answer
         * @param {Object} radioBtns
         */
        function handleFailure(answer, radioBtns) {
            var hashes = [], rightAnswer, i, span;

            _.each(currentGame.getUsedWords(), function(word){
                hashes.push(word.hash);
            });

            answer.addClass('failure');

            rightAnswer = currentGame.getAnswer();
            for (i = 0; i < radioBtns.length; i++) {
                span = $('span', radioBtns.eq(i).parent());
                if (span.text() == rightAnswer) {
                    span.addClass('rightAnswer');
                    break;
                }
            }

            stat.saveResult(hashes, false);

            gui.showErrorReportBtn();

            reRun();
        }

        /**
         *
         * @param {Object} answer
         */
        function handleSuccess(answer) {
            var hashes = [];

            _.each(currentGame.getUsedWords(), function(word){
                hashes.push(word.hash);
            });

            answer.addClass('success');

            stat.saveResult(hashes, true);

            reRun();
        }

        function updateStats() {
            var dict, stats;

            dict = dictionary.getDictionary();
            stats = stat.getStats(dict);

            gui.updateStats(stats);
        }

        function reRun() {
            canReRun = true;
            setTimeout(function(){
                if (canReRun) {
                    run();
                }
            }, 3000);
        }

        function isReady(){
            if (gui.isReady()) {
                updateStats();
                return true;
            }
            return false;
        }

        return {
            run: run,
            isReady: isReady
        };
    }
);