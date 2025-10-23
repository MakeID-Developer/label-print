//
//  WWLocalizedUtil.h
//  WewinPrintLib
//
//  Created by 刘良平 on 2019/11/13.
//  Copyright © 2019 WeWin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WewinPrintLib/WewinMacro.h>

NS_ASSUME_NONNULL_BEGIN

@interface WWLocalizedUtil : NSObject

/// 自定义多语言NSDictionary
@property (nonatomic, strong) NSDictionary *customLanguageDict;

@property (nonatomic, assign) WWLanguageType languageType;

+ (instancetype)shareManager;

- (NSString *)wwLocalizedStringForKey:(nonnull NSString *)key;

- (NSString *)wwLocalizedStringForKey:(nonnull NSString *)key value:(nullable NSString *)value;

- (NSString *)getLanguageShortName;

@end

NS_ASSUME_NONNULL_END
