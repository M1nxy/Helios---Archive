import { Command } from "../classes";

import { helloWorld, version } from "./Misc";
import { play, pause, volume, loop, filter, skip, lyrics } from "./Music";
import { serverInfo, packages, help, games } from "./Utility";
import { guesser } from './fun';


export const commands: Command[] = [
	helloWorld,
	version,
	play,
	pause,
	volume,
	loop,
	filter,
	skip,
	lyrics,
	serverInfo,
	packages,
	help,
	guesser,
	games
]
