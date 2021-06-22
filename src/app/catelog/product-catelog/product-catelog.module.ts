import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductCatelogPageRoutingModule } from './product-catelog-routing.module';

import { ProductCatelogPage } from './product-catelog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductCatelogPageRoutingModule
  ],
  declarations: [ProductCatelogPage]
})
export class ProductCatelogPageModule {}
