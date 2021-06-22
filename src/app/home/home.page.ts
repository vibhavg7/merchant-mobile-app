import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderService } from '../orders/order.service';
import { Router } from '@angular/router';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Platform, AlertController } from '@ionic/angular';

const { PushNotifications, Modals } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  subscription: Subscription = new Subscription();
  storeId: number;
  searchCriteriaForm: FormGroup;
  isLoading = false;
  newordercount = 0;
  pendingordercount = 0;
  IsstoreNotClosed;
  pickedordercount = 0;
  pendingBillingCount = 0;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private platform: Platform,
    private changeDetector: ChangeDetectorRef,
    private alertCtrl: AlertController,
    public orderService: OrderService
  ) {
    this.searchCriteriaForm = this.formBuilder.group({
      searchCriteria: ['']
    });
  }

  public async ngOnInit(): Promise<void> {

  }

  async ngAfterViewInit() {
    await this.onEnter();
  }

  public async onEnter(): Promise<void> {
    this.subscription = this.orderService.ordersCount$.subscribe((message: any) => {
      this.newordercount = message.new_order_count;
      this.pendingordercount = message.pending_order_count;
      this.pickedordercount = message.picked_order_count;
      this.IsstoreNotClosed = message.is_store_not_closed;
      // console.log(this.newordercount);
      // console.log(this.pendingordercount);
      // console.log(this.pickedordercount);
      console.log(this.IsstoreNotClosed);
      this.changeDetector.detectChanges();
    });
  }

  ionViewWillEnter() {
    // this.storeClosingStatus = JSON.parse(localStorage.getItem('loginstatus'));
    this.platform.backButton.subscribeWithPriority(0, () => {
      // tslint:disable-next-line:no-string-literal
      navigator['app'].exitApp();
    });
    console.log('ionViewWillEnter');
    this.fetchOrdersCount();
  }

  changeStoreStatus(e) {
    setTimeout(() => {
      const storeClosingChangedValue = this.IsstoreNotClosed;
      this.alertCtrl
        .create({
          header: 'Confirm ?',
          message: `Are you sure you want to ${!this.IsstoreNotClosed ? 'close' : 'open'} the store?`,
          backdropDismiss: false,
          buttons: [
            {
              text: 'Cancel',
              cssClass: 'cancelcss',
              handler: () => {
                this.IsstoreNotClosed = !this.IsstoreNotClosed;
              }
            },
            {
              text: 'YES',
              cssClass: 'updatecss',
              handler: () => {
                console.log(storeClosingChangedValue);
                // this.isLoading = true;
                this.subscription.add(this.orderService.updateStoreClosingStatus(this.storeId, !storeClosingChangedValue)
                // .pipe(finalize(() => this.isLoading = false))
                .subscribe((data: any) => {
                  if (+data.status === 200) {
                    this.IsstoreNotClosed = storeClosingChangedValue;
                    alert(`Store ${!storeClosingChangedValue ? 'closed' : 'opened'} successfully`);
                  } else {
                    this.IsstoreNotClosed = !this.IsstoreNotClosed;
                  }
                }));
              }
            }
          ]
        })
        .then(alertEl => alertEl.present());
    }, 0);
  }

  doRefresh(event) {
    // console.log('Begin async operation');
    this.fetchOrdersCount();
    setTimeout(() => {
      // console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  fetchOrdersCount() {
    this.isLoading = true;
    this.storeId = +JSON.parse(localStorage.getItem('merchantid'));
    this.subscription.add(this.orderService.fetchOrdersCount(this.storeId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: any) => {
        // console.log(data);
        // if (data.status === 200) {
        //   this.newordercount = data.new_order_count[0].new_order_count;
        //   this.pendingordercount = data.pending_order_count[0].pending_order_count;
        //   this.pendingBillingCount = data.pending_billing_order_count[0].pending_billing_order_count;
        //   this.pickedordercount = data.picked_order_count[0].picked_order_count;
        // }
      }));
  }

  newOrder() {
    if (this.newordercount > 0) {
      this.router.navigate(['/orders/ordertrack/1']);
    }
    // this.router.navigate(['/orders/ordertrack'], { queryParams: { state: 'new' } });
  }

  pendingOrder() {
    if (this.pendingordercount > 0) {
      this.router.navigate(['/orders/ordertrack/2']);
    }
  }

  pickedOrder() {
    if (this.pickedordercount > 0) {
      this.router.navigate(['/orders/ordertrack/4']);
    }
  }

  pendingBillingOrders() {
    this.router.navigate(['/orders/ordertrack/3']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
