import { CustomClient } from "./classes"; // @ts-ignore not a real issue but webstorm's intellisence doesn't appear support tsconfig resolveJSON yet.
import packageInfo from '../package.json';

// Boilerplate Code
import { commands } from './Commands';
import { events } from "./Events";
import { setupDiscord, setupMusic } from "./eventBinders";

// Load Environmental variables
require('dotenv').config()

const client = new CustomClient({
	intents: ['MessageContent', 'Guilds', 'GuildMessages',  'GuildVoiceStates'],
	allowedMentions: { parse: ['users', 'roles'] }
})

// client args and event binders
client.prefix = 'h!';
client.commands = commands;
client.packageInfo = packageInfo;
setupDiscord(client, events);
setupMusic(client);

// client login :woo:
client.login(process.env.DISCORD).then(() => {
	client.user.setPresence({ activities: [{ name: 'M1nx\'s brain rot', type: 3 }] });
});
