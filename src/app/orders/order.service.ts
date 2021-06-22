import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, throwError, of, Subject } from 'rxjs';
// import { ErrorTracker } from '../shared/errorTracker';

export class ErrorTracker {
  errorNumber: number;
  errorMessage: string;
  friendlyMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  onpendingbilledorders: any;
  ongoingOrders: any;
  private storeServiceUrl = 'https://api.grostep.com/storesapi/';
  private orderService: any = 'https://api.grostep.com/ordersapi/';
  ordersInfo: any = [];
  private subject = new Subject<any>();
  public ordersCount$: Observable<any> = this.subject.asObservable();
  constructor(private http: HttpClient) { }

  fetchOrdersCount(storeId: number): Observable<any> {
    const timeoffset = new Date().getTimezoneOffset();
    return this.http.get<any[]>(`${this.storeServiceUrl}merchantorderscount/${storeId}/${timeoffset}`)
      .pipe(
        tap(data => {
        })
        , map((data: any) => {
          this.sendMessage(data);
          return data;
        })
        , catchError(this.handleError)
      );
  }

  sendMessage(data: any) {
    this.subject.next({
      new_order_count: data.new_order_count[0].new_order_count,
      pending_order_count: data.pending_order_count[0].pending_order_count,
      pending_billing_order_count: data.pending_order_count[0].pending_billing_order_count,
      picked_order_count: data.picked_order_count[0].picked_order_count,
      is_store_not_closed: data.is_store_not_closed,
    });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  fetchAllNewAndPickedOrders(storeId: number, pagenumber: number, pagesize: number, filterBy: any, ordertype: any) {
    const obj: any = {};
    obj.page_number = pagenumber;
    obj.page_size = pagesize;
    obj.storeId = storeId;
    obj.filterBy = filterBy;
    obj.order_type = ordertype;
    obj.multiplePages = false;
    obj.offset = new Date().getTimezoneOffset();
    // console.log(obj);
    return this.http.post<any[]>(`${this.storeServiceUrl}storeinfo/storenewpickedorders`, obj)
      .pipe(
        tap((data: any) => {
          this.ordersInfo = data.store_orders_info;
          console.log(data);
        })
        , map((data) => {
          return data;
        })
        , catchError(this.handleError)
      );
  }

  fetchOrderBillInfo(orderId: number): Observable<any> {

    return this.http.get<any>(`${this.orderService}orderinfo/orderbill/${orderId}`).pipe(
      tap(data => {
        console.log(data);
      })
      , map((data) => {
        // this.orderDetails = data;
        return data;
      })
      , catchError(this.handleError)
    );
  }

  fetchAllOngoingOrders(storeId, pagenumber: number, pagesize: number, filterBy: any) {
    const obj: any = {};
    obj.page_number = pagenumber;
    obj.page_size = pagesize;
    obj.storeId = storeId;
    obj.filterBy = filterBy;
    obj.multiplePages = false;
    return this.http.post<any[]>(`${this.storeServiceUrl}fetchAllRunningOrders`, obj)
       .pipe(
        tap((data: any) => {
          // console.log(data);
          this.ongoingOrders = data.ongoing_orders_info;
        })
        , map((data: any) => {
          return data;
        })
        , catchError(this.handleError)
      );
  }

  fetchAllOnPendingBillingOrders(storeId) {
    return this.http.get<any[]>(`${this.storeServiceUrl}fetchAllPendingBilledOrders/${storeId}`)
    .pipe(
     tap((data: any) => {
       this.onpendingbilledorders = data.onpendingbilledorders;
     })
     , map((data: any) => {
       return data;
     })
     , catchError(this.handleError)
   );
  }

  updateStoreOrderStatus(orderid, storeId, orderstatus, storemerchantstatus, billnumber, billamount) {
    const obj: any = {};
    obj.status = orderstatus;
    obj.storeId = storeId;
    obj.order_merchant_status = storemerchantstatus;
    obj.bill_number = billnumber;
    obj.bill_amount = billamount;
    console.log(obj);
    const url = `${this.storeServiceUrl}${orderid}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(url, obj, { headers }).pipe(
      tap(data => {
        console.log(JSON.stringify(data));
      }),
      map((data1) => {
        return data1;
      }),
      catchError(this.handleError)
    );
  }

  fetchStoreInfoById(storeId): Observable<any> {

    return this.http.get(`${this.storeServiceUrl}storeinfo/${storeId}`).pipe(
      tap(data => {
        // this.storeCategories = data['store_categories'];
        // console.log(data);
      })
      , map((storeData) => {
        return storeData;
      })
      , catchError(this.handleError)
    );
  }

  fetchOrderInformationById(orderid) {
    return this.http.get<any[]>(`${this.orderService}customerorderInfoById/${orderid}`)
    .pipe(
      tap((data: any) => {
        // this.ordersInfo = data.customer_orders_info;
      })
      , map((data) => {
        return data;
      })
      , catchError(this.handleError)
    );
  }

  fetchOrderProducts(orderId: number): Observable<any> {
    // console.log(orderId);
    return this.http.get<any[]>(`${this.storeServiceUrl}storeinfo/storeorderproducts/${orderId}`)
      .pipe(
        tap(data => {
        })
        , map((data) => {
          console.log(data);
          return data;
        })
        , catchError(this.handleError)
      );
  }
  fetchAllStorePastOrders(storeId: number, pagenumber: number, pagesize: number, filterBy: any, ordertype: any) {
    const obj: any = {};
    obj.page_number = pagenumber;
    obj.page_size = pagesize;
    obj.storeId = storeId;
    obj.filterBy = filterBy;
    obj.order_type = ordertype;
    obj.offset = new Date().getTimezoneOffset();
    console.log(obj);
    return this.http.post<any[]>(`${this.storeServiceUrl}storeinfo/storepastorders`, obj)
      .pipe(
        tap((data: any) => {
          this.ordersInfo = data.store_orders_info;
          console.log(data);
        })
        , map((data) => {
          return data;
        })
        , catchError(this.handleError)
      );
  }

  updateStoreClosingStatus(storeId, storestatus) {
    const obj: any = {};
    obj.closed = +storestatus;
    console.log(obj);
    const url = `${this.storeServiceUrl}updatestoreclosingstatus/${storeId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(url, obj, { headers }).pipe(
      tap(data => {
        console.log(JSON.stringify(data));
      }),
      map((data1) => {
        return data1;
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
