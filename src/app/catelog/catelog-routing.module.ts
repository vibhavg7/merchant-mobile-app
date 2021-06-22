import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./product-catelog/product-catelog.module').then( m => m.ProductCatelogPageModule)
  },
  // {
  //   path: 'merchantproducts/:productId/edit',
  //   loadChildren: () => import('./add-product-catelog/
        // add-product-catelog-routing.module').then( m => m.AddProductCatelogPageRoutingModule)
  // },
  {
    path: 'add-store-product',
    loadChildren: () => import('./add-product-catelog/add-product-catelog.module').then( m => m.AddProductCatelogPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatelogRoutingModule {}
