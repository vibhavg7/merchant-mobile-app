import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';
import { ToastController, Platform } from '@ionic/angular';


const { PushNotifications, Storage } = Plugins;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  storeId: number;
  isLoading = false;
  phoneNumber: any = '';
  @ViewChild('input', { static: false }) input;
  token: any;
  subscription: Subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private toastCtrl: ToastController,
    private router: Router) { }

  ngOnInit() {
    // PushNotifications.register();

    // // On success, we should be able to receive notifications
    // PushNotifications.addListener('registration',
    //   (token: PushNotificationToken) => {
    //     this.token = token.value;
    //   }
    // );
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.input.setFocus();
    }, 0);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      // tslint:disable-next-line:no-string-literal
      navigator['app'].exitApp();
    });
    this.storeId = +this.activatedRoute.snapshot.paramMap.get('storeId');
  }

  async getMerchantToken(phoneNumber) {
    const merchanttoken = await Storage.get({ key: 'merchanttoken' });
    if (phoneNumber === undefined || phoneNumber.length < 10) {
    } else if (phoneNumber !== undefined && phoneNumber.length === 10) {
      this.isLoading = true;
      this.subscription.add(this.authService.loginMerchant(phoneNumber, merchanttoken.value)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe((data: any) => {
          if (data.status === 400) {
            alert('Unable to login.Our Team will get back to you soon for your registration');
          } else if (data.status === 200) {
            // this.router.navigate(['/', 'auth', 'validate-otp', data.customer_id, { storeId: this.storeId }]);
            this.router.navigate(['/', 'auth', 'validate-otp', data.store_id]);
          }
        }));
    } else {
      alert('Unable to login.Please enter valid phone number');
    }
  }

  login(phoneNumber: any) {
    this.getMerchantToken(phoneNumber);
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 1000, position: 'middle' });

    toast.present();
  }
}
