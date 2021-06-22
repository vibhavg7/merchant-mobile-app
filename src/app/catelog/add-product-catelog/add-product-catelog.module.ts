import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProductCatelogPageRoutingModule } from './add-product-catelog-routing.module';

import { AddProductCatelogPage } from './add-product-catelog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddProductCatelogPageRoutingModule
  ],
  declarations: [AddProductCatelogPage]
})
export class AddProductCatelogPageModule {}
