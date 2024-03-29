import { Client, version } from 'discord.js';

export function onReady(client: Client) {
	console.log(`Logged in as ${client.user?.tag}`);
	setInterval(() => {
		client.user?.setActivity(`mc!help | Created By CH Products | ${client.guilds.cache.size} Servers`);
	}, 10000);
	console.table({
		'Bot User': client.user?.tag,
		'Guild(s)': client.guilds.cache.size + ' Servers',
		Watching: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) + ' Members',
		'Discord.js': version,
		'Node.js': process.version,
		Plattform: process.platform + ' | ' + process.arch,
		Memory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + 'MB | ' + (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + 'MB'
		// Quote from: https://github.com/Nich87/Faith
	});
}
