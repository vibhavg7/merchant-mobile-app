import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductCatelogPage } from './product-catelog.page';

const routes: Routes = [
  {
    path: '',
    component: ProductCatelogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCatelogPageRoutingModule {}
