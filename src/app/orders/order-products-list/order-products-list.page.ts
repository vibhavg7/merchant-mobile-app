import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order.service';
import { mergeMap } from 'rxjs/operators';
import { ToastController, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-order-products-list',
  templateUrl: './order-products-list.page.html',
  styleUrls: ['./order-products-list.page.scss'],
})
export class OrderProductsListPage implements OnInit {

  orderstatus: any;
  storeId: number;
  orderProducts = [];
  orderId: number;
  isLoading = false;
  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private toastCtrl: ToastController,
              private navCtrl: NavController,
              private platform: Platform,
              private orderService: OrderService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      // this.navCtrl.pop();
      this.navCtrl.navigateRoot(['/home']);
    });
    this.isLoading = true;
    this.storeId = +JSON.parse(localStorage.getItem('merchantid'));
    this.route.queryParamMap.pipe(
      mergeMap(data => this.getOrderProducts(data))
    ).subscribe((productData: any) => {
      this.isLoading = false;
      this.orderProducts = productData.order_products_info;
      console.log(this.orderProducts);
    });
  }

  getOrderProducts(data) {
    this.orderId = data.params.order;
    this.orderstatus = +data.params.orderstatus;
    return this.orderService.fetchOrderProducts(data.params.order);
  }

  confirmedItems(orderstatus, storemerchantstatus) {
    this.orderService.updateStoreOrderStatus(this.orderId, this.storeId, orderstatus, storemerchantstatus, 0, 0).subscribe((data: any) => {
      console.log(data);
      if (data.status === 200) {
        console.log(data);
        this.presentToast('Thanks for confirming the Items.Please accept the bill.');
        this.router.navigate(['/orders/confirmation'], {queryParams: { order: this.orderId }});
      }
    });
  }


  async presentToast(msg) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2500, position: 'bottom' });
    toast.present();
  }

  back() {
    // this.navCtrl.pop();
    this.navCtrl.navigateRoot(['/home']);
  }

  pendingBillConfirmation() {
    // this.router.navigate(['/orders/confirmation'], {queryParams: { order: this.orderId, orderstatus: status }});
  }
}
