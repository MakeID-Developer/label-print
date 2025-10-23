//
//  WwCommon.h
//  PrintExtApi
//
//  Created by wewin on 2019/2/18.
//  Copyright © 2019 wewin. All rights reserved.
//

#ifndef WwCommon_h
#define WwCommon_h

/// 打印机设置结果类型
typedef NS_ENUM(NSUInteger, WwSetResult) {
    wwDarknessSetSuccess  = 0,/// 黑度设置成功
    wwDarknessSetfailed   = 1,/// 黑度设置失败
    wwCutOptionSetSuccess = 2,/// 切刀设置成功
    wwCutOptionSetfailed  = 3 /// 切刀设置失败
};

/**
 * 枚举打印机结果类型
 */
typedef NS_ENUM(NSUInteger, WwPrintResult) {
    /**
     * 未知异常
     */
    wwUnknowError = -1,
    /**
     * >连接操作异常
     */
    wwConnectError= -3,
    /**
     * 连接设备异常
     */
    wwConnectDeviceError = -4,
    /**
     * 创建标签异常
     */
    wwCreateLabelError = -5,
    /**
     * 打印异常
     */
    wwPrintError = -6,
    /**
     * 打印机被占用（或正在打印）
     */
    wwPrintingError = -7,
    /**
     * 预览异常
     */
    wwPreviewError = -8,
    /**
     * 标签类型错误
     */
    wwLabelTypeError = -9,
    
    /**
     * 打印取消
     */
    wwPrintCancel = -10,
    
    /**
     * 打印被禁止
     */
    wwPrintProhibited = -11,
    /**
     * 打印成功
     */
    wwPrintSuccess = 0
};

///标签类型(Label Type)
typedef NS_ENUM(NSUInteger, WwLabelType) {
    WwLabelTypeDefault     = 0, //default
    WwLabelTypeBlackMark   = 1, //Gap-Black Mark
    WwLabelTypeTranslucent = 2, //间隙-半透明（绝大部分是半透明）Gap - translucent (mostly translucent)
    WwLabelTypeDDF         = 3, //连续标签（Continuous Labels）
    WwLabelTypeTransparent = 4, //间隙-透明（Gap-Transparent）
};

///打印对象元素类型（Print object element type）
typedef NS_ENUM(NSUInteger, WwBlockType) {
    wwText      = 0,
    wwBarcode   = 1,
    wwQrcode    = 2,
    wwGraphic   = 3,
    wwLine      = 4,
    wwRect      = 5,
    wwTextArray = 6
};

/**
 * 打印对象块旋转（Print object block rotation）
 */
typedef NS_ENUM(NSUInteger, WwOritention) {
    wwOritention0 = 0,
    wwOritention90 = 1,
    wwOritention180 = 2,
    wwOritention270 = 3
};

/**
 * dots
 */
typedef NS_ENUM(NSUInteger, WwDPIDots) {
    
    wwDots7 = 7,
    wwDots8 = 8,
    wwDots11 = 11,
    wwDots12 = 12,
    wwDots24 = 24
};

/**
 * HorizontalAlignment
 */
typedef NS_ENUM(NSUInteger, WwHorizontalAlignment) {
    wwHorizontalLeft,
    wwHorizontalCenter,
    wwHorizontalRight
};

/**
 * VerticalAlignment
 */
typedef NS_ENUM(NSUInteger, WwVerticalAlignment) {
    wwVerticalTop,
    wwVerticalCenter,
    wwVerticalBottom
};

//二维码容错等级（QR code error tolerance level）
typedef NS_ENUM(NSUInteger, WwQrCodeCorrectionLevel) {
    wwQrCodeCorrectionLevelL,
    wwQrCodeCorrectionLevelM,
    wwQrCodeCorrectionLevelQ,
    wwQrCodeCorrectionLevelH
};
//二维码码制（Qrcode format）
typedef NS_ENUM(NSUInteger, WwCodeFormat) {
    WwCodeFormatQRCode = 0,
    WwCodeFormatDM     = 1,
    WwCodeFormatPDF417 = 2,
};

#endif
