//
//  WwToast.h
//  WewinPrintLib
//
//  Created by 欧海川 on 2018/1/5.
//  Copyright © 2018年 WeWin. All rights reserved.
//

#define WwSCALE ([UIScreen mainScreen].scale * 0.3)
#define WwSCREENWIDTH ([[UIScreen mainScreen] bounds].size.width)
#define WwSCREENHEIGHT ([[UIScreen mainScreen] bounds].size.height)

#import <UIKit/UIKit.h>

@interface WwToast : UIView

+ (WwToast *)makeText:(NSString *)text;

- (void)show;

- (void)showTime:(NSTimeInterval)timeInterval;

@end
