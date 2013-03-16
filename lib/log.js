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

module.exports = {    
    //===============================================================================================
    
    //===============================================================================================
    // Name
    name: 'log',

    //===============================================================================================
    // Depends
    //depends: [],    
    
    //===============================================================================================
    // Config
    config: [
	"enabled",
        "folder",
        "date"
    ],

    //===============================================================================================
    // Properties
    properties: [
        "path",
        "util",
        "fs"
    ],

    //===============================================================================================
    // Init
    init: function(ready) {        
        var self = this;

        this.path = require('path');
        this.util = require('util');
        this.fs = require('fs');

	if(this.config.enabled)
	    this.fs.mkdir(this.path.resolve(this.config.path, this.config.folder), 0777);
        
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
        //  Create tables from schema 
        function message(date, message) {
            if( this.config.enabled )
            {
	        var self = this;
                var dateObj = new Date(date),
                    day = dateObj.getFullYear()+'-'+dateObj.getMonth()+'-'+dateObj.getDate(),
                    dayFile = '',
                    writestring = '';

                if( self.config.date )
            	    dayFile = self.path.resolve(this.config.path, self.config.folder+'/'+day+'.rss');
            	else
               	    dayFile = self.path.resolve(this.config.path, self.config.folder+'/feed.rss');

            	self.fs.stat(dayFile, function(err,stats) {
                    if( stats === undefined )
                    	writestring += '<?xml version="1.0"?><rss version="2.0"><channel>\n';

                    writestring += '<item><title>'+message+'</title><pubDate>'+date+'</pubDate></item>'+"\n";
                
                    self.fs.open(dayFile, 'a', 0777, function( e, fd ) {
                    	if( !e ) {
                            self.fs.write(fd, writestring, null, 'utf8', function() {
                            	self.fs.close(fd);
                            });
                        }
                    });
                });
            }
        },
        ////-----------------------------------------------------------------------------------------
        // Error
        function error(err) {
            this.log('error', err);
        }
    ],
    
    //===============================================================================================
    // Exports
    exports: [
    ]
    
    //===============================================================================================
};

    
