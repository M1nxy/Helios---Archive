import extractUrls from "extract-urls";
import { EmbedBuilder, inlineCode, Message } from "discord.js";

let compromisedEmbed = message => new EmbedBuilder().setTitle("Compromised Account")
	.setDescription(`Your account has been compromised and used to promote a scam! As a result, you have been banned from ${message.guild.name}. If you still have access to this account, change your password or delete it. In the future, be more careful with handling random data on the internet and never download anything from websites unless it is 100% trustworthy.`)
	.setFooter({ text: `👋 Code provided by scambegone`})
	.setTimestamp()

async function scamAPI(message: string) {
	let links = extractUrls(message, true)
	let flagged = false;

	if(typeof(links) === 'object'){
		for(let link of links){
			let res = await fetch(`https://api.exerra.xyz/scam/?url=${link}`)
			if(res.status === 200){
				let { isScam } = await res.json()
				if(isScam === true){
					flagged = true
				}
			}
		}
	}
	return flagged;
}

export async function scamCheck(message: Message){
	try { // Sanity Check because I distrust occult's api
		if(await scamAPI(message.content)){
			let perms = (await message.guild.members.fetchMe()).permissions
			let author = await message.guild.members.fetch(message.author)

			if(perms.has('BanMembers') && author.bannable){
				(await author.createDM()).send({
					embeds: [compromisedEmbed(message)]
				})
				message.guild.members.ban(author, {
					reason: 'Compromised Account Detected  😞', deleteMessageDays: 7
				})
			} else{
				message.reply(
					'This is a scam related message. Please fix this bot\'s permissions and/or move the bot role higher.\nRequired Permissions: ' +
					inlineCode('Ban Members')
				)
			}
		}
	} catch (e) {
		console.log('There was an issue checking the scam api')
	}
}
