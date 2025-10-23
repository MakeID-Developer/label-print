//
//  WwLineBlock.h
//  PrintExtApi
//
//  Created by wewin on 2019/3/9.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <WewinPrintExtApi/WwBlock.h>

@interface WwLineBlock : WwBlock

///宽度(Width)
@property(nonatomic, assign) float width;

//高度(height)
@property(nonatomic, assign) float height;

///根据dot转换后的宽度(According to the width after dot conversion)
@property (nonatomic,readonly,assign) float transformWidth;

///根据dot转换后的高度(According to the height after dot conversion)
@property (nonatomic,readonly,assign) float transformHeight;

@end
