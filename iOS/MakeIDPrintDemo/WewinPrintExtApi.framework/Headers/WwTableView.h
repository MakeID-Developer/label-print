//
//  WwTableView.h
//  PrintExtApi
//
//  Created by wewin on 2019/3/7.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <UIKit/UIKit.h>

/// 打印机选择回调
typedef void(^IPrinterSelectCallback)(NSString *deviceName);

@interface WwTableView : UITableView

@property (nonatomic, copy) IPrinterSelectCallback iPrinterSelectCallback;
@property (nonatomic, strong) NSMutableArray *deviceNames;

///追加显示设备
- (void)addDevice:(NSString *)deviceName;
//插入到顶部
- (void)insertDeviceToTop:(NSString *)deviceName;
///清空所有显示
- (void)clearAll;

@end
