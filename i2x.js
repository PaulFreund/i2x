//###################################################################################################
/*
    Todo:
    -----
    
    - Wiring
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

                // Wiring
                
                irc.on ('message', onIRCMessage);
                irc.on('command', onIRCCommand);
                xmpp.on('message', onXMPPMessage);
            });        
        }
        

    ////=============================================================================================
    ;

    /////////////////////////////////////////////////////////////////////////////////////////////////

    init();
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
}) ();
