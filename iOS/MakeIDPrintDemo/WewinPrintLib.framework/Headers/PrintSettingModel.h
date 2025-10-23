//
//  PrintSettingModel.h
//  WewinPrintLib
//
//  Created by 刘良平 on 2019/4/9.
//  Copyright © 2019 WeWin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WewinMacro.h"

NS_ASSUME_NONNULL_BEGIN

/**
 打印参数设置
 */
@interface PrintSettingModel : NSObject

///切刀设置(用于ProtocolTypeNew打印机设置切刀）默认CutOptionTear
@property (nonatomic, assign) CutOption cutOption;

///证卡卡片厚度，仅适用于CP50， 默认CardThickness03
@property (nonatomic, assign) CardThickness cardThickness;

///间隙类型设置,默认GapTypeDefault
@property (nonatomic, assign) GapType gapType;

///RFID的存储区类型，默认RFIDStorageTypeEPC
@property (nonatomic, assign) RFIDStorageArea rfidStorageArea;

///RFID字符存储类型 默认RFIDStorageDataTypeASCII：全ASCII码， RFIDStorageDataTypeHex只能0~9 A~F，不符会报RFID异常
@property (nonatomic, assign) RFIDStorageDataType rfidStorageDataType;

///CS18自定义保存类型
@property (nonatomic, assign) CS18CustomType cs18CustomType;

///黑度（用于ProtocolTypeNew打印机设置黑度，范围:1-20，设置小于等于0则以打印机为准)
@property (nonatomic, assign) int darkNess;

///DDF间隙(单位为毫米,默认为0),仅支持ProtocolTypeOld
@property (nonatomic, assign) NSInteger ddfGap;

///标签宽度，如果一次要打多个尺寸的标签，请使用PrintModel.labelWidth
@property (nonatomic, assign) NSInteger labelWidth;

///标签高度(同时作为DDF打印高度使用)
@property (nonatomic, assign) NSInteger labelHeight;

///每张打印份数(大于0)，默认为1
@property (nonatomic, assign) NSInteger count;

///控制打印机屏幕显示打印进度的总张数，不传或者传0，由相关机型自动控制
@property (nonatomic, assign) NSInteger showCount;

///控制打印机屏幕显示打印进度的index，不传或者传0，由相关机型自动控制
@property (nonatomic, assign) NSInteger piceCount;

@end

NS_ASSUME_NONNULL_END
