import { CommandInteraction, EmbedBuilder, inlineCode, Message, SlashCommandBuilder } from "discord.js";
import { CustomClient, Command } from "../../classes";
import objectKeys from "distube";

function getFilters(client, queue) {
	let filters = ''
	for(let filter of Object.keys(client.music.filters)){
		filters += `\n${queue.filters.has(filter) ? '✅' : '❎'} ${inlineCode(filter.charAt(0).toUpperCase() + filter.slice(1))}`
	}
	return filters
}

export const filter = new Command({
	name: 'filter',
	alias: ['filters'],
	desc: 'Apply a filter to the current playback!',
	category: 'Music',
	args: ['<filter>'],
	inVoice: true,
	data: new SlashCommandBuilder().setName('filter').setDescription('Apply a filter to the current playback!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages', 'Speak'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		const queue = client.music.getQueue(message)
		if (!queue) return `❎ There is nothing in the queue right now!`
		if(args.length === 0){
			let replyEmbed = new EmbedBuilder({
				title: 'Filters',
				description: getFilters(client, queue)
			})

			return { embeds: [replyEmbed]}
		} else{

		}
		const filter = args[0]
		if (filter === 'off' && queue.filters.size) queue.filters.clear()
		else if (Object.keys(client.music.filters).includes(filter)) {
			if (queue.filters.has(filter)) queue.filters.remove(filter)
			else queue.filters.add(filter)
		} else if (args[0]) return `❎ Not a valid filter`
		return `Current Queue Filter: \`${queue.filters.names.join(', ') || 'Off'}\``
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		return 'test';
	},
})
