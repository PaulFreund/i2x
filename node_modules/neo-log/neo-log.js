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
        "folder",
        "date"
    ],

    //===============================================================================================
    // Properties
    properties: [
        "util",
        "fs"
    ],

    //===============================================================================================
    // Init
    init: function(ready) {        
        var self = this;

        this.util = require('util');
        this.fs = require('fs');

        this.fs.mkdir(this.config.path+'/'+this.config.folder, 0777);
        
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
            var self = this;
            var dateObj = new Date(date),
                day = dateObj.getFullYear()+'-'+dateObj.getMonth()+'-'+dateObj.getDate(),
                dayFile = '',
                writestring = '';

            if( self.config.date )
                dayFile = this.config.path+'/'+self.config.folder+'/'+day+'.rss';
            else
                dayFile = this.config.path+'/'+self.config.folder+'/feed.rss';

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

    