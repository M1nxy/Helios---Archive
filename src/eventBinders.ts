import { CustomClient } from "./classes";
import { DisTube, Queue } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { EmbedBuilder, inlineCode } from "discord.js";


export function setupDiscord(client: CustomClient, events){
	for (const event of events) {
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}
}

export function setupMusic(client: CustomClient){
	client.music = new DisTube(client, {
		leaveOnStop: true,
		emitNewSongOnly: true,
		emitAddSongWhenCreatingQueue: false,
		emitAddListWhenCreatingQueue: false,
		plugins: [
			new SpotifyPlugin({
				emitEventsAfterFetching: true
			}),
			new SoundCloudPlugin(),
			new YtDlpPlugin()
		]
	})
	const status = queue =>
		`Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
			queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
		}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
	client.music
		.on('playSong', (queue, song) => {
			let playEmbed = new EmbedBuilder({
				title: 'Playing',
				description: `[${song.name}](${song.url})`
			})
			playEmbed.setThumbnail(song.thumbnail)
			playEmbed.addFields([{name: 'Requested By', value: `<@${song.user.id}>`, inline: true}])
			playEmbed.addFields([{name: 'Duration', value: inlineCode(song.formattedDuration), inline: true}])
			playEmbed.addFields([{
				name: 'Queue',
				value: `${queue.songs.length.toString()} song(s) - ${inlineCode(queue.formattedDuration)}`,
				inline: true
			}])

			queue.textChannel.send({embeds: [playEmbed]})
		})
		.on('addSong', (queue, song) =>
			queue.textChannel.send(
				`✅ Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
			)
		)
		.on('addList', (queue, playlist) =>
			queue.textChannel.send(
				`✅ Added \`${playlist.name}\` playlist (${
					playlist.songs.length
				} songs) to queue\n${status(queue)}`
			)
		)
		.on('error', (channel, e) => {
			if (channel) channel.send(`❎ An error encountered: ${e.toString().slice(0, 1974)}`)
			else console.error(e)
		})
		.on('empty', queue => {
			queue.textChannel.send('Voice channel is empty! Leaving the channel...');
			void queue.stop()
		})
		.on('searchNoResult', (message, query) =>
			message.channel.send(`❎ No result found for \`${query}\`!`)
		)
		.on('finish', queue => {
			queue.textChannel.send('Finished!')
			void queue.stop()
		})
		.on('disconnect', (queue: Queue) => {
			queue.textChannel.send('Disconnected from voice channel!')
			void queue.stop()
		})
}
