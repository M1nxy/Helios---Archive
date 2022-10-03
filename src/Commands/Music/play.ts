import { CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { CustomClient, Command } from "../../classes";

export const play = new Command({
	name: 'play',
	alias: ['p'],
	desc: 'Play a song',
	category: 'Music',
	args: ['<song>'],
	inVoice: true,
	data: new SlashCommandBuilder().setName('play').setDescription('Play a song'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages', 'Speak'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		const string = args.join(' ')
		if (!string) return `❎ Please enter a song url or query to search.`
		await client.music.play(message.member.voice.channel, string, {
			member: message.member, // @ts-ignore
			textChannel: message.channel,
			message
		})
		return
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		return
	},
})
