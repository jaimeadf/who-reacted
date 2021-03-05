const { Plugin } = require('powercord/entities');
const { React, getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { findInTree, getReactInstance, waitFor } = require('powercord/util');

const Settings = require('./components/Settings');
const Reactors = require('./components/Reactors');

module.exports = class WhoReacted extends Plugin {
  constructor () {
    super();
    this.selectors = {
      reaction: `.${getModule([ 'reactions', 'reaction' ], false).reaction}`
    };
  }

  async startPlugin () {
    await this.loadStylesheet('style.scss');

    powercord.api.settings.registerSettings('who-reacted', {
      category: this.entityID,
      label: 'Who Reacted',
      render: Settings
    });

    await this._patchReaction();
  }

  pluginWillUnload () {
    powercord.api.settings.unregisterSettings('who-reacted');

    uninject('who-reacted-reactors');
    this._forceUpdateAllReactions();
  }

  async _patchReaction () {
    const Reaction = await this._findReaction();

    const { settings } = this;

    function canShowReactors ({ reactions }) {
      const reactionThreshold = settings.get('reactionThreshold', 10);
      if (reactionThreshold !== 0 && reactions.length > reactionThreshold) {
        return false;
      }

      const userThreshold = settings.get('userThreshold', 100);
      if (userThreshold !== 0) {
        const userCount = settings.get('useHighestUserCount', true) ?
          Math.max(...reactions.map(reaction => reaction.count)) :
          reactions.reduce((total, reaction) => total + reaction.count, 0);

        if (userCount > userThreshold) {
          return false;
        }
      }

      return true;
    }

    inject('who-reacted-reactors', Reaction.prototype, 'render', function (args, result) {
      const { message, emoji, count } = this.props;

      if (canShowReactors(message)) {
        const renderTooltip = result.props.children;
        result.props.children = props => {
          const tooltip = renderTooltip(props);
          const popout = tooltip.props.children.props.children;

          const renderReactionInner = popout.props.children;
          popout.props.children = props => {
            const reactionInner = renderReactionInner(props);

            reactionInner.props.children.props.children.push(React.createElement(Reactors, {
              message,
              emoji,
              count,
              max: settings.get('maxUsersShown', 6)
            }));

            return reactionInner;
          };

          return tooltip;
        };
      }

      return result;
    });

    this._forceUpdateAllReactions();
  }

  async _findReaction () {
    return this._findReactionReactElement(await waitFor(this.selectors.reaction)).elementType;
  }

  // Thanks @Juby210
  _forceUpdateAllReactions () {
    for (const element of document.querySelectorAll(this.selectors.reaction)) {
      this._findReactionReactElement(element).stateNode.forceUpdate();
    }
  }

  _findReactionReactElement (node) {
    return findInTree(getReactInstance(node), r => r?.elementType?.displayName === 'Reaction', {
      walkable: [ 'return' ]
    });
  }
};
