import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderProductsListPage } from './order-products-list.page';

describe('OrderProductsListPage', () => {
  let component: OrderProductsListPage;
  let fixture: ComponentFixture<OrderProductsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderProductsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProductsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
