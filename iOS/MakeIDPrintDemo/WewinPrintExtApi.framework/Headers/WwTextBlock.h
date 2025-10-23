//
//  WwTextBlock.h
//  PrintExtApi
//
//  Created by wewin on 2019/3/9.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WewinPrintExtApi/WwBlock.h>

//设置文字样式（Set text style）
typedef NS_ENUM(NSUInteger, WwTextStyle) {
    wwTextStyleNormal         = 0,
    wwTextStyleBold           = 1,
    wwTextStyleItalics        = 2,
    wwTextStyleBoldAndItalics = 3
};

//设置文字样式
typedef NS_ENUM(NSUInteger, WwTextFormat) {
    //默认，无粗体斜体设置（Default, no bold or italic settings）
    wwTextFormatNormal = 0,
    //首个：符号后，其他行缩近（After the first : symbol, the remaining lines are indented）
    wwTextFormatShrink = 1
};

@interface WwTextBlock : WwBlock

///最大字号，默认3，单位mm（Maximum font size, default 3, unit mm）
@property(nonatomic, assign) float fontSize;

///字体样式，默认none（Font style, default is none）
@property(nonatomic, assign) WwTextStyle textStyle;

///字体名称，默认黑体（Font name, default bold）
@property(nonatomic, strong) NSString *fontName;

///是否自动换行,默认Yes,设置为NO后将会只有一行文字(Whether to automatically wrap text, the default is Yes, if set to NO, there will be only one line of text)
@property(nonatomic, assign) BOOL ifAutoLine;

///配合ifAuoline使用，只有当ifAutoLine为NO时生效，默认为1，值必须 >0(Used with ifAuoline, only takes effect when ifAutoLine is NO, the default is 1, the value must be >0)
@property(nonatomic, assign) NSInteger lineNum;

///最大打印宽度(Maximum print width, unit mm)
@property(nonatomic, assign) float maxW;


///最大打印高度(Maximum printing height, unit mm)
@property(nonatomic, assign) float maxH;

///行间距(Line Spacing)
@property(nonatomic, assign) float lineOffset;

///文本内容（Text content）
@property(nonatomic, strong) NSString *content;

///横向对齐方式,默认居左（Horizontal alignment, default left）
@property(nonatomic, assign) WwHorizontalAlignment horizontalAlignment;

///纵向对齐方式,默认上(Vertical alignment, default is up)
@property(nonatomic, assign) WwVerticalAlignment verticalAlignment;

///是否需要自适应，默认YES（Whether to need self-adaptation, the default is YES）
@property(nonatomic, assign) BOOL needResize;

///根据dot转换后的字体大小(Font size after conversion according to dot)
@property (nonatomic,readonly,assign) float transformFontSize;

///根据dot转换后的最大宽度(According to the maximum width after dot conversion)
@property (nonatomic,readonly,assign) float transformMaxW;

///根据dot转换后的最大高度(According to the maximum height after dot conversion)
@property (nonatomic,readonly,assign) float transformMaxH;

///根据dot转换后的行间距(According to the line spacing after dot conversion)
@property (nonatomic,readonly,assign) float transformLineOffset;

///用于设置文本段落格式(Used to format text paragraphs)
@property(nonatomic, assign) WwTextFormat textFormat;
 
///根据什么内容进行分段缩进  默认为"："()
@property(nonatomic, strong) NSString *shrinkIdentify;

///设置段落格式为wwTextFormatShrink 后 缩进的字符数， 默认为-1 可不设置，wwTextFormatShrink情况下讲自动寻找第一个中文"："
@property (nonatomic,assign) NSInteger shrinkWordNum;

///是否缩短之前加粗。默认NO()
@property (nonatomic,assign) bool ifShrinkBold;


@end
