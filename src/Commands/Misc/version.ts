import { CommandInteraction, EmbedBuilder, Message, SlashCommandBuilder, inlineCode } from "discord.js";
import { CustomClient, Command } from "../../classes";

const versionEmbed = async (client: CustomClient) => {
	let embed = new EmbedBuilder({
		fields: [
			{
				name: 'TakumiTS',
				value: inlineCode(client.packageInfo.version)
			},
			{
				name: 'NodeJS',
				value: inlineCode(process.version)
			},
			{
				name: 'Discord.js',
				value: inlineCode(client.packageInfo.dependencies['discord.js'].replace('^', ''))
			},
			{
				name: 'Distube',
				value: inlineCode(client.packageInfo.dependencies['distube'].replace('^', ''))
			}
		],
		footer: {
			text: 'Version',
			iconURL: 'https://raw.githubusercontent.com/Zemyoro/TakumiTS/main/assets/profile.png?token=GHSAT0AAAAAABUDR6J7MZAP45NH7K6N4MTMYZGHI2Q'
		}
	})
	embed.setColor('Blurple');
	embed.setTimestamp();
	return { embeds: [embed] }
}

export const version = new Command({
	name: 'version',
	alias: ['v'],
	desc: 'Check the version of the bot and it\'s dependencies',
	category: 'Misc',
	args: [], // no args
	data: new SlashCommandBuilder().setName('version').setDescription('Check the version of the bot and it\'s dependencies'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		return await versionEmbed(client);
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		return await versionEmbed(client);
	},
})
