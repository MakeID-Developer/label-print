//
//  WwWifiConnect.h
//  WewinPrintLib
//
//  Created by 欧海川 on 2017/12/25.
//  Copyright © 2017年 WeWin. All rights reserved.
//

#import "BaseConnect.h"

extern NSString * _Nonnull const wwIP;
extern NSString * _Nonnull const ESPIP;
extern int const wwPORT;
extern NSTimeInterval const wwTimeOut;

@interface WwWifiConnect : BaseConnect

+ (instancetype _Nonnull )shareWwWifiConnect;

/**
 搜索连接WiFi名字

 @param block 搜索成功，data包含一个字符串data（名字）
 */
- (void)searchWIFI:(BaseCallBack _Nonnull)block;

/// 搜索局域网内的打印机设备
/// @param timeout 搜索超时时间
/// @param callback 搜索回调
- (void)searchLANDevicesForTimeout:(NSInteger)timeout
                          callback:(BaseCallBack _Nonnull)callback;

/// 连接局域网打印机设备
/// @param deviceName 设备名称
/// @param host IP地址
/// @param port 端口
- (void)connectDeviceWithName:(NSString *_Nonnull)deviceName
                         host:(NSString *_Nonnull)host
                         port:(NSInteger)port;

@end
