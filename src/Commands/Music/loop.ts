import { CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { CustomClient, Command } from "../../classes";

export const loop = new Command({
	name: 'loop',
	alias: ['repeat', 'rp'],
	desc: 'Repeat one song or the entire queue!',
	category: 'Music',
	args: ['<mode>'],
	inVoice: true,
	data: new SlashCommandBuilder().setName('loop').setDescription('Repeat one song or the entire queue!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages', 'Speak'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		const queue = client.music.getQueue(message)
		if (!queue) return `❎ There is nothing playing!`
		let mode = null
		switch (args[0]) {
			case 'off':
				mode = 0
				break
			case 'song':
				mode = 1
				break
			case 'queue':
				mode = 2
				break
		}
		mode = queue.setRepeatMode(mode)
		mode = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off'
		return `🔁 Set repeat mode to \`${mode}\``
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		return 'test';
	},
})
