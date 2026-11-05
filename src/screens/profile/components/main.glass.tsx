import { StyleSheet, Text, View } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import {
  Avatar,
  EmailDomainInput,
  FocusableInput,
  GlassSurface,
  Loading,
  PressableButton,
  StatusTile,
} from '@/components'
import { useMainViewModel } from '@profile/view-model'
import { LoginProvider } from '@/services/types'
import { GLASS, glassText, LINK, TEXT } from '@/theme/glass'
import { formatPhone } from '@/utils'

const PROVIDER_LABEL: Record<LoginProvider, string> = {
  kakao: '카카오 계정',
  google: 'Google 계정',
  apple: 'Apple 계정',
}

// My 본문 (글래스): 영상 Users & Auth처럼 유리 판 하나에 사용자 줄 · 입력 폼 · 작은 버튼을 담고,
// 구간 사이는 얇은 선으로 나눈다
export const GlassMain = () => {
  const { state, actions } = useMainViewModel()
  return (
    <View>
      <View style={styles.wrapper}>
        {state.loading && <Loading />}
        <GlassSurface style={styles.panel}>
          {/* 페이지 제목도 판 안에 */}
          <Text style={styles.pageTitle}>프로필</Text>

          {/* 사용자 줄: 아바타 + 이름 + 번호, 오른쪽에 로그인 방식 (영상 표의 2FA 방식처럼 파란 글씨) */}
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
            {!!state.loginProvider && (
              <Text style={styles.provider} numberOfLines={1}>
                {PROVIDER_LABEL[state.loginProvider]}
              </Text>
            )}
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

          {/* 이 기기에 남은 주소: 영상 상태 목록처럼 한 겹 더 놓인 타일 */}
          {!!state.reportEmail && (
            <StatusTile
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
          )}

          <View style={styles.divider} />

          {/* 계정: 영상 표의 Reset 2FA · Logs처럼 작은 버튼 두 개 */}
          <View style={styles.account}>
            <Text style={[glassText.title, styles.accountTitle]}>계정</Text>
            <PressableButton
              size="sm"
              variant="secondary"
              title="로그아웃"
              onPress={actions.logoutPress}
            />
            <PressableButton
              size="sm"
              variant="danger"
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
  provider: {
    maxWidth: '40%',
    color: LINK,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
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
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountTitle: {
    flex: 1,
  },
})
