import { CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { CustomClient, Command } from "../../classes";

export const pause = new Command({
	name: 'pause',
	alias: ['ps', 'resume'],
	desc: 'Pause or resume current playback!',
	category: 'Music',
	args: [],
	inVoice: true,
	data: new SlashCommandBuilder().setName('pause').setDescription('Pause or resume current playback!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages', 'Speak'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		const queue = client.music.getQueue(message)
		if (!queue) return `❎ There is nothing in the queue right now!`;
		if(queue.paused){
			queue.resume()
			return 'Resumed current playback!'
		} else {
			queue.pause()
			return 'Paused current playback!'
		}
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		const queue = client.music.getQueue(interaction.guild)
		if (!queue) return `❎ There is nothing in the queue right now!`;
		if(queue.paused){
			queue.resume()
			return 'Resumed current playback!'
		} else {
			queue.pause()
			return 'Paused current playback!'
		}
	},
})
