import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderProductDetailPage } from './order-product-detail.page';

const routes: Routes = [
  {
    path: '',
    component: OrderProductDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderProductDetailPageRoutingModule {}
