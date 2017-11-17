const { stripIndents } = require('common-tags')

module.exports = (client, error) => {
  client.log.error(stripIndents`
    ${client.shard ? `Shard ID: ${client.shard.id}` : '\n'}
    ${error.stack}
  `, 'unhandledRejection')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.processEvents.unhandledRejection) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'unhandledRejection' },
          timestamp: new Date(),
          title: `unhandledRejection${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: '```js\n' + fix(error.stack) + '\n```',
          color: 0xAA0000
        }]
      })
    }
  }
}
var fix = (text) => {
  if (typeof (text) === 'string') {
    return text
    .replace(/`/g, '`' + String.fromCharCode(8203))
    .replace(/@/g, '@' + String.fromCharCode(8203))
    .replace(/#/g, '#' + String.fromCharCode(8203))
  } else {
    return text
  }
}