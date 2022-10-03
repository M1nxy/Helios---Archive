import {
	Client,
	CommandInteraction,
	InteractionReplyOptions,
	Message,
	MessagePayload,
	PermissionResolvable,
	ReplyMessageOptions
} from "discord.js";
import DisTube from "distube";

export interface CommandOpts {
	name: string;
	alias: string[];
	desc: string;
	category: string;
	args: string[];
	inVoice?: boolean;
	ownerOnly?: boolean;
	data: any;
	perms: PermissionResolvable[];
	bPerms: PermissionResolvable[];
	execute: (message: Message, client: CustomClient, args: string[]) => Promise<string | void | MessagePayload | ReplyMessageOptions>;
	slashExecute: (interaction: CommandInteraction, client: CustomClient, args: string[]) => Promise<string | void | InteractionReplyOptions | MessagePayload>;
}

export class Command {
	name: string;
	alias: string[];
	desc: string;
	category: string;
	args: string[];
	inVoice?: boolean;
	ownerOnly?: boolean;
	data: any;
	perms: PermissionResolvable[];
	bPerms: PermissionResolvable[];
	execute: (message: Message, client: Client, args: string[]) => Promise<string | void | MessagePayload | ReplyMessageOptions>;
	slashExecute: (interaction: CommandInteraction, client: Client, args: string[]) => Promise<string | void | InteractionReplyOptions | MessagePayload>;
	constructor(opts: CommandOpts) {
		this.name = opts.name
		this.alias = opts.alias
		this.desc = opts.desc
		this.category = opts.category
		this.args = opts.args
		this.inVoice = opts.inVoice ?? false
		this.ownerOnly = opts.ownerOnly ?? false
		this.data = opts.data
		this.perms = opts.perms
		this.bPerms = opts.bPerms
		this.execute = opts.execute
		this.slashExecute = opts.slashExecute
	}
}

export interface EventOpts {
	name: string;
	once?: boolean;
	execute: Function;
}

export class Event {
	name: string;
	once: boolean;
	execute: Function;
	constructor(opts: EventOpts) {
		this.name = opts.name
		this.once = opts.once ?? false
		this.execute = opts.execute
	}
}

export class CustomClient extends Client {
	commands!: Command[];
	events!: Event[];
	prefix!: string;
	packageInfo: any;
	music: DisTube;
}
