# Discord Bot Docs

## General information
To start, you'll open this project and see a couple files.

* commands
    - This holds all of your custom commands. Whether they be slash commands or old style text commands
* src
    - This is what holds the base code that passes information to the commands, registers commands, fetches guilds, etc...
* unused_commands
    - This is where you can throw commands that are in progress or unused. The 'monkersay' command will be provided here. 

You will want to create a "resources" folder in the main project file and place a 'config.json' file within it. The config file will need to mirror this for the bot to work:

```json
"token": "",
"appID": ""
```

The values that you supply for token and appID should be provided by discord when you set up your bot on their developer website. You may also populate this file with any other configuration info that you wouldn't want published to github or the like. For example, I have a bot I use in tandem with a minecraft server. This bot uses rcon for some of its functionality and I store the rcon password, port, and host within this config file. That way, the data contained within is a little more safe and it's unlikely that I will accidentally publish said data. 

#### What is the monkersay command?
This is a simple command that is given as an example for building some simple commands. This bot was originally designed for the Gorilla Tag discord server as a way to make in-game reports more manageable and actionable. Before this bot being replaced by a more robust report system in-game and online, I decided I would try and make it modular so adding commands would be a quicker endeavor (it doesn't help that discord had just introduced slash commands either). Monkersay was a silly test command that allowed those with a moderator type role to speak as the bot.

#### How do I make a command? What are all of the options? What does any of this mean?!

To make a command, you will create a new folder (with a name of your choice) under the 'commands' folder. Within your new folder, you will want two files:
* index.js
* metadata.json

*index.js* should look a little something like this:

```js
module.exports = {
    Main: function(client, interaction, flags){
        return mainFunc(client, interaction, flags)
    }
}

function mainFunc(_client, _interaction, _flags){}

```

This will just get you started so you can begin putting together your command. You'll want all of the code ran by the bot to be executed within mainFunc. If you write extra code outside of this without modifying index.js within the src folder, it will not be ran by the bot. 

If you are familiar with discord.js or are trying to build your bot using the docs with discord.js, index.js within the src folder will pass the standard client object to **_client**, the *ChatInputCommandInteraction* object passed by Events.InteractionCreate to **_interaction**, and the MessageFlags object to **_flags**. These should allow you to do most things for the bot. You can visit the [DiscordJS docs](https://discord.js.org/docs/) for more information on these objects and how you can use them.

To interact with any of the options that will be later described in metadata.json, you may address them as such:
```js
let option1 = _interaction.options.get[optionType]('Option Name');
```

Here's an example from a command I've written:

```js
let markerName = _interaction.options.getString('name');
```

**Now for the fun part.. metadata.json**
Here's the basic layout..

```json
{
    "name":"Command name",
    "description":"Command description",
    "entry":"index",
    "type":"Command type",
    "options":{
        "Option name":{
            "type": "Option type",
            "name": "Option name",
            "description": "Option description",
            "isRequired": true|false (whether the option is required or not)
        }
    }
}
```

Here's an example from a bot I made for my minecraft server, it's a command to make markers for the server's webmap..

```json
{
    "name":"marker",
    "description":"Create a marker on the webmap!",
    "entry":"index",
    "type": "SLASH",
    "options":{
        "name":{
            "type": "STRING",
            "name": "name",
            "description": "The name of the marker!",
            "isRequired": true
        },
        "markertype":{
            "type": "CHOICE",
            "name": "markertype",
            "description": "The type of marker!",
            "isRequired": true,
            "choices":{
                "c1":{
                    "name": "mobspawners",
                    "value": "mobspawners"
                },
                "c2":{
                    "name": "portals",
                    "value": "portals"
                },
                "c3":{
                    "name": "houses",
                    "value": "houses"
                },
                "c4":{
                    "name": "mines",
                    "value": "mines"
                },
                "c5":{
                    "name": "generic",
                    "value": "generic"
                }
            }
        },
        "x":{
            "type": "STRING",
            "name": "x",
            "description": "X coordinate of the marker",
            "isRequired": true
        },
        "z":{
            "type": "STRING",
            "name": "z",
            "description": "Z coordinate of the marker",
            "isRequired": true
        }
    }
}
```

You have two options for command types as it currently stands:

* SLASH
* TEXT

There are a great deal more option types than there are command types:

* STRING
* INTEGER
* BOOLEAN
* USER
* CHANNEL
* ROLE
* MENTIONABLE
* NUMBER
* ATTACHMENT
* CHOICE

You can retreieve all of the above using the 'get' methods supplied by **CommandInteractionOptionResolver**.

When using **CHOICE** options (like those in my example above) you will continue using 'getString' to retrieve the data. You can use arbitrary names for each parent container for each choice (I used c1, c2, ..., c5) but the user will see the name provided by the "name" value within each choice container. You will then set "value" to be whatever that choice will return to the bot. For example I had multiple choices of marker types, when a user would select "mines" the value that would be returned to the bot to process would be "mines". However if "value" was set to "mineshaft", the bot would see "mineshaft" when it processed the command interaction.

## Future Ideas
Because this modular bot was originally built for single server use, it would have trouble if you wanted certain commands to only work in certain servers. I intend to implement server filtering in the future. Eventually this bot template could come to support modals and such as well. That's later on down the line. 
