# I2X #

I2X is a IRC to XMPP bridge. Many mobile clients don't support MUC, to fill that gap, I2X translates between the two networks.

## Installation ##

To install I2X just clone the repository and run 

    npm install

Note: Two of the modules in the dependency chain need to be compiled, node-stringprep and sqlite3. node-stringprep requires libicu ( libicu-dev on ubuntu ) and sqlite3 requires libsqlite3 >= 3.6 ( libsqlite3-dev on ubuntu ).

## Configuration ##

To configure I2X just copy config.json.example to config.json and customize it to fit your needs. 

    // Start I2X and use the config.json in the same folder
    node I2X.js                     
    
    // Start I2X with the specified config file
    node I2X.js customconfig.json   

## Usage ##

I2X is controlled via the XMPP interface, to get a list of commands, send !help. Note that only the configured admin user gets a list of all commands. Other xmpp users have to be added by the admin via !useradd first.


