import { CommandInteraction, EmbedBuilder, Guild, Message, SlashCommandBuilder } from "discord.js";
import { CustomClient, Command } from "../../classes";


async function serverEmbed(client: CustomClient, guild: Guild) {
	let response = new EmbedBuilder({
		thumbnail: {
			url: guild.iconURL(),
		},
		fields: [
			{
				name: 'ℹ️ Server Name',
				value: guild.name
			},
			{
				name: '👤 Total Members',
				value: guild.memberCount.toString()
			},
			{
				name: '📆: Creation Date',
				value: guild.createdAt.toDateString()
			},
			{
				name: '👑 Server Owner',
				value: (await guild.fetchOwner()).user.tag
			},
		],
		footer: {
			text: 'Server Info'
		}
	})
	response.setColor('Blurple')
	response.setTimestamp();

	return { embeds: [response] }

}

export const serverInfo = new Command({
	name: 'serverinfo',
	alias: ['server', 'guild'],
	desc: 'Set the volume of the current music playback!',
	category: 'Utility',
	args: [],
	data: new SlashCommandBuilder().setName('serverinfo').setDescription('Find out information about the server!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		return serverEmbed(client, message.guild);
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		return serverEmbed(client, interaction.guild);
	},
})
