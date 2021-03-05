const { React } = require('powercord/webpack');
const { TextInput, SliderInput, SwitchItem } = require('powercord/components/settings');

const Settings = ({ getSetting, updateSetting }) => {
  function getThresholdMarkerLabel(value) {
    if (value === 0) {
      return 'Off';
    }

    if (value % 1000 === 0) {
      return `${value / 1000}k`;
    }

    return value;
  }

  return (
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
        note="Hides the reactors when the number of separate reactions is exceeded on a message."
        required={true}
        minValue={0}
        maxValue={20}
        defaultValue={10}
        initialValue={getSetting('reactionThreshold', 10)}
        markers={[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]}
        stickToMarkers={true}
        onMarkerRender={getThresholdMarkerLabel}
        onValueChange={value => updateSetting('reactionThreshold', value)}
      >
        Reaction threshold
      </SliderInput>
      <SliderInput
        note="Hides the reactors when the count of users is exceeded on a message."
        required={true}
        minValue={0}
        maxValue={10000}
        defaultValue={100}
        initialValue={getSetting('userThreshold', 100)}
        markers={[ 0, 10, 20, 50, 100, 500, 1000, 2000, 3000, 4000, 5000, 10000 ]}
        stickToMarkers={true}
        equidistant={true}
        onMarkerRender={getThresholdMarkerLabel}
        onValueChange={value => updateSetting('userThreshold', value)}
      >
        User threshold
      </SliderInput>
      <SwitchItem
        note="Uses the highest user count of the reactions on a message for user threshold."
        value={getSetting('useHighestUserCount', true)}
        onChange={value => updateSetting('useHighestUserCount', value)}
      >
        Use highest user count
      </SwitchItem>
    </div>
  );
};

module.exports = Settings;
