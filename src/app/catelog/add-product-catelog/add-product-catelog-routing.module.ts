import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProductCatelogPage } from './add-product-catelog.page';
import { AddProductResolverService } from '../add-product-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: AddProductCatelogPage,
    resolve: { resolvedStoreProduct: AddProductResolverService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProductCatelogPageRoutingModule {}
