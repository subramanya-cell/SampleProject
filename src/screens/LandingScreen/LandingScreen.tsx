import {memo, useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

const ButtonView = memo((props: any) => {
  const {text, onPress} = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles?.buttonStyle}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}, []);

const LandingScreen = () => {
  const [counterValue, setCounterValue] = useState(0);

  return (
    <View style={styles?.mainContainer}>
      <Text style={styles?.counterTextStyle}>{counterValue}</Text>
      <View style={styles?.buttonSection}>
        <ButtonView
          text={'Minus'}
          onPress={() => {
            setCounterValue(val => val - 1);
          }}
        />
        <ButtonView
          text={'Add'}
          onPress={() => {
            setCounterValue(val => val + 1);
          }}
        />
      </View>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet?.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  counterTextStyle: {
    textAlign: 'center',
    fontSize: 20,
  },
  buttonSection: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
  },
  buttonStyle: {
    height: 65,
    width: 120,
    backgroundColor: 'gold',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
