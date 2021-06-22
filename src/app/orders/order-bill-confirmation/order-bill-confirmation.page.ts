import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { OrderService } from '../order.service';
import { NavController, ToastController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-order-bill-confirmation',
  templateUrl: './order-bill-confirmation.page.html',
  styleUrls: ['./order-bill-confirmation.page.scss'],
})
export class OrderBillConfirmationPage implements OnInit {

  storeId: number;
  billimage: any;
  billInfo: any;
  submitted = false;
  orderId: number;
  @ViewChild('slider', { read: ElementRef, static: true}) slider: ElementRef;
  @ViewChild('billnumber', {static: false}) billnumber: any;
  @ViewChild('billamount', {static: false}) billamount: any;
  sliderOpts = {
    zoom: {
      maxRatio: 3
    }
  };
  constructor(private route: ActivatedRoute,
              private toastCtrl: ToastController,
              private platform: Platform,
              private navCtrl: NavController,
              private orderService: OrderService,
              private router: Router) { }

  ngOnInit() {
    this.storeId = +JSON.parse(localStorage.getItem('merchantid'));
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.navCtrl.navigateRoot(['/home']);
      // this.navCtrl.navigateBack([`orders/ordertrack/${this.orderId}`]);
    });
    this.route.queryParamMap.pipe(
      mergeMap(data => this.getOrderDetails(data))
    ).subscribe((orderData: any) => {
      // console.log(orderData);
      this.billInfo = orderData.billInfo[0];
      this.billimage = this.billInfo.bill_image_url;
      console.log(this.billimage);
    });
  }

  getOrderDetails(data) {
    this.orderId = data.params.order;
    return this.orderService.fetchOrderBillInfo(this.orderId);
  }

  acceptorderImage(billnumber, billamount) {
    this.submitted = true;
    console.log(this.orderId);
    console.log(this.storeId);
    console.log(billnumber);
    console.log(billamount);
    this.orderService.updateStoreOrderStatus(this.orderId, this.storeId, 9, 4, +billnumber, +billamount).subscribe((data: any) => {
      if (data.status === 200) {
        console.log(data);
        this.presentToast('Thanks for confirming the Bill.');
        this.navCtrl.navigateRoot(['/home']);
        this.submitted = false;
      }
    });
  }

  zoom(zoomin) {
    console.log(zoomin);
    const zoom = this.slider.nativeElement.swiper.zoom;
    console.log(zoom);
    if (zoomin) {
      zoom.in();
    } else {
      zoom.out();
    }
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2500, position: 'bottom' });

    toast.present();
  }


  back() {
    this.navCtrl.navigateRoot(['/home']);
    // this.navCtrl.pop();
    // this.navCtrl.navigateBack([`orders/ordertrack/${this.orderId}`]);
  }


}
