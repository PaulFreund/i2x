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
    
        irc,
        xmpp,
        
    ////=============================================================================================
    // Methods
    
        ////-----------------------------------------------------------------------------------------
        // Function
        init = function() { 
            var config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));
            
            irc = ircHandler.create(config.irc);
            xmpp = xmppHandler.create(config.xmpp);

            irc.on ('message', onIRCMessage);
            xmpp.on('message', onXMPPMessage);
            
        },
        
        onIRCMessage = function(from, to, message) {
            console.log('[IRC] From: '+from+', To: '+to+', Message: '+message);
            xmpp.send(from+': '+message);
        },
        
        onXMPPMessage = function(from, to, message) {
            console.log('[JAB] From: '+from+', To: '+to+', Message: '+message);
            irc.send(message);
        }
        
        

    ////=============================================================================================
    ;

    /////////////////////////////////////////////////////////////////////////////////////////////////

    init();
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
}) ();
