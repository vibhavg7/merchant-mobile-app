import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OrderService } from '../order.service';
import { Router } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-past-orders',
  templateUrl: './past-orders.page.html',
  styleUrls: ['./past-orders.page.scss'],
})
export class PastOrdersPage implements OnInit, OnDestroy {

  // tslint:disable-next-line:variable-name
  orders_billing_amount: any;
  totalPages: number;
  storeorderscount: any;
  storeId: number;
  isLoading = false;
  filterBy: any = '';
  errorMessage: any = '';
  currentPage = 1;
  pageSize = 10;
  orderstatus = 4;
  totalSale = 0;
  storeOrders: any = [];
  subscription: Subscription = new Subscription();
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  constructor(
    private orderService: OrderService,
    private platform: Platform,
    private navCtrl: NavController,
    private router: Router) {
      this.storeId = +JSON.parse(localStorage.getItem('merchantid'));
    }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.navCtrl.navigateRoot(['/home']);
    });
    this.currentPage = 1;
    this.storeOrders = [];
    this.infiniteScroll.disabled = false;
    this.loadPastOrders();
  }

  loadPastOrders(event?) {
    this.isLoading = true;
    this.subscription.add(
    this.orderService.fetchAllStorePastOrders(this.storeId, this.currentPage, this.pageSize, '', this.orderstatus)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe((data: any) => {
      if (+data.status === 200) {
        this.storeOrders = this.storeOrders.concat(data.store_orders_info);
        this.storeorderscount = data.store_order_count[0].store_orders_count;
        this.orders_billing_amount = data.orders_billing_amount[0].orders_billing_amount;
        this.totalPages = Math.ceil(this.storeorderscount / this.pageSize);
        // this.calculateTotalSaleAmount(this.storeOrders);
      }
      if (event) {
        event.target.complete();
      }
    }));
  }

  calculateTotalSaleAmount(storeOrders) {
    storeOrders.forEach((order: any) => {
      this.totalSale += +order.merchant_bill_amount;
    });
  }
  loadMore(event) {
    this.currentPage++;
    console.log(event);
    console.log(this.currentPage);
    this.loadPastOrders(event);
    if (this.currentPage === this.totalPages) {
      console.log('dddd');
      event.target.disabled = true;
    }
  }

  orderDetail(storeOrder) {
    console.log(storeOrder);
    this.navCtrl.navigateForward([`/orders/orderdetail/${storeOrder.order_id}`]);
  }


  backToHome() {
    this.navCtrl.navigateRoot(['/home']);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.subscription.unsubscribe();
  }

}
