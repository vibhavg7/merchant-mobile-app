import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderProductDetailPageRoutingModule } from './order-product-detail-routing.module';

import { OrderProductDetailPage } from './order-product-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderProductDetailPageRoutingModule
  ],
  declarations: [OrderProductDetailPage]
})
export class OrderProductDetailPageModule {}
