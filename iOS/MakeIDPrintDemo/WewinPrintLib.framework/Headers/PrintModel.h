//
//  PrintModel.h
//  WewinPrintLib
//
//  Created by 欧海川 on 2017/12/22.
//  Copyright © 2017年 WeWin. All rights reserved.
//

typedef NS_ENUM(NSUInteger, ModelType) {
    ModelTypeGraphic = 0, //图片
    ModelTypeRfid    = 1  //RFID
};

@class UIImage;
@interface PrintModel : NSObject

@property (nonatomic, assign) ModelType modelType;

///x坐标
@property (nonatomic, assign) int x;

///y坐标
@property (nonatomic, assign) int y;

///最爱(CS18支持保存一张用户喜欢的标签，以备直接打印机按键输出,只需要设置一块printModel的isFavourite属性即可)
@property (nonatomic, assign) BOOL isFavourite;

@property (nonatomic, strong, nullable) UIImage *image;

///RFID数据(用于p70、P70S、CP50设置rfid，<12个字节,P70、P70S支持打印rfid,注意：如果一张标签包含多个PrintModel,只需要设置一块printModel的rfid属性即可)
@property (nonatomic, copy, nullable) NSString *rfid;

/**
 适用于PrintDispatcher.labelArray有多种尺寸的标签，
 此时应设置PrintDispatcher.labelWidth设置>0，
 多张标签宽高一样，不需设置该属性
 仅适用于JINGJING的机器
 */
@property (nonatomic, assign) NSInteger labelWidth;

/**
 适用于PrintDispatcher.labelArray有多种尺寸的标签，
 此时应设置PrintDispatcher.labelHeight设置>0，
 多张标签宽高一样，不需设置该属性
 仅适用于JINGJING的机器
 */
@property (nonatomic, assign) NSInteger labelHeight;

@end
