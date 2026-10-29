import { FlatList, StyleSheet, Text, View } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Loading } from '@/components'
import { RootStackParamList } from '@/navigation/types'
import { Header, RecordItem } from '@/screens/drive-record/components'
import { useDriveRecordsViewModel } from '@/screens/drive-record/view-model'
import { GRAY } from '@/theme/color'
import { PRETENDARD } from '@/theme/fonts'

type DriveRecordsScreenProps = {
  route: RouteProp<RootStackParamList, 'DriveRecords'>
}

// 카드별 주행 기록 목록
export default function DriveRecordsScreen({ route }: DriveRecordsScreenProps) {
  const { state, actions } = useDriveRecordsViewModel(route.params.cardId)
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={styles.container}>
      <Header
        title={state.cardTitle ? `${state.cardTitle} 주행 기록` : '주행 기록'}
        onBack={actions.backPress}
      />
      {state.loading ? (
        <Loading />
      ) : (
        <FlatList
          data={state.records}
          keyExtractor={record => record.id}
          renderItem={({ item }) => (
            <RecordItem
              record={item}
              accent={state.accent}
              onPress={() => actions.recordPress(item)}
            />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: bottom + 30 }]}
          ListEmptyComponent={
            <Text style={styles.empty}>
              아직 주행 기록이 없어요.{'\n'}주행 모드를 끝내면 여기에
              저장됩니다.
            </Text>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  list: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  empty: {
    marginTop: 80,
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
})
