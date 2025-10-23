//
//  DeviceInfoModel.h
//  WewinPrintLib
//
//  Created by 刘良平 on 2018/12/8.
//  Copyright © 2018 WeWin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WewinMacro.h"

NS_ASSUME_NONNULL_BEGIN

/**
 当前连接打印机的数据model
 */
@interface DeviceInfoModel : NSObject

///适配器状态
@property (nonatomic, assign) AdapterStatus adapterStatus;
///纵向DPI
@property (nonatomic, assign) PrinterDPI vDeviceDpi;
///横向DPI
@property (nonatomic, assign) PrinterDPI hDeviceDpi;
///切刀模式
@property (nonatomic, assign) CutOption cutOption;
///CP50证卡厚度
@property (nonatomic, assign) CardThickness cardThickness;
///打印机任务状态
@property (nonatomic, assign) PrintTaskStatus printTaskStatus;
///打印机状态
@property (nonatomic, assign) PrinterStatus printerStatus;

///是否有切刀
@property (nonatomic, assign) BOOL cutter;
///BT是否打开
@property (nonatomic, assign) BOOL BT;
///是否支持WIFI
@property (nonatomic, assign) BOOL WIFI;
///是否支持RFID
@property (nonatomic, assign) BOOL RFID;
///是否支持物联网
@property (nonatomic, assign) BOOL IoT;

///电量
@property (nonatomic, assign) int electricQuantity;
///黑度
@property (nonatomic, assign) int darkNess;
///标签高度
@property (nonatomic, assign) int labelHeight;
///碳带/标签剩余长度
@property (nonatomic, assign) int labelRemainLength;
///碳带/标签总长度
@property (nonatomic, assign) int labelTotalLength;
///碳带编码
@property (nonatomic, assign) int ribbonCode;

///标签型号
@property (nonatomic, copy) NSString *labelType;
///打印机类型
@property (nonatomic, copy) NSString *printerType;
///打印机状态描述
@property (nonatomic, copy) NSString *printerStatusDescription;

@end

NS_ASSUME_NONNULL_END
