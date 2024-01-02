import { Message, EmbedBuilder, GuildMember } from 'discord.js';

export async function userCommand(message: Message) {
	const member = message.mentions.members?.first() ?? (message.member as GuildMember);
	const createdDate = new Date(member.user.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
	const nickname = member.nickname ?? 'なし';
	if (!member.joinedAt) return;
	const joinedDate = new Date(member.joinedAt.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
	const userEmbed = new EmbedBuilder()
		.setColor('#0099ff')
		.setTitle(member.user.username)
		.addFields(
			{ name: 'ユーザー名', value: member.user.username },
			{ name: 'ニックネーム', value: nickname },
			{ name: 'ユーザーID', value: member.id },
			{ name: 'アカウント作成日', value: createdDate.toString() },
			{ name: 'サーバー参加日', value: joinedDate.toString() }
		)
		.setThumbnail(member.user.displayAvatarURL())
		.setTimestamp();
	message.reply({ embeds: [userEmbed] });
}
