//###################################################################################################
/*
    Todo:
    -----
    
    - Store getSub auto create 
    - Logging
    - Users
    - Router
    - Webinterface
    - XMPP Multiuser
    
    Done: 
    -----
    
    - StoreHandler
    
    
    
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
                store.emit('get', 'log', function(data) {
                    if(!data )
                        store.emit('set', 'log', {});
                    
                    start();
                });
            });        
        },
        
        start = function() {
                irc.on ('message', onIRCMessage);
                irc.on('command', onIRCCommand);
                xmpp.on('message', onXMPPMessage);
        }, 
        
        onIRCCommand = function(from, to, command) {
            var commandarr = command.split(' ');
            
            switch(commandarr[0]) {
            
            case 'insult':
                irc.emit('send', commandarr[1] + ' ist scheisse');
                break;
            case 'printdb':
                store.emit('get', 'log', function(data) {
                    if(data) {
                        for(var prop in data) {
                            if(data.hasOwnProperty(prop))
                                irc.emit('send', util.inspect(data[prop]));
                        }
                    }
                });
                break;
            }   
        },
        
        onIRCMessage = function(from, to, message) {
            logstring = '[IRC] '+ from +': ' + message;
            store.emit('setSub', 'log', [Date.now()], logstring);
            xmpp.emit('send', from+': '+message);
        },
        
        onXMPPMessage = function(from, to, message) {
            logstring = '[JAB] '+ from +': ' + message;
            store.emit('setSub', 'log', [Date.now()], logstring);
            irc.emit('send', message);
        }
        
        

    ////=============================================================================================
    ;

    /////////////////////////////////////////////////////////////////////////////////////////////////

    init();
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
}) ();
