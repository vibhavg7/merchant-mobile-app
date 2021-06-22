import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { mergeMap, map } from 'rxjs/operators';
import { ShowImageModalComponent } from '../show-image-modal/show-image-modal.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  isLoading: boolean;
  orderId: number;
  orderInfo: any;
  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private navCtrl: NavController,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    // this.activatedRoute.paramMap.subscribe((data: any) => {
    //   if (!data.has('orderId')) {
    //     this.navCtrl.navigateBack('/home');
    //     return;
    //   }
    //   this.orderId = +data.get('orderId');
    // });
    this.activatedRoute.paramMap.pipe(
      mergeMap(data => this.getOrderDetail(data))
    )
    .subscribe((orderData: any) => {
      this.isLoading = false;
      this.orderInfo = orderData.customer_orders_info[0];
      console.log(this.orderInfo);
    });

  }

  getOrderDetail(data) {
    console.log(data);
    return this.orderService.fetchOrderInformationById(+data.params.orderId);
  }

  backToHome() {
    // this.navCtrl.navigateRoot(['/home']);
    this.navCtrl.pop();
  }

  viewBill(billImage) {
    this.modalController.create({
      component: ShowImageModalComponent,
      componentProps: { billimage: billImage, orderId: this.orderId }
    }).then(modalel => {
      modalel.present();
      return modalel.onDidDismiss();
    }).then((resultData: any) => {
      // this.livestatus = +resultData.data.orderstatus;
      // this.setHeight(resultData.data.orderstatus);
    });
  }

}
