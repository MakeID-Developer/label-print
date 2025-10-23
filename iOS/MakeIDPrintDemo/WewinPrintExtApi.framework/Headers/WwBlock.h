//
//  WwBlock.h
//  PrintExtApi
//
//  Created by wewin on 2019/3/9.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WewinPrintExtApi/WwCommon.h>
/**
 * 基础Block
 */
@interface WwBlock : NSObject

@property(nonatomic, assign) WwBlockType type;

///x坐标，单位为毫米(x-coordinate in millimeters)
@property(nonatomic, assign) float x;

///y坐标，单位为毫米(y coordinate, in millimeters)
@property(nonatomic, assign) float y;

///旋转方向,默认0度（Rotation direction, default 0 degrees ()）
@property(nonatomic, assign) WwOritention oritention;

///根据dot转换后的x(According to the x after dot conversion)
@property (nonatomic,readonly,assign) float transformX;

///根据dot转换后的Y(According to the Y after dot conversion)
@property (nonatomic,readonly,assign) float transformY;

/**
 *  是否只预览显示，二维码用静态请不要设置此属性，默认为false（Whether to display only preview. If the QR code is static, please do not set this property. The default value is false）
 */
@property (nonatomic,assign) BOOL ifOnlyPreview;




@end
