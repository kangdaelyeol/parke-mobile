import { StyleSheet, Text, View } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import {
  Avatar,
  EmailDomainInput,
  FocusableInput,
  GlassRow,
  GlassSurface,
  Loading,
  PressableButton,
} from '@/components'
import { useMainViewModel } from '@profile/view-model'
import { GLASS, glassText, TEXT } from '@/theme/glass'
import { formatPhone } from '@/utils'

// My 본문 (글래스): 모든 요소를 유리 판 하나에 묶고, 구간 사이는 얇은 선으로 나눈다
export const GlassMain = () => {
  const { state, actions } = useMainViewModel()
  return (
    <View>
      <View style={styles.wrapper}>
        {state.loading && <Loading />}
        <GlassSurface style={styles.panel}>
          {/* 페이지 제목도 판 안에 */}
          <Text style={styles.pageTitle}>프로필</Text>

          {/* 프로필: 아바타 + 이름 + 번호 */}
          <View style={styles.profile}>
            <Avatar name={state.nickname} size={48} />
            <View style={styles.profileTexts}>
              <Text style={styles.name} numberOfLines={1}>
                {state.nickname || '이름 없음'}
              </Text>
              <Text style={glassText.subtitle} numberOfLines={1}>
                {formatPhone(state.phone) || '번호 없음'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 내 정보: 제목 + 설명 + 파인 입력칸 + 저장 */}
          <View style={styles.cardHeader}>
            <Text style={glassText.title}>내 정보</Text>
            <Text style={glassText.subtitle}>
              카드에 쓰이는 번호와 주행 기록을 받을 주소예요.
            </Text>
          </View>
          <FocusableInput
            inset
            title="닉네임"
            placeholder="닉네임"
            onChangeText={actions.nicknameInput}
            value={state.nickname}
            iconName="my"
          />
          <FocusableInput
            inset
            title="연락처"
            placeholder="연락처"
            onChangeText={actions.phoneInput}
            value={formatPhone(state.phone)}
            iconName="phone"
          />
          <EmailDomainInput
            inset
            title="이메일"
            value={state.email}
            onChangeText={actions.emailInput}
          />
          {!state.email && (
            <Text style={styles.emailHint}>
              카드에 이메일이 없으면 주행 기록을 보낼 때 이 주소가 미리
              채워져요.
            </Text>
          )}
          <PressableButton
            title="저장"
            onPress={actions.savePress}
            style={styles.saveButton}
          />

          {!!state.reportEmail && (
            <>
              <View style={styles.divider} />
              <GlassRow
                style={styles.flushRow}
                icon="envelope"
                iconVariant="glass"
                tone="warning"
                title="이 기기에서 최근 보낸 주소"
                subtitle={state.reportEmail}
                right={
                  <PressableButton
                    size="sm"
                    variant="danger"
                    title="삭제"
                    onPress={actions.clearReportEmailPress}
                  />
                }
              />
            </>
          )}

          <View style={styles.divider} />

          {/* 계정 */}
          <View style={styles.buttonSection}>
            <PressableButton
              variant="secondary"
              icon="right-from-bracket"
              title="로그아웃"
              onPress={actions.logoutPress}
            />
            <PressableButton
              variant="danger"
              icon="user-xmark"
              title="회원탈퇴"
              onPress={actions.deletePress}
            />
          </View>
        </GlassSurface>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 'auto',
    width: '100%',
    maxWidth: 380,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  panel: {
    padding: 16,
    gap: 14,
  },
  pageTitle: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileTexts: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 17,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: GLASS.divider,
  },
  cardHeader: {
    gap: 4,
  },
  emailHint: {
    marginTop: -6,
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  saveButton: {
    minHeight: 50,
  },
  // 판 안쪽 여백에 맞춰 줄 좌우 여백은 없앤다
  flushRow: {
    minHeight: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  buttonSection: {
    gap: 12,
  },
})
