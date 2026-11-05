// 구성 요소 보기에 쓰는 예시 값. 영상(design/dashboard.mp4) 속 대시보드 내용을 그대로 옮겼다
import { Tone } from '@/theme/glass'
import { SolidIconName } from '@/components'

export const NAV_MENU: {
  key: string
  label: string
  icon: SolidIconName
  badge?: string
}[] = [
  { key: 'overview', label: 'Overview', icon: 'table-cells-large' },
  { key: 'analytics', label: 'Analytics', icon: 'chart-line', badge: 'Live' },
  { key: 'otp', label: 'OTP Station', icon: 'lock' },
  { key: 'users', label: 'Users & Auth', icon: 'users' },
  { key: 'transactions', label: 'Transactions', icon: 'credit-card' },
]

export const NAV_SYSTEM = [
  { key: 'security', label: 'Security & Keys', icon: 'gear' as SolidIconName },
]

export const RANGES = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: '1y', label: '1Y' },
] as const

export const STATS: {
  title: string
  value: string
  icon: SolidIconName
  tone: Tone
  badge: string
  caption: string
}[] = [
  {
    title: 'Total Processed',
    value: '$128,430.00',
    icon: 'dollar-sign',
    tone: 'info',
    badge: '+14.6%',
    caption: 'vs last month',
  },
  {
    title: 'Active Users',
    value: '42,890',
    icon: 'user',
    tone: 'violet',
    badge: '+8.2%',
    caption: 'new accounts',
  },
  {
    title: 'OTP Success Rate',
    value: '99.4%',
    icon: 'circle-check',
    tone: 'success',
    badge: '+0.6%',
    caption: '34,120 verified',
  },
  {
    title: 'Auth Velocity',
    value: '1.42s',
    icon: 'bolt',
    tone: 'warning',
    badge: '-0.3s',
    caption: 'avg delivery & verify',
  },
]

export const CHART_TABS = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'users', label: 'Users' },
  { key: 'verifications', label: 'Verifications' },
] as const

export const REVENUE = {
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
  ],
  data: [18, 27, 23, 39, 35, 49, 44, 60, 56, 78],
}

export const DISTRIBUTION = [
  { label: 'SMS OTP', value: 54, detail: '54% (18.4k)', tone: 'success' },
  { label: 'Biometric 2FA', value: 28, detail: '28% (9.5k)', tone: 'info' },
  {
    label: 'Authenticator App',
    value: 18,
    detail: '18% (6.2k)',
    tone: 'warning',
  },
] as const

export const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'success', label: 'Success' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
] as const

export type ChallengeFilter = (typeof FILTERS)[number]['key']

export const CHALLENGES: {
  id: string
  name: string
  avatar: string
  method: string
  status: { label: string; tone: Tone; filter: ChallengeFilter }
  time: string
}[] = [
  {
    id: 'TX-9021',
    name: 'Alex Rivera',
    avatar: '#38bdf8',
    method: 'SMS OTP (US)',
    status: { label: 'Verified', tone: 'success', filter: 'success' },
    time: '2 mins ago',
  },
  {
    id: 'TX-9020',
    name: 'Sarah Chen',
    avatar: '#a78bfa',
    method: 'Biometric 2FA',
    status: { label: 'Verified', tone: 'success', filter: 'success' },
    time: '8 mins ago',
  },
  {
    id: 'TX-9019',
    name: 'Marcus Vance',
    avatar: '#f59e0b',
    method: 'SMS OTP (UK)',
    status: { label: 'Challenged', tone: 'warning', filter: 'pending' },
    time: '14 mins ago',
  },
  {
    id: 'TX-9018',
    name: 'Elena Rostova',
    avatar: '#ef4444',
    method: 'Auth App (TOTP)',
    status: { label: 'Failed', tone: 'danger', filter: 'failed' },
    time: '22 mins ago',
  },
  {
    id: 'TX-9017',
    name: 'David Kim',
    avatar: '#22c55e',
    method: 'Email Magic Link',
    status: { label: 'Verified', tone: 'success', filter: 'success' },
    time: '35 mins ago',
  },
]

export const SECURITY_LOG: { title: string; time: string; tone: Tone }[] = [
  {
    title: 'OTP Auto-Verified for User @alex',
    time: 'Just now',
    tone: 'success',
  },
  {
    title: 'High-Value Payment Authorization',
    time: '4 mins ago',
    tone: 'success',
  },
  {
    title: 'New Session from Frankfurt (IP: 194.12.x.x)',
    time: '11 mins ago',
    tone: 'success',
  },
  {
    title: 'Failed 2FA Challenge flagged',
    time: '25 mins ago',
    tone: 'danger',
  },
]

export const ANALYTICS_STATS: {
  title: string
  value: string
  badge: string
  tone: Tone
  caption: string
}[] = [
  {
    title: 'Peak Auth TPS',
    value: '1,840 TPS',
    badge: '+22.4%',
    tone: 'success',
    caption: 'Max burst volume',
  },
  {
    title: 'Global Edge Latency',
    value: '28.4 ms',
    badge: '-4.2ms',
    tone: 'success',
    caption: '99.99% SLA target',
  },
  {
    title: 'Protocol Velocity',
    value: '99.92%',
    badge: 'Optimal',
    tone: 'success',
    caption: 'Under risk benchmark',
  },
  {
    title: 'Threat Interceptions',
    value: '14,820',
    badge: 'Shield Active',
    tone: 'danger',
    caption: '0 breaches detected',
  },
]

export const WAVE_RANGES = [
  { key: '24h', label: '24H' },
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
] as const

export const WAVEFORM = {
  labels: ['00:00', '06:00', '12:00', '18:00', '23:59'],
  authorizations: [22, 20, 34, 58, 66, 67, 56, 47, 37],
  attacks: [14, 15, 31, 46, 52, 59, 40, 34, 22],
}

export const PROVIDERS = [
  { name: 'Twilio SMS Gateway', latency: 'Latency: 42ms' },
  { name: 'AWS SNS Multi-Region', latency: 'Latency: 31ms' },
  { name: 'Infobip Global Direct', latency: 'Latency: 56ms' },
  { name: 'Apple WebAuthn Engine', latency: 'Latency: 18ms' },
]

export const DIRECTORY: {
  name: string
  email: string
  avatar?: string
  method: string
  status: { label: string; tone: Tone }
}[] = [
  {
    name: 'CodeXr',
    email: 'admin@codexr.dev',
    method: 'Hardware Token (FIDO2)',
    status: { label: 'Active', tone: 'success' },
  },
  {
    name: 'Alex Rivera',
    email: 'alex.r@enterprise.io',
    avatar: '#38bdf8',
    method: 'SMS OTP (+1 555-019)',
    status: { label: 'Active', tone: 'success' },
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.c@fintech.net',
    avatar: '#a78bfa',
    method: 'Biometric Passkey',
    status: { label: 'Active', tone: 'success' },
  },
  {
    name: 'Marcus Vance',
    email: 'm.vance@tecncorp.uk',
    avatar: '#f59e0b',
    method: 'Authenticator App',
    status: { label: 'Pending 2FA', tone: 'warning' },
  },
  {
    name: 'Elena Rostova',
    email: 'elena@globalsec.org',
    avatar: '#ef4444',
    method: 'SMS OTP (+44 791)',
    status: { label: 'Suspended', tone: 'danger' },
  },
]

export const STATS_CARD_CODE = `import { motion } from 'framer-motion';
import { ShoppingBag, Users, DollarSign, ArrowUpRight } from 'lucide-react';

const StatsCard = ({ title, value, change, icon: Icon, gradient }) => {
  return (
    <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">{title}</p>
          <h2 className="text-2xl font-bold text-white">{value}</h2>
          <p className="flex items-center gap-1 text-sm text-emerald-400">
            <ArrowUpRight size={16} /> {change}%
          </p>
        </div>`
