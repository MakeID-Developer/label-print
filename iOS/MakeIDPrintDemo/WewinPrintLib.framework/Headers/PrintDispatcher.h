//
//  PrintDispatcher.h
//  WewinPrintLib
//
//  Created by 欧海川 on 2017/12/20.
//  Copyright © 2017年 WeWin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PrintSettingModel.h"
#import "DeviceInfoModel.h"
#import "PrintLibHeader.h"
#import "BaseConnect.h"
#import "FirmwareInfo.h"
#import "PrintModel.h"

@interface PrintDispatcher : NSObject

///当前SDK版本号（Current SDK version number）
@property (nonatomic, copy) NSString * _Nonnull version;

///是否输出打印日志（Whether to output print logs）
@property (nonatomic, assign) BOOL log;

///是否连接打印机（Is a printer connected?）
@property (nonatomic, assign) BOOL isConnected;

///打印机信息，实时更新（Printer information, updated in real time）
@property (nonatomic, strong, readonly, nullable) DeviceInfoModel *deviceInfo;

///当前连接的设备（Currently connected devices）
@property (nonatomic, strong, nullable) BaseConnect *baseConnect;

///通信协议类型 默认为：ProtocolTypeOld（Communication protocol type Default is: ProtocolTypeOld）
@property (nonatomic, assign, readonly) ProtocolType protocolType;

/**
 *按照什么DPI生成的图片，各机型有所不同，具体点数请参考PrinterDPI（The DPI used to generate the image varies from model to model. For specific points, please refer to Printer DPI）
 *eg. 如标签实际宽度50mm，打印机纵向DPI为PrinterDPI_300，则 300/25.4≈11.81个点(1英寸=25.4mm)，
 *生成图片高度度= 11.81*50，最终宽度四舍五入取整591，则生成打印图片的画布宽度为591
 */
@property (nonatomic, assign, readonly) PrinterDPI imageDPI;

///默认打印参数设置（Default printing parameter settings）
@property (nonatomic, strong, nonnull) PrintSettingModel *defaultPrintSetting;

///多语言类型，默认跟随系统（Multi-language type, default follows the system）
@property (nonatomic, assign) WWLanguageType languageType;

/**
 *支持自定义多语言提示，但是所自定义多语言的key必须与原key一致
 *@example: 开发者需要替换 key: "WWPrintSuccessKey"，value:"打印成功" 的多语言，则需要传入的字典为 @{@"WWPrintSuccessKey": @"打印成功"}
 * 具体的Key请参看 Resource>WewinPrintLib.bundle中的key
 */
@property (nonatomic, strong, nullable) NSDictionary<NSString *, NSString *> *customLanguageKeyValue;

#pragma mark - Method


+ (instancetype _Nonnull )sharePrintDispatcher;

/**
 打印标签 RFID model请放在数组前面（Print label RFID model please put it in front of the array）
 */
- (void)printLabelsWithArray:(NSArray * _Nonnull)labelArray callBack:(PrintCallBack _Nonnull)block;

/**
 *ProtocolTypeNew替换当前打印数据数组中的某一个标签,用于多标签打印时，解决内存溢出问题(ProtocolTypeNew replaces a label in the current print data array to solve the memory overflow problem when printing multiple labels)
 *e.g. 打印10条， labelArray = @[@[label], @[label], @[label], @[], @[], @[], @[], @[], @[], @[],]
 *     然后在PrintStatePieceFinish回调中，添加 index = 3，4，5.....后续数据
 
 @param label 标签数组
 @param index index
 */
- (void)replaceLabel:(NSArray *_Nonnull)label atIndex:(NSInteger)index;

/**
 暂停，继续、取消打印任务(Pause, resume, cancel printing tasks)

 @param taskStatus 打印状态
 */
- (void)changePrintTaskStatus:(PrintTaskStatus)taskStatus;

/**
 打印机状态查询，不支持P1200(Printer status query, does not support P1200)

 @param block callBack
 */
- (void)checkPrinterStatus:(PrintCallBack _Nonnull)block;

/**
  查询打印机唯一识别码UID(Query the printer's unique identification code UID)
 */
- (void)checkPrinterUID:(PrintCallBack _Nonnull)block;

/**
 *握手api(Handshake API)
 *ProtocolTypeNew的机型读取打印机数据，请读取deviceInfo(To read printer data for a device with ProtocolTypeNew, read deviceInfo.)
 */
- (void)sendHandShakeWithCallBack:(PrintCallBack _Nonnull)block;

/**
 黑度设置，仅支持P1200，P30，P50。其他机型使用该方法无效，请使用darkNess参数设置(Blackness setting, only supports P1200, P30, P50. Other models use this method invalid, please use darkNess parameter setting)

 @param darkNess 0~20
 */
- (void)sendDarkNess:(int)darkNess callBack:(PrintCallBack _Nonnull)block;

/**
 切刀设置，仅支持P50。其他机型使用该方法无效，请使用cutOption参数设置(Cutter settings, only supports P50. Other models use this method is invalid, please use the cutOption parameter setting)

 @param cutOption 切刀设置类型
 */
- (void)sendCutOption:(CutOption)cutOption callBack:(PrintCallBack _Nonnull)block;

/**
 单独查询打印机DPI,支持P1200、P30、P50、P70、P70S，ProtocolTypeNew机型请查询deviceInfo
 */
- (void)checkPrinterDPIWithCallBack:(PrintCallBack _Nonnull)block;

/**
 查询打印机硬件版本号,软件版本号,序列号(Query the printer hardware version number, software version number, and serial number)
 */
- (void)checkFssVerWithCallBack:(CheckFirmwareCallBack _Nonnull)block;

/**
 下发更新固件数据(Send updated firmware data)

 @param data data
 */
- (void)upgradeWithBinData:(NSData *_Nonnull)data
                  fileName:(NSString *_Nonnull)fileName
                  callBack:(UpdatePrinterCallBack _Nonnull)block;

/**
 取消固件升级(Cancel firmware upgrade)
 */
- (void)cancelUpgrade:(UpdatePrinterCallBack _Nullable )block;

@end
