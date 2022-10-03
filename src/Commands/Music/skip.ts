import { CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { CustomClient, Command } from "../../classes";

export const skip = new Command({
	name: 'skip',
	alias: [],
	desc: 'Skips the current song!',
	category: 'Music',
	args: [],
	inVoice: true,
	data: new SlashCommandBuilder().setName('skip').setDescription('Skips the current song!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages', 'Speak'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		const queue = client.music.getQueue(message)
		if (!queue) return `❎ There is nothing in the queue right now!`
		try {
			if (queue.songs.length > 1){
				const song = await queue.skip()
				return `❎ Skipped! Now playing:\n${song.name}`
			}
			else{
				await queue.stop()
				return `❎ No music left in queue.`
			}

		} catch (e) {
			return `❎ ${e}`
		}
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		return 'test';
	},
})
