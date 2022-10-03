import {
	ButtonStyle,
	CommandInteraction,
	EmbedBuilder,
	inlineCode,
	Message,
	SlashCommandBuilder,
	TextBasedChannel
} from "discord.js";
import { CustomClient, Command } from "../../classes";
import { Queue } from "distube";
import { Client } from "genius-lyrics";
import { ChannelPagination, NextPageButton, PreviousPageButton } from "djs-button-pages";

const buttons =[
	new PreviousPageButton({custom_id: "prev_page", label: "Previous", style: ButtonStyle.Success}),
	new NextPageButton().setStyle({custom_id: "next_page", label: "Next", style: ButtonStyle.Success}),
];

class geniusEmbed extends EmbedBuilder {
	constructor(title, url, artist, thumbnail, lyrics) {
		super();
		this.setTitle(`${title}`);
		this.setURL(url);
		this.setDescription(lyrics.substr(0, 1976) + '...');
		this.setAuthor({
			name: artist.name,
			iconURL: artist.thumbnail,
			url: artist.url
		})
		this.setThumbnail(thumbnail)
	}
}

async function fetchLyrics(channel: TextBasedChannel, args: string[], queue: Queue, prefix: string) {
	const genius = new Client(process.env.GENIUS);

	await channel.sendTyping()

	let query
	if(args.length > 0) query = args.join(' ')
	if(queue) query = queue.songs[0].name

	if(query){

		let res = (await genius.songs.search(query)).slice(0, 5);
		if(res.length < 1) return channel.send('No Results Found!');

		let embeds = []

		for(let song of res){
			let lyrics = await (await genius.songs.get(song.id)).lyrics(false)
			embeds.push(new geniusEmbed(song.title, song.url, song.artist, song.thumbnail, lyrics))
		}
		const pagination = new ChannelPagination().setButtons(buttons).setEmbeds(embeds).setTime(300000); // 3 mins
		await pagination.send(channel)
	} else {
		channel.send({
			embeds: [
				new EmbedBuilder().setTitle(inlineCode(`Please specify a song name or play some music with ${prefix}play <song>!`)).setColor('Red')
			]
		})
	}
}

export const lyrics = new Command({
	name: 'lyrics',
	alias: [],
	desc: 'Fetch current the lyrics for a song or the current playback!',
	category: 'Music',
	args: ['<song>'],
	data: new SlashCommandBuilder().setName('lyrics').setDescription('Fetch current the lyrics for a song or the current playback!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		const queue = client.music.getQueue(message)
		await fetchLyrics(message.channel, args, queue, client.prefix)
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		const queue = client.music.getQueue(interaction.guild)
	},
})
