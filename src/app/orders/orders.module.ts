import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { ShowImageModalComponent } from './show-image-modal/show-image-modal.component';
import { IonicModule } from '@ionic/angular';
import { MyDatePipePipe } from './my-date-pipe.pipe';

@NgModule({
  declarations: [ShowImageModalComponent],
  imports: [
    OrdersRoutingModule,
    CommonModule,
    IonicModule,
  ],
  entryComponents: [ShowImageModalComponent]
})
export class OrdersModule { }
