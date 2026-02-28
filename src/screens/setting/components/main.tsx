import { StyleSheet, Switch, View, Text } from 'react-native';
import { useSettingMainViewModel } from '@/view-model';
import { FONT } from '@/theme/fonts';

export const Main = () => {
  const { state, actions } = useSettingMainViewModel();
  return (
    <View style={styles.main}>
      <View style={styles.list}>
        <View style={styles.line}>
          <Text style={styles.lineText}>자동바꿈</Text>
          <View>
            <Switch
              disabled={state.autoSetDisabled}
              value={state.autoSet}
              onValueChange={actions.autoSetChange}
            />
          </View>
        </View>
        <View style={styles.underLine} />
        <View style={styles.line}>
          <Text style={styles.lineText}>알림</Text>
          <View>
            <Switch
              disabled={state.noticeDisabled}
              value={state.notice}
              onValueChange={actions.noticeChange}
            />
          </View>
        </View>
      </View>
      <View style={styles.list}>
        <View style={styles.line}>
          <Text style={styles.lineText}>활성화</Text>
          <View>
            <Switch value={state.active} onValueChange={actions.activeChange} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#eeeeee',
    fontSize: 30,
    marginTop: 50,
    fontWeight: 500,
    textAlign: 'center',
  },
  main: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 10,
    marginHorizontal: 'auto',
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
    fontFamily: FONT.REGULAR,
    fontSize: 16,
  },
  backBtn: {
    position: 'absolute',
    top: 55,
    left: 0,
    zIndex: 3,
  },
  header: {
    borderBottomColor: '#444444',
    borderBottomWidth: 1,
  },
  headerWrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
    paddingBottom: 15,
  },
});
