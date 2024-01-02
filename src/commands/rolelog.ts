import { ServerRoleData } from '../Utils/ServerData';
import { embeds } from '../embeds';
import { Message, PermissionsBitField, Guild } from 'discord.js';
import { writeFile, readFileSync } from 'fs';

export async function rolelogCommand(message: Message) {
	if (!message.member?.permissions.has(PermissionsBitField.Flags.ManageChannels))
		return message.reply(embeds.PermissionError);
	const channel = message.channel;
	const guild = message.guild as Guild;
	const serverId = guild.id;
	const rawData = readFileSync('./database/rolelogs.json', 'utf-8');
	const data: Record<string, ServerRoleData> = JSON.parse(rawData);
	data[serverId] = {
		channelId: channel.id
	};
	writeFile('./database/rolelogs.json', JSON.stringify(data, null, 2), (err) => {
		if (err) {
			message.reply(embeds.defaultError);
			console.error(err);
		} else {
			message.reply(embeds.saveSuccess);
		}
	});
}
