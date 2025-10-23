//
//  WwBleConnect.h
//  WewinPrintLib
//
//  Created by 欧海川 on 17/12/18.
//  Copyright (c) 2017年 wewin. All rights reserved.
//

#import <WewinPrintLib/BaseConnect.h>

@class CBPeripheral;

@interface WwBleConnect : BaseConnect

@property (nonatomic, strong, nullable) NSArray <NSString *> *extraDeviceArray;

+ (instancetype _Nonnull )shareWwBleConnect;

/**
 * global_queue线程实例化方法（global_queue thread instantiation method）
 */
+ (instancetype _Nonnull)shareGlobalQueueWwBleConnect;

/**
 监听蓝牙状态（Monitor Bluetooth status）

 @param block callback
 */
- (void)observeCentralManagerState:(BaseCallBack _Nonnull )block;

/**
 搜索蓝牙（Search Bluetooth）
 */
- (void)search;

/**
 *蓝牙根据identifier重连设备（Bluetooth reconnects to the device based on the identifier）
 @param identifier identifier
 */
- (void)retrieveConnect:(NSString *_Nonnull)identifier;

@end
