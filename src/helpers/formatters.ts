import { inlineCode } from "discord.js";


export function toNameCase(str: string){
	return str[0].toUpperCase() + str.substring(1, str.length)
}

export function inlineCodeList(arr: string[]){
	if(arr.length < 1) return ''
	let res = []
	for(let item of arr){
		res.push(inlineCode(item))
	}
	return res.join(', ')
}
