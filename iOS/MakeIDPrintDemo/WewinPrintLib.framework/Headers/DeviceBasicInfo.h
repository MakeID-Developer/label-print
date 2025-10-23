//
//  DeviceBasicInfo.h
//  WewinPrintLib
//
//  Created by 凉皮 on 2021/12/28.
//  Copyright © 2021 WeWin. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
typedef NS_ENUM(NSUInteger, MkdPrintPosition) {
    ///居左打印
    MkdPrintPositionLeft   = 0,
    ///居中打印
    MkdPrintPositionCenter = 1,
    ///居右打印
    MkdPrintPositionRight  = 2,
};//打印内容位置

/**
 设备基础信息
 */
@interface DeviceBasicInfo : NSObject

///协议版本号
@property (nonatomic, assign) double protocolVersion;

///打印内容位置
@property (nonatomic, assign) MkdPrintPosition printPosition;

///打印数据是否需要高低字节交换
@property (nonatomic, assign) BOOL isExchageHL;

///打印头宽度
@property (nonatomic, assign) NSInteger printerWidth;

///单次最大发送数据块行数
@property (nonatomic, assign) NSInteger maxPrintRows;

@end

NS_ASSUME_NONNULL_END
