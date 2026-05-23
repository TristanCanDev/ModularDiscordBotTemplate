//  ==========================================
//  Author: Tristan Bouchard
//  Date: March 25, 2026
//  
//  This is a discord bot that will be used to
//      help moderate, do niche stuff in, and
//      whitelist players for the
//      GamesButNoGames discord server
//  ==========================================

// "Requires" lol
const { token, appID, rconPass, rconPort } = require('../resources/config.json');
const {Client, Events, GatewayIntentBits, MessageFlags} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes, ActivityType } = require('discord-api-types/v10');

// Initialize discord bot
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages]});

client.once(Events.ClientReady, async (clientInfo) => {

    console.log(`Logged in as ${client.user.username}`);
    
    // Fetch guilds and store them
    const guilds_fetch = await client.guilds.fetch();
    const Guilds = guilds_fetch.map(guild => guild.id);

    // Set up the commands directory and commands array to iterate through
    let commands = [];
    let commandsDir = fs.readdirSync('./commands');

    // Iterate through commands and build/register them :)
    commandsDir.forEach(command => {

        let { name, description, options, type } = require(`../commands/${command}/metadata.json`);

        if (type == "SLASH"){
            let builder = new SlashCommandBuilder().setName(name).setDescription(description)
            for(let i in options){
                let option = options[i]
                if(option.type == 'STRING'){
                    builder.addStringOption(val => val.setName(option.name).setDescription(option.description).setRequired(option.isRequired))
                }
                if(option.type == 'INTEGER'){
                    builder.addIntegerOption(val => val.setName(option.name).setDescription(option.description).setRequired(option.isRequired))
                }
                if(option.type == 'BOOLEAN'){
                    builder.addBooleanOption(val => val.setName(option.name).setDescription(option.description).setRequired(option.isRequired))
                }
                if(option.type == 'USER'){
                    builder.addUserOption(val => val.setName(option.name).setDescription(option.description).setRequired(option.isRequired))
                }
                if(option.type == 'CHANNEL'){
                    builder.addChannelOption(val => val.setName(option.name).setDescription(option.description).setRequired(option.isRequired))
                }
                if(option.type == 'ROLE'){
                    builder.addRoleOption(val => val.setName(option.name).setDescription(option.description).setRequired(option.isRequired))
                }
                if(option.type == 'MENTIONABLE'){
                    builder.addMentionableOption(val => val.setName(option.name).setDescription(option.description).setRequired(option.isRequired))
                }
                if(option.type == 'NUMBER'){
                    builder.addNumberOption(val => val.setName(option.name).setDescription(option.description).setRequired(option.isRequired))
                }
                if(option.type == 'ATTACHMENT'){
                    builder.addAttachmentOption(val => val.setName(option.name).setDescription(option.description).setRequired(option.isRequired))
                }
                if(option.type == 'CHOICE'){
                    let choices = []
                    for(let x in option.choices){
                        let choice = option.choices[x]
                        choices.push(choice)
                    }
                    builder.addStringOption(val => val.setName(option.name).setDescription(option.description).setRequired(option.isRequired).addChoices(...choices))
                }
            }
            commands.push(builder)
        }

    })

    // Map the commands to their JSON equivalents..
    let comsToRegister = commands.map(command => command.toJSON());

    // Set up rest for registering commands
    const rest = new REST({ version: '10' }).setToken(token);

    // Register each command to all guilds it exists in :)
    //  If this were a larger bot, it would likely need to have a filter for the guilds that commands belong too..
    //  luckily, this is not a larger bot 
    Guilds.forEach((val) => {
        rest.put(Routes.applicationGuildCommands(appID, val), { body: comsToRegister })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
    })

})

// Handle the use of slash commands by forwarding all relevant info to the index files specified by each command..
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isCommand()) return;

    let commands = fs.readdirSync('./commands');
    
    if(commands.includes(interaction.commandName)){
        let { entry } = require(`../commands/${interaction.commandName}/metadata.json`);
        let { Main } = require(`../commands/${interaction.commandName}/${entry}`);
        Main(client, interaction, MessageFlags);
    }
})

client.login(token);