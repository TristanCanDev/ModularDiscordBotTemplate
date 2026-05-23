module.exports = {
    Main: function(client, interaction, flags){
        return mainFunc(client, interaction, flags)
    }
}

//const {Log} = require('../../utils/utilities')

function mainFunc(_client, _interaction, _flags){
    if(true){
        const input = _interaction.options.getString('input');
        const attach = _interaction.options.getAttachment('attachments');
        if(attach != null){
            _interaction.channel.send(attach.url);
            //Log(`${_interaction.member.user.username}#${_interaction.member.user.discriminator} SENT ${attach.url} WITH MONKERSAY`);
        }
        if(input != null){
            _interaction.channel.send(input);
            //Log(`${_interaction.member.user.username}#${_interaction.member.user.discriminator} SAID ${input} WITH MONKERSAY`);
        }
        _interaction.reply({content: 'Monker Is Doing', flags:[_flags.Ephemeral]});
    }
    else{
        _interaction.reply({content: 'Nice try monke', flags:[_flags.Ephemeral]});
    }
}