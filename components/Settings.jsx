const { React } = require('powercord/webpack');
const { TextInput, SliderInput } = require('powercord/components/settings');

const Settings = ({ getSetting, updateSetting }) => (
  <div>
    <TextInput
      note="The maximum number of users shown per reaction between 0 and 99."
      defaultValue={getSetting('maxUsersShown', 6)}
      required={true}
      onChange={value => {
        if (isNaN(value) || value < 0 || value > 99) {
          return;
        }

        updateSetting('maxUsersShown', value);
      }}
    >
      Max users shown
    </TextInput>
    <SliderInput
      note="Hides all the users when the number of separate reactions is exceeded on a message."
      required={true}
      minValue={0}
      maxValue={20}
      defaultValue={10}
      initialValue={getSetting('reactionThreshold', 10)}
      markers={[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]}
      stickToMarkers={true}
      onValueChange={value => updateSetting('reactionThreshold', value)}
    >
      Reaction threshold
    </SliderInput>
  </div>
);

module.exports = Settings;
