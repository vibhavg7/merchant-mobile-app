import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveOrdersPageRoutingModule } from './live-orders-routing.module';

import { LiveOrdersPage } from './live-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveOrdersPageRoutingModule
  ],
  declarations: [LiveOrdersPage]
})
export class LiveOrdersPageModule {}
