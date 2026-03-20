import { StyleSheet } from 'react-native'
import { GRAY, GRAY_LIGHT, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'
export const styles = StyleSheet.create({
  container: { width: '100%' },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    gap: 20,
  },
  paragraph: { color: GRAY_LIGHT, fontSize: 15, fontFamily: DM_SANS.MEDIUM },
  mainTitle: {
    color: WHITE,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: DM_SANS.BOLD,
    marginTop: 20,
  },
  title: {
    color: WHITE,
    fontSize: 15,
    fontFamily: DM_SANS.BOLD,
  },
  list: { gap: 15 },
  item: {
    marginLeft: 15,
    color: GRAY_LIGHT,
    fontSize: 15,
    fontFamily: DM_SANS.MEDIUM,
  },
  table: {
    marginHorizontal: 'auto',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHead: {
    color: GRAY_LIGHT,
    fontSize: 15,
    fontFamily: DM_SANS.BOLD,
    backgroundColor: '#242424',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: GRAY,
    width: 100,
    textAlign: 'center',
  },
  tableData: {
    color: GRAY_LIGHT,
    fontSize: 15,
    fontFamily: DM_SANS.MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: GRAY,
    width: 100,
  },
})
