import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderBillConfirmationPageRoutingModule } from './order-bill-confirmation-routing.module';

import { OrderBillConfirmationPage } from './order-bill-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderBillConfirmationPageRoutingModule
  ],
  declarations: [OrderBillConfirmationPage]
})
export class OrderBillConfirmationPageModule {}
