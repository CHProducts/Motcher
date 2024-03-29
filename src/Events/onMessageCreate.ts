import { commands } from '../commands';
import { bannedUsers, bannedServers, list } from '../index';
import { connect, Database } from 'aurora-mongo';
import { Message, PermissionsBitField, Awaitable, GuildTextBasedChannel, Guild } from 'discord.js';
import { config } from 'dotenv';

config();

const prefix = 'mc!';

export async function onMessageCreate(message: Message): Promise<Awaitable<void>> {
	if (bannedUsers.includes(message.author.id)) return;
	if (!message.guild) {
		if (message.author.id === message.client.user.id) return;
		const channel = await message.client.channels.fetch('1121348990030589963');
		const attachment = message.attachments.first();
		if (!channel?.isTextBased()) return;
		channel
			.send({
				content: message.content
					? `${message.content}\n(${message.author.id} | ${message.author.username})`
					: `${message.author.id} | (${message.author.username})`,
				files: attachment
					? [
							{
								attachment: attachment.url,
								name: attachment.name
							}
						]
					: undefined
			})
			.catch((err) => {
				channel.send(err.toString());
			});
		return;
	}
	if (
		message.author.bot ||
		message.guild?.members.me?.communicationDisabledUntil !== null ||
		!message.guild.members.me.permissionsIn(message.channel as GuildTextBasedChannel).has(PermissionsBitField.Flags.SendMessages) ||
		bannedServers.includes(message.guild.id)
	)
		return;
	await connect(process.env.MONGO_URL!);
	const Response = new Database('Response');
	list['response'] = await Response.keys();
	const matchingKeys = list['response'].filter((key) => key.split(',')[0] === (message.guild as Guild).id);
	const serverData: { [key: string]: string } = {};
	await Promise.all(
		matchingKeys.map(async (key) => {
			const value = await Response.get(key);
			serverData[key] = value;
		})
	);
	for (const key in serverData) {
		if (message.content.includes(key.split(',')[1])) {
			const response = serverData[key];
			message.channel.send(response);
		}
	}
	if (!message.content.startsWith(prefix)) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/) as string[];
	const commandName = args.shift()?.toLowerCase();
	switch (commandName) {
		case 'about':
			commands.about(message);
			break;
		case 'avatar':
			commands.avatar(message);
			break;
		case 'ban':
			commands.ban(message);
			break;
		case 'banlist':
			commands.banlist(message);
			break;
		case 'banner':
			commands.banner(message);
			break;
		case 'clear':
			commands.clear(message);
			break;
		case 'help':
			commands.help(message);
			break;
		case 'inlist':
			commands.inlist(message);
			break;
		case 'invite':
			commands.invite(message);
			break;
		case 'join':
			commands.join(message);
			break;
		case 'kick':
			commands.kick(message);
			break;
		case 'leave':
			commands.leave(message);
			break;
		case 'log':
			commands.log(message);
			break;
		case 'mcbeskin':
			commands.mcbeskin(message);
			break;
		case 'mcskin':
			commands.mcskin(message);
			break;
		case 'mcstatus':
			commands.mcstatus(message);
			break;
		case 'minvite':
			commands.botinvite(message);
			break;
		case 'ping':
			commands.ping(message);
			break;
		case 'poll':
			commands.poll(message);
			break;
		case 'restart':
			commands.restart(message);
			break;
		case 'response':
			commands.response(message);
			break;
		case 'role':
			commands.role(message);
			break;
		case 'run':
			commands.run(message);
			break;
		case 'script':
			commands.script(message);
			break;
		case 'search':
			commands.search(message);
			break;
		case 'server':
			commands.server(message);
			break;
		case 'status':
			commands.status(message);
			break;
		case 'timeout':
			commands.timeout(message);
			break;
		case 'untimeout':
			commands.untimeout(message);
			break;
		case 'user':
			commands.user(message);
			break;
		default:
			message.reply('存在しないコマンドです。');
			break;
	}
}
