//
//  WewinMacro.h
//  WewinPrintLib
//
//  Created by 刘良平 on 2018/10/30.
//  Copyright © 2018 WeWin. All rights reserved.
//

#ifndef WewinMacro_h
#define WewinMacro_h

#import "WewinConstants.h"

///机型匹配
#define MATCH_DEVICE(deviceName, prefix) (([deviceName hasPrefix:prefix]) ? YES : NO)

///以下设备为旧协议begin
#define DEVICENAME_P1200(deviceName) MATCH_DEVICE(deviceName, @"P1200")
#define DEVICENAME_P30(deviceName)   MATCH_DEVICE(deviceName, @"P30")
#define DEVICENAME_P50(deviceName)   MATCH_DEVICE(deviceName, @"P50")
#define DEVICENAME_P70(deviceName)   (MATCH_DEVICE(deviceName, @"P70") && !MATCH_DEVICE(deviceName, @"P70S"))
#define DEVICENAME_P70S(deviceName)  MATCH_DEVICE(deviceName, @"P70S")
///end

///以下设备为新协议
#define DEVICENAME_P51(deviceName)   MATCH_DEVICE(deviceName, @"P51") || MATCH_DEVICE(deviceName, @"GP52")
#define DEVICENAME_C18(deviceName)   MATCH_DEVICE(deviceName, @"C18")
#define DEVICENAME_CS18(deviceName)  MATCH_DEVICE(deviceName, @"CS18")
#define DEVICENAME_SYD(deviceName)   MATCH_DEVICE(deviceName, @"TP60") || MATCH_DEVICE(deviceName, @"DS60") ||\
                                     MATCH_DEVICE(deviceName, @"ML60")

#define DEVICENAME_WD(deviceName)    MATCH_DEVICE(deviceName, @"HS50") || MATCH_DEVICE(deviceName, @"DS50") ||\
                                     MATCH_DEVICE(deviceName, @"WD")   || MATCH_DEVICE(deviceName, @"DS51") ||\
                                     MATCH_DEVICE(deviceName, @"WB51")

#define DEVICENAME_CP50(deviceName)  MATCH_DEVICE(deviceName, @"CP50")
#define DEVICENAME_P31(deviceName)   MATCH_DEVICE(deviceName, @"P31") || MATCH_DEVICE(deviceName, @"GP31")
#define DEVICENAME_P20(deviceName)   MATCH_DEVICE(deviceName, @"P20")
#define DEVICENAME_M1(deviceName)    MATCH_DEVICE(deviceName, @"M1")
#define DEVICENAME_S1(deviceName)    MATCH_DEVICE(deviceName, @"S1") || MATCH_DEVICE(deviceName, @"CSMAX_S1")
#define DEVICENAME_D50(deviceName)   MATCH_DEVICE(deviceName, @"D50")
#define DEVICENAME_L1(deviceName)    MATCH_DEVICE(deviceName, @"L1")
#define DEVICENAME_I70(deviceName)   MATCH_DEVICE(deviceName, @"I70")
#define DEVICENAME_D70(deviceName)   MATCH_DEVICE(deviceName, @"D70")
#define DEVICENAME_Q52(deviceName)   MATCH_DEVICE(deviceName, @"Q52")
#define DEVICENAME_Q31(deviceName)   MATCH_DEVICE(deviceName, @"Q31")

#define DEF_IS_WEWIN_PRINTER(name) (DEVICENAME_P30(name) || DEVICENAME_P1200(name) || DEVICENAME_P50(name)  ||\
                                    DEVICENAME_P70(name) || DEVICENAME_P70S(name)  || DEVICENAME_CS18(name) ||\
                                    DEVICENAME_C18(name) || DEVICENAME_SYD(name)   || DEVICENAME_P51(name)  ||\
                                    DEVICENAME_WD(name)  || DEVICENAME_CP50(name)  || DEVICENAME_P31(name)  ||\
                                    DEVICENAME_P20(name) || DEVICENAME_S1(name)    || DEVICENAME_M1(name)   ||\
                                    DEVICENAME_D50(name) || DEVICENAME_L1(name)    || DEVICENAME_I70(name)  ||\
                                    DEVICENAME_D70(name) || DEVICENAME_Q52(name)   || DEVICENAME_Q31(name))

#define DEF_PRINTER_STATUS(status) @{PrinterStatusKey: status}

typedef NS_ENUM(NSInteger, DeviceDPI) {
    ///CS18         1毫米7个点
    DeviceDPI178_300 = 0,
    ///C18          1毫米7个点
    DeviceDPI178_178 = 1,
    ///常规          1毫米8个点
    DeviceDPI203_203 = 2,
    ///P50          1毫米8个点
    DeviceDPI300_203 = 3,
    ///P70、P51     1毫米12个点
    DeviceDPI300_300 = 4,
    ///SYD          1毫米8个点
    DeviceDPI203_300 = 5
}; ///打印机横纵向DPI

typedef NS_ENUM(NSUInteger, PrinterDPI) {
    ///根据该机型之前的设计给定纵向DPI
    PrinterDPI_000 = 0,
    ///1mm7.1个点
    PrinterDPI_180 = 180,
    ///1mm8个点
    PrinterDPI_203 = 203,
    ///1mm11.34个点
    PrinterDPI_288 = 288,
    ///1mm11.81个点
    PrinterDPI_300 = 300,
    ///1mm23.62个点
    PrinterDPI_600 = 600
};///打印DPI，计算后的值需要取整

typedef NS_ENUM(NSUInteger, PrintState) {
    ///打印开始
    PrintStateStart,
    ///打印中
    PrintStatePrinting,
    ///打印结束
    PrintStateEnd,
    
    ///打印成功
    PrintStateSuccess,
    ///单张打印成功
    PrintStatePieceSuccess,
    ///单张打印count张全部打印完成
    PrintStatePieceFinish,
    
    ///打印暂停
    PrintStatePause,
    ///打印恢复
    PrintStateResume,
    ///打印中断
    PrintStateInterrupt,
    ///打印取消
    PrintStateCancel,
    ///打印失败、出错
    PrintStateFailed,
    ///打印超时
    PrintStateTimeOut,

    ///不支持
    PrintStateUnSupport,
    ///打印内容出错
    PrintStateContentEvent,
    ///打印数量有错
    PrintStateCountEvent,
    ///打印宽高有错
    PrintStateWidthOrHeightEvent,
    ///设备问题
    PrintStateDeviceEvent,
    ///设备未连接
    PrintStateDeviceNotConnected,
    ///数据问题
    PrintStateDataEvent,

    ///握手成功
    SendHandShakeSuccess,
    ///握手失败
    SendHandShakeFailed,
    
    ///心跳成功
    HeartbeatSuccess,
    ///心跳失败
    HeartbeatFailed,
    
    ///设置黑度成功
    SendDarkNessSuccess,
    ///设置黑度失败
    SendDarkNessFailed,
    
    ///设置切刀参数成功
    SendCutOptionSuccess,
    ///设置切刀参数失败
    SendCutOptionFailed,
    
    ///单独查询DPI成功
    CheckPrinterDPISuccess,
    ///单独查询DPI失败
    CheckPrinterDPIFailed,
    
    ///同步时间成功
    SysncTimeSuccess,
    ///同步时间失败
    SysncTimeFailed,
    
    ///打印机状态正常
    PrintStateStatusNormal,
    ///打印机状态异常
    PrintStateStatusAbnormal,
    
    CheckUIDSuccess,
    CheckUIDFail,
};

typedef NS_ENUM(NSUInteger, CutOption) {
    CutOptionDefault                 = -1,///默认，以打印机当前设置为准
    CutOptionTear                    = 0, ///撕纸
    CutOptionCut                     = 1, ///切纸
    CutOptionContinuousCutting       = 2, ///连续自动切纸
    CutOptionCutAfterTheEnd          = 3, ///结束后自动切纸
    CutOptionContinuousManualCutting = 4, ///连续手动切纸
}; ///切刀设置模式

typedef NS_ENUM(NSUInteger, CardThickness) {
    CardThicknessDefault = -1,
    CardThickness00      = 0, ///0.5mm
    CardThickness01      = 1, ///0.6mm
    CardThickness02      = 2, ///0.8mm
    CardThickness03      = 3, ///1.0mm
    CardThickness04      = 4  ///1.2mm
}; ///证卡卡片厚度

typedef NS_ENUM(NSUInteger, AdapterStatus) {
    AdapterStatusUncharged = 0, ///未充电
    AdapterStatusCharging  = 1, ///充电中
    AdapterStatusNobattery = 2, ///没有电池
    AdapterStatusUnknown   = 3  ///未知
};

typedef NS_ENUM(NSUInteger, PrintTaskStatus) {
    PrintTaskStatusCheck  = 0,///查询
    PrintTaskStatusPause  = 1,///暂停
    PrintTaskStatusResume = 2,///恢复
    PrintTaskStatusCancel = 3,///取消
    PrintTaskStatusPrinterPause  = 4, ///打印机暂停，不可用
    PrintTaskStatusPrinterCancel = 5 ///打印机取消，不可用
};

typedef NS_ENUM(NSUInteger, ProtocolType) {
    ProtocolTypeOld = 1, ///数据先传后打印
    ProtocolTypeNew = 2, ///数据边传边打印
};///打印协议类型

typedef NS_ENUM(NSUInteger, GapType) {
    GapTypeDefault     = 0,///默认
    GapTypeBlackMark   = 1,///黑标
    GapTypeTranslucent = 2,///半透明，间隙
    GapTypeDDF         = 3,///DDF，无间隙
    GapTypeTransparent = 4,///透明，间隙，目前只支持I70
};///间隙类型

typedef NS_ENUM(NSUInteger, RFIDStorageArea) {
    RFIDStorageAreaRES  = 0, ///RES
    RFIDStorageAreaEPC  = 1, ///UII|ESP|EPC
    RFIDStorageAreaTID  = 2, ///TID
    RFIDStorageAreaUSER = 3  ///USER
};///RFID存储区类型

typedef NS_ENUM(NSInteger, RFIDStorageDataType) {
    RFIDStorageDataTypeASCII = 0, ///ASCII
    RFIDStorageDataTypeHex   = 1, ///只能0~9 A~F，不符会报RFID异常
};///RFID字符存储类型

typedef NS_ENUM(NSUInteger, PrinterStatus) {
    PrinterStatusNormal                = 0x00, ///正常
    PrinterStatusNoLabelBox            = 0x01, ///请放入标签盒
    PrinterStatusEPROMError            = 0x02, ///EPROM 错误
    PrinterStatusNoLabels              = 0x03, ///标签用完
    PrinterStatusUnrecognizedLabel     = 0x04, ///不能识别的标签
    PrinterStatusUnlockToPutInLabelBox = 0x05, ///解锁放入标签盒
    PrinterStatusLockTheLid            = 0x06, ///请合上锁紧杆
    PrinterStatusSecurityLineError     = 0x07, ///防伪线路故障
    PrinterStatusHighTemperature       = 0x08, ///打印头温度过高
    PrinterStatusCutterStuck           = 0x09, ///切刀卡住
    PrinterStatusRibbonAbnormality     = 0x0a, ///碳带异常
    PrinterStatusPrinterBusy           = 0x0b, ///打印机忙
    PrinterStatusWrongAdapter          = 0x0c, ///适配器错误
    PrinterStatusLabelStuck            = 0x0d, ///卡纸
    PrinterStatusShutDown              = 0x0e, ///已关机
    PrinterStatusLabelAbnormality      = 0x0f, ///标签异常
    PrinterStatusRFIDAbnormality       = 0x10, ///RFID异常
    PrinterStatusRepeat                = 0x11, ///重发当前标签，不用报警*(a1)
    PrinterStatusUnlockToPutRibbonBox  = 0x12, ///请解锁放入碳带盒
    PrinterStatusRibbonOver            = 0x13, ///碳带用完
    PrinterStatusUnrecognizedRibbon    = 0x14, ///不能识别的碳带
    PrinterStatusHeadAbnormality       = 0x15, ///打印头异常
    PrinterStatusRibbonForbid          = 0x16, ///在热敏模式下不能安装碳带
    PrinterStatusUnknow                = 0xff, ///未知状态
};///ProtocolTypeNew打印机状态

typedef NS_ENUM(NSUInteger, CS18ChoiceType) {
    CS18ChoiceTypeNotSetting = 0xff, ///只同步时间，不打印
    CS18ChoiceTypeAnswer     = 0x01, ///同步时间+打印答案
    CS18ChoiceTypeCalendar   = 0x02, ///同步时间+打印今日
};///CS18灵魂按键同步类型

typedef NS_ENUM(NSUInteger, CS18CustomType) {
    CS18CustomTypePrintOnly     = 0, ///打印不保存
    CS18CustomTypeSaveAnswer    = 1, ///保存答案签
    CS18CustomTypeSaveCanlendar = 2, ///保存日历签
};///CS18自定义保存类型

typedef NS_ENUM(NSUInteger, WWLanguageType) {
    WWLanguageSystem             = 0,
    WWLanguageChineseSimplified  = 1,
    WWLanguageChineseTraditional = 2,
    WWLanguageEnglish            = 3,
    WWLanguageFranch             = 4,
    WWLanguageItaly              = 5,
    WWLanguageGermany            = 6,
    WWLanguageSpain              = 7,
    WWLanguageJapanese           = 8,
    WWLanguageKorean             = 9,
    WWLanguageArabic             = 10,
};///多语言

typedef NS_ENUM(NSUInteger, ConnectModel) {
    ///WiFi热点连接
    ConnectModelWiFi = 1,
    ///蓝牙连接
    ConnectModelBle  = 2,
    ///局域网连接
    ConnectModelLAN  = 3,
};///连接类型

typedef NS_ENUM(NSUInteger, BaseHandle) {
    BaseHandleDevice,
    BaseHandleSearch,
    BaseHandleConnect,
    BaseHandleWriteData,
    BaseHandleRecvData,
    BaseHandleDispose
};///连接操作类型

typedef NS_ENUM(NSUInteger, BaseState) {
    BaseDeviceStatePoweredOff,  ///手机蓝牙关闭
    BaseDeviceStatePoweredOn,   ///手机蓝牙打开
    BaseDeviceStateUnauthorized,///未获取权限
    BaseDeviceStateUnsupported,
    BaseDeviceStateUnknown,
    BaseDeviceStateResetting,
    BaseSearchStateSuccess,
    BaseSearchStatePiece,
    BaseSearchStateFailed,
    BaseSearchStateLocationRestricted, ///未开启定位
    BaseConnectStateSuccess,
    BaseConnectStateConnectting,
    BaseConnectStateFailed,
    BaseConnectStateTimeout,
    BaseConnectStateOccupy, ///设备被占用
    BaseConnectStateNetRestricted, ///连接WIFI网络受限
    BaseWriteDataStateSuccess, ///发送数据成功
    BaseWriteDataStateFailed, ///发送数据失败
    BaseRecvDataStateSuccess,
    BaseRecvDataStateFailed,
    BaseDisposeStateSuccess,
    BaseDisposeStateFailed
};

typedef NS_ENUM(NSUInteger, FwUpState) {
    FwUpStateDataEvent = 0,///升级数据问题
    FwUpStateOutTime   = 1,///超时
    FwUpStateUpdating  = 2,///升级中
    
    FwUpStateCheckFssVerSuccess = 3,///查询打印机硬件版本号,软件版本号,序列号成功
    FwUpStateCheckFssVerFailed  = 4,///查询打印机硬件版本号,软件版本号,序列号失败
    
    FwUpStateChange2IAPModelSuccess = 5,///让打印机由用户模式进入到IAP模式成功
    FwUpStateChange2IAPModelFailed  = 6,///让打印机由用户模式进入到IAP模式失败
    
    FwUpStateCheckBloaderVerSuccess = 7,///查询BootLoader版本号，握手指令成功
    FwUpStateCheckBloaderVerFailed  = 8,///查询BootLoader版本号，握手指令失败
    
    FwUpStateRequestSuccess = 9,///升级请求成功
    FwUpStateRequestFailed  = 10,///升级请求失败
    
    FwUpStateSendUpCurrentDataing = 11,///发送一块数据
    FwUpStateSendUpDataSuccess    = 12,///发送升级包数据成功
    FwUpStateSendUpDataFailed     = 13,///发送升级包数据失败
    
    FwUpStateWrite2FlashSuccess = 14,///写入flash成功
    FwUpStateWrite2FlashFailed  = 15,///写入flash失败
    
    FwUpStateChange2UserModelSuccess = 16,///进入用户程序成功
    FwUpStateChange2UserModelFailed  = 17,///进入用户程序失败
    
    FwUpStateCancel     = 18,///升级取消
    FwUpStateInterrupt  = 19,///升级被打断
    FwUpStateDisconnect = 20,///断开连接
    
    FwUpStateSuccess = 21,///升级成功
    FwUpStateFailed  = 22,///升级失败
};

#endif /* WewinMacro_h */
