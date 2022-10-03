import {
	ButtonStyle,
	CommandInteraction,
	Embed,
	EmbedBuilder,
	Message,
	SlashCommandBuilder,
	TextBasedChannel
} from "discord.js";
import { CustomClient, Command } from "../../classes";
import { getGames } from "epic-free-games";
import { getColorFromURL } from 'color-thief-node';
import { getFreePromotions } from 'steam-free-promotions';
import SteamApi from 'steam-api';
import { ChannelPagination, NextPageButton, PreviousPageButton } from "djs-button-pages";

const buttons =[
	new PreviousPageButton({custom_id: "prev_page", label: "Previous", style: ButtonStyle.Success}),
	new NextPageButton().setStyle({custom_id: "next_page", label: "Next", style: ButtonStyle.Success}),
];

async function gameEmbed(args: string[], channel: TextBasedChannel) {

	let embeds: Embed | EmbedBuilder[] = []
	let epicOffers = await getGames("GB", true)
	let steamOffers = await getFreePromotions()
	let s = new SteamApi.App(process.env.STEAM);

	if(epicOffers.currentGames){
		for(let game of epicOffers.currentGames){
			let embed = new EmbedBuilder({
				title: game.title,
				description: game.description.substring(0, 1977),
				footer: {
					text: 'Epic Games',
				},
				thumbnail: {
					url: game.keyImages[0].url
				},
			});
			embed.setColor(await getColorFromURL(game.keyImages.filter(i => i.type === 'Thumbnail')[0].url));
			embeds.push(embed);
		}
	}

	if(steamOffers.length > 0){
		for(let game of steamOffers){
			let id = game.link.split('https://store.steampowered.com/app/')[1];
			let a = await s.appDetails(1281881);
			let embed = new EmbedBuilder({
				title: game.name,
				description: a.description.substring(0, 1977),
				url: game.link,
				footer: {
					text: 'Steam',
				},
				thumbnail: {
					url: game.header
				},
			});
			embed.setColor(await getColorFromURL(game.header));
			embeds.push(embed);
		}
	}

	const pagination = new ChannelPagination().setButtons(buttons).setEmbeds(embeds).setTime(300000);
	await pagination.send(channel);
}

export const games = new Command({
	name: 'games',
	alias: ['epic', 'offers'],
	desc: 'Check which games are free!',
	category: 'Utility',
	args: [],
	data: new SlashCommandBuilder().setName('games').setDescription('Check which games are free!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		return gameEmbed(args, message.channel);
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		return gameEmbed(args, interaction.channel);
	},
})
