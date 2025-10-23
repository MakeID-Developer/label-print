//
//  WewinConstants.h
//  WewinPrintLib
//
//  Created by 刘良平 on 2018/10/30.
//  Copyright © 2018 WeWin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

UIKIT_EXTERN NSString * const PrintingPieceNumKey; //打印中单张计数
UIKIT_EXTERN NSString * const PrintingTotalNumKey; //打印中总共张计数
UIKIT_EXTERN NSString * const kPrintingFinishNumKey; //某张标签打印count张后的index计数

UIKIT_EXTERN NSString * const DeviceDPIKey;        //打印机DPI
UIKIT_EXTERN NSString * const HDeviceDPIKey;
UIKIT_EXTERN NSString * const VDeviceDPIKey;       //打印机纵向DPI
UIKIT_EXTERN NSString * const PrinterStatusKey;    //打印机状态KEY
UIKIT_EXTERN NSString * const kCS18ChoiceTypeKey;  //CS18签KEY
UIKIT_EXTERN NSString * const AdapterStatusKey;    //适配器状态KEY
UIKIT_EXTERN NSString * const ElectricQuantityKey; //电量KEY
UIKIT_EXTERN NSString * const DarkNessKey;         //黑度KEY
UIKIT_EXTERN NSString * const CutOptionKey;        //切刀KEY
UIKIT_EXTERN NSString * const kCardThickness;      //证卡卡片厚度KEY
UIKIT_EXTERN NSString * const LabelHeightKey;      //标签高度KEY
UIKIT_EXTERN NSString * const PrinterTypeKey;      //打印机类型KEY

UIKIT_EXTERN NSString * const LabelRemainLengthKey; //碳带/标签剩余长度KEY
UIKIT_EXTERN NSString * const LabelTotalLengthKey;  //碳带/标签总长度
UIKIT_EXTERN NSString * const LabelTypeKey;         //标签型号
UIKIT_EXTERN NSString * const RibbonCodeKey;        //碳带编码
UIKIT_EXTERN NSString * const PrintSpeedKey;        //打印速度
UIKIT_EXTERN NSString * const PrintTaskStateKey;    //打印任务状态

//计时器
UIKIT_EXTERN void WwDispatchTimer(double timeInterval, void (^handler)(dispatch_source_t timer));
//根据语言获取对应文本
UIKIT_EXTERN NSString * WwGetLocalLanguageTextValue(NSString *key);

@interface WewinConstants : NSObject

@end

NS_ASSUME_NONNULL_END
