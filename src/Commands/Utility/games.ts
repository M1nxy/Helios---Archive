import { CommandInteraction, Embed, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import { CustomClient, Command } from "../../classes";
import { getGames } from "epic-free-games";
import { getColorFromURL } from 'color-thief-node';
import { getFreePromotions } from 'steam-free-promotions';
import steam from 'steam-web';

async function gameEmbed(args: string[]) {

	let embeds: Partial<Embed>[] = []
	let epicOffers = await getGames("GB", true)
	let steamOffers = await getFreePromotions()
	let s = new steam({
		apiKey: process.env.STEAM,
		format: 'json' //optional ['json', 'xml', 'vdf']
	});

	if(epicOffers.currentGames){
		for(let game of epicOffers.currentGames){
			let embed = new EmbedBuilder({
				title: game.title,
				description: game.description.substring(0, 1977),
				fields: [
					{
						name: 'Store',
						value: 'Epic Games'
					}
				],
				thumbnail: {
					url: game.keyImages.filter(i => i.type === 'Thumbnail')[0].url
				},
			})
			embed.setColor(await getColorFromURL(game.keyImages.filter(i => i.type === 'Thumbnail')[0].url))
			embeds.push(embed)
		}
	}

	if(steamOffers.length > 0){
		for(let game of steamOffers){
			let id = game.link.split('https://store.steampowered.com/app/')[1]
			console.log(id)
			s.getStoreMetadata({
				appid: id,
				callback: function(err, data) {
					console.log(data);
				}
			})
			let embed = new EmbedBuilder({
				title: game.name,
				url: game.link,
				image: {
					url: game.images[0]
				},
				fields: [
					{
						name: 'Store',
						value: 'Steam'
					}
				],
				thumbnail: {
					url: game.header
				},
			})
			embed.setColor(await getColorFromURL(game.header))
			embeds.push(embed)
		}
	}

	return { embeds }

}

export const games = new Command({
	name: 'games',
	alias: ['steam', 'epic'],
	desc: 'Check which games are free!',
	category: 'Utility',
	args: [],
	data: new SlashCommandBuilder().setName('games').setDescription('Check which games are free!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		return gameEmbed(args);
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		return gameEmbed(args);
	},
})
