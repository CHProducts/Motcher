import { ServerRoleData } from '../Utils/ServerData';
import { embeds } from '../embeds';
import { ChatInputCommandInteraction, Guild, GuildMember } from 'discord.js';
import { writeFile, readFileSync } from 'fs';

export async function rolelogstopCommand(interaction: ChatInputCommandInteraction) {
	if (!(interaction.member instanceof GuildMember)) return;
	const guild = interaction.guild as Guild;
	const serverId = guild.id;
	const rawData = readFileSync('/database/rolelogs.json', 'utf-8');
	const data: Record<string, ServerRoleData> = JSON.parse(rawData);
	delete data[serverId];
	writeFile('../database/rolelogs.json', JSON.stringify(data, null, 2), (err) => {
		if (err) {
			interaction.reply(embeds.defaultError);
			console.error(err);
		} else {
			interaction.reply(embeds.deleteSuccess);
		}
	});
}
