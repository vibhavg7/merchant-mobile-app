import { Component, OnInit, ViewChild, OnDestroy, OnChanges } from '@angular/core';
import { ProductsService } from '../products.service';
import { AlertController, ToastController, NavController, Platform, IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize, tap, distinctUntilChanged, debounceTime, startWith, map } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as _ from 'lodash';
@Component({
  selector: 'app-product-catelog',
  templateUrl: './product-catelog.page.html',
  styleUrls: ['./product-catelog.page.scss'],
})
export class ProductCatelogPage implements OnInit, OnDestroy {

  orignalstoreproductsList: any;
  storeId: number;
  isLoading = false;
  filterBy: any = '';
  searchTerm: any = '';
  errorMessage: any = '';
  currentPage = 1;
  pageSize = 20;
  storeproductsList: any = [];
  totalPages: any;
  storeproductscount: any = 0;
  subscription: Subscription = new Subscription();
  public searchControl: FormControl;
  // searchCriteriaForm: FormGroup;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  constructor(
    private productService: ProductsService,
    private toastCtrl: ToastController,
    private router: Router,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private navCtrl: NavController,
    private alertCtrl: AlertController) {
    this.searchControl = new FormControl();
    // this.searchCriteriaForm = this.formBuilder.group({
    //   searchCriteria: ['']
    // });
  }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe(search => {
        this.isLoading = false;
        this.setFilteredItems(search);
      });
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.navCtrl.navigateRoot(['/home']);
    });
    this.storeproductsList = [];
    this.storeproductscount = 0;
    this.totalPages = 1;
    // this.infiniteScroll.disabled = false;
    this.loadProductCatelog();
  }

  onSearchInput() {
    this.isLoading = true;
  }



  setFilteredItems(searchTerm) {
    this.storeproductsList = this.orignalstoreproductsList.filter(item => {
      return item.product_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
    this.storeproductscount = this.storeproductsList.length;
    console.log(this.storeproductsList);
  }
  changeProductStock(product) {
    this.alertCtrl
      .create({
        header: 'Confirm Update the stock',
        message: 'Are you sure you want to update the stock?',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Cancel',
            cssClass: 'cancelcss',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'YES',
            cssClass: 'updatecss',
            handler: () => {
              const obj: any = {};
              obj.stock = !product.stock;
              this.isLoading = true;
              this.subscription.add(this.productService.updateStoreProduct(product.store_product_mapping_id, obj)
              .pipe(finalize(() => this.isLoading = false))
              .subscribe((data: any) => {
                if (data.status === 200) {
                  this.storeproductsList.filter((data1: any) => {
                    if (data1.store_product_mapping_id === product.store_product_mapping_id) {
                      data1.stock = !data1.stock;
                    }
                  });
                  this.presentToast('Stock updated successfully');
                }
              }));
            }
          }]
      })
      .then(alertEl => alertEl.present());
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 1000, position: 'bottom' });
    toast.present();
  }

  backToHome() {
    this.navCtrl.navigateRoot(['/home']);
  }

  // deleteStoreProduct(product) {
  //   this.alertCtrl
  //     .create({
  //       header: 'Confirm delete?',
  //       message: 'Are you sure you want to delete the product?',
  //       buttons: [
  //         {
  //           text: 'Cancel',
  //           cssClass: 'cancelcss',
  //           handler: () => {
  //             console.log('Cancel clicked');
  //           }
  //         },
  //         {
  //           text: 'YES',
  //           cssClass: 'updatecss',
  //           handler: () => {
  //             console.log('deleteStoreProduct');
  //             const obj: any = {};
  //             obj.status = !product.status;
  //             this.productService.updateStoreProduct(product.store_product_mapping_id, obj)
  //               .subscribe((data: any) => {
  //                 console.log(data);
  //                 if (data.status === 200) {
  //                   this.storeproductsList.filter((data1: any) => {
  //                     if (data1.store_product_mapping_id === product.store_product_mapping_id) {
  //                       data1.status = !data1.status;
  //                     }
  //                   });
  //                   // this.navCtrl.navigateRoot('/home');
  //                   this.presentToast('Product updated successfully');
  //                 }
  //               });
  //           }
  //         }]
  //     })
  //     .then(alertEl => alertEl.present());
  // }

  editStoreProduct(product) {
    const obj = { productId: product.store_product_mapping_id };
    this.router.navigate(['/catalog/add-store-product', obj]);
  }

  addNewProduct() {
    const obj = { productId: '' };
    this.router.navigate(['/catalog/add-store-product', obj]);
  }

  loadProductCatelog() {
    this.isLoading = true;
    this.storeId = +JSON.parse(localStorage.getItem('merchantid'));
    this.subscription.add(
      this.productService.fetchStoreProducts(this.storeId, this.currentPage, this.pageSize, this.filterBy)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe((data: any) => {
          this.isLoading = false;
          this.storeproductsList = this.storeproductsList.concat(data.store_products_info);
          this.orignalstoreproductsList = JSON.parse(JSON.stringify(this.storeproductsList));
          this.storeproductscount = data.store_products_count[0].store_products_count;
          this.totalPages = Math.ceil(this.storeproductscount / this.pageSize);
          console.log(this.storeproductsList);
          console.log(this.storeproductscount);
          console.log(this.totalPages);
          // if (event) {
          //   event.target.complete();
          // }
        }));
  }

  loadMore(event) {
    // this.currentPage++;
    // this.loadProductCatelog(event);
    // if (this.currentPage === this.totalPages) {
    //   event.target.disabled = true;
    // }
  }

  productClick() {
    // this.navCtrl.navigateForward(['/orders/orderproductdetail/8']);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.subscription.unsubscribe();
  }

}
