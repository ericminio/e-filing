var chai = require('chai')
    , expect = chai.expect;
var LocalServer = require('../../app/server/fake.bceid.form');

describe('Form access', function() {

    var Zombie = require("zombie");
    var Server = require('../../app/server/server');

    var port = 5000;
    var ip = 'localhost';
    var home = 'http://' + ip + ':' + port;
    var validator;
    var localLoginServer;

    beforeEach(function(done) {
        localLoginServer = new LocalServer({token:'monday'});
        server = new Server();
        server.useGuardian(localLoginServer);
        server.start(port, ip, done);
    });

    afterEach(function(done) {
        server.stop(done);
    });

    it('requires login by default', function(done) {
        const browser = new Zombie();

        browser.visit(home + '/index.html')
            .then(function() {
                browser.assert.success();
            })
            .then(function() {
                return browser.clickLink('#form2');
            })
            .then(function() {
                return browser.assert.element('form input[name=user]');
            })
            .then(done, done);
    });

    it('is allowed after login', function(done) {
        const browser = new Zombie();

        browser.visit(home + '/index.html')
            .then(function() {
                browser.assert.success();
            })
            .then(function() {
                return browser.clickLink('#form2');
            })
            .then(function() {
                browser
                    .fill('user', 'any-user')
                    .fill('password', 'any');                
                return browser.pressButton('Continue');
            })
            .then(function() {
                browser.assert.text('title', 'E-Filing - Form 2');
            })
            .then(function() {
                return browser.clickLink('#home');
            })
            .then(function() {
                return browser.clickLink('#form7');
            })
            .then(function() {
                browser.assert.text('title', 'E-Filing - Form 7');
            })
            .then(done, done);
    });
});
