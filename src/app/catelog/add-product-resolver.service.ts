import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductsService } from './products.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddProductResolverService implements Resolve<any> {

  constructor(private productService: ProductsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const productId = route.params.productId;
    if (productId !== '') {
      return this.productService.fetchStoreProductInfoById(productId)
      .pipe(
        map(storeProductInfoResolver => (
          { storeProductInfo: storeProductInfoResolver.products_info[0], error: '' }
        )),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          //   console.log(message);
          return of({ storeProductInfo: null, error: message });
        })
      );
    }
    return of([]);
  }
}
