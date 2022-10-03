import { CommandInteraction, EmbedBuilder, Guild, Message, SlashCommandBuilder } from "discord.js";
import { CustomClient, Command } from "../../classes";

const helloEmbed = async (client: CustomClient, server: Guild, username: string, args: string[]) => {
	let embed = new EmbedBuilder({
		title: `Hello ${username}`
	})
	return { embeds: [embed] }
}

export const helloWorld = new Command({
	name: 'hello',
	alias: ['hi', 'howdy'],
	desc: 'Say hello to the bot',
	category: 'Misc',
	args: [], // no args
	data: new SlashCommandBuilder().setName('hello').setDescription('Get help with commands'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		return await helloEmbed(client, message.guild, message.author.username, args);
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		return await helloEmbed(client, interaction.guild, interaction.user.username, args);
	},
})
