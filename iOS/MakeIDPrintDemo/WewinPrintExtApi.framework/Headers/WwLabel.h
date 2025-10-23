//
//  Label.h
//  PrintExtApi
//
//  Created by wewin on 2019/3/9.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WewinPrintExtApi/WwCommon.h>
#import <WewinPrintExtApi/WwBlock.h>
#import <WewinPrintLib/WewinPrintLib.h>
#import <WewinPrintExtApi/WwTextBlock.h>
#import <WewinPrintExtApi/WwBarcodeBlock.h>
#import <WewinPrintExtApi/WwQrcodeBlock.h>
#import <WewinPrintExtApi/WwGraphicBlock.h>
#import <WewinPrintExtApi/WwLineBlock.h>
#import <WewinPrintExtApi/WwRectBlock.h>

/**
 * 附加信息的key   标签标题
 */
extern NSString *const extInfoLabelTitle;

@interface WwLabel : NSObject

///标签宽度，单位为毫米(Label width in mm)
@property(nonatomic, assign) float labelWidth;

///标签高度，单位为毫米(Label height in mm)
@property(nonatomic, assign) float labelHeight;

/**
 * 模板图名称，可以做预览用，可放置于assets或者drawable根目录（Template image name, can be used for preview, can be placed in assets or drawable root directory）
 * 当背景图时打印，当预览图时不打印（Print when it is a background image, but not print when it is a preview image）
 * 传入图片名字  或  UIimage 图片对象（Pass in the image name or UIimage object）
 * 当背景图时 需要将 isBackground 设置为YES（当背景图时 需要将 isBackground 设置为YES）
 */
@property(nonatomic) id previewGraphicName;

///是否将previewGraphicName 设置为背景图，可以打印
@property(nonatomic,assign) BOOL isBackground;

///rfid内容(RFID content)
@property(nonatomic, strong) NSString *rfid;

///rfid存储区，默认EPC（RFID storage area, default EPC）
@property(nonatomic,assign) RFIDStorageArea rfidStorageType;

///rfid存储方式，默认ASCII（RFID storage mode, default ASCII）
@property(nonatomic,assign) RFIDStorageDataType rfidCharStorageType;

@property(nonatomic, assign) float ddfLength;

@property(nonatomic,assign) float ddfGpc;

///标签类型，默认保持打印机默认值（Label type, keep the printer default value by default）
@property(nonatomic, assign) WwLabelType labelType;

///切纸模式（Paper cutting mode）
@property(nonatomic, assign) CutOption cutOption;

///标签打印时的旋转方向，默认0度（The rotation direction of the label when printing, the default is 0 degrees）
@property(nonatomic, assign) WwOritention oritention;

///元素block数组（element block array）
@property(nonatomic, copy) NSArray *blocks;

///需要字体大小相同的 字体块数组，无特殊需求，请使用blocks（Requires an array of font blocks with the same font size. If there is no special requirement, please use blocks）
@property(nonatomic, copy) NSArray <WwTextBlock *> *textNeedFontBlocks;

@property (nonatomic,readonly,assign) float transformLabelWidth;

@property (nonatomic,readonly,assign) float transformLabelHeight;

@property (nonatomic, copy) NSString *labelInfo;

///标签检测专用，传入标签类型，将会在打印时匹配标签（Dedicated to label detection, pass in the label type, and the label will be matched when printing.）
@property (nonatomic, copy) NSString *detectionTypeKey;

@property (nonatomic, strong) NSDictionary *extInfo;

@end
