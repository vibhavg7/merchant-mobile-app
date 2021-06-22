import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderBillConfirmationPage } from './order-bill-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: OrderBillConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderBillConfirmationPageRoutingModule {}
