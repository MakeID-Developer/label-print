//
//  BluetoothViewController.m
//  WewinPrintExtApiDemo
//
//  Created by 凉皮 on 2025/10/22.
//  Copyright © 2025 wewin. All rights reserved.
//

#import "BluetoothViewController.h"
#import <WewinPrintLib/WewinPrintLib.h>
#import "UIAlertController+Blocks.h"
#import "MBProgressHUD.h"

#define WS(weakSelf)  __weak __typeof(&*self)weakSelf = self;

@interface BluetoothViewController ()<UITableViewDelegate, UITableViewDataSource>

@property (weak, nonatomic) IBOutlet UITableView *tableView;
///搜索到的蓝牙设备
@property (nonatomic, strong) NSMutableArray *devicesArray;

@end

@implementation BluetoothViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.view.backgroundColor = UIColor.whiteColor;
    self.tableView.delegate = self;
    self.tableView.dataSource = self;
    [self.tableView registerClass:[UITableViewCell class] forCellReuseIdentifier:@"UITableViewCell"];
    self.tableView.estimatedRowHeight = 48;

    [self.devicesArray removeAllObjects];
    [self.tableView reloadData];

    self.tableView.hidden = NO;
    WS(weakSelf);

    [WwBleConnect shareWwBleConnect].baseCallBack = ^(BaseHandle handle, BaseState state, ConnectResponse *response) {
        
        if (handle == BaseHandleDevice){//设备状态
            switch (state) {
                case BaseDeviceStatePoweredOn: {
                    // Do nothing or handle powered on state
                }
                    break;
                case BaseDeviceStatePoweredOff: {
                    [UIAlertController showAlertInViewController:self
                                                          withTitle:@"Notice"
                                                            message:@"Bluetooth is turned off"
                                                  cancelButtonTitle:@"OK"
                                             destructiveButtonTitle:nil
                                                 otherButtonTitles:nil
                                                          tapBlock:nil];
                }
                    break;
                case BaseDeviceStateUnauthorized: {
                    [UIAlertController showAlertInViewController:self
                                                          withTitle:@"Notice"
                                                            message:@"Bluetooth permission not granted"
                                                  cancelButtonTitle:@"OK"
                                             destructiveButtonTitle:nil
                                                 otherButtonTitles:nil
                                                          tapBlock:nil];
                }
                    break;
                default: {
                    [UIAlertController showAlertInViewController:self
                                                          withTitle:@"Notice"
                                                            message:@"Bluetooth error"
                                                  cancelButtonTitle:@"OK"
                                             destructiveButtonTitle:nil
                                                 otherButtonTitles:nil
                                                          tapBlock:nil];
                }
                    break;
            }

            
        } else if(handle == BaseHandleSearch) {

            if (state == BaseSearchStateSuccess) {

            } else if (state == BaseSearchStateFailed) {
                
                NSLog(@"Search failed!!");
                
            } else if (state == BaseSearchStatePiece) {

                dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{

                    [weakSelf.devicesArray addObject:response.device];

                    dispatch_async(dispatch_get_main_queue(), ^{
                        [weakSelf.tableView reloadData];
                    });
                });
            }
            
        } else if (handle == BaseHandleConnect) {//连接操作
            
            if (state == BaseConnectStateSuccess) {

                [MBProgressHUD hideHUDForView:self.view animated:YES];

                dispatch_async(dispatch_get_main_queue(), ^{
                    
                    [self.navigationController popViewControllerAnimated:YES];
                });

                [[NSUserDefaults standardUserDefaults] setValue:response.device.identifier forKey:@"ConnectedBluetoothIdentfier"];
                [[NSUserDefaults standardUserDefaults] synchronize];
//                
//                NSString *string = [[NSUserDefaults standardUserDefaults] stringForKey:@"ConnectedBluetoothIdentfier"];
                
            }else if(state == BaseConnectStateFailed){
                
                NSLog(@"Connect fail!!");
                
                [UIAlertController showAlertInViewController:self
                                                   withTitle:@"提示"
                                                     message:@"连接失败"
                                           cancelButtonTitle:@"知道了"
                                      destructiveButtonTitle:nil
                                           otherButtonTitles:nil
                                                    tapBlock:nil];
                
                [MBProgressHUD hideHUDForView:self.view animated:YES];
            }
        }
    };

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [[WwBleConnect shareWwBleConnect] search];
    });
}

#pragma mark - TableView Delegate

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.devicesArray.count;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *identifier = @"UITableViewCell";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:identifier];
    
    WwDevice *device = self.devicesArray[indexPath.row];
    
    cell.textLabel.text = [NSString stringWithFormat:@"Deivce Name：%@", device.connectName];
    cell.detailTextLabel.text = device.identifier;
    
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    
    WwDevice *device = self.devicesArray[indexPath.row];
    
    [[WwBleConnect shareWwBleConnect] connect:device.connectName];
    
    //OR
    //[[WwBleConnect shareWwBleConnect] retrieveConnect:device.identifier]

}

- (IBAction)clickSerachButtonAction:(UIButton *)sender {
    
    [self.devicesArray removeAllObjects];
    
    [[WwBleConnect shareWwBleConnect] search];
}

- (NSMutableArray *)devicesArray {
    if (!_devicesArray) {
        _devicesArray = [[NSMutableArray alloc] init];
    }
    return _devicesArray;
}

@end
