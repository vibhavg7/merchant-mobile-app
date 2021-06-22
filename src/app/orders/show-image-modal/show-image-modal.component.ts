import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { OrderService } from '../../orders/order.service';

@Component({
  selector: 'app-show-image-modal',
  templateUrl: './show-image-modal.component.html',
  styleUrls: ['./show-image-modal.component.scss'],
})
export class ShowImageModalComponent implements OnInit {

  @Input() billimage: any;
  @Input() orderId: any;
  @Input() orderStatus: any;
  @ViewChild('slider', { read: ElementRef, static: true}) slider: ElementRef;
  sliderOpts = {
    zoom: {
      maxRatio: 3
    }
  };
  constructor(private modalCtrl: ModalController,
              private navCtrl: NavController,
              private orderService: OrderService) { }

  ngOnInit() {
    // console.log(this.billimage);
    console.log(this.sliderOpts);
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
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

  back() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
