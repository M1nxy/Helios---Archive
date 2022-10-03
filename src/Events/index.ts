import { Event } from "../classes";
import { ready } from "./ready";
import { messageCreate } from "./messageCreate";

export const events: Event[] = [
	ready,
	messageCreate
]
