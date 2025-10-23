//
//  WwQrcodeBlock.h
//  PrintExtApi
//
//  Created by wewin on 2019/3/9.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <WewinPrintExtApi/WwBlock.h>

@interface WwQrcodeBlock : WwBlock

///二维码宽度，高度会根据宽度自适应（The width, height of the QR code will adapt to the width）
@property (nonatomic, assign) float width;

///是否需要强制固定大小，默认为NO(Whether to force a fixed size, the default is NO)
@property (nonatomic, assign) BOOL needResize;

///容错等级 默认为L(Fault tolerance level The default is L)
@property (nonatomic, assign) WwQrCodeCorrectionLevel qrCodeCorrectionLeve;

///二维码码制（The code format）
@property (nonatomic, assign) WwCodeFormat codeFormat;

///二维码内容(QR code content)
@property (nonatomic, strong) NSString *content;

///根据dot转换后的宽度(According to the width after dot conversion)
@property (nonatomic,readonly,assign) float transformWidth;

///是否反色,默认NO (Whether to invert the color, default is NO)
@property (nonatomic, assign) BOOL needReverseColor;

///是否启用预览静态二维码,默认NO(Whether to enable preview of static QR code, default is NO)
@property (nonatomic, assign) BOOL ifPreViewStatic;

///是否在二维码上添加Logo  Logo可以为UIImage 或 图片名字，可不设置size， logo的大小会被自动设置为对应二维码等级的 7% 15% 25% 30%(Whether to add a logo to the QR code. The logo can be a UIImage or a picture name. The size can be left unset. The logo size will be automatically set to 7%, 15%, 25%, or 30% of the corresponding QR code level.)
@property (nonatomic) id logo;

@property (nonatomic,assign) CGSize logoSize;

@property (nonatomic,readonly,assign) CGSize transformlogoSize;


@end
