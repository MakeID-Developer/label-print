//
//  WwAlertView.h
//  PrintExtApi
//
//  Created by wewin on 2019/3/7.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol WwAlertViewDelegate

- (void)wwIOS7dialogButtonTouchUpInside:(id)alertView clickedButtonAtIndex:(NSInteger)buttonIndex;

@end

/**
 设备列表弹框
 */
@interface WwAlertView : UIView<WwAlertViewDelegate>

@property (nonatomic, retain) UIView *parentView;    // The parent view this 'dialog' is attached to
@property (nonatomic, retain) UIView *dialogView;    // Dialog's container view
@property (nonatomic, retain) UIView *containerView; // Container within the dialog (place your ui elements here)

@property (nonatomic, assign) id<WwAlertViewDelegate> delegate;
@property (nonatomic, retain) NSArray *buttonTitles;
@property (nonatomic, assign) BOOL useMotionEffects;
@property (nonatomic, assign) BOOL closeOnTouchUpOutside;       // Closes the AlertView when finger is lifted outside the bounds.

@property (copy) void (^onButtonTouchUpInside)(WwAlertView *alertView, int buttonIndex) ;

- (id)init;
/*!
 DEPRECATED: Use the [CustomIOSAlertView init] method without passing a parent view.
 */
- (id)initWithParentView: (UIView *)_parentView __attribute__ ((deprecated));
- (void)show;
- (void)close;
- (void)wwIOS7dialogButtonTouchUpInside:(id)sender;
- (void)setOnButtonTouchUpInside:(void (^)(WwAlertView *alertView, int buttonIndex))onButtonTouchUpInside;
- (void)deviceOrientationDidChange: (NSNotification *)notification;
- (void)dealloc;

@end
