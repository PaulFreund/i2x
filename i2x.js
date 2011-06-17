//###################################################################################################
/*
    Todo:
    -----
    
    - actionHandler
    - MultiUser
    - Router
    - Webinterface
    
    Done: 
    -----
    
    - StoreHandler
    - New StoreHandler functions
    - Simple action add/del with database
    
    
*/
//###################################################################################################
// Basic Object
I2X = (function i2x() {
    /////////////////////////////////////////////////////////////////////////////////////////////////
   
    var 
    ////=============================================================================================
    // Requirements
    
        util = require('util'),
        fs = require('fs'),
        ircHandler = require('ircHandler.js'),
        xmppHandler = require('xmppHandler.js'),
        storeHandler = require('storeHandler.js'),
    
    ////=============================================================================================
    // Propertys
    
        self = this, 
        irc,
        xmpp,
        store,
        
    ////=============================================================================================
    // Methods
    
        ////-----------------------------------------------------------------------------------------
        // Function
        init = function() { 
            var config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));
            
            store = storeHandler.create(config.store);
            irc = ircHandler.create(config.irc);
            xmpp = xmppHandler.create(config.xmpp);
                
            store.on('ready', function() {
                irc.on ('message', onIRCMessage);
                irc.on('command', onIRCCommand);
                xmpp.on('message', onXMPPMessage);
            });        
        },
        
        onIRCCommand = function(from, to, command) {
            var args = command.split(' ');
            
            
            if( args[0] === 'add' ) {
                store.emit('set', 'command.'+args[1], command.substr(args[0].length+args[1].length+2));
            }
            else if( args[0] === 'del' ) {
                store.emit('remove', 'command.'+args[1]);
            }
            else {
                store.emit('get', 'command.'+args[0], function(value) {
                if( value != undefined )
                    eval(value);
            });
            }
        },
        
        onIRCMessage = function(from, to, message) {
            logstring = '[IRC] '+ from +': ' + message;
            store.emit('set', 'log'+'.'+Date.now(), logstring);
            xmpp.emit('say', from+': '+message);
        },
        
        onXMPPMessage = function(from, to, message) {
            logstring = '[JAB] '+ from +': ' + message;
            store.emit('set', 'log'+'.'+Date.now(), logstring);
            irc.emit('say', message);
        }
        
        

    ////=============================================================================================
    ;

    /////////////////////////////////////////////////////////////////////////////////////////////////

    init();
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
}) ();
