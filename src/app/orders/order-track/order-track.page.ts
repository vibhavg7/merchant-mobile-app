import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AlertController, ToastController, NavController, Platform, IonInfiniteScroll } from '@ionic/angular';
import { OrderService } from '../order.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-order-track',
  templateUrl: './order-track.page.html',
  styleUrls: ['./order-track.page.scss'],
})
export class OrderTrackPage implements OnInit, OnDestroy {

  offset: any;
  totalPages: number;
  storeOrders: any = [];
  storeordertotalcount: any;
  storeId: number;
  orderType: number;
  currentPage = 1;
  pageSize = 10;
  isLoading: boolean;
  searchCriteriaForm: FormGroup;
  subscription: Subscription = new Subscription();
  // @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    // private router: Router,
    private platform: Platform,
    private formBuilder: FormBuilder,
    private orderService: OrderService) {
    this.searchCriteriaForm = this.formBuilder.group({
      searchCriteria: ['']
    });
  }


  ngOnInit() {
    this.subscription.add(
      this.activatedRoute.paramMap.subscribe((data: any) => {
        if (!data.has('state')) {
          this.navCtrl.navigateBack('/home');
          return;
        }
        this.orderType = +data.get('state');
        this.storeId = +JSON.parse(localStorage.getItem('merchantid'));
      })
    );
  }

  backToHome() {
    this.navCtrl.navigateRoot(['/home']);
  }


  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.navCtrl.pop();
    });
    this.offset = new Date().getTimezoneOffset().toString();
    this.currentPage = 1;
    this.storeOrders = [];
    this.loadStoreOrders();
  }

  loadStoreOrders(event?) {
    this.isLoading = true;
    if (this.orderType === 1 || this.orderType === 4) {
      this.fetchNewAndPickedOrders(event);
    }
    if (this.orderType === 2) {
      this.fetchAllOngoingOrders(event);
    }
  }

  fetchAllOngoingOrders(event?) {
    this.subscription.add(
    this.orderService.fetchAllOngoingOrders(this.storeId, this.currentPage, this.pageSize, '')
    .pipe(finalize(() => this.isLoading = false))
    .subscribe((data) => {
      this.storeordertotalcount = data.ongoing_order_count[0].store_orders_count;
      this.storeOrders = this.storeOrders.concat(data.ongoing_orders_info);
      this.totalPages = Math.ceil(this.storeordertotalcount / this.pageSize);
      if (event) {
        event.target.complete();
      }
    }));
  }

  fetchNewAndPickedOrders(event?) {
    this.subscription.add(
      this.orderService.fetchAllNewAndPickedOrders(
        this.storeId, this.currentPage, this.pageSize, '', this.orderType
      )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: any) => {
        this.storeOrders = this.storeOrders.concat(data.store_orders_info);
        this.storeordertotalcount = data.store_order_count[0].store_orders_count;
        this.totalPages = Math.ceil(this.storeordertotalcount / this.pageSize);
        if (event) {
          event.target.complete();
        }
      }));
  }

  // loadMore(event) {
  //   this.currentPage++;
  //   this.loadStoreOrders(event);
  //   if (this.currentPage === this.totalPages) {
  //     event.target.disabled = true;
  //   }
  // }
  onChanges() {
  }
  orderDetail(orderid) {
    this.navCtrl.navigateForward([`/orders/orderproductdetail/${orderid}`]);
  }

  orderRequested(orderid, orderstatus, storemerchantstatus, orderAmount) {
    this.orderService.updateStoreOrderStatus(orderid, this.storeId, orderstatus, storemerchantstatus, 0, orderAmount)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe((data: any) => {
      console.log(data);
      if (data.status === 200) {
        if (+data.order_status === 12) {
          this.presentToast('You cannot accept this order since this order is cancelled by the customer');
        } else {
          if (storemerchantstatus === 2) {
            this.presentToast('You have sucessfully accepted the order.The order will be soon picked by delivery boy');
          } else if (storemerchantstatus === 4) {
            this.presentToast('You have sucessfully cancelled the order. Our operation team will contact you soon');
          }
        }
        this.navCtrl.navigateRoot([`/home`]);
      }
    });
  }
  itemsRequested(orderid, status) {
    if (this.orderType === 2) {
      this.navCtrl.navigateForward(['/orders/orderproductsinfo'], { queryParams: { order: orderid, orderstatus: status } });
    }
  }

  pendingBillConfirmation(orderid, status) {
    if (this.orderType === 2) {
      this.navCtrl.navigateForward(['/orders/confirmation'], { queryParams: { order: orderid, orderstatus: status } });
    }
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2500, position: 'bottom' });

    toast.present();
  }

  // ionViewWillLeave() {
  //   this.infiniteScroll.disabled = false;
  //   this.infiniteScroll.position = 'bottom';
  // }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
