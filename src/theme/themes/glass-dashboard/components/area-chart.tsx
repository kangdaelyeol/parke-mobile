import { memo, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import { TEXT } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'

export interface AreaSeries {
  data: number[]
  color: string
  // 점선 (영상의 두 번째 선)
  dashed?: boolean
}

interface AreaChartProps {
  // 같은 길이의 값 묶음. 첫 번째가 맨 앞에 그려진다
  series: AreaSeries[]
  // x축 이름 (값 개수와 같게)
  labels?: string[]
  height?: number
  // 값마다 점 (흰 속 + 선 색 테두리)
  dots?: boolean
}

// 위아래 여백 (점과 굵은 선이 잘리지 않도록)
const PAD_Y = 8
const PAD_X = 6

type Point = [number, number]

// 점들을 지나는 부드러운 곡선 (Catmull-Rom → 베지어)
const smoothPath = (points: Point[]) => {
  const [first] = points
  if (!first) return ''
  let d = `M${first[0]},${first[1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    if (!p1 || !p2) break
    const p0 = points[i - 1] ?? p1
    const p3 = points[i + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`
  }
  return d
}

// 영역 선 차트 (영상의 Performance & Velocity Analytics): 빛나는 곡선 + 아래로 옅어지는 채움
export const AreaChart = memo(
  ({ series, labels, height = 140, dots = true }: AreaChartProps) => {
    const [width, setWidth] = useState(0)

    // 크기나 값이 바뀔 때만 경로를 다시 계산한다
    const paths = useMemo(() => {
      const values = series.flatMap(s => s.data)
      // 크기를 아직 모르거나 값이 하나도 없으면 그리지 않는다
      if (width === 0 || values.length === 0) return []
      const max = Math.max(...values)
      const min = Math.min(0, ...values)
      const range = max - min || 1
      // 값이 없는 선은 건너뛴다
      return series.flatMap(s => {
        const step = (width - PAD_X * 2) / Math.max(1, s.data.length - 1)
        const points: Point[] = s.data.map((v, i) => [
          PAD_X + i * step,
          PAD_Y + (1 - (v - min) / range) * (height - PAD_Y * 2),
        ])
        const first = points[0]
        const last = points[points.length - 1]
        if (!first || !last) return []
        const line = smoothPath(points)
        const area = `${line} L${last[0]},${height} L${first[0]},${height} Z`
        return [{ ...s, line, area, points }]
      })
    }, [series, width, height])

    return (
      <View>
        <View
          style={{ height }}
          onLayout={e => setWidth(e.nativeEvent.layout.width)}
        >
          {width > 0 && (
            <Svg width={width} height={height}>
              <Defs>
                {paths.map((p, i) => (
                  <LinearGradient
                    key={i}
                    id={`area-fill-${i}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <Stop offset="0" stopColor={p.color} stopOpacity={0.35} />
                    <Stop offset="1" stopColor={p.color} stopOpacity={0} />
                  </LinearGradient>
                ))}
              </Defs>
              {/* 뒤 묶음부터 그려 첫 번째가 맨 앞에 오게 한다 */}
              {[...paths].reverse().map((p, ri) => {
                const i = paths.length - 1 - ri
                return (
                  <Path
                    key={`area-${i}`}
                    d={p.area}
                    fill={`url(#area-fill-${i})`}
                  />
                )
              })}
              {[...paths].reverse().map((p, ri) => (
                <Path
                  key={`line-${ri}`}
                  d={p.line}
                  stroke={p.color}
                  strokeWidth={2}
                  strokeDasharray={p.dashed ? '4 4' : undefined}
                  fill="none"
                />
              ))}
              {dots &&
                paths.map((p, i) =>
                  p.points.map(([x, y], j) => (
                    <Circle
                      key={`dot-${i}-${j}`}
                      cx={x}
                      cy={y}
                      r={3}
                      fill="#ffffff"
                      stroke={p.color}
                      strokeWidth={2}
                    />
                  )),
                )}
            </Svg>
          )}
        </View>
        {!!labels?.length && (
          <View style={styles.labels}>
            {labels.map((label, i) => (
              <Text key={`${label}-${i}`} style={styles.label}>
                {label}
              </Text>
            ))}
          </View>
        )}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  labels: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: TEXT.faint,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 10,
  },
})
