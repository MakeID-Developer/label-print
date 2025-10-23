//
//  BaseOldPrintLib.h
//  WewinPrintLib
//
//  Created by 刘良平 on 2019/4/9.
//  Copyright © 2019 WeWin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WewinMacro.h"
#import "BaseConnect.h"
#import "PrintLibUtil.h"
#import "PrintLibHeader.h"
#import "PrintSettingModel.h"
#import "MkdCustomLog.h"

NS_ASSUME_NONNULL_BEGIN

@interface BaseOldPrintLib : NSObject

@property (nonatomic, strong) BaseConnect * _Nullable baseConnect;
///打印参数设置
@property (nonatomic, strong) PrintSettingModel *printSetting;
///标签数组
@property (nonatomic, strong) NSArray * _Nullable labelArray;

@property (nonatomic, copy, nullable) PrintCallBack printingCallBack;
@property (nonatomic, copy, nullable) PrintCallBack sendHandShakeCallBack;
@property (nonatomic, copy, nullable) PrintCallBack sendDarkNessCallBack;
@property (nonatomic, copy, nullable) PrintCallBack sendCutOptionCallBack;
@property (nonatomic, copy, nullable) PrintCallBack checkDPICallBack;
@property (nonatomic, copy, nullable) PrintCallBack printerStatusCallBack;

@property (nonatomic, assign) BOOL isPrinting;

/**
 主线程打印标签
 */
- (void)printLabelsWithLabelArray:(NSArray *)labelArray callBack:(PrintCallBack _Nullable)block;

- (void)sendHandShakeWithCallBack:(PrintCallBack _Nullable)block;

- (void)changePrintTaskStatus:(PrintTaskStatus)taskStatus;

- (void)sendDarkNess:(int)darkNess callBack:(PrintCallBack _Nullable)block;

- (void)checkPrinterDPIWithCallBack:(PrintCallBack _Nullable)block;

- (void)sendCutOption:(CutOption)cutOption callBack:(PrintCallBack _Nullable)block;
/**
 查询打印机状态
 */
- (void)checkPrinterStatus:(PrintCallBack _Nonnull )block;

@end

NS_ASSUME_NONNULL_END
