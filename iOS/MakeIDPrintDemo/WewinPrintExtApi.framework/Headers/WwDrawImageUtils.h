//
//  WwImageUtils.h
//  WewinPrintExtApi
//
//  Created by Max on 2019/6/18.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WwCommon.h"
@class WwLabel ,WwQrcodeBlock,WwBarcodeBlock;
NS_ASSUME_NONNULL_BEGIN

@interface WwDrawImageUtils : NSObject

#pragma mark 预览处理

/**
 传入Label数组批量获取预览图

 @param labels 标签对象数组
 @return 预览图数组
 */
+(NSArray<UIImage *> *)createLabelsBitmap:(NSArray *)labels;


/**
 获取单个预览图

 @param label 标签对象
 @return 预览图片
 */
+ (UIImage *)createLabelBitmap:(WwLabel *)label;

#pragma mark - 二维码处理
/**
 获取最小大小的二维码图片

 @param contentString 二维码内容
 @return 最小二维码图片
 */
+ (UIImage *)getMineQRCodeWithCodeString:(NSString *)contentString;

/**
 获取指定大小的二维码图片

 @param contentString 二维码内容
 @param theWidth 大小
 @param qrCodeCorrectionLevel 容错等级
 @return 二维码图片
 */
+ (UIImage *)getQRCodefromString:(NSString *)contentString andWidth:(CGFloat)theWidth andErrorTye:(WwQrCodeCorrectionLevel)qrCodeCorrectionLevel;

/**
 *  生成指定大小的二维码图片
 *  @param qrBlock 传入qrbloack
 */
+ (UIImage *)getQRCodeWithQRBlock:(WwQrcodeBlock *)qrBlock;

#pragma mark 条形码处理

/**
 生成指定大小的条形码

 @param contentString 条形码内容
 @param theWidth 宽度
 @param theHight 高度
 @return 条形码
 */
+ (UIImage *)getBRCodeWithContentString:(NSString *)contentString andWidth:(CGFloat)theWidth andHight:(CGFloat)theHight;


/**
 生成指定大小的条码

 @param brBlock 条码Block
 @return 条形码
 */
+ (UIImage *)getBRCodeWithBRBlock:(WwBarcodeBlock *)brBlock;
@end

NS_ASSUME_NONNULL_END
