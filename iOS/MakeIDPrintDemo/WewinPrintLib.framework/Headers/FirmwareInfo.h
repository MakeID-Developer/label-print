//
//  FirmwareInfo.h
//  WewinPrintLib
//
//  Created by 凉皮 on 2020/4/24.
//  Copyright © 2020 WeWin. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 固件信息
 */
@interface FirmwareInfo : NSObject
///硬件版本
@property (nonatomic, copy) NSString *hardwareVersion;
///软件版本
@property (nonatomic, copy) NSString *softwareVersion;
///序列号
@property (nonatomic, copy) NSString *serialNum;

@end

NS_ASSUME_NONNULL_END
