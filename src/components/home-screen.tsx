import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { safeStartScan, manager } from '../background/manager';

export default function HomeScreen({ navigation }: any) {
  useEffect(() => {
    safeStartScan();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.textBox}>
        <Text style={styles.upText}>PARKÉ</Text>
        <Text style={styles.downText}>LUXURY</Text>
      </View>
      <Pressable
        style={styles.btn}
        onPress={() => navigation.navigate('SearchBLE')}
      >
        <Text style={styles.btnText}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  textBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upText: {
    color: 'white',
    fontSize: 90,
    transform: [{ scaleY: 0.7 }],
    marginVertical: -10,
    letterSpacing: 3,
  },
  downText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 7,
  },
  btn: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 14,
    width: 200,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 20,
    color: 'black',
  },
});
