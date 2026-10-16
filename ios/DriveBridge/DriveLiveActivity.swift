//
//  DriveLiveActivity.swift
//  JS에서 주행 Live Activity(잠금화면 / 다이내믹 아일랜드)를 시작·갱신·종료하는 모듈.
//  iOS 16.2 미만이거나 사용자가 실시간 현황을 꺼 두었으면 아무것도 하지 않는다.
//

import ActivityKit
import Foundation

@objc(DriveLiveActivity)
class DriveLiveActivity: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool { false }

  @objc(start:accentHex:startAt:resolver:rejecter:)
  func start(
    _ cardTitle: String,
    accentHex: String,
    startAt: Double,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else { return resolve(false) }
    guard ActivityAuthorizationInfo().areActivitiesEnabled else { return resolve(false) }

    DriveEndRequest.reset()
    Task {
      // 이전 주행에서 남은 표시가 있으면 정리
      for activity in Activity<DriveActivityAttributes>.activities {
        await activity.end(nil, dismissalPolicy: .immediate)
      }
      let attributes = DriveActivityAttributes(
        cardTitle: cardTitle,
        accentHex: accentHex,
        startDate: Date(timeIntervalSince1970: startAt / 1000)
      )
      let state = DriveActivityAttributes.ContentState(
        distanceMeters: 0, speedKmh: 0, averageSpeedKmh: 0, weakSignal: false
      )
      do {
        _ = try Activity.request(
          attributes: attributes,
          content: ActivityContent(state: state, staleDate: nil),
          pushType: nil
        )
        resolve(true)
      } catch {
        reject("live_activity", error.localizedDescription, error)
      }
    }
  }

  @objc(update:speedKmh:averageSpeedKmh:weakSignal:)
  func update(_ distanceMeters: Double, speedKmh: Double, averageSpeedKmh: Double, weakSignal: Bool) {
    guard #available(iOS 16.2, *) else { return }
    let state = DriveActivityAttributes.ContentState(
      distanceMeters: distanceMeters,
      speedKmh: speedKmh,
      averageSpeedKmh: averageSpeedKmh,
      weakSignal: weakSignal
    )
    Task {
      for activity in Activity<DriveActivityAttributes>.activities {
        await activity.update(ActivityContent(state: state, staleDate: nil))
      }
    }
  }

  @objc
  func endActivity() {
    guard #available(iOS 16.2, *) else { return }
    Task {
      for activity in Activity<DriveActivityAttributes>.activities {
        await activity.end(nil, dismissalPolicy: .immediate)
      }
    }
  }

  // 잠금화면에서 [주행 종료]를 눌렀는지 (한 번 읽으면 지워진다)
  @objc(consumeEndRequest:rejecter:)
  func consumeEndRequest(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    resolve(DriveEndRequest.consume())
  }
}
