//
//  BaseConnect.h
//  WewinPrintLib
//
//  Created by 欧海川 on 2017/12/26.
//  Copyright © 2017年 WeWin. All rights reserved.
//

#import <WewinPrintLib/BaseConnect.h>
#import <WewinPrintLib/WewinMacro.h>
#import <WewinPrintLib/ConnectResponse.h>
#import <WewinPrintLib/DeviceBasicInfo.h>

///心跳时间
extern NSTimeInterval const kHeartbeatTime;
extern int const kHeartTag;

#define OverTime 5    //单次发送超时时间

typedef void (^BaseCallBack)(BaseHandle handle, BaseState state, ConnectResponse * _Nullable response);
typedef void (^RevCallBack) (BaseHandle handle, BaseState state, NSData * _Nonnull recvData);
typedef void (^StopHeartbeatCallback)(void);

@interface BaseConnect : NSObject
///已连接设备名称-序列号（Connected device name-serial number）
@property (nonatomic, copy, nullable) NSString *connectedName;

///已连接蓝牙的identifier（Connected Bluetooth identifier）
@property (nonatomic, copy, nullable) NSString *connectedIdentifier;

///打印机型号（Printer model）
@property (nonatomic, copy, nullable) NSString *printerModel;

///连接类型（Connection Type）
@property (nonatomic, assign) ConnectModel connectModel;

///设备基础信息（Basic device information）
@property (nonatomic, strong, nullable) DeviceBasicInfo *basicInfo;

///手动设置语言（Manually set the language）
@property (nonatomic, assign) WWLanguageType languageType;

/**
 *支持自定义多语言提示，但是所自定义多语言的key必须与原key一致
 *@example: 开发者需要替换 key: "WWPrintSuccessKey"，value:"打印成功" 的多语言，则需要传入的字典为 @{@"WWPrintSuccessKey": @"打印成功"}
 * 具体的Key请参看 Resource>WewinPrintLib.bundle中的key
 */
@property (nonatomic, strong, nullable) NSDictionary<NSString *, NSString *> *customLanguageKeyValue;

///连接回调（Connection callback）
@property (nonatomic, copy) BaseCallBack _Nullable baseCallBack;


///接收打印数据通道，外部无需调用（Receive print data channel, no external call required）
@property (nonatomic, copy) RevCallBack _Nullable revCallBack;
///心跳停止后的回调，外部无需调用（Callback after the heartbeat stops, no external call is required）
@property (nonatomic, copy) StopHeartbeatCallback _Nullable stopHeartbeatCallback;
///已接收到心跳数据，记录每一次收发，外部无需调用（Heartbeat data has been received, recording each transmission and reception, no external call is required）
@property (nonatomic, assign) BOOL receivedHeartbeat;

/**
 连接设备（Connecting devices）

 @param deviceName 设备名称（Device Name）
 */
- (void)connect:(NSString *_Nonnull)deviceName;

/**
 断开连接（Disconnect）
 */
- (void)dispose;

/**
 写入数据，外部无需调用（Write data, no external call required）

 @param data data
 */
- (void)writeData:(NSData *_Nonnull)data;

/**
 WIFI读取数据，BLE无效，外部无需调用（WIFI reads data, BLE is invalid, no external call is required）
 */
- (void)readData;

/**
 开启发送心跳，外部无需调用（Enable sending heartbeats, no external calls are required）
 */
- (void)startSendHeartbeat;

/**
 停止发送心跳，外部无需调用（Stop sending heartbeats, no external calls are required）
 */
- (void)stopSendHeartbeat:(StopHeartbeatCallback _Nonnull)callback;

@end
