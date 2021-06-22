import { Component, AfterViewInit, OnInit } from '@angular/core';

import { Platform, NavController, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import {
  Plugins,
  Capacitor,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';


import { OrderService } from './orders/order.service';
import { Subscription } from 'rxjs';

const { PushNotifications, Modals, Storage } = Plugins;

const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {

  storeId: number;
  subscription: Subscription;
  storeName = 'Welcome Merchant';
  private TOKEN_KEY = 'merchanttoken';
  private MERCHANT_ID = 'merchantid';
  private MERCHANT_PHONE = 'merchantphone';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private navCtrl: NavController,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private orderService: OrderService,
    private statusBar: StatusBar
  ) {
  }

  async setMerchantToken(token) {
    await Storage.set({
      key: 'merchanttoken',
      value: token
    });
  }

  ngOnInit() {
    this.initializeApp();
    this.storeId = +JSON.parse(localStorage.getItem('merchantid'));

    if (isPushNotificationsAvailable) {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();

      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.requestPermission().then(result => {
        if (result.granted) {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });
      PushNotifications.createChannel({
        description: 'Emergency Notifications',
        id: 'fcm_emergency_channel',
        importance: 5,
        lights: true,
        name: 'Emergency Alert Channel',
        sound: 'emergency.mp3',
        vibration: true,
        visibility: 1,
      })
        .then(() => {
          // alert('push channel created: ');
        })
        .catch((error) => {
          // alert(error);
        });
      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
        (token: PushNotificationToken) => {
          // alert('Push registration success, token: ' + token.value);
          this.setMerchantToken(token.value);
        }
      );

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
        (error: any) => {
          alert('Error on registration: ' + JSON.stringify(error));
        }
      );

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotification) => {
          // const audio1 = new Audio('../assets/emergency.mp3');
          // console.log('Audio');
          // audio1.play();
          this.storeId = +JSON.parse(localStorage.getItem('merchantid'));
          alert('Push received: ' + JSON.stringify(notification.title) + JSON.stringify(notification.body));
          this.orderService.fetchOrdersCount(this.storeId).subscribe((data: any) => {
          });
        }
      );
      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: PushNotificationActionPerformed) => {
          this.storeId = +JSON.parse(localStorage.getItem('merchantid'));
          this.orderService.fetchOrdersCount(this.storeId).subscribe((data: any) => {
          });
        }
      );
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (!this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot(['/auth/login']);
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      } else {
        // console.log(localStorage.getItem('storename'));
        // this.storeName = localStorage.getItem('storename');
        this.navCtrl.navigateRoot(['/home']);
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
    });
  }

  ngAfterViewInit() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.router.url === '/auth/login' || this.router.url === '/home') {
        // tslint:disable-next-line:no-string-literal
        navigator['app'].exitApp();
      } else {
        this.navCtrl.pop();
      }
    });
  }

  // ionViewWillEnter() {
  //   console.log('ionViewWillEnter');
  //   // this.subscription = this.authService.getStoreName().subscribe((message: any) => {
  //   //   this.storeName = message.text;
  //   //   console.log(this.storeName);
  //   // });

  // }

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  // get userName() {
  //   console.log(localStorage.getItem('storename'));
  //   const merchant = localStorage.getItem('storename');
  //   return (merchant) ? `Welcome ${merchant}` : 'Grostep Mechant';
  // }

  logout() {
    this.presentAlertConfirm();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Logout!',
      message: 'Are you sure you want to logout!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Logout',
          handler: () => {
            console.log('Confirm Okay');
            this.authService.logout().subscribe((data: any) => {
              if (data.status === 200) {
                localStorage.removeItem(this.MERCHANT_ID);
                localStorage.removeItem(this.TOKEN_KEY);
                localStorage.removeItem(this.MERCHANT_PHONE);
                this.navCtrl.navigateRoot(['/auth/login']);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
  clickMenu(value) {
    this.navCtrl.navigateRoot(`/${value}`);
    this.menuCtrl.close();
  }
}
