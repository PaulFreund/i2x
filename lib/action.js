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
    name: 'action',

    //===============================================================================================
    // Depends
    depends: ['store','router'],    
    
    //===============================================================================================
    // Config
    config: [

    ],
    
    //===============================================================================================
    // Properties
    properties: [

    ],
    
    //===============================================================================================
    // Init
    init: function(ready) {        
        self = this;


        ready();
    },
    
    //===============================================================================================
    // Exit
    exit: function(ready) {
        var self = this;
        ready();
    },

    //===============================================================================================
    // Methods
    methods: [
    ],
    
    //===============================================================================================
    // Slots
    slots: [
        ////-----------------------------------------------------------------------------------------
        // Send an IRC Command
        function add(name, command) {     
            self.events.emit('store.set', 'command.'+name, command);
        },
        
        ////-----------------------------------------------------------------------------------------
        // Send an IRC message
        function del(name) {     
            self.events.emit('store.remove', 'command.'+name);
        },
        
        ////-----------------------------------------------------------------------------------------
        // Send an IRC message
        function execute(name, message) {     
                self.events.emit('store.get', 'command.'+name, function(value) {
                if( value !== undefined )
                    eval(value);      
                });
        }
        
    ],
    
    //===============================================================================================
    // Exports
    exports: [
    ]
    
    //===============================================================================================
};

//###################################################################################################
