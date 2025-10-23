//
//  WwRectBlock.h
//  PrintExtApi
//
//  Created by wewin on 2019/3/9.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <WewinPrintExtApi/WwBlock.h>

@interface WwRectBlock : WwBlock

@property (nonatomic, assign) float width;

@property (nonatomic, assign) float height;

@property (nonatomic, assign) float thinkness;

@property (nonatomic, assign) float radius;

@property (nonatomic,readonly,assign) float transformWidth;

@property (nonatomic,readonly,assign) float transformHeight;

@property (nonatomic,readonly,assign) float transformThinkness;

@end
