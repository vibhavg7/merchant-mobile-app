import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { mergeMap, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-order-product-detail',
  templateUrl: './order-product-detail.page.html',
  styleUrls: ['./order-product-detail.page.scss'],
})
export class OrderProductDetailPage implements OnInit {

  orderProducts: any;
  isLoading: boolean;
  orderId: number;
  orderInfo: any;
  subscription: Subscription = new Subscription();
  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private navCtrl: NavController,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.navCtrl.pop();
    });
    this.isLoading = true;
    this.subscription.add(
    this.activatedRoute.paramMap.pipe(
      mergeMap(data => this.getOrderDetail(data))
    )
    .pipe(finalize(() => this.isLoading = false))
    .subscribe((productData: any) => {
      this.isLoading = false;
      this.orderProducts = productData.order_products_info;
      console.log(this.orderProducts);
    }));
  }

  getOrderDetail(data) {
    return this.orderService.fetchOrderProducts(+data.params.orderId);
  }

  onBack() {
    // this.navCtrl.pop();
    // this.navCtrl.navigateRoot(['/home']);
    this.navCtrl.pop();
  }

}
