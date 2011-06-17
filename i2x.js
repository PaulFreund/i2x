//###################################################################################################
/*
    Todo:
    -----
    
    - Router
    - Actions
    - MultiUser
    - Webinterface
    
    Done: 
    -----
    
    - StoreHandler
    - New StoreHandler functions
    - Simple action add/del with database
    - Extended ircHandler
    - Extended xmppHandler
    - Wiring
    
    
*/
//###################################################################################################
// Basic Object
I2X = (function i2x() {
    /////////////////////////////////////////////////////////////////////////////////////////////////
   
    var 
    ////=============================================================================================
    // Requirements
    
        fs = require('fs'),
        util = require('util'),
        ircHandler = require('ircHandler'),
        xmppHandler = require('xmppHandler'),
        storeHandler = require('storeHandler'),
        routerHandler = require('routerHandler'),
        actionHandler = require('actionHandler'),

    ////=============================================================================================
    // Propertys
    
        self = this, 
        irc,
        xmpp,
        store,
        router,
        action,
        
    ////=============================================================================================
    // Methods
    
        ////-----------------------------------------------------------------------------------------
        // Initialize
        init = function() {
            var config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));
            
            irc = ircHandler.create(config.irc);
            xmpp = xmppHandler.create(config.xmpp);
            store = storeHandler.create(config.store);
            
            store.on('ready', function() {
                router = routerHandler.create(config.router, store);
                action = actionHandler.create(config.action, store);

                //// Wiring        
                // IRC
                irc.on('message', function(from,to,message) {
                    var arr = [];
                    router.emit.apply(this, arr.concat('message', 'irc', arguments));
                    action.emit.apply(this, arr.concat('message', 'irc',arguments));
                });

                irc.on('command', function(from,to,message) {
                    var arr = [];
                    action.emit.apply(this, arr.concat('command', 'irc',arguments));
                });
                
                irc.on('event', function(from,to,message) {
                    var arr = [];
                    router.emit.apply(this, arr.concat('event', 'irc', arguments));
                    action.emit.apply(this, arr.concat('event', 'irc', arguments));
                });

                // XMPP
                xmpp.on('message', function(from,to,message) {
                    var arr = [];
                    router.emit.apply(this, arr.concat('message', 'xmpp', arguments));
                    action.emit.apply(this, arr.concat('message', 'xmpp', arguments));
                });

                xmpp.on('command', function(from,to,message) {
                    var arr = [];
                    action.emit.apply(this, arr.concat('command', 'xmpp', arguments));
                });
                
                xmpp.on('presence', function(from,to,message) {
                    var arr = [];
                    router.emit.apply(this, arr.concat('presence', 'xmpp', arguments));
                    action.emit.apply(this, arr.concat('presence', 'xmpp', arguments));
                });
                
                xmpp.on('subscribe', function(from,to,message) {
                    var arr = [];
                    router.emit.apply(this, arr.concat('subscribe', 'xmpp', arguments));
                    action.emit.apply(this, arr.concat('subscribe', 'xmpp', arguments));
                });

                xmpp.on('unsubscribe', function(from,to,message) {
                    var arr = [];
                    router.emit.apply(this, arr.concat('unsubscribe', 'xmpp', arguments));
                    action.emit.apply(this, arr.concat('unsubscribe', 'xmpp', arguments));
                });
                
                // ROUTER
                
                // ACTION

            });        
        }
        

    ////=============================================================================================
    ;

    /////////////////////////////////////////////////////////////////////////////////////////////////

    init();
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
}) ();
