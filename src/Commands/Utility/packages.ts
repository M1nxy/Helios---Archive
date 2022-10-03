import { ButtonStyle, CommandInteraction, Embed, EmbedBuilder, Guild, Message, SlashCommandBuilder, TextBasedChannel } from "discord.js";
import { ChannelPagination, NextPageButton, PreviousPageButton } from "djs-button-pages";
import { CustomClient, Command } from "../../classes";
import { toNameCase } from "../../helpers/formatters";

class packageEmbed extends EmbedBuilder {
	constructor(name, description, packageIcon, author, identifier, depiction, repo, index, total) {
		super();
		this.setTitle(name)
		this.setDescription(description)
		this.setThumbnail(packageIcon)
		this.addFields([
			{
				name: 'Author',
				value: `${author ?? 'Unknown'}`.split(' <')[0],
				inline: true
			},
			{
				name: 'Repo',
				value: `[${repo.name}](${repo.uri})`,
				inline: true
			},
			{
				name: 'Bundle ID',
				value: `${identifier}`,
				inline: false
			},
			{
				name: 'View Depiction',
				value: `[View on ${repo.name}](${depiction})`,
				inline: false
			}
		])
		this.setFooter({
			text: `${toNameCase(repo.name)} • ${index + 1}/${total}`,
			iconURL: repo.uri += '/CydiaIcon.png'
		})
		this.setTimestamp()
	}
}

const buttons =[
	new PreviousPageButton({custom_id: "prev_page", label: "Previous", style: ButtonStyle.Success}),
	new NextPageButton().setStyle({custom_id: "next_page", label: "Next", style: ButtonStyle.Success}),
];

async function searchPackage(client: CustomClient, channel: TextBasedChannel, packageName: string) {
	await channel.sendTyping()
	let packages = (await (await fetch(`https://api.canister.me/v1/community/packages/search?query=${packageName}`)).json()).data.slice(0, 10)

	let embeds = []

	for(let index in packages){
		let pkg = packages[index]
		let repo = (await (await fetch(`https://api.canister.me/v1/community/repositories/search?query=${pkg.repository.uri}`)).json()).data[0]
		let { name, description, packageIcon, author, identifier, depiction } = pkg
		embeds.push(new packageEmbed(name, description, packageIcon, author, identifier, depiction, repo, index, packages.length));
	}

	const pagination = new ChannelPagination().setButtons(buttons).setEmbeds(embeds).setTime(600000);

	await pagination.send(channel);
}

export const packages = new Command({
	name: 'packages',
	alias: ['package', 'pkg'],
	desc: 'Get info about a package!',
	category: 'Utility',
	args: ['package'],
	data: new SlashCommandBuilder().setName('packages').setDescription('Get info about a package!'),
	perms: ['SendMessages'], // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
	bPerms: ['SendMessages'],
	execute: async (message: Message, client: CustomClient, args: string[]) => {
		if(args.length < 1) return 'Please specify a package name!'
		return searchPackage(client, message.channel, args.join(' '));
	},
	slashExecute: async (interaction: CommandInteraction, client: CustomClient, args: string[]) => {
		if(args.length < 1) return 'Please specify a package name!'
		return searchPackage(client, interaction.channel, args.join(' '));
	},
})
