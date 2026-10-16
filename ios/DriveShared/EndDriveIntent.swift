//
//  EndDriveIntent.swift
//  잠금화면 / 다이내믹 아일랜드의 [주행 종료] 버튼 (iOS 17+).
//  LiveActivityIntent는 위젯이 아니라 앱 프로세스에서 실행된다.
//

import ActivityKit
import AppIntents
import Foundation

@available(iOS 17.0, *)
struct EndDriveIntent: LiveActivityIntent {
  static var title: LocalizedStringResource = "주행 종료"

  func perform() async throws -> some IntentResult {
    DriveEndRequest.request()
    // 잠금화면 표시는 바로 닫는다 (기록 종료와 요약은 JS가 처리)
    for activity in Activity<DriveActivityAttributes>.activities {
      await activity.end(nil, dismissalPolicy: .immediate)
    }
    return .result()
  }
}
