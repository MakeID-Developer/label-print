//
//  WwDeviceView.h
//  WewinPrintExtApi
//
//  Created by 凉皮 on 2021/4/8.
//  Copyright © 2021 wewin. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <WewinPrintLib/WewinPrintLib.h>
#import "WwCommon.h"

NS_ASSUME_NONNULL_BEGIN
/// 连接结果回调
typedef void(^IPrintConnectCallback)(BaseState state, NSString *desc);

/**
 搜索列表页
 */
@interface WwDeviceView : UIView

///默认搜索类型，如果searchType中不包含设置的type，则无效
//@property (nonatomic, assign) WwSearchType defaultSearchType;
///多个请以 eg（WwSearchTypeBLE | WwSearchTypeLAN）赋值
//@property (nonatomic, assign) WwSearchType searchType;

@property (nonatomic, strong) UIColor *themeColor;

@property (nonatomic, copy) void(^cancleCallback)(void);
@property (nonatomic, copy) void(^searchCallback)(void);
@property (nonatomic, copy) void(^dismissCallback)(void);
@property (nonatomic, copy) IPrintConnectCallback connectCallback;

/**
 搜索设备，一定要在设置参数之后执行
 */
- (void)searchDevices;

@end

NS_ASSUME_NONNULL_END
