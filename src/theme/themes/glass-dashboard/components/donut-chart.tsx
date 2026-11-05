import { memo, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'
import { GLASS, TEXT } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'

export interface DonutSegment {
  value: number
  color: string
  label?: string
}

interface DonutChartProps {
  segments: DonutSegment[]
  size?: number
  thickness?: number
  // 조각 사이 틈 (px)
  gap?: number
  // 가운데 큰 글자와 그 아래 작은 글자 (영상의 54% / SMS OTP)
  centerValue?: string
  centerLabel?: string
}

// 도넛 차트 (영상의 Verification Distribution). 조각 끝은 둥글게, 조각 사이는 조금 띄운다
export const DonutChart = memo(
  ({
    segments,
    size = 132,
    thickness = 12,
    gap = 4,
    centerValue,
    centerLabel,
  }: DonutChartProps) => {
    const radius = (size - thickness) / 2
    const center = size / 2
    const circumference = 2 * Math.PI * radius

    // 조각마다 [그릴 길이, 시작 위치, 끝 모양].
    // 둥근 끝은 조각 밖으로 두께 절반씩 나오므로 그만큼 줄이고,
    // 그만큼도 안 되는 작은 조각은 평평한 끝으로 비율대로 그린다
    const arcs = useMemo(() => {
      const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0)
      if (total === 0) return []
      let start = 0
      return segments.map(segment => {
        const length = (Math.max(0, segment.value) / total) * circumference
        const round = length > gap + thickness
        const inset = round ? (gap + thickness) / 2 : gap / 2
        const visible = Math.max(0, length - inset * 2)
        const arc = {
          color: segment.color,
          dash: `${visible} ${circumference}`,
          offset: -(start + inset),
          cap: round ? ('round' as const) : ('butt' as const),
          visible,
        }
        start += length
        return arc
      })
    }, [segments, circumference, gap, thickness])

    return (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={GLASS.fill}
            strokeWidth={thickness}
            fill="none"
          />
          {/* 12시 방향에서 시계 방향으로 */}
          <G rotation={-90} origin={`${center}, ${center}`}>
            {arcs.map((arc, i) =>
              arc.visible === 0 ? null : (
                <Circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={arc.color}
                  strokeWidth={thickness}
                  strokeDasharray={arc.dash}
                  strokeDashoffset={arc.offset}
                  strokeLinecap={arc.cap}
                  fill="none"
                />
              ),
            )}
          </G>
        </Svg>
        {(centerValue || centerLabel) && (
          <View style={styles.center} pointerEvents="none">
            {!!centerValue && <Text style={styles.value}>{centerValue}</Text>}
            {!!centerLabel && <Text style={styles.label}>{centerLabel}</Text>}
          </View>
        )}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 22,
  },
  label: {
    marginTop: 2,
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 11,
  },
})
