# i2x #

i2x is a IRC to XMPP bridge. Many mobile clients don't support MUC, to fill that gap, i2x translates between the two networks ( tested on Linux and Windows ).

## Installation ##

You can install i2x with npm 

    npm install i2x

Or by cloning the repository and  install the dependencies

    git clone https://github.com/PaulFreund/i2x.git
    cd i2x
    npm install

Note: Three of the modules in the dependency chain need to be compiled, node-expat is required, node-stringprep and sqlite3 are optional. 
* node-expat requires libexpat ( libexpat-dev on ubuntu )
* node-stringprep requires libicu ( libicu-dev on ubuntu ) 
* sqlite3 requires libsqlite3 >= 3.6 ( libsqlite3-dev on ubuntu )

## Configuration ##

To configure i2x just copy config.json.example to config.json and customize it to fit your needs. 

    // Start i2x and use the config.json in the same folder
    node i2x.js                     
    
    // Start i2x with the specified config file
    node i2x.js customconfig.json   

## Usage ##

i2x is controlled via the XMPP interface, to get a list of commands, send !help. Note that only the configured admin user gets a list of all commands. Other xmpp users have to be added by the admin via !useradd first.


