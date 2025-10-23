//
//  WwPrintUtils.h
//  PrintExtApi
//
//  Created by wewin on 2019/2/18.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WewinPrintLib/WewinPrintLib.h>
#import <WewinPrintExtApi/WwCommon.h>

@class WwLabel;

/**
 打印设置回调 (Print settings callback)
 
 @param result 打印设置结果 (Print setting result)
 */
typedef void(^IPrintSetCallback)(WwSetResult result);

/**
 打印结果回调 (Print result callback)
 
 @param result 打印结果 (Print result)
 */
typedef void(^IPrintLabelCallback)(WwPrintResult result);

/**
 单张打印成功时回调 （批量打印中，每打印成功一张 都会返回一次） (Callback when single label prints successfully - returns for each successful print in batch printing)

 @param result  result 单张打印结果 及其第几张  NSDictionary *dic = @{@"index":indexStr}; (Single print result and its index NSDictionary *dic = @{@"index":indexStr})
 */
typedef void(^IPrintPieceLabelCallback)(id _Nonnull result);

/**
 蓝牙操作回调 (Bluetooth operation callback)

 @param state 蓝牙操作状态 (Bluetooth operation state)
 @param result 蓝牙返回结果---(返回类型详见具体使用方法) (Bluetooth return result - see specific usage for return types)
 */
typedef void(^IPrintBleCallBack)(BaseState state, id _Nullable result);

/**
 获取设备信息回调 (Get device information callback)
 @param deviceInfo 设备信息 (Device information)
 @param desc 描述，当deviceInfo为空时，desc会说明原因 (Description - when deviceInfo is empty, desc explains why)
 */
typedef void(^IPrintDeviceInfoCallback)(DeviceInfoModel * _Nullable deviceInfo, NSString * _Nonnull sn, NSString * _Nonnull uid, NSString * _Nullable desc);

#pragma mark - Print util class
@interface WwPrintUtils : NSObject

///连接模式  目前设置无作用  改为自动连接模式 (Connection mode - currently no effect, changed to automatic connection mode)
@property (nonatomic, assign) ConnectModel connectModel;

///判断当前蓝牙是否已连接
@property (nonatomic, assign) BOOL isConnected;

///允许打印的打印机SN，与notAllowSNArray不可同时设置，同时设置均不生效 (Allowed printer SNs - cannot be set with notAllowSNArray simultaneously)
@property (nonatomic, strong, nullable) NSArray * allowSNArray;

///提示语言 (Prompt language)
@property (nonatomic, assign) WWLanguageType languageType;

///主题颜色，默认是 0x1606FC (Theme color - default is 0x1606FC)
@property (nonatomic, strong) UIColor * _Nullable themeColor;

///是否启用自动重连断开蓝牙连接（默认NO） (Enable auto-reconnect for Bluetooth disconnection - default NO)
@property (nonatomic, assign) BOOL ifAutoReConnect;

///是否使用报错提示UI （默认YES ，设置NO后将关闭SDK内部的报错提示框） (Use error prompt UI - default YES, NO disables SDK's error alerts)
@property (nonatomic, assign) BOOL ifAutoHint;

///是否使用HUD （默认YES，设置NO后将关闭SDK内部的HUD） (Use HUD - default YES, NO disables SDK's HUD)
@property (nonatomic, assign) BOOL ifAutoHUD;

///预览图是否采用出纸方向 (默认NO) (Preview follows paper direction - default NO)
@property (nonatomic, assign) BOOL previewFollowPaperDirection;

///是否开启调试模式 (默认为NO, 调试模式 会在预览图给 给各个模块加上背景色,以区分区域,打印无影响) (Enable debug mode - default NO, adds background colors in preview)
@property (nonatomic, assign) BOOL ifDebug;

///是否开启预览中的份数模式 默认NO (Enable copy count mode in preview - default NO)
@property (nonatomic, assign) BOOL ifShowPrintCountEdit;

///单张打印成功时回调  设置后将会收到单张打印后的结果回调 (Single print success callback - receives result after each print)
@property (nonatomic, assign) IPrintPieceLabelCallback _Nonnull iPrintPieceLabelCallback;

///XML报文 (XML message)
@property (nonatomic, copy) NSString * _Nullable popMessage;

#pragma mark - Method
/**
 * 初始化 (Initialization)
 */
+ (instancetype _Nonnull )getInstance;


/**
 返回蓝牙列表 (Return Bluetooth list)
 
 @param bleCallBack 返回参数1 state 搜索状态  返回参数2 result  NSArray 蓝牙列表 (Return param1: search state, param2: NSArray Bluetooth list)
 */
- (void)searchDevice:(IPrintBleCallBack _Nonnull )bleCallBack;

/**
 * 断开连接 (Disconnect)
 */
- (void)closeConnection;

/**
 * 异步打印操作 (Asynchronous print operation)
 *
 * @param array  标签数组(Label对象的NSArray) (Label array - NSArray of Label objects)
 * @param iPrintLabelCallback 打印结果回调 (Print result callback)
 */
- (void)asyncPrint:(NSArray *_Nonnull)array IPrintLabelCallback:(IPrintLabelCallback _Nullable )iPrintLabelCallback;

/**
 * 预览打印(异步) (Preview print - asynchronous)
 *
 * @param array              标签数组(Label对象NSArray) (Label array - NSArray of Label objects)
 * @param iPrintLabelCallback 回调接口对象 (Callback interface object)
 */
- (void)previewPrint:(NSArray *_Nonnull)array IPrintLabelCallback:(IPrintLabelCallback _Nullable )iPrintLabelCallback;

/**
 * 根据传入的Label获得预览图片 (Get preview images from input Labels)
 */
- (void)previewImagesWithLabelList:(NSArray *_Nonnull)array callback:(void (^_Nonnull) ( NSArray <UIImage *> *_Nullable images))callback;

/**
 获取设备信息 (Get device information)
 */
- (void)getDeviceInfoCallback:(IPrintDeviceInfoCallback _Nonnull )iPrintDeviceInfoCallback;

/**
 限制渠道连接，限制仅传入的这些渠道的打印机可连接，注意需要在调用连接方法前设置
 @param channels 要连接的渠道，渠道编号在打印机序号上查看，序号V后面的即为渠道号，例如序号为P51A250001V02，则渠道号为02
 */
- (void)limitConnectByChannels:(NSArray <NSString *>*_Nullable)channels;

/**
 连接蓝牙 (Connect Bluetooth)
 
 @param deviceName 蓝牙设备名称 (Bluetooth device name)
 @param bleCallBack  返回参数1 state 连接状态  返回参数2 result 都是nil (Return param1: connection state, param2: nil)
 */
- (void)connectDevice:(NSString *_Nullable)deviceName CallBack:(IPrintBleCallBack _Nonnull )bleCallBack;

/**
 * 获取API版本号 (Get API version)
 */
- (NSString *_Nonnull)getVersion;

@end
