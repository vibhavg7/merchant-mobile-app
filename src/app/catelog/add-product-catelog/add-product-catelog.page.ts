import { Component, OnInit, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, AlertController, Platform, ToastController } from '@ionic/angular';
import {
  Plugins,
  Capacitor
} from '@capacitor/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ProductsService } from '../products.service';
@Component({
  selector: 'app-add-product-catelog',
  templateUrl: './add-product-catelog.page.html',
  styleUrls: ['./add-product-catelog.page.scss'],
})
export class AddProductCatelogPage implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  isLoading = false;
  submitted = false;
  storeProductData: any;
  buttonSubmitted = false;
  public addStoreProductForm: FormGroup;
  productId: any = 0;
  subscription: Subscription = new Subscription();
  registerCredentials = {
    product_name: '', product_marked_price: '', store_selling_price: '',
    store_discount: 0, store_product_caping: '', stock: 1, status: ''
  };
  constructor(
    public fb: FormBuilder,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private productService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private platform: Platform,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    // this.addStoreProductForm = fb.group({
    //   stock: [null, Validators.required],
    //   product_name: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]{2,80}$')])],
    //   product_marked_price: [null, Validators.compose([Validators.required])],
    //   store_selling_price: [null, Validators.compose([Validators.required])],
    //   store_discount: [null, Validators.compose([Validators.required])],
    //   store_product_caping: [null, Validators.compose([Validators.required])],
    //   status: [null]
    // });
    this.addStoreProductForm = fb.group({
      stock: [null, Validators.required],
      // Validators.pattern('[a-zA-Z ]{2,80}$')
      product_name: [null, Validators.compose([Validators.required])],
      product_marked_price: [null, Validators.compose([Validators.required])],
      store_selling_price: [null, Validators.compose([Validators.required])],
      store_discount: [null, Validators.compose([Validators.required])],
      store_product_caping: [null, Validators.compose([Validators.required])],
      status: [null]
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    console.log(charCode);
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  calculateDiscount(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else {
      const discountAmount = +this.registerCredentials.product_marked_price - +this.registerCredentials.store_selling_price;
      this.registerCredentials.store_discount = +((+discountAmount / +this.registerCredentials.product_marked_price) * 100).toFixed(2);
    }
    return true;
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    console.log(this.productId);
    if (this.productId) {
      this.storeProductData = this.activatedRoute.snapshot.data.resolvedStoreProduct.storeProductInfo;
      console.log(this.storeProductData);
      this.registerCredentials.product_name = this.storeProductData.product_name;
      this.registerCredentials.product_marked_price = this.storeProductData.product_marked_price;
      this.registerCredentials.store_selling_price = this.storeProductData.store_selling_price;
      this.registerCredentials.store_discount =
        +((+this.storeProductData.store_discount / +this.registerCredentials.product_marked_price) * 100)
          .toFixed(2);
      this.registerCredentials.store_product_caping = this.storeProductData.store_product_caping;
      this.registerCredentials.stock = +this.storeProductData.stock;
      this.registerCredentials.status = this.storeProductData.status;
    }
    this.cdr.detectChanges();
  }

  ngAfterViewChecked() {
    // console.log('ngAfterViewChecked');
  }


  get f() { return this.addStoreProductForm.controls; }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.navCtrl.pop();
    });
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
  }

  ionViewWillEnter() {

  }

  addStoreProduct() {
    this.submitted = true;
    this.isLoading = true;
    if (!this.addStoreProductForm.valid) {
      this.presentToast('Please fill all the entries');
      this.isLoading = false;
      return;
    }
    if (this.productId !== '') {
      this.isLoading = true;
      this.buttonSubmitted = true;
      const discountAmount = +this.registerCredentials.product_marked_price - +this.registerCredentials.store_selling_price;
      this.registerCredentials.store_discount = discountAmount;
      this.subscription.add(
        this.productService.editStoreProduct(this.productId, this.registerCredentials)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.submitted = false;
          this.buttonSubmitted = false;
        }))
        .subscribe(data => {
          if (data.status === 200) {
            this.navCtrl.pop();
            this.presentToast('product successfully updated');
          } else {
            this.presentToast('Unable to update product');
          }
          // this.isLoading = false;
        }));
    } else {
      // this.isLoading = true;
      // this.buttonSubmitted = true;
      // // this.registerCredentials.customer_id = localStorage.getItem('customerid');
      // this.productService.addNewStoreProduct(this.registerCredentials).pipe()
      //   .subscribe((data: any) => {
      //     if (data.status === 200) {
      //       this.presentToast('product successfully updated');
      //     } else {
      //       this.presentToast('Unable to update product');
      //     }
      //     this.navCtrl.pop();
      //     this.isLoading = false;
      //     this.submitted = false;
      //     this.buttonSubmitted = false;
      //   });
    }
  }

  backToHome() {
    this.navCtrl.pop();
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 1000, position: 'middle' });
    toast.present();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.subscription.unsubscribe();
  }

}
