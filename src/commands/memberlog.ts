import { ServerMemberData } from '../Utils/ServerData';
import { embeds } from '../embeds';
import { Guild, Message, PermissionsBitField } from 'discord.js';
import { writeFile, readFileSync } from 'fs';

export async function memberlogCommand(message: Message) {
	if (!message.member?.permissions.has(PermissionsBitField.Flags.ManageChannels))
		return message.reply(embeds.PermissionError);
	const channel = message.channel;
	const guild = message.guild as Guild;
	const serverId = guild.id;
	const rawData = readFileSync('./database/memberlogs.json', 'utf-8');
	const data: Record<string, ServerMemberData> = JSON.parse(rawData);
	data[serverId] = {
		channelId: channel.id
	};
	writeFile('./database/memberlogs.json', JSON.stringify(data, null, 2), (err) => {
		if (err) {
			message.reply(embeds.defaultError);
			console.error(err);
		} else {
			message.reply(embeds.saveSuccess);
		}
	});
}
