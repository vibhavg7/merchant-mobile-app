import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorTracker } from '../../shared/errorTracker';
import { OrderService } from '../../orders/order.service';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  storeId: number;
  isLoading = false;
  errorMessage: any = '';
  merchantData: any;
  constructor(
      private activatedRoute: ActivatedRoute,
      private platform: Platform,
      private navCtrl: NavController,
      private orderService: OrderService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.navCtrl.navigateRoot(['/home']);
    });
    this.isLoading = true;
    this.storeId = +JSON.parse(localStorage.getItem('merchantid'));
    this.orderService.fetchStoreInfoById(this.storeId).subscribe((data) => {
        this.isLoading = false;
        this.merchantData = data.store[0];
        console.log(this.merchantData);
    });
  }

  backToHome() {
    this.navCtrl.navigateRoot(['/home']);
  }

}
