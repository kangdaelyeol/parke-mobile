//
//  DriveLiveActivity.m
//  DriveLiveActivity.swift를 React Native에 노출한다.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DriveLiveActivity, NSObject)

RCT_EXTERN_METHOD(start:(NSString *)cardTitle
                  accentHex:(NSString *)accentHex
                  startAt:(double)startAt
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(update:(double)distanceMeters
                  speedKmh:(double)speedKmh
                  averageSpeedKmh:(double)averageSpeedKmh
                  weakSignal:(BOOL)weakSignal)

RCT_EXTERN_METHOD(endActivity)

RCT_EXTERN_METHOD(consumeEndRequest:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
