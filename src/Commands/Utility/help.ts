import { ButtonStyle, CommandInteraction, Embed, EmbedBuilder, Guild, inlineCode, Message, SlashCommandBuilder, TextBasedChannel } from "discord.js";
import { ChannelPagination, NextPageButton, PreviousPageButton } from "djs-button-pages";
import { CustomClient, Command } from "../../classes";
import { inlineCodeList, toNameCase } from "../../helpers/formatters";

class commandEmbed extends EmbedBuilder {
	constructor(name, desc, category, alias, args, perms, bPerms, prefix) {
		super();
		this.setTitle(toNameCase(name))
		this.setDescription(desc)
		this.addFields([
			{
				name: 'Usage',
				value: inlineCode(`${prefix}name ${args.join(' ')}`),
			}
		])
		this.addFields([
			{
				name: 'Category',
				value: inlineCode(category),
			}
		])
		if(alias.length > 0){
			this.addFields([
				{
					name: 'Alias',
					value: inlineCodeList(alias),
				}
			])
		}
		if(perms.length > 0){
			this.addFields([
				{
					name: 'User Permissions',
					value: inlineCodeList(perms)
				}
			])
		}
		if(bPerms.length > 0){
			this.addFields([
				{
					name: 'Bot Permissions',
					value: inlineCodeList(bPerms)
				}
			])
		}
		this.setFooter({ text: 'Help' })
		this.setTimestamp()
		this.setColor('Green')
	}
}

class helpEmbed extends EmbedBuilder {
	constructor(client: CustomClient, commands: Map<string, Command[]>) {
		super();
		this.setTitle('Help')
			.setDescription(`For command specific help run ${inlineCode(`${client.prefix}help <command>`)}.`)
			.setFooter({text: 'Help'})
			.setTimestamp()
			.setColor('Green')
		for(let key of commands.keys()){
			let cmds = []
			for(let cmd of commands.get(key)){
				cmds.push(inlineCode(cmd.name))
			}
			this.addFields([{
				name: key,
				value: cmds.join(', '),
				inline: false
			}])
		}
	}
}

async function sendHelp(client: CustomClient, channel: TextBasedChannel, commandName: string | undefined) {
	channel.sendTyping() // start typing in channel

	if(commandName){ // Command specific page here
		let command = client.commands.filter(cmd => cmd.name === commandName || cmd.alias.includes(commandName))[0]

		if(command){
			let { name, desc, category, alias, args, perms, bPerms } = command
			return channel.send({embeds: [new commandEmbed(name, desc, category, alias, args, perms, bPerms, client.prefix)]})
		} else {
			return channel.send('Couldn\'t find that command');
		}

	} else { // Generic page here
		let commandMap: Map<string, Command[]> = new Map()
		for(let cmd of client.commands){
			let existing = commandMap.get(cmd.category)
			if(existing){
				existing.push(cmd)
				commandMap.set(cmd.category, existing)
			} else {
				commandMap.set(cmd.category, [cmd])
			}
		}
		return channel.send({embeds: [new helpEmbed(client, commandMap)]})
	}

	return channel.send('An error occurred!')
}

export const help = new Command({
	name: 'help',
	alias: [],
	desc: 'Get info about a command!',
	category: 'Utility',
	args: ['<commandName>'],
	data: new SlashCommandBuilder().setName('packages').setDescription('Get info about a command!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		await sendHelp(client, message.channel, args[0])
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
	},
})
