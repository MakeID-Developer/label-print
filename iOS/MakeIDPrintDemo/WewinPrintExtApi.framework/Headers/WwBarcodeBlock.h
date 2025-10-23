//
//  BarcodeBlock.h
//  PrintExtApi
//
//  Created by wewin on 2019/3/9.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WewinPrintExtApi/WwBlock.h>

@interface WwBarcodeBlock : WwBlock

///条码宽度(Barcode width)
@property(nonatomic, assign) float width;

///条码高度(Barcode height)
@property(nonatomic, assign) float height;

///是否需要强制固定大小(Is it necessary to enforce a fixed size?)
@property(nonatomic, assign) BOOL needResize;

///条码内容，一个长度为 1-100 的字符串(Barcode content, a string with a length of 1-100)
@property(nonatomic, strong) NSString *content;

///根据dot转换后的宽度(According to the width after dot conversion)
@property (nonatomic,readonly,assign) float transformWidth;

///根据dot转换后的高度(According to the height after dot conversion)
@property (nonatomic,readonly,assign) float transformHeight;

///是否反色，默认NO(Whether to invert the color, default is NO)
@property(nonatomic, assign) BOOL needReverseColor;

@end
