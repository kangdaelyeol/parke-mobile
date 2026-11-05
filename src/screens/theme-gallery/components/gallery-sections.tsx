import { PropsWithChildren } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import {
  AreaChart,
  Avatar,
  BrandBlock,
  ChartLegend,
  CodeBlock,
  DonutChart,
  FilterChips,
  GlassButton,
  GlassIconButton,
  GlassInput,
  GlassPanel,
  GlassRow,
  GlassTable,
  GlassTableColumn,
  GlassToolbar,
  HighlightStat,
  IconTile,
  LinkText,
  NavItem,
  SearchField,
  SectionLabel,
  SegmentedControl,
  StatCard,
  StatusPill,
  StatusTile,
  UserBlock,
} from '@/components'
import { CHART, GLASS, TEXT, Tone, TONE } from '@/theme/glass'
import { PRETENDARD } from '@/theme/fonts'
import {
  ANALYTICS_STATS,
  CHALLENGES,
  CHART_TABS,
  ChallengeFilter,
  DIRECTORY,
  DISTRIBUTION,
  FILTERS,
  NAV_MENU,
  NAV_SYSTEM,
  PROVIDERS,
  RANGES,
  REVENUE,
  SECURITY_LOG,
  STATS,
  STATS_CARD_CODE,
  WAVE_RANGES,
  WAVEFORM,
} from '../sample-data'
import { ChartTabKey, RangeKey, WaveRangeKey } from '../types'

// 차트 값은 바뀌지 않으므로 모듈에서 한 번만 만든다 (차트는 같은 배열이면 다시 그리지 않는다)
const CHART_SERIES: Record<ChartTabKey, { data: number[]; color: string }[]> = {
  revenue: [{ data: REVENUE.data, color: CHART.primary }],
  users: [
    { data: REVENUE.data.map((v, i) => v * 0.7 + i * 2), color: CHART.primary },
  ],
  verifications: [
    {
      data: REVENUE.data.map((v, i) => 40 + Math.sin(i) * 12 + v * 0.4),
      color: CHART.primary,
    },
  ],
}

const WAVE_SERIES = [
  { data: WAVEFORM.authorizations, color: CHART.primary },
  { data: WAVEFORM.attacks, color: CHART.secondary, dashed: true },
]

const DONUT_SEGMENTS = DISTRIBUTION.map(item => ({
  value: item.value,
  color: TONE[item.tone],
}))

const DONUT_LEGEND = DISTRIBUTION.map(item => ({
  color: TONE[item.tone],
  label: item.label,
  value: item.detail,
}))

const WAVE_LEGEND = [
  {
    color: CHART.primary,
    label: 'Successful Token Authorizations',
    value: 'Total: 48.6k',
  },
  {
    color: CHART.secondary,
    label: 'Mitigated Attack Vectors',
    value: 'Avg Latency: 34ms',
  },
]

const CHALLENGE_COLUMNS: GlassTableColumn<(typeof CHALLENGES)[number]>[] = [
  {
    key: 'user',
    title: 'USER',
    flex: 1.5,
    render: row => (
      // 좁은 폭에서는 시간 칸을 따로 두지 않고 아이디 옆에 붙인다
      <UserBlock
        name={row.name}
        caption={`${row.id} · ${row.time}`}
        color={row.avatar}
        size={30}
      />
    ),
  },
  { key: 'method', title: 'METHOD', flex: 1.1, render: row => row.method },
  {
    key: 'status',
    title: 'STATUS',
    flex: 1.1,
    align: 'right',
    render: row => (
      <StatusPill label={row.status.label} tone={row.status.tone} />
    ),
  },
]

const DIRECTORY_COLUMNS: GlassTableColumn<(typeof DIRECTORY)[number]>[] = [
  {
    key: 'user',
    title: 'USER PROFILE',
    flex: 1.5,
    render: row => (
      <UserBlock
        name={row.name}
        caption={row.email}
        color={row.avatar}
        size={30}
      />
    ),
  },
  {
    key: 'method',
    title: '2FA METHOD',
    flex: 1.2,
    render: row => <LinkText>{row.method}</LinkText>,
  },
  {
    key: 'status',
    title: 'STATUS',
    flex: 1,
    align: 'right',
    render: row => (
      <StatusPill label={row.status.label} tone={row.status.tone} />
    ),
  },
]

const TONES: Tone[] = [
  'accent',
  'success',
  'info',
  'warning',
  'danger',
  'violet',
  'neutral',
]

// 묶음 이름 + 그 아래 요소들
export const GallerySection = ({
  label,
  children,
}: PropsWithChildren<{ label: string }>) => (
  <View style={styles.section}>
    <SectionLabel>{label}</SectionLabel>
    {children}
  </View>
)

// 두 칸씩 나눠 놓는 줄
const Pairs = ({ children }: PropsWithChildren) => (
  <View style={styles.pairs}>{children}</View>
)

// 사이드바: 브랜드 + 메뉴(MENU / SYSTEM) + 아래 프로필
export const SidebarSample = ({
  active,
  onSelect,
}: {
  active: string
  onSelect: (key: string) => void
}) => (
  <GlassPanel>
    <BrandBlock
      title="Codexr Glass"
      caption="ADMIN CENTER"
      logo={
        <FontAwesome6
          name="bolt"
          iconStyle="solid"
          size={15}
          color={TEXT.primary}
        />
      }
    />
    <View style={styles.navGroup}>
      <SectionLabel style={styles.navLabel}>MENU</SectionLabel>
      {NAV_MENU.map(item => (
        <NavItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          active={active === item.key}
          badge={item.badge ? { label: item.badge, tone: 'danger' } : undefined}
          onPress={() => onSelect(item.key)}
        />
      ))}
      <SectionLabel style={styles.navLabel}>SYSTEM</SectionLabel>
      {NAV_SYSTEM.map(item => (
        <NavItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          active={active === item.key}
          onPress={() => onSelect(item.key)}
        />
      ))}
    </View>
    <View style={styles.divider} />
    <UserBlock name="CodeXr" caption="Super Administrator" />
  </GlassPanel>
)

// 상단 바: 검색칸 + 기간 세그먼트 + 알림 + 기본 버튼
export const ToolbarSample = ({
  search,
  onSearch,
  range,
  onRange,
}: {
  search: string
  onSearch: (v: string) => void
  range: RangeKey
  onRange: (key: RangeKey) => void
}) => (
  <GlassToolbar>
    <SearchField
      style={styles.fullWidth}
      value={search}
      onChangeText={onSearch}
      placeholder="Search user, transaction ID, IP..."
    />
    <SegmentedControl
      style={styles.fullWidth}
      options={RANGES}
      value={range}
      onChange={onRange}
    />
    <GlassIconButton icon="bell" dot="success" onPress={() => {}} />
    <GlassButton
      size="sm"
      icon="plus"
      title="New 2FA Rule"
      onPress={() => {}}
    />
  </GlassToolbar>
)

// 통계 카드 네 장
export const StatsSample = () => (
  <View style={styles.grid}>
    {[STATS.slice(0, 2), STATS.slice(2, 4)].map((pair, i) => (
      <Pairs key={i}>
        {pair.map(stat => (
          <StatCard
            key={stat.title}
            style={styles.grow}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            tone={stat.tone}
            badge={{
              label: stat.badge,
              tone: 'success',
              icon: stat.badge.startsWith('-')
                ? 'arrow-trend-down'
                : 'arrow-trend-up',
            }}
            caption={stat.caption}
            // 누르는 동안 떠오른다 (영상 코드의 whileHover y:-5)
            onPress={() => {}}
          />
        ))}
      </Pairs>
    ))}
  </View>
)

// 영역 차트 카드: 제목 + 탭 + 빛나는 곡선
export const AreaChartSample = ({
  tab,
  onTab,
}: {
  tab: ChartTabKey
  onTab: (key: ChartTabKey) => void
}) => (
  <GlassPanel title="Performance & Velocity Analytics">
    <SegmentedControl options={CHART_TABS} value={tab} onChange={onTab} />
    <AreaChart
      series={CHART_SERIES[tab]}
      labels={REVENUE.labels}
      height={150}
    />
  </GlassPanel>
)

// 도넛 카드: 가운데 큰 값 + 아래 범례
export const DonutSample = () => (
  <GlassPanel title="Verification Distribution">
    <View style={styles.center}>
      <DonutChart
        segments={DONUT_SEGMENTS}
        centerValue="54%"
        centerLabel="SMS OTP"
      />
    </View>
    <ChartLegend items={DONUT_LEGEND} />
  </GlassPanel>
)

// 표 카드: 필터 알약 + 사용자·상태 표
export const TableSample = ({
  filter,
  onFilter,
  rows,
}: {
  filter: ChallengeFilter
  onFilter: (key: ChallengeFilter) => void
  rows: typeof CHALLENGES
}) => (
  <GlassPanel title="Recent Verification Challenges">
    <FilterChips options={FILTERS} value={filter} onChange={onFilter} />
    <GlassTable
      columns={CHALLENGE_COLUMNS}
      rows={rows}
      keyExtractor={row => row.id}
    />
  </GlassPanel>
)

// 실시간 로그: Live Feed 알약 + 체크 타일 줄
export const LogSample = () => (
  <GlassPanel
    title="Live Security Log"
    right={<StatusPill dot tone="success" label="Live Feed" />}
  >
    <View>
      {SECURITY_LOG.map(item => (
        <GlassRow
          key={item.title}
          style={styles.flushRow}
          icon="check"
          iconVariant="glass"
          tone={item.tone}
          title={item.title}
          subtitle={item.time}
        />
      ))}
    </View>
  </GlassPanel>
)

// 분석 화면: 아이콘 없는 통계 카드 + 두 줄 영역 차트 + 가로 범례 + 강조 수치 + 링크
export const AnalyticsSample = ({
  range,
  onRange,
}: {
  range: WaveRangeKey
  onRange: (key: WaveRangeKey) => void
}) => (
  <>
    <View style={styles.grid}>
      {[ANALYTICS_STATS.slice(0, 2), ANALYTICS_STATS.slice(2, 4)].map(
        (pair, i) => (
          <Pairs key={i}>
            {pair.map(stat => (
              <StatCard
                key={stat.title}
                style={styles.grow}
                title={stat.title}
                value={stat.value}
                badge={{ label: stat.badge, tone: stat.tone }}
                caption={stat.caption}
              />
            ))}
          </Pairs>
        ),
      )}
    </View>
    <GlassPanel
      title="Global Ingestion Velocity & Anomaly Waveform"
      subtitle="Real-time cryptographic token authorizations vs mitigated attack vectors"
    >
      <View style={styles.spread}>
        <StatusPill dot tone="success" label="Live Feed • 18.4k req/sec" />
        <SegmentedControl
          style={styles.waveRange}
          options={WAVE_RANGES}
          value={range}
          onChange={onRange}
        />
      </View>
      <AreaChart series={WAVE_SERIES} labels={WAVEFORM.labels} height={150} />
      <ChartLegend direction="row" items={WAVE_LEGEND} />
      <HighlightStat label="Global SLA Reliability:" value="99.99%" />
    </GlassPanel>
    <GlassPanel
      title="Global Edge Datacenter Latency"
      subtitle="Roundtrip network handshake per geographic PoP"
      right={<LinkText>Target {'<'} 50ms</LinkText>}
    />
  </>
)

// 입력 폼 카드 + 상태 타일 목록
export const FormSample = ({
  phone,
  onPhone,
}: {
  phone: string
  onPhone: (v: string) => void
}) => (
  <>
    <GlassPanel
      title="Live OTP Challenge Simulator"
      subtitle="Trigger instant mock OTP challenge token directly to verification gateway"
    >
      <GlassInput
        label="Target Mobile Number"
        value={phone}
        onChangeText={onPhone}
        keyboardType="phone-pad"
      />
      <GlassButton
        size="sm"
        title="Send Test OTP Token"
        onPress={() => {}}
        pressableStyle={styles.start}
      />
    </GlassPanel>
    <GlassPanel title="Telecom Provider Health">
      <View style={styles.tiles}>
        {PROVIDERS.map(provider => (
          <StatusTile
            key={provider.name}
            title={provider.name}
            subtitle={provider.latency}
            status={{ label: 'Optimal', tone: 'success' }}
          />
        ))}
      </View>
    </GlassPanel>
  </>
)

// 사용자 목록: 머리줄 버튼 + 링크 글자 표 + 작은 버튼
export const DirectorySample = () => (
  <GlassPanel
    title="Users & Credential Directory"
    subtitle="Total 5 active registered administrative and member accounts"
    right={
      <GlassButton size="sm" icon="plus" title="Invite" onPress={() => {}} />
    }
  >
    <GlassTable
      columns={DIRECTORY_COLUMNS}
      rows={DIRECTORY}
      keyExtractor={row => row.email}
    />
    <View style={styles.actions}>
      <Text style={styles.actionsLabel}>ACTIONS</Text>
      <GlassButton
        size="sm"
        variant="secondary"
        title="Reset 2FA"
        onPress={() => {}}
      />
      <GlassButton
        size="sm"
        variant="secondary"
        title="Logs"
        onPress={() => {}}
      />
    </View>
  </GlassPanel>
)

// 기본 요소: 버튼 변형, 알약(soft/plain), 아이콘 타일(tinted/glass), 아바타
export const ElementsSample = () => (
  <GlassPanel title="Elements">
    <View style={styles.wrap}>
      <GlassButton title="Primary" onPress={() => {}} />
      <GlassButton variant="secondary" title="Secondary" onPress={() => {}} />
      <GlassButton
        variant="danger"
        icon="trash-can"
        title="Danger"
        onPress={() => {}}
      />
    </View>
    <View style={styles.wrap}>
      <GlassButton size="sm" icon="plus" title="Small" onPress={() => {}} />
      <GlassButton
        size="sm"
        variant="secondary"
        title="Reset 2FA"
        onPress={() => {}}
      />
      <GlassButton
        size="sm"
        variant="danger"
        title="Delete"
        onPress={() => {}}
      />
    </View>
    <View style={styles.wrap}>
      {TONES.map(tone => (
        <StatusPill key={tone} tone={tone} label={tone} />
      ))}
    </View>
    <View style={styles.wrap}>
      {TONES.map(tone => (
        <StatusPill key={tone} variant="plain" dot tone={tone} label={tone} />
      ))}
    </View>
    <View style={styles.wrap}>
      {TONES.map(tone => (
        <IconTile key={tone} icon="bolt" tone={tone} />
      ))}
      {TONES.slice(0, 3).map(tone => (
        <IconTile
          key={`glass-${tone}`}
          icon="check"
          tone={tone}
          variant="glass"
        />
      ))}
    </View>
    <View style={styles.wrap}>
      <Avatar name="CodeXr" />
      <Avatar name="Alex Rivera" color="#38bdf8" />
      <Avatar name="Sarah Chen" color="#a78bfa" />
      <Avatar name="Marcus Vance" color="#f59e0b" />
      <Avatar name="Elena Rostova" color="#ef4444" />
      <Avatar name="David Kim" color="#22c55e" />
    </View>
  </GlassPanel>
)

// 코드 창
export const CodeSample = () => (
  <CodeBlock code={STATS_CARD_CODE} language="jsx" />
)

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  grid: {
    gap: 10,
  },
  pairs: {
    flexDirection: 'row',
    gap: 10,
  },
  grow: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  navGroup: {
    gap: 4,
  },
  navLabel: {
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: GLASS.divider,
  },
  center: {
    alignItems: 'center',
  },
  flushRow: {
    paddingHorizontal: 0,
  },
  // 폭이 좁으면 세그먼트가 다음 줄로 내려간다
  spread: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  waveRange: {
    width: 150,
  },
  start: {
    alignSelf: 'flex-start',
  },
  tiles: {
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionsLabel: {
    flex: 1,
    color: TEXT.faint,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 10.5,
    letterSpacing: 1,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
})
