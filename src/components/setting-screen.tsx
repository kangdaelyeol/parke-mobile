import React, { useState } from 'react';
import { StyleSheet, Switch, View, Text } from 'react-native';

export default function SettingScreen() {
  const [autoChange, setAutoChange] = useState(false);
  const [notice, setNotice] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Setting</Text>
        <View style={styles.list}>
          <View style={styles.line}>
            <Text style={styles.lineText}>자동바꿈</Text>
            <View>
              <Switch value={autoChange} onValueChange={setAutoChange} />
            </View>
          </View>
          <View style={styles.underLine} />
          <View style={styles.line}>
            <Text style={styles.lineText}>알림</Text>
            <View>
              <Switch
                style={styles.btn}
                value={notice}
                onValueChange={setNotice}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: '100%',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginHorizontal: 'auto',
    marginTop: 60,
    fontWeight: 500,
  },
  inner: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 20,
  },
  list: {
    justifyContent: 'center',
    backgroundColor: '#222222',
    borderRadius: 20,
    marginTop: 10,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 50,
  },
  underLine: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    height: 0.5,
  },
  lineText: {
    color: 'white',
    fontWeight: 300,
    fontSize: 16,
  },
});
