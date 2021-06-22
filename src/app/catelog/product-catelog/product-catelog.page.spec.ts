import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductCatelogPage } from './product-catelog.page';

describe('ProductCatelogPage', () => {
  let component: ProductCatelogPage;
  let fixture: ComponentFixture<ProductCatelogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCatelogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCatelogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
