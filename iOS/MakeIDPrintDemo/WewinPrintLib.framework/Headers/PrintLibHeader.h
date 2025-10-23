//
//  PrintLibHeader.h
//  WewinPrintLib
//
//  Created by 刘良平 on 2019/4/9.
//  Copyright © 2019 WeWin. All rights reserved.
//

#ifndef PrintLibHeader_h
#define PrintLibHeader_h

#import "WewinMacro.h"

@class DeviceInfoModel;
@class FirmwareInfo;

/**
 所有跟打印相关的回调

 @param state state
 @param result 获取PrinterStatusKey
 */
typedef void(^PrintCallBack)(PrintState state, NSDictionary * _Nonnull result);

typedef void(^UpdateDeviceInfoCallBack)(DeviceInfoModel * _Nullable deviceInfo);

typedef void(^UpdatePrinterCallBack)(FwUpState state, NSDictionary * _Nonnull result);

typedef void(^CheckFirmwareCallBack)(FwUpState state, FirmwareInfo * _Nullable info, NSDictionary * _Nonnull description);

typedef void(^CheckUIDCallback)(NSString * _Nullable uid);

#endif /* PrintLibHeader_h */
