//
//  DriveActivityAttributes.swift
//  앱과 위젯(Live Activity)이 함께 쓰는 주행 정보. 두 타깃 모두에 포함된다.
//

import ActivityKit
import Foundation

struct DriveActivityAttributes: ActivityAttributes {
  // 주행 중 바뀌는 값 (앱이 몇 초마다 갱신)
  public struct ContentState: Codable, Hashable {
    var distanceMeters: Double
    var speedKmh: Double
    var averageSpeedKmh: Double
    var weakSignal: Bool
  }

  // 주행 동안 고정된 값
  var cardTitle: String
  var accentHex: String
  // 주행 시간은 이 시각부터 iOS가 스스로 센다
  var startDate: Date
}

// 잠금화면 [주행 종료] 요청. 버튼은 앱 프로세스에서 실행되고, JS가 이 값을 가져간다.
enum DriveEndRequest {
  static let key = "parke.driveEndRequested"

  static func request() {
    UserDefaults.standard.set(true, forKey: key)
  }

  static func consume() -> Bool {
    let requested = UserDefaults.standard.bool(forKey: key)
    if requested { UserDefaults.standard.set(false, forKey: key) }
    return requested
  }

  static func reset() {
    UserDefaults.standard.set(false, forKey: key)
  }
}
