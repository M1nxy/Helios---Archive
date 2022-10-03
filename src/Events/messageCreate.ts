import { Message, EmbedBuilder, inlineCode} from "discord.js";
import { scamCheck } from "../helpers/scamCheck";
import { CustomClient, Event } from "../classes";

async function mentionMessage(message: Message, client: CustomClient){
	const replyEmbed = new EmbedBuilder({
		title: 'TakumiTS',
		description: `Current prefix is \`${client.prefix}\`.\nFor more help run \`${client.prefix}help\`.`,
		footer: {
			text: `TakumiTS • Latency ${Math.round(client.ws.ping)}ms`,
		},
	})
	replyEmbed.setColor('Green');
	await message.reply({embeds: [replyEmbed]});
}

export const messageCreate = new Event({
	name: 'messageCreate',
	once: false,
	async execute(message: Message, client: CustomClient): Promise<void> {
		if(message.author.bot) return;
		scamCheck(message);

		if(message.content === "<@945347877033619507>") await mentionMessage(message, client);

		if(!message.content.startsWith(client.prefix)) return;
		if(!(await message.guild.members.fetchMe()).permissions.has('SendMessages')) return

		let args = message.content.slice(client.prefix.length).split(' ');
		let commandName = args.shift().toLowerCase();

		let command = client.commands.filter(cmd => cmd.name === commandName || cmd.alias.includes(commandName))[0]

		if(!command){
			await message.reply('Command not found!')
		} else {
			try {
				if(!(await message.guild.members.fetchMe()).permissions.has(command.bPerms)) {
					let perms = '';
					for (const bPerms of command.bPerms) {
						perms += ' ' + inlineCode(bPerms.toString());
					}
					let permissionEmbed = new EmbedBuilder({
						title: 'I require additional permissions to run this command',
						description: `Required Permissions:\n${perms}`
					})
					permissionEmbed.setColor('Red')
					await message.reply({embeds: [permissionEmbed]})
				} else if(!(await message.guild.members.fetch(message.author.id)).permissions.has(command.perms)){
					await message.reply('You lack the required permissions to run this command!')
				} else if(command.inVoice && !message.member.voice.channel) {
					await message.reply('Join a voice channel before running this command!')
				} else {
					let response = await command.execute(message, client, args)
					if(typeof response !== 'undefined'){
						await message.reply(response);
					}
				}


			}
			catch(e){
				message.reply({embeds: [
					new EmbedBuilder().setTitle(inlineCode(`${e}.`)).setColor('Red')
				]})
			}
		}

	},
})
