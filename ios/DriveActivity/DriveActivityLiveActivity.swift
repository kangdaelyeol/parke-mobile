//
//  DriveActivityLiveActivity.swift
//  주행 중 잠금화면 / 다이내믹 아일랜드 표시
//

import ActivityKit
import AppIntents
import SwiftUI
import WidgetKit

struct DriveActivityLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: DriveActivityAttributes.self) { context in
      DriveLockScreenView(context: context)
        .activityBackgroundTint(Color.black.opacity(0.85))
        .activitySystemActionForegroundColor(.white)
    } dynamicIsland: { context in
      let accent = Color(hex: context.attributes.accentHex)
      return DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          DriveStatView(value: kmText(context.state.distanceMeters), unit: "km", label: "이동 거리")
        }
        DynamicIslandExpandedRegion(.trailing) {
          VStack(alignment: .trailing, spacing: 2) {
            ElapsedText(startDate: context.attributes.startDate)
              .font(.title3.monospacedDigit().bold())
              .multilineTextAlignment(.trailing)
            Text("주행 시간").font(.caption2).foregroundStyle(.gray)
          }
        }
        DynamicIslandExpandedRegion(.bottom) {
          HStack {
            Text("현재 \(Int(context.state.speedKmh)) km/h · 평균 \(Int(context.state.averageSpeedKmh)) km/h")
              .font(.caption)
              .foregroundStyle(.gray)
            Spacer()
            EndDriveButton()
          }
        }
      } compactLeading: {
        Image(systemName: "car.fill").foregroundStyle(accent)
      } compactTrailing: {
        Text("\(kmText(context.state.distanceMeters))km")
          .font(.caption.monospacedDigit().bold())
      } minimal: {
        Image(systemName: "car.fill").foregroundStyle(accent)
      }
      .keylineTint(accent)
    }
  }
}

// 잠금화면 카드
struct DriveLockScreenView: View {
  let context: ActivityViewContext<DriveActivityAttributes>

  var body: some View {
    let accent = Color(hex: context.attributes.accentHex)

    VStack(alignment: .leading, spacing: 12) {
      HStack(spacing: 6) {
        Circle().fill(accent).frame(width: 8, height: 8)
        Text("주행 중").font(.caption.bold()).foregroundStyle(accent)
        Text(context.attributes.cardTitle)
          .font(.subheadline.bold())
          .foregroundStyle(.white)
          .lineLimit(1)
        Spacer()
        if context.state.weakSignal {
          Text("GPS 신호 약함").font(.caption2.bold()).foregroundStyle(.yellow)
        }
      }

      HStack(alignment: .top) {
        DriveStatView(value: kmText(context.state.distanceMeters), unit: "km", label: "이동 거리")
        Spacer()
        VStack(alignment: .leading, spacing: 2) {
          ElapsedText(startDate: context.attributes.startDate)
            .font(.title2.monospacedDigit().bold())
            .foregroundStyle(.white)
          Text("주행 시간").font(.caption2).foregroundStyle(.gray)
        }
        .frame(width: 110, alignment: .leading)
        Spacer()
        DriveStatView(value: "\(Int(context.state.speedKmh))", unit: "km/h", label: "현재 속도")
      }

      HStack {
        (Text(context.attributes.startDate, style: .time)
          + Text(" 출발 · 평균 \(Int(context.state.averageSpeedKmh)) km/h"))
          .font(.caption)
          .foregroundStyle(.gray)
        Spacer()
        EndDriveButton()
      }
    }
    .padding(16)
  }
}

struct DriveStatView: View {
  let value: String
  let unit: String
  let label: String

  var body: some View {
    VStack(alignment: .leading, spacing: 2) {
      HStack(alignment: .firstTextBaseline, spacing: 2) {
        Text(value).font(.title2.monospacedDigit().bold()).foregroundStyle(.white)
        Text(unit).font(.caption.bold()).foregroundStyle(.gray)
      }
      Text(label).font(.caption2).foregroundStyle(.gray)
    }
  }
}

// iOS가 1초마다 스스로 올려 주는 경과 시간 (앱이 갱신하지 않아도 된다)
struct ElapsedText: View {
  let startDate: Date

  var body: some View {
    Text(timerInterval: startDate...Date.distantFuture, countsDown: false)
  }
}

// [주행 종료] 버튼은 iOS 17부터 (16.x는 표시만)
struct EndDriveButton: View {
  var body: some View {
    if #available(iOS 17.0, *) {
      Button(intent: EndDriveIntent()) {
        Text("주행 종료").font(.caption.bold())
      }
      .tint(.red)
    }
  }
}

func kmText(_ meters: Double) -> String {
  String(format: meters < 10000 ? "%.2f" : "%.1f", meters / 1000)
}

extension Color {
  // "#RRGGBB" → Color (형식이 맞지 않으면 앱 기본 파랑)
  init(hex: String) {
    let cleaned = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
    var value: UInt64 = 0
    guard cleaned.count == 6, Scanner(string: cleaned).scanHexInt64(&value) else {
      self = Color(red: 0x38 / 255, green: 0x3B / 255, blue: 0xF9 / 255)
      return
    }
    self = Color(
      red: Double((value >> 16) & 0xFF) / 255,
      green: Double((value >> 8) & 0xFF) / 255,
      blue: Double(value & 0xFF) / 255
    )
  }
}
