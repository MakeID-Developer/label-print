//
//  WwLocationExManager.h
//  WewinPrintExtApi
//
//  Created by Max on 2020/9/11.
//  Copyright © 2020 wewin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WewinPrintLib/WewinPrintLib.h>

NS_ASSUME_NONNULL_BEGIN

UIKIT_EXTERN NSString * WwLocalLanguageTextValue(NSString *key);

@interface WwLocationExManager : NSObject

@property (nonatomic, assign) WWLanguageType languageType;

+ (instancetype)shareManager;

- (NSString *)wwLocalizedStringForKey:(nonnull NSString *)key;

@end

NS_ASSUME_NONNULL_END
