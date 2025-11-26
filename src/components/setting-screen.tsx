import React from 'react';
import { StyleSheet, Switch, View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSetting } from '../controllers/use-setting';

export default function SettingScreen() {
  const {
    noticeDisabled,
    autoSetDisabled,
    notice,
    onAutoSetChange,
    onActiveChange,
    onNoticeChange,
    onHomeBtnPress,
    active,
    autoSet,
  } = useSetting();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Pressable style={styles.backBtn} onPress={onHomeBtnPress}>
          {({ pressed }) => (
            <Icon
              name="arrow-back-ios-new"
              size={30}
              style={{
                color: pressed ? '#666' : '#fff',
              }}
            />
          )}
        </Pressable>
        <Text style={styles.title}>Setting</Text>
        <View style={styles.list}>
          <View style={styles.line}>
            <Text style={styles.lineText}>자동바꿈</Text>
            <View>
              <Switch
                disabled={autoSetDisabled}
                value={autoSet}
                onValueChange={onAutoSetChange}
              />
            </View>
          </View>
          <View style={styles.underLine} />
          <View style={styles.line}>
            <Text style={styles.lineText}>알림</Text>
            <View>
              <Switch
                disabled={noticeDisabled}
                value={notice}
                onValueChange={onNoticeChange}
              />
            </View>
          </View>
        </View>
        <View style={styles.list}>
          <View style={styles.line}>
            <Text style={styles.lineText}>활성화</Text>
            <View>
              <Switch value={active} onValueChange={onActiveChange} />
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
  backBtn: {
    position: 'absolute',
    top: 65,
    left: 30,
    borderColor: '#444',
    borderRadius: '50%',
    color: 'white',
  },
});
