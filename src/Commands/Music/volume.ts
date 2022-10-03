import { CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { CustomClient, Command } from "../../classes";

export const volume = new Command({
	name: 'volume',
	alias: ['v', 'vol'],
	desc: 'Set the volume of the current music playback!',
	category: 'Music',
	args: ['<vol>'],
	inVoice: true,
	data: new SlashCommandBuilder().setName('volume').setDescription('Set the volume of the current music playback!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages', 'Speak'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		const queue = client.music.getQueue(message)
		if (!queue) return `❎ There is nothing in the queue right now!`;
		const volume = parseInt(args[0])
		if (isNaN(volume)) return `❎ Please enter a valid number!`;
		if(volume > 0 && volume < 101){
			queue.setVolume(volume)
			return `✅ Volume set to \`${volume}%\``
		} else {
			queue.setVolume(volume)
			return `❎ Volume specified is out of range.(0 - 100)`
		}
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		return 'test';
	},
})
