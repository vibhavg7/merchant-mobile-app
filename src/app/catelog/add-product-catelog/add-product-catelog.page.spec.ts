import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddProductCatelogPage } from './add-product-catelog.page';

describe('AddProductCatelogPage', () => {
  let component: AddProductCatelogPage;
  let fixture: ComponentFixture<AddProductCatelogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductCatelogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductCatelogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
