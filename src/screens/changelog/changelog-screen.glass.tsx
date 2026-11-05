import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  GlassSection,
  GlassSurface,
  GlassTitleBar,
  StatusPill,
} from '@/components'
import { ChangeType, VersionBump } from '@/domain/app'
import { PRETENDARD } from '@/theme/fonts'
import { GLASS, glassText, TEXT, Tone } from '@/theme/glass'
import { BUMP_LABEL, CHANGE_LABEL } from './labels'
import { useChangelogViewModel } from './view-model'

const BUMP_TONE: Record<VersionBump, Tone> = {
  major: 'accent',
  minor: 'info',
  patch: 'neutral',
}

const CHANGE_TONE: Record<ChangeType, Tone> = {
  feature: 'success',
  improve: 'info',
  fix: 'warning',
}

// 변경 내역 (글래스): 현재 버전 판 + 버전마다 제목이 판 안에 들어간 묶음
export const GlassChangelogScreen = () => {
  const { state, actions } = useChangelogViewModel()
  const { top, bottom } = useSafeAreaInsets()
  const current = state.entries[0]

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: top + 8 }]}>
        <GlassTitleBar title="버전 정보" onBack={actions.backPress} />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 40 }]}
      >
        <GlassSurface style={styles.current}>
          <Text style={glassText.label}>현재 버전</Text>
          <View style={styles.versionRow}>
            <Text style={styles.version}>{state.version}</Text>
            <StatusPill tone="info" label={state.stage} />
          </View>
          <Text style={glassText.subtitle}>
            {current.date} · {current.title}
          </Text>
        </GlassSurface>

        {state.entries.map(entry => (
          <GlassSection
            key={entry.version}
            title={`v${entry.version}`}
            right={
              <StatusPill
                tone={BUMP_TONE[entry.bump]}
                label={BUMP_LABEL[entry.bump]}
              />
            }
          >
            <View style={styles.entry}>
              <View style={styles.entryHead}>
                <Text style={glassText.title}>{entry.title}</Text>
                <Text style={glassText.caption}>{entry.date}</Text>
              </View>
              {entry.changes.map((change, i) => (
                <View key={i} style={styles.change}>
                  <StatusPill
                    variant="plain"
                    dot
                    tone={CHANGE_TONE[change.type]}
                    label={CHANGE_LABEL[change.type]}
                    style={styles.changeType}
                  />
                  <Text style={styles.changeText}>{change.text}</Text>
                </View>
              ))}
            </View>
          </GlassSection>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingHorizontal: 14,
    paddingBottom: 4,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingHorizontal: 14,
    paddingTop: 10,
    gap: 12,
  },
  current: {
    padding: 16,
    gap: 6,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  version: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 30,
    letterSpacing: -0.5,
  },
  entry: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 16,
    gap: 10,
  },
  entryHead: {
    gap: 3,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GLASS.divider,
  },
  change: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  // 종류 글자 폭을 맞춰 설명이 한 줄로 정렬되게
  changeType: {
    width: 58,
  },
  changeText: {
    flex: 1,
    color: TEXT.secondary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
    lineHeight: 20,
  },
})
