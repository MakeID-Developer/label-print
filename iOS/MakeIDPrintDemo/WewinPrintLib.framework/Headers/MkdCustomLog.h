//
//  MkdCustomLog.h
//
//  Created by 凉皮 on 2023/3/29.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
/**
 *  自定义Log，可配置开关（用于替换NSLog）
 */
#define MLog(format,...) CustomLog(format,##__VA_ARGS__)

/**
 *  自定义Log
 *  @warning 外部可直接调用 KDS_Log
 *
 *  @param format       Log内容
 *  @param ...          个数可变的Log参数
 */
void CustomLog(NSString *format, ...);

/**
 *  自定义Log类，外部控制Log开关
 */
@interface MkdCustomLog : NSObject
/**
 *  Log 输出开关 (默认关闭)
 *
 *  @param flag 是否开启
 */
+ (void)setLogEnable:(BOOL)flag;

/**
 *  是否开启了 Log 输出
 *
 *  @return Log 开关状态
 */
+ (BOOL)logEnable;

@end

NS_ASSUME_NONNULL_END
