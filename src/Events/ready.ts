import { CustomClient, Event } from "../classes";

export const ready = new Event({
	name: 'ready',
	once: true,
	async execute(client: CustomClient): Promise<void> {
		console.log(`Ready as ${client.user.tag}`);
	},
})
