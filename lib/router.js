//###################################################################################################
/*
    Copyright (c) since 2012 - Paul Freund

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
*/
//###################################################################################################

//###################################################################################################
var self = null;
module.exports = {    
    //===============================================================================================
    
    //===============================================================================================
    // Name
    name: 'router',

    //===============================================================================================
    // Depends
    depends: [
        'store',
        'irc',
        'xmpp',
        'log'
    ],    
    
    //===============================================================================================
    // Config
    config: [
        'xmppAdmin',
        'ircChannel'
    ],
    
    //===============================================================================================
    // Properties
    properties: [
        'util',
        'onlineusers',
        'nicklist'
    ],
    
    //===============================================================================================
    // Init
    init: function(ready) {        
        self = this;
        this.util = require('util');
        this.onlineusers = {};
        
        this.events.emit('xmpp.command', self.config.xmppAdmin, 
                            self.config.xmppAdmin, '!useradd '+self.config.xmppAdmin);
                            
        ready();
    },
    
    //===============================================================================================
    // Exit
    exit: function(ready) {
        //var self = this;
        ready();
    },

    //===============================================================================================
    // Methods
    methods: [
        ////-----------------------------------------------------------------------------------------
        // Return the Index of the JID ( jid without '.' chars )
        function jidToIndex(jid) {
            var jidarr;
            if( jid !== undefined )
                jidarr = jid.split(".");


            var index = '';    
            for( var item in jidarr )
                index = index + jidarr[item];
                
            return index;
        },
        
        ////-----------------------------------------------------------------------------------------
        // Return the bare jid ( without resouce )
        function jidToBare(jid) {
            return jid.split("/")[0];
        },
        
        ////-----------------------------------------------------------------------------------------
        // Store users object
        function setUsers(users, callback) {
            if( users !== undefined ) {
                self.events.emit('store.remove', 'users', function() {
                    self.events.emit('store.set', 'users', users, function() {
                        if( callback )
                            callback();
                    });
                });
            }
        },
        
        ////-----------------------------------------------------------------------------------------
        // Return user object of the specified jid 
        function getUserByJID(jid, callback) {
            var index = self.jidToIndex(jid);
            self.events.emit('store.get', 'users.'+index, function(user) {
                if( user !== undefined &&
                    user !== null ) {
                    callback(index, user);
                }
                else {
                    callback(undefined, undefined);
                }
            });
        },
        
        ////-----------------------------------------------------------------------------------------
        // Return users object
        function getUsers(callback) {
            self.events.emit('store.get', 'users', function(users) {
                if( users !== undefined )
                    callback(users);
                else
                    callback(undefined);
            });
        },
        
        ////-----------------------------------------------------------------------------------------
        // Is the user online ( with at least one resource )
        function isOnline(jid) {
            var bare = self.jidToBare(jid);
            var index = self.jidToIndex(bare);
            var found = false;
            
            if( self.onlineusers[index] !== undefined ) {            
                for( var resource in self.onlineusers[index].resources ) {
                    if( self.onlineusers[index].resources[resource] === true) {
                        found = true;
                    }
                }
            }
            
            return found;
        },
        
        ////-----------------------------------------------------------------------------------------
        // Send message from IRC to all Users
        function pushXMPP(message, exclude, type) {
            console.log('Ich bin definitiv hier');
            if( message !== undefined ) {
                var now = Date.now();
                
                if( type === 'action' ) {
                    message = '/me - '+message;
                }
                
                // Log
                self.events.emit('log.message', now, message);
                
                // Get Users
                self.getUsers( function(users) {
                    for(var user in users) {
                        if(users.hasOwnProperty(user)) {
                            // Is Online and listening
                            if( exclude !== undefined ) {
                                if( users[user].jid === exclude ) {
                                    continue;
                                }
                            }
                            
                            if( users[user].listening  === true && 
                                self.isOnline(users[user].jid)       ) {
    
                                self.events.emit('xmpp.send', users[user].jid, message);
                                users[user].last = now;
                            }
                            else if(users[user].nick !== undefined &&
                                    users[user].highlight !== undefined &&
                                    users[user].highlight === true) {
                                            
                                if( message.toLowerCase().search( users[user].nick.toLowerCase()) !== -1 ) {
                                    self.events.emit('xmpp.send', users[user].jid, '[HIGHLIGHT]'+message);
                                    users[user].last = now;
                                }                                        
                            }
                        }                            
                    }
                });
            }
        },

        ////-----------------------------------------------------------------------------------------
        // Send message from IRC to all Users
        function pushIRC(message, exclude, type) {
            if( type != 'action' )
                self.events.emit('irc.say', self.config.ircChannel, message);
            else
                self.events.emit('irc.action', self.config.ircChannel, message);

            self.pushXMPP(message, exclude, type);
        },
        
        ////-----------------------------------------------------------------------------------------
        // Send the backlog of the user
        function pushBacklog(jid) {
            self.getUserByJID(jid, function(key, user) {
                if( user !== undefined ) {
                    if( user.last !== undefined) {
                        var last = user.last;
                        
                        self.events.emit('store.get', 'log', function(log) {
                            var sent = false;
                            var counter = 0;
                            var message;
                            var item = last;
                            for( item in log ) {
                                if( counter < 49 ) {
                                    message = message + log[item] +'\n';
                                    counter++;
                                }
                                else {
                                    self.events.emit('xmpp.send', jid, message);
                                    message = '';
                                    counter = 0;
                                    sent = true;
                                }
                            }
                            if( counter > 0 )
                                self.events.emit('xmpp.send', jid, message);
                            
                            if( counter === 0 && sent === false )
                                self.events.emit('xmpp.send', jid, 'No messages in backlog');
                            
                        });
                    }
                }
            });
        },
        ////-----------------------------------------------------------------------------------------
        // Message from XMPP
        function onXMPPMessage(from, to, message) {
            self.getUserByJID(from, function(key, user) {
                if( user !== undefined ) {
                    var sender = from;
                    if( user.nick !== undefined)
                        sender = user.nick;
                        
                    if( user.listening !== true)
                        self.events.emit('xmpp.send',from,'You have to !join the room to write to it!');
                    else
                        self.pushIRC(sender+': '+message, from);
                }
            });
        },
        
        ////-----------------------------------------------------------------------------------------
        // Administrator commands
        function onXMPPAdminCommand(from, to, command) {
            var args = command.split(' ');

            switch(args[0]) {
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            case 'deleteuserdata':
                self.events.emit('store.remove', 'users');
                self.events.emit('xmpp.send', from, '[USR]Deleted all users');
                break;
                
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            case 'useradd':
                var addjid = args[1];
                self.getUserByJID(addjid, function(key, user) {
                    if(user) {
                        self.events.emit('xmpp.send', from, '[USR]User already exists');
                    }
                    else {
                        self.events.emit('store.set', 'users.'+self.jidToIndex(addjid), {"jid": addjid});
                        self.events.emit('xmpp.send', from, '[USR]'+addjid+' added');
                        self.events.emit('xmpp.dosubscribe', addjid);
                    }
                });
                break;
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            case 'userdel':
                var deljid = args[1];
                self.getUserByJID(deljid, function(key, user) {
                    if(user === undefined) {
                        self.events.emit('xmpp.send', from, '[USR]User does not exists');
                    }
                    else {
                        self.getUsers(function(users) {
                            if( users !== undefined ) {
                                for(var user in users) {
                                    if(users.hasOwnProperty(user)) {
                                        if( users[user].jid === deljid      || 
                                            users[user].jid === undefined   ) {
                                            users[user] = {};
                                            delete users[user];
                                            self.events.emit('xmpp.send',from,'[USR]'+deljid+' deleted');
                                            self.events.emit('xmpp.dounsubscribe', deljid);
                                        }
                                    }
                                }
                                self.setUsers(users);
                            }
                        });
                    }
                });
                break;
                
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            case 'userlist':
                self.getUsers(function(users) {
                    var found = false;
                    for(var user in users) {
                        if(users.hasOwnProperty(user)) {
                            found = true;
                            self.events.emit('xmpp.send', from, '[USR]'+users[user].jid);    
                        }
                    }
                    if( !found )
                        self.events.emit('xmpp.send', from, '[USR] No Users');
                }); 
                break;
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            case 'userreauth':
                self.getUsers(function(users) {
                    var found = false;
                    for(var user in users) {
                        if(users.hasOwnProperty(user) && users[user].jid !== undefined) {
                            found = true;
                            self.events.emit('xmpp.dosubscribe', users[user].jid);    
                            self.events.emit('xmpp.send', from, '[USR]Auth Send to '+users[user].jid);    

                        }
                    }
                    if( !found )
                        self.events.emit('xmpp.send', from, '[USR] No Users');
                }); 
                break;

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            case 'userdb':
                self.getUsers(function(users) {
                    self.events.emit('xmpp.send', from, '[USR]' + self.util.inspect(users));
                }); 
                break;                        
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            case 'usersonline':
                self.events.emit('xmpp.send', from, self.util.inspect(self.onlineusers));
                break;
            
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            case 'help':
                    self.events.emit('xmpp.send', from, 'Admin Commands: ');
                    self.events.emit('xmpp.send', from, '!deleteuserdata - Deletes all user data');
                    self.events.emit('xmpp.send', from, '!useradd jid - Add the user with the given jid');
                    self.events.emit('xmpp.send', from, '!userdel jid - Remove the user with the given jid');
                    self.events.emit('xmpp.send', from, '!userlist - Print list of users registered');
                    self.events.emit('xmpp.send', from, '!userreauth - Subscription refresh for all users');
                    self.events.emit('xmpp.send', from, '!usersonline - Debug: Print all online user objects');
                    self.events.emit('xmpp.send', from, '!userdb - Debug: Print all user objects');
                    break;

            }
        },     
        
        ////-----------------------------------------------------------------------------------------
        // User commands
        function onXMPPCommand(from, to, command) {
            self.getUserByJID(from, function(key, user) {
                var args = command.split(' ');

                switch(args[0]) {
                case 'join':
                    self.events.emit('store.get', 'users.'+key+'.listening', function(listening) {
                        if( listening ) {
                            self.events.emit('xmpp.send', from, 'You are already in the room');
                        }
                        else {
                            self.events.emit('store.set', 'users.'+key+'.listening', true);
                            self.events.emit('xmpp.send', from, 'You have joined the room');
                            self.pushIRC(from+' '+args[0]+'\'ed');
                        }    
                    });
                    break;
                    
                case 'part':
                    self.events.emit('store.get', 'users.'+key+'.listening', function(listening) {
                        if( listening ) {
                            self.events.emit('store.set', 'users.'+key+'.listening', false);
                            self.events.emit('xmpp.send', from, 'You have parted the room');
                            self.pushIRC(from+' '+args[0]+'\'ed');                            
                        }
                        else {
                            self.events.emit('xmpp.send', from, 'You haven\'t been in the room');

                        }    
                    });
                    break;
                
                case 'nick':
                    var nick = args[1];
                    self.getUsers(function(users) {
                        var found = false;
                        for(var inuser in users) {
                            if(users.hasOwnProperty(inuser)) {    
                                if( users[inuser].nick === nick )
                                    found = true;
                            }
                        }
                        
                        if(!found) {
                            self.events.emit('store.set', 'users.'+key+'.nick', nick);
                            self.events.emit('xmpp.send', from, 'Nick set to '+nick);
                        }
                        else {
                            self.events.emit('xmpp.send', from, 'Nick already taken!');
                        }
                    });
                    break;
                    
                case 'highlight':
                    var newval = args[1];
                    if( newval === '1' ) {
                        self.events.emit('store.set', 'users.'+key+'.highlight', true);
                        self.events.emit('xmpp.send', from, 'Nick highlight enabled');
                    } 
                    else if( newval === '0' ) {
                        self.events.emit('store.set', 'users.'+key+'.highlight', false);
                        self.events.emit('xmpp.send', from, 'Nick highlight disabled');
                    }
                    break;
                    
                case 'names':
                    if(self.nicklist !== undefined) {
                        var nickstr = '';
                        for(var item in self.nicklist)
                            nickstr = nickstr+' '+item;
                            
                        self.events.emit('xmpp.send', from, 'Names: '+nickstr);

                    }
                    break;
                    
                case 'backlog':
                    self.pushBacklog(from);
                    break;
                                    
                case 'topic':
                    var topic = command.substr(args[0].length);
                    var sender = from;
                    if( user.nick !== undefined)
                        sender = user.nick;
                    self.events.emit('irc.settopic', self.config.ircChannel, topic+' (by '+sender+')');                    
                    break;          
                    
                case 'me':
                    var message = command.substr(args[0].length);

                    if( user !== undefined ) {
                        var sender = from;
                        if( user.nick !== undefined)
                            sender = user.nick;
                            
                        if( user.listening !== true)
                            self.events.emit('xmpp.send',from,'You have to !join the room to write to it!');
                        else
                            self.pushIRC(' - ' + sender+' '+message, from, 'action');
                    }                    
                    break;
                    
                case 'help':
                    self.events.emit('xmpp.send', from, 'User Commands: ');
                    self.events.emit('xmpp.send', from, '!join - Start listening to IRC Messages');
                    self.events.emit('xmpp.send', from, '!part - Stop listening to IRC Messages');
                    self.events.emit('xmpp.send', from, '!nick Newnick - Change nick to NewNick');
                    self.events.emit('xmpp.send', from, '!names - Print list of users in channel');
                    self.events.emit('xmpp.send', from, '!topic - Lets you change the topic');
                    self.events.emit('xmpp.send', from, '!me - Issue an action command');
                    //self.events.emit('xmpp.send', from, '!backlog - Return link to the backlog');
                    break;
                }
            });
        }
    ],
    
    //===============================================================================================
    // Slots
    slots: [
        ////-----------------------------------------------------------------------------------------
        // IRC
        {
            name: 'irc.message',
            value: function(from, to, message) {
                // From Chan
                if(to === self.config.ircChannel) {
                    if( message.substr(0,6) === 'ACTION' )
                        self.pushXMPP(from+' '+message.substr(6), undefined, 'action');
                    else
                        self.pushXMPP(from+': '+message);
                }
                else {
                    self.events.emit('irc.say', from, 'I\'m sorry, no Priv MSG avalible');
                }      
            }
        },
        //-------------------------------------------------------------------------------------------
        {
            name: 'irc.command',
            value: function(from, to, command) {
                // Do nothing
            }
        },
        //-------------------------------------------------------------------------------------------
        {
            name: 'irc.topic',
            value: function(channel, topic, nick) {
                self.events.emit('xmpp.setstatus', topic+' (by '+nick+')');
            }
        },
        //-------------------------------------------------------------------------------------------
        {
            name: 'irc.names',
            value: function(channel, names) {
                self.nicklist = names;
            }
        },
        ////-----------------------------------------------------------------------------------------
        // XMPP
        {
            name: 'xmpp.message',
            value: function(from, to, message) {
                if( from !== undefined )
                    from = self.jidToBare(from);         
                if( to !== undefined )
                    to = self.jidToBare(to);
                    
                
                self.onXMPPMessage(from, to, message);
            }
        },
        //-------------------------------------------------------------------------------------------
        {
            name: 'xmpp.command',
            value: function(from, to, command) {
                if( from !== undefined )
                    from = self.jidToBare(from);         
                if( to !== undefined )
                    to = self.jidToBare(to);
                command = command.substr(1);
                
                if( from === self.config.xmppAdmin ) {
                    self.onXMPPAdminCommand(from, to, command);
                }
                
                self.onXMPPCommand(from, to, command);
            }
        },
        //-------------------------------------------------------------------------------------------
        {
            name: 'xmpp.online',
            value: function(from) {
                var bare,resource,index;
                if( from !== undefined ) {
                    bare = self.jidToBare(from);
                    resource = from.split("/")[1];
                    index = self.jidToIndex(bare);
                }
                
                if( self.onlineusers[index] === undefined ) {
                    self.onlineusers[index] = {
                        jid: bare,
                        resources: []
                    };
                }
                    
                self.onlineusers[index].resources[resource] = true;
                
                self.getUserByJID(bare, function(key, user) {
                    if( user !== undefined ) {
                        if( user.listening === true ) {
                            //self.pushBacklog(bare);
                        }
                    }
                });
            }
        },
        //-------------------------------------------------------------------------------------------
        {
            name: 'xmpp.offline',
            value: function(from) {
                var bare,resource,index;
                if( from !== undefined ) {
                    bare = self.jidToBare(from);
                    resource = from.split("/")[1];
                    index = self.jidToIndex(bare);
                }                
                
                if( self.onlineusers[index] === undefined ) {
                    self.onlineusers[index] = {
                        jid: bare,
                        resources: []
                    };
                }
                    
                self.onlineusers[index].resources[resource] = false;      
                
            }
        },
        //-------------------------------------------------------------------------------------------
        {
            name: 'xmpp.presence',
            value: function(from, to, stanza) {
                var bare;
                if( from !== undefined ) {
                    bare = self.jidToBare(from);
                }
                    
                // Nothing to do atm
                
            }
        },
        //-------------------------------------------------------------------------------------------
        {
            name: 'xmpp.subscribe',
            value: function(from) {
                if( from !== undefined )
                    from = self.jidToBare(from);    
                    
                self.getUserByJID(from, function(key, user) {
                    if( user !== undefined ) {
                        self.events.emit('xmpp.subscribed', from);
                        self.events.emit('xmpp.dosubscribe', from);
                    }
                }); 
            }
        },
        //-------------------------------------------------------------------------------------------
        {
            name: 'xmpp.unsubscribe',
            value: function(from) {
                if( from !== undefined )
                    from = this.jidToBare(from);         
                    
                self.getUserByJID(from, function(key, user) {
                    if( user !== undefined ) {
                        self.events.emit('xmpp.unsubscribed', from);
                        self.events.emit('xmpp.dounsubscribe', from);
                    }
                });  
            }
        }        
    ],
    
    //===============================================================================================
    // Exports
    exports: [
        'jidToBare',
        'getUserByJID'
    ]
    
    //===============================================================================================
};

//###################################################################################################
