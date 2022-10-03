import { AttachmentBuilder, CommandInteraction, EmbedBuilder, Guild, Message, MessageCollector, SlashCommandBuilder, TextBasedChannel, User } from "discord.js";
import { CustomClient, Command } from "../../classes";
const Spotify = require('node-spotify-api');

const songMode = async (channel: TextBasedChannel, author: User) => {
	const spotify = new Spotify({
		id: process.env.SPOTICLIENT,
		secret: process.env.SPOTISECRET
	});
	let res = await spotify.request('https://api.spotify.com/v1/playlists/37i9dQZEVXbLRQDuF5jeBp')

	if(res.tracks){
		let { track } = res.tracks.items[Math.floor(Math.random() * res.tracks.items.length)]
		let song = await spotify.request(track.href)
		if(song.preview_url){
			let test = new AttachmentBuilder(
				song.preview_url,
				{ name: 'preview.mp3' }
			)
			await channel.send({ files: [test]})

			const filter = m => m.author.id === author.id;

			const collector: MessageCollector = channel.createMessageCollector({ filter, time: 45000 });

			collector.on('collect', m => {
				if(m.content === song.name){
					m.react('✅')
					collector.stop('correct')
				} else {
					m.react('❎')
				}
			});

			collector.on('end', (collected, reason) => {
				if(reason !== 'correct'){
					collector.channel.send('Game Ended!')
				}
			});
		}
	}
}

export const guesser = new Command({
	name: 'guesser',
	alias: ['guess'],
	desc: 'Play a guessing game!',
	category: 'Fun',
	args: ['<mode>'],
	data: new SlashCommandBuilder().setName('guesser').setDescription('Play a guessing game!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages', 'AttachFiles'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		let mode = args[0]
		if(mode === 'song'){
			await songMode(message.channel, message.author);
		} else {
			return 'Unknown mode!'
		}
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		let mode = args[0]
		if(mode === 'song'){
			await songMode(interaction.channel, interaction.user);
		} else {
			return 'Unknown mode!'
		}
	},
})
