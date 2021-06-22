import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { ErrorTracker } from '../shared/errorTracker';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private storeServiceUrl = 'https://api.grostep.com/storesapi/';
  constructor(private http: HttpClient) { }

  fetchStoreProducts(storeId: number, pagenumber: number, pagesize: number, filterBy: any) {
    const obj: any = {};
    obj.multiplePages = false;
    obj.page_number = pagenumber; obj.page_size = pagesize; obj.storeId = storeId;
    obj.filterBy = filterBy;
    console.log(obj);
    return this.http.post<any[]>(`${this.storeServiceUrl}storeinfo/storeproducts`, obj)
      .pipe(
        tap(data => {
          console.log(data);
        })
        , map((data) => {
          return data;
        })
        , catchError(this.handleError)
      );
  }

  fetchStoreProductInfoById(productId) {
    return this.http.get<any>(`${this.storeServiceUrl}storeinfo/storeproducts/${productId}`)
      .pipe(
        tap(data => {
        })
        , map((data) => {
          return data;
        })
        , catchError(this.handleError)
      );
  }

  editStoreProduct(productId, product) {
    console.log(product);
    return this.http.put<any>(`${this.storeServiceUrl}storeinfo/storeproducts/${productId}`, product)
      .pipe(
        tap(data => {
        })
        , map((data) => {
          return data;
        })
        , catchError(this.handleError)
      );
  }

  // addNewStoreProduct(product) {
  //   return this.http.post<any>(`${this.storeServiceUrl}customeraddress`, product)
  //     .pipe(
  //       tap(data => {
  //       })
  //       , map((data) => {
  //         return data;
  //       })
  //       , catchError(this.handleError)
  //     );
  // }
  updateStoreProduct(storeProductId, obj) {

    const url = `${this.storeServiceUrl}storeinfo/storeproducts/updatestock/${storeProductId}`;
    // console.log(obj);
    // console.log(url);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(url, obj, { headers }).pipe(
      tap(
        (data) => { console.log(JSON.stringify(data));
      }),
      map((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse): Observable<ErrorTracker> {

    const dataError = new ErrorTracker();
    dataError.errorNumber = 100;
    dataError.errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    dataError.friendlyMessage = 'An error retriving data';
    return throwError(dataError);
  }
}
