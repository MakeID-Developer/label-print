//
//  WwGraphicBlock.h
//  PrintExtApi
//
//  Created by wewin on 2019/3/9.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <WewinPrintExtApi/WwBlock.h>

@interface WwGraphicBlock : WwBlock

///图片宽度，graphic为bitmap时，为了不再丢失分辨率，宽度参数无效(Image width. When the graphic is a bitmap, the width parameter is invalid to avoid loss of resolution.)
@property(nonatomic, assign) float width;

///图片高度，graphic为bitmap时，为了不再丢失分辨率，高度参数无效(Image height. When the graphic is a bitmap, the height parameter is invalid to avoid loss of resolution.)
@property(nonatomic, assign) float height;

///图名称，也可是UIImage对象(Image name, can also be a UIImage object)
@property(nonatomic, strong) NSObject *graphic;

///根据dot转换后的宽度(According to the width after dot conversion)
@property (nonatomic,readonly,assign) float transformWidth;

///根据dot转换后的高度(According to the height after dot conversion)
@property (nonatomic,readonly,assign) float transformHeight;

@end
