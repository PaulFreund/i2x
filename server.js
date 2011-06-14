//###################################################################################################
// Basic Object
I2X = (function i2x() {
    /////////////////////////////////////////////////////////////////////////////////////////////////
   
    var 
    ////=============================================================================================
    // Requirements
        
        fs = require('fs'),
        ircHandler = require('ircHandler.js'),
        xmppHandler = require('xmppHandler.js'),
    
    ////=============================================================================================
    // Propertys
        
    ////=============================================================================================
    // Methods
    
        ////-----------------------------------------------------------------------------------------
        // Function
        init = function() { 
            var config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));
            
            ircHandler.init(config.irc.host, 
                            config.irc.port, 
                            config.irc.name, 
                            config.irc.channel);
            
            xmppHandler.init(   config.xmpp.host, 
                                config.xmpp.port, 
                                config.xmpp.jid, 
                                config.xmpp.password);
                        
            ircHandler.events.on('message', onIRCMessage);
            xmppHandler.events.on('message', onXMPPMessage);
            
        },
        
        onIRCMessage = function(from, to, message) {
            console.log('[IRC] From: '+from+', To: '+to+', Message: '+message);
            xmppHandler.send(from+': '+message);
        },
        
        onXMPPMessage = function(from, to, message) {
            console.log('[JAB] From: '+from+', To: '+to+', Message: '+message);
            ircHandler.send(message);
        }
        
        

    ////=============================================================================================
    ;

    /////////////////////////////////////////////////////////////////////////////////////////////////

    init();

    return {
    };
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
}) ();
