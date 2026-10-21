// 운행 기록 보고서 이메일 (샘플 형식).
// 이메일 클라이언트 호환을 위해 표 레이아웃 + 인라인 스타일만 쓴다.

export interface LatLng {
  lat: number
  lng: number
}

export interface DriveReportInput {
  email: string
  cardTitle: string
  driverName: string
  startAt: number // ms
  endAt: number // ms
  distanceMeters: number
  averageSpeedKmh: number
  maxSpeedKmh: number
  startPoint: LatLng | null
  endPoint: LatLng | null
  // 요약 화면 카카오 지도 캡처 (JPEG base64)
  mapImage: string | null
}

export const ROUTE_MAP_CID = 'route-map'

const TIME_ZONE = 'Asia/Seoul'

const escapeHtml = (v: string) =>
  v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const formatDate = (ms: number) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(ms)

const formatTime = (ms: number) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(ms)

const formatDuration = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return h > 0 ? `${h}시간 ${m}분 ${s}초` : `${m}분 ${s}초`
}

const formatKm = (meters: number) => (meters / 1000).toFixed(2)

// 좌표를 누르면 카카오맵에서 열리는 링크
const kakaoMapLink = (label: string, p: LatLng) =>
  `https://map.kakao.com/link/map/${encodeURIComponent(label)},${p.lat},${p.lng}`

const pointCell = (label: string, p: LatLng | null) =>
  p
    ? `<a href="${kakaoMapLink(label, p)}" style="color:#383bf9;text-decoration:none;">${p.lat.toFixed(5)}, ${p.lng.toFixed(5)} ↗</a>`
    : '-'

export const buildDriveReport = (input: DriveReportInput) => {
  const title = escapeHtml(input.cardTitle)
  const driver = escapeHtml(input.driverName)
  const date = formatDate(input.startAt)
  const duration = formatDuration(input.endAt - input.startAt)

  const subject = `[Parké] 운행 기록 보고서 · ${input.cardTitle} · ${date}`

  const stat = (label: string, value: string, unit: string) => `
    <td width="50%" style="padding:14px 16px;background:#f5f6fa;border-radius:12px;">
      <div style="font-size:12px;color:#8a8f98;">${label}</div>
      <div style="font-size:22px;font-weight:700;color:#111;margin-top:4px;">
        ${value}<span style="font-size:13px;font-weight:600;color:#8a8f98;margin-left:3px;">${unit}</span>
      </div>
    </td>`

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;font-size:13px;color:#8a8f98;width:110px;border-bottom:1px solid #eef0f4;">${label}</td>
      <td style="padding:10px 0;font-size:14px;color:#111;border-bottom:1px solid #eef0f4;">${value}</td>
    </tr>`

  const mapSection = input.mapImage
    ? `
    <tr><td style="padding:24px 28px 0;">
      <div style="font-size:14px;font-weight:700;color:#111;margin-bottom:10px;">이동 경로</div>
      <img src="cid:${ROUTE_MAP_CID}" alt="이동 경로 지도" width="544"
        style="display:block;width:100%;max-width:544px;border-radius:12px;border:1px solid #eef0f4;" />
    </td></tr>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#eef0f4;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f4;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">

  <tr><td style="padding:28px 28px 20px;background:#0f0f14;">
    <div style="font-size:12px;letter-spacing:2px;color:#8a8cff;font-weight:700;">PARKÉ</div>
    <div style="font-size:22px;font-weight:700;color:#ffffff;margin-top:6px;">운행 기록 보고서</div>
    <div style="font-size:13px;color:#9a9aa5;margin-top:6px;">${title} · ${date}</div>
  </td></tr>

  <tr><td style="padding:24px 28px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="8" style="border-collapse:separate;">
      <tr>${stat('주행 거리', formatKm(input.distanceMeters), 'km')}${stat('주행 시간', duration, '')}</tr>
      <tr>${stat('평균 속도', String(Math.round(input.averageSpeedKmh)), 'km/h')}${stat('최고 속도', String(Math.round(input.maxSpeedKmh)), 'km/h')}</tr>
    </table>
  </td></tr>
  ${mapSection}
  <tr><td style="padding:24px 28px 0;">
    <div style="font-size:14px;font-weight:700;color:#111;margin-bottom:4px;">운행 정보</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('차량', title)}
      ${row('운전자', driver)}
      ${row('운행일', date)}
      ${row('출발 시각', formatTime(input.startAt))}
      ${row('도착 시각', formatTime(input.endAt))}
      ${row('출발 위치', pointCell('출발', input.startPoint))}
      ${row('도착 위치', pointCell('도착', input.endPoint))}
    </table>
  </td></tr>

  <tr><td style="padding:24px 28px 28px;">
    <div style="font-size:12px;line-height:1.6;color:#8a8f98;background:#f5f6fa;border-radius:10px;padding:12px 14px;">
      본 보고서는 Parké 앱이 GPS로 측정한 값으로 자동 작성되었습니다.
      GPS 특성상 건물, 터널, 지하 구간 등에서 실제 주행 거리와 차이가 있을 수 있습니다.
    </div>
  </td></tr>

  <tr><td style="padding:16px 28px;background:#f5f6fa;font-size:11px;color:#a0a4ad;">
    © Originals · 이 메일은 앱에서 요청한 주소로만 발송되었습니다.
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  const text = [
    `Parké 운행 기록 보고서`,
    ``,
    `차량: ${input.cardTitle}`,
    `운전자: ${input.driverName}`,
    `운행일: ${date}`,
    `출발 ~ 도착: ${formatTime(input.startAt)} ~ ${formatTime(input.endAt)}`,
    `주행 거리: ${formatKm(input.distanceMeters)} km`,
    `주행 시간: ${duration}`,
    `평균 / 최고 속도: ${Math.round(input.averageSpeedKmh)} / ${Math.round(input.maxSpeedKmh)} km/h`,
    ``,
    `GPS로 측정한 값으로, 실제 주행 거리와 차이가 있을 수 있습니다.`,
  ].join('\n')

  return { subject, html, text }
}
