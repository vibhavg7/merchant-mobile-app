import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'pastorders',
    loadChildren: () => import('./past-orders/past-orders.module').then( m => m.PastOrdersPageModule)
  },
  {
    path: 'ordertrack/:state',
    loadChildren: () => import('./order-track/order-track.module').then( m => m.OrderTrackPageModule)
  },
  {
    path: 'orderproductsinfo',
    loadChildren: () => import('./order-products-list/order-products-list.module').then( m => m.OrderProductsListPageModule)
  },
  {
    path: 'confirmation',
    loadChildren: () => import('./order-bill-confirmation/order-bill-confirmation.module').then( m => m.OrderBillConfirmationPageModule)
  },
  {
    path: 'orderdetail/:orderId',
    loadChildren: () => import('./order-detail/order-detail.module').then( m => m.OrderDetailPageModule)
  },
  {
    path: 'orderproductdetail/:orderId',
    loadChildren: () => import('./order-product-detail/order-product-detail.module').then( m => m.OrderProductDetailPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./live-orders/live-orders.module').then( m => m.LiveOrdersPageModule)
  },  {
    path: 'order-track',
    loadChildren: () => import('./order-track/order-track.module').then( m => m.OrderTrackPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
