//
//  ConnectResponse.h
//  WewinPrintLib
//
//  Created by 刘良平 on 2019/11/20.
//  Copyright © 2019 WeWin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WewinMacro.h"
@class CBPeripheral;

NS_ASSUME_NONNULL_BEGIN

@interface WwDevice : NSObject
///当前连接名称
@property (nonatomic, copy, nullable) NSString *connectName;
///蓝牙连接-identifier
@property (nonatomic, copy, nullable) NSString *identifier;
///蓝牙连接-外设
@property (nonatomic, strong, nullable) CBPeripheral *peripheral;

//---------一下属性为局域网打印机的属性----------------
///版本号
@property (nonatomic, copy) NSString *version;
///设备名称
@property (nonatomic, copy) NSString *sn;
///mac地址
@property (nonatomic, copy) NSString *macAddress;
///机型
@property (nonatomic, copy) NSString *model;
///IP地址
@property (nonatomic, copy) NSString *IP;
///端口
@property (nonatomic, assign) NSInteger port;
///dpi
@property (nonatomic, assign) PrinterDPI dpi;

@end

@interface ConnectResponse : NSObject
///搜索设备列表
@property (nonatomic, strong, nullable) NSArray <WwDevice *> *searchDeviceList;
///当前连接的设备
@property (nonatomic, strong) WwDevice *device;
///错误或提示性描述
@property (nonatomic, copy, nonnull) NSString *desc;

@end

NS_ASSUME_NONNULL_END
