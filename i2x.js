//###################################################################################################
/*
    Todo:
    -----
    
    - Router: Backlog
    - Router: Presence handling
    - Actions
    - Commenting
      
*/
//###################################################################################################

// Load neuron factory
var neo = require('neo');

// Load config 
neo.neo.config(__dirname+'/config.json');

neo.neo.load('neo-irc'      , function() {});
neo.neo.load('neo-xmpp'     , function() {});
neo.neo.load('neo-log'      , function() {});
neo.neo.load('neo-store'    , function() {});
neo.neo.load('neo-router'   , function() {});
//neo.neo.load('neo-action'   , function() {});

