const { React, Flux, getModule, getModuleByDisplayName } = require('powercord/webpack');

const ReactionStore = getModule([ 'getReactions', '_dispatcher' ], false);
const VoiceUserSummaryItem = getModuleByDisplayName('VoiceUserSummaryItem', false);

const Reactors = ({ count, max, users }) => {
  function renderMoreUsers (text, className) {
    return (
      <div className={`${className} more-reactors`}>
        +{1 + count - max}
      </div>
    );
  }

  return (
    <VoiceUserSummaryItem
      className="powercord-who-reacted-reactors"
      max={max}
      users={users}
      renderMoreUsers={renderMoreUsers}
    />
  );
}

module.exports = Flux.connectStores([ ReactionStore ], ({ message, emoji }) => ({
  users: Object.values(ReactionStore.getReactions(message.getChannelId(), message.id, emoji) ?? {})
}))(Reactors);
