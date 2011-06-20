//###################################################################################################
/*
    Todo:
    -----
    
    - Router: test Subscribe/Unsubscribe
    - Router: Backlog
    - Actions
    - MultiUser
    - Webinterface
    - Virtual XMP Server
    - Commenting
    
    Done: 
    -----
    
    - StoreHandler
    - New StoreHandler functions
    - Simple action add/del with database
    - Extended ircHandler
    - Extended xmppHandler
    - Wiring
    - Rewiring
    - Basic Error handling
    - Router basics
    
    
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
        events = require('events'),
        ircHandler = require('ircHandler'),
        xmppHandler = require('xmppHandler'),
        storeHandler = require('storeHandler'),
        routerHandler = require('routerHandler'),
        actionHandler = require('actionHandler'),

    ////=============================================================================================
    // Propertys
    
        self = this, 
        eventEmitter = new events.EventEmitter(),
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
            process.addListener("unhandledException", function (err) {
                console.log(err);
            });
            
            var config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));
            
            irc = ircHandler.create(eventEmitter, config.irc);
            xmpp = xmppHandler.create(eventEmitter, config.xmpp);
            store = storeHandler.create(eventEmitter, config.store);
            
            eventEmitter.on('store', function(type) {
                if( type === 'ready' ) {
                    router = routerHandler.create(eventEmitter,config);
                    action = actionHandler.create(eventEmitter,config.action);
                }
            });        
        }
        

    ////=============================================================================================
    ;

    /////////////////////////////////////////////////////////////////////////////////////////////////

    init();
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
}) ();
