import { Injectable } from '@angular/core';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private merchantServiceUrl = 'https://api.grostep.com/storesapi/';
  redirectUrl: any;
  merchantInfo: any;
  private TOKEN_KEY = 'merchanttoken';
  private MERCHANT_ID = 'merchantid';
  private MERCHANT_PHONE = 'merchantphone';
  private STORE_NAME = 'storename';
  private LOGIN_STATUS = 'loginstatus';
  private subject = new BehaviorSubject<any>(null);
  constructor(private httpClient: HttpClient) { }


  get isLoggedIn() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  get isauthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // sendStoreName() {
  //   this.subject.next({ text: localStorage.getItem(this.STORE_NAME) });
  // }

  // getStoreName(): Observable<any> {
  //   // console.log(this.subject);
  //   return this.subject.asObservable();
  // }

  // get storeName() {
  //   return !!localStorage.getItem(this.STORE_NAME);
  // }

  loginMerchant(phone: any, token: any) {
    const obj: any = {};
    obj.phone = phone;
    obj.token = token;
    console.log(obj);
    return this.httpClient.post<any[]>(`${this.merchantServiceUrl}login`, obj)
      .pipe(
        tap(data => {
          this.merchantInfo = data;
        })
        , map((data) => {
          return data;
        })
        , catchError(this.handleError)
      );
  }

  validateMerchant(phone: any, otp: any) {
    const obj: any = {};
    obj.phone_number = phone;
    obj.otp_number = otp;
    return this.httpClient.post<any[]>(`${this.merchantServiceUrl}validate`, obj)
      .pipe(
        tap(data => {
        })
        , map((data) => {
          // console.log(data);
          return this.authenticate(data);
          // return data;
        })
        , catchError(this.handleError)
      );
  }

  logout() {
    const storeid = localStorage.getItem(this.MERCHANT_ID);
    const obj: any = {};
    obj.closed = 1;
    // obj.token = '';
    const url = `${this.merchantServiceUrl}storeinfo/${storeid}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(url, obj, { headers }).pipe(
      tap(data => {
      }),
      map((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  resendOTP(merchantId) {
    return this.httpClient.get<any[]>(`${this.merchantServiceUrl}resendOTP/${merchantId}`)
      .pipe(
        tap((data: any) => {
          // this.customerInfo = data;
        })
        , map((data) => {
          return data;
        })
        , catchError(this.handleError)
      );
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' +
      localStorage.getItem(this.TOKEN_KEY));
  }

  authenticate(response: any): any {
    if (response.status === 200) {
      const token = response.token;
      const merchantid = response.merchantData.store_id;
      const phone = response.merchantData.phone_number;
      const storeName = response.merchantData.store_name;
      if (token) {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.MERCHANT_ID, merchantid);
        localStorage.setItem(this.MERCHANT_PHONE, phone);
        localStorage.setItem(this.STORE_NAME, storeName);
        localStorage.setItem(this.LOGIN_STATUS, 'true');
        // this.sendStoreName();
        return response;
      } else {
        return response;
      }
    } else {
      return response;
    }
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    // console.error(errorMessage);
    return throwError(errorMessage);
  }
}
