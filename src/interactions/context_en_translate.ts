import { embeds } from '../embeds';
import translate from 'deepl';
import { EmbedBuilder, MessageContextMenuCommandInteraction } from 'discord.js';

export const userEnCounts = new Map<string, number>();
const maxCharsPerDay = 3000;

export async function en_translateCommand(interaction: MessageContextMenuCommandInteraction) {
	if (!interaction.targetMessage.content) return interaction.reply(embeds.translateError);

	const currentChars = userEnCounts.get(interaction.user.id) || 0;
	const newChars = currentChars + interaction.targetMessage.content.length;

	if (newChars > maxCharsPerDay) {
		return interaction.reply(embeds.translateLimit);
	}

	userEnCounts.set(interaction.user.id, newChars);
	translate({
		text: interaction.targetMessage.content,
		target_lang: 'EN',
		auth_key: process.env.DEEPL_API_KEY!,
		free_api: true
	})
		.then((res) => {
			const embed = new EmbedBuilder()
				.setTitle('Translation Result')
				.addFields({ name: 'Original', value: interaction.targetMessage.content })
				.addFields({ name: 'Translation (EN)', value: res.data.translations[0].text })
				.setColor('#0099ff')
				.setFooter({ text: 'Powered by DeepL' });
			interaction.reply({ embeds: [embed] });
		})
		.catch((err) => {
			console.error(err);
			interaction.reply(embeds.translateError);
		});
}
