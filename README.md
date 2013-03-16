# I2X #

I2X is a IRC to XMPP bridge. Many mobile clients don't support MUC, to fill that gap, I2X translates between the two networks ( tested on Linux and Windows ).

## Installation ##

You can install I2X with npm 

    npm install I2X

Or by cloning the repository and  install the dependencies

    git clone https://github.com/PaulFreund/I2X.git
    cd I2X
    npm install

Note: Three of the modules in the dependency chain need to be compiled, node-expat is required, node-stringprep and sqlite3 are optional. 
* node-expat requires libexpat ( libexpat-dev on ubuntu )
* node-stringprep requires libicu ( libicu-dev on ubuntu ) 
* sqlite3 requires libsqlite3 >= 3.6 ( libsqlite3-dev on ubuntu )

## Configuration ##

To configure I2X just copy config.json.example to config.json and customize it to fit your needs. 

    // Start I2X and use the config.json in the same folder
    node I2X.js                     
    
    // Start I2X with the specified config file
    node I2X.js customconfig.json   

## Usage ##

I2X is controlled via the XMPP interface, to get a list of commands, send !help. Note that only the configured admin user gets a list of all commands. Other xmpp users have to be added by the admin via !useradd first.


