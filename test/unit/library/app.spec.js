define(
    ['vendor/underscore'],
    function (_) {
        var stubs, context, loaded = false, createResult = 'hello';

        stubs = {
            'base/gui': {
                isReady: function(){return true;},
                displayGame: function(){},
                displayHelp: function(){},
                updateStats: function(){},
                addRaters: function(){}
            },
            'base/games': {
                getAllGames: function() {
                    return {
                        game1: {
                            getImportance: sinon.stub().returns(100),
                            create: sinon.stub().returns(createResult),
                            getHtml: sinon.stub().returns('<h1>' + createResult + '</h1>'),
                            getHelp: sinon.stub(),
                            getUsedWords: sinon.stub(),
                            getHash: sinon.stub()
                        }
                    }
                },
                getEnabledGames: function() {
                    return {
                        game1: {
                            getImportance: sinon.stub().returns(100),
                            create: sinon.stub().returns(createResult),
                            getHtml: sinon.stub().returns('<h1>' + createResult + '</h1>'),
                            getHelp: sinon.stub(),
                            getUsedWords: sinon.stub(),
                            getHash: sinon.stub()
                        }
                    }
                }
            },
            'base/stat': {
                getStats: sinon.stub()
            },
            'base/timer': {
                start: sinon.stub(),
                end: sinon.stub()
            },
            'base/dictionary': {
                getDictionary: sinon.stub()
            }
        };

        context = requireHelper.createContext(stubs, _);

        context(['app'], function (app) {
            describe('app', function() {
                describe('#run()', function() {
                    it('should return a game', function(){
                        expect(app.run()).to.be.an('object');
                    });
                });
            });

            loaded = true;
        });

        return {
            isLoaded: function(){return loaded;}
        }
    }
);