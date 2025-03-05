import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {
  CustomObservable,
  CustomObservableLogic
} from '../common/custom-observable/customObservableLogic';
import { ProjectStore } from '@tungle/project/state/project/project.store';
// import { LoadingLogic } from '../shared-logic/loading-logic';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private http: HttpClient, private store: ProjectStore) {}

  /*getAllRequest<T>(controller: string, params: any[] = []): Observable<T[]> {
    const url = this.baseUrl + controller + "/" + params.join("/");
    return this.http.get<T[]>(url);
  }*/

  /**
   * {@link getJsonRequest}のローディングスピナー表示選択
   * @param isLoading
   * @returns
   */
  getJsonRequestWhetherLoading(isLoading: boolean) {
    const fn = isLoading ? this.getJsonRequestWithLoading : this.getJsonRequest;
    return fn.bind(this) as typeof this.getJsonRequest;
  }

  /**
   * {@link getTextRequest}のローディングスピナー表示選択
   * @param isLoading
   * @returns
   */
  getTextRequestWhetherLoading(isLoading: boolean) {
    const fn = isLoading ? this.getTextRequestWithLoading : this.getTextRequest;
    return fn.bind(this) as typeof this.getTextRequest;
  }

  /**
   * {@link jsonRequest}のローディングスピナー表示選択
   * @param isLoading
   * @returns
   */
  jsonRequestWhetherLoading(isLoading: boolean) {
    const fn = isLoading ? this.jsonRequestWithLoading : this.jsonRequest;
    return fn.bind(this) as typeof this.jsonRequest;
  }

  /**
   * {@link textRequest}のローディングスピナー表示選択
   * @param isLoading
   * @returns
   */
  textRequestWhetherLoading(isLoading: boolean) {
    const fn = isLoading ? this.textRequestWithLoading : this.textRequest;
    return fn.bind(this) as typeof this.textRequest;
  }

  /**
   * GETリクエストを送信する(レスポンス形式:JSON)
   * @param url リクエスト送信先URL
   * @param params パラメータ(オプション)
   */
  getJsonRequest<T>(url: string, params: any[] = []): CustomObservable<T | null | undefined> {
    const fullUrl = this.concatParamsToUrl(url, params);
    url + '/' + params.map((p) => encodeURIComponent(p)).join('/');
    const observable = this.http.get<T>(fullUrl);
    return CustomObservableLogic.transCustomObservable(observable);
  }

  /**
   * GETリクエストを送信する(レスポンス形式:TEXT)
   * @param url リクエスト送信先URL
   * @param params パラメータ(オプション)
   */
  getTextRequest(url: string, params: any[] = []): CustomObservable<string | null | undefined> {
    const fullUrl = this.concatParamsToUrl(url, params);
    const observable = this.http.get(fullUrl, { responseType: 'text' });
    return CustomObservableLogic.transCustomObservable(observable);
  }

  /**
   * JSON形式のリクエストを送信する
   * @param method "POST","PUT","DELETE","PATCH"
   * @param url 送信先URL
   * @param data 送信データ* @param params パラメータ(オプション)
   */
  jsonRequest<T>(
    method: SupportedMethod,
    url: string,
    data: T,
    params: any[] = []
  ): CustomObservable<any> {
    const fullUrl = this.concatParamsToUrl(url, params);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let observable: Observable<any>;
    switch (method) {
      case 'POST':
        observable = this.http.post<T>(fullUrl, data, httpOptions);
        break;
      case 'PUT':
        observable = this.http.put<T>(fullUrl, data, httpOptions);
        break;
      case 'DELETE':
        observable = this.http.delete<T>(fullUrl, httpOptions);
        break;
      case 'PATCH':
        observable = this.http.patch<T>(fullUrl, data, httpOptions);
        break;
    }

    return CustomObservableLogic.transCustomObservable(observable);
  }

  /**
   * TEXT形式のリクエストを送信する
   * @param method "POST","PUT","DELETE","PATCH"
   * @param url 送信先URL
   * @param params パラメータ(オプション)
   * @param text 送信テキスト(オプション)
   */
  textRequest<T>(
    method: SupportedMethod,
    url: string,
    params: any[] = [],
    text: string = ''
  ): CustomObservable<any> {
    const fullUrl = this.concatParamsToUrl(url, params);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/text' })
    };

    let observable: Observable<any>;
    switch (method) {
      case 'POST':
        observable = this.http.post<T>(fullUrl, text, httpOptions);
        break;
      case 'PUT':
        observable = this.http.put<T>(fullUrl, text, httpOptions);
        break;
      case 'DELETE':
        observable = this.http.delete<T>(fullUrl, httpOptions);
        break;
      case 'PATCH':
        observable = this.http.patch<T>(fullUrl, text, httpOptions);
        break;
    }

    return CustomObservableLogic.transCustomObservable(observable);
  }

  /**
   * GETリクエストを送信する(レスポンス形式:JSON)
   * @param url リクエスト送信先URL
   * @param params パラメータ(オプション)
   */
  getJsonRequestWithLoading<T>(
    url: string,
    params: any[] = []
  ): CustomObservable<T | null | undefined> {
    const fullUrl = this.concatParamsToUrl(url, params);
    this.switchLoading(true);
    let observable = this.http.get<T>(fullUrl).pipe<T>(
      tap(() => {
        this.switchLoading(false);
      })
    );

    return CustomObservableLogic.transCustomObservable(observable);
  }

  /**
   * GETリクエストを送信する(レスポンス形式:TEXT)
   * @param url リクエスト送信先URL
   * @param params パラメータ(オプション)
   */
  getTextRequestWithLoading(
    url: string,
    params: any[] = []
  ): CustomObservable<string | null | undefined> {
    const fullUrl = this.concatParamsToUrl(url, params);
    this.switchLoading(true);
    const observable = this.http.get(fullUrl, { responseType: 'text' }).pipe<string>(
      tap(() => {
        this.switchLoading(false);
      })
    );

    return CustomObservableLogic.transCustomObservable(observable);
  }

  /**
   * JSON形式のリクエストを送信する
   * @param method "POST","PUT","DELETE","PATCH"
   * @param url 送信先URL
   * @param data 送信データ
   * @param params パラメータ(オプション)
   */
  jsonRequestWithLoading<T>(
    method: SupportedMethod,
    url: string,
    data: T,
    params: any[] = []
  ): CustomObservable<any> {
    const fullUrl = this.concatParamsToUrl(url, params);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let observable: Observable<any>;
    this.switchLoading(true);
    switch (method) {
      case 'POST':
        observable = this.http.post<T>(fullUrl, data, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
        break;
      case 'PUT':
        observable = this.http.put<T>(fullUrl, data, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
        break;
      case 'DELETE':
        const deleteOptions = {
          ...httpOptions,
          body: data
        };
        observable = this.http.delete<T>(fullUrl, deleteOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
        break;
      case 'PATCH':
        observable = this.http.patch<T>(fullUrl, data, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
        break;
    }

    return CustomObservableLogic.transCustomObservable(observable);
  }

  /**
   * TEXT形式のリクエストを送信する
   * @param method "POST","PUT","DELETE","PATCH"
   * @param url 送信先URL
   * @param params パラメータ(オプション)
   * @param text 送信テキスト(オプション)
   */
  textRequestWithLoading<T>(
    method: SupportedMethod,
    url: string,
    params: any[] = [],
    text: string = ''
  ): CustomObservable<any> {
    const fullUrl = this.concatParamsToUrl(url, params);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/text' })
    };

    let observable: Observable<any>;
    this.switchLoading(true);
    switch (method) {
      case 'POST':
        observable = this.http.post<T>(fullUrl, text, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
        break;
      case 'PUT':
        observable = this.http.put<T>(fullUrl, text, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
        break;
      case 'DELETE':
        observable = this.http.delete<T>(fullUrl, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
        break;
      case 'PATCH':
        observable = this.http.patch<T>(fullUrl, text, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
        break;
    }

    return CustomObservableLogic.transCustomObservable(observable);
  }

  /**
   * ファイルをアップロードする
   * @param url APIのURL
   * @param file フォームに入力されたファイル
   * @param formName ↑フォームの名前(バックエンドで利用される)
   * @param params APIのパラメータ
   * @returns
   */
  uploadFileWithLoading<T = any>(
    url: string,
    file: File,
    formName: string = 'file',
    params: any[] = []
  ): CustomObservable<T | null | undefined> {
    const fullUrl = this.concatParamsToUrl(url, params);

    const formData: FormData = new FormData();
    formData.append(formName, file, file.name);

    this.switchLoading(true);
    return CustomObservableLogic.transCustomObservable(
      this.http.post<T>(fullUrl, formData).pipe(
        tap(() => {
          this.switchLoading(false);
        })
      )
    );
  }

  /**
   * GETリクエストを送信する(レスポンス形式:JSON)
   * @param url リクエスト送信先URL
   * @param params パラメータ(オプション)
   */
  getJsonRequestLegacy<T>(url: string, params: any[] = []): Observable<T> {
    const fullUrl = this.concatParamsToUrl(url, params);
    return this.http.get<T>(fullUrl);
  }

  /**
   * GETリクエストを送信する(レスポンス形式:TEXT)
   * @param url リクエスト送信先URL
   * @param params パラメータ(オプション)
   */
  getTextRequestLegacy(url: string, params: any[] = []): Observable<string> {
    const fullUrl = this.concatParamsToUrl(url, params);
    return this.http.get(fullUrl, { responseType: 'text' });
  }

  /**
   * JSON形式のリクエストを送信する
   * @param method "POST","PUT","DELETE","PATCH"
   * @param url 送信先URL
   * @param data 送信データ
   * @param params パラメータ(オプション)
   */
  jsonRequestLegacy<T>(
    method: SupportedMethod,
    url: string,
    data: T,
    params: any[] = []
  ): Observable<any> {
    const fullUrl = this.concatParamsToUrl(url, params);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    switch (method) {
      case 'POST':
        return this.http.post<T>(fullUrl, data, httpOptions);
      case 'PUT':
        return this.http.put<T>(fullUrl, data, httpOptions);
      case 'DELETE':
        return this.http.delete<T>(fullUrl, httpOptions);
      case 'PATCH':
        return this.http.patch<T>(fullUrl, data, httpOptions);
    }
  }

  /**
   * TEXT形式のリクエストを送信する
   * @param method "POST","PUT","DELETE","PATCH"
   * @param url 送信先URL
   * @param params パラメータ(オプション)
   * @param text 送信テキスト(オプション)
   */
  textRequestLegacy<T>(
    method: SupportedMethod,
    url: string,
    params: any[] = [],
    text: string = ''
  ): Observable<any> {
    const fullUrl = this.concatParamsToUrl(url, params);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/text' })
    };

    switch (method) {
      case 'POST':
        return this.http.post<T>(fullUrl, text, httpOptions);
      case 'PUT':
        return this.http.put<T>(fullUrl, text, httpOptions);
      case 'DELETE':
        return this.http.delete<T>(fullUrl, httpOptions);
      case 'PATCH':
        return this.http.patch<T>(fullUrl, text, httpOptions);
    }
  }

  /**
   * GETリクエストを送信する(レスポンス形式:JSON)
   * @param url リクエスト送信先URL
   * @param params パラメータ(オプション)
   */
  getJsonRequestWithLoadingLegacy<T>(url: string, params: any[] = []): Observable<T> {
    const fullUrl = this.concatParamsToUrl(url, params);
    this.switchLoading(true);
    return this.http.get<T>(fullUrl).pipe(
      tap(() => {
        this.switchLoading(false);
      })
    );
  }

  /**
   * GETリクエストを送信する(レスポンス形式:TEXT)
   * @param url リクエスト送信先URL
   * @param params パラメータ(オプション)
   */
  getTextRequestWithLoadingLegacy(url: string, params: any[] = []): Observable<string> {
    const fullUrl = this.concatParamsToUrl(url, params);
    this.switchLoading(true);
    return this.http.get(fullUrl, { responseType: 'text' }).pipe(
      tap(() => {
        this.switchLoading(false);
      })
    );
  }

  /**
   * JSON形式のリクエストを送信する
   * @param method "POST","PUT","DELETE","PATCH"
   * @param url 送信先URL
   * @param data 送信データ
   * @param params パラメータ(オプション)
   */
  jsonRequestWithLoadingLegacy<T>(
    method: SupportedMethod,
    url: string,
    data: T,
    params: any[] = []
  ): Observable<any> {
    const fullUrl = this.concatParamsToUrl(url, params);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    this.switchLoading(true);
    switch (method) {
      case 'POST':
        return this.http.post<T>(fullUrl, data, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
      case 'PUT':
        return this.http.put<T>(fullUrl, data, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
      case 'DELETE':
        return this.http.delete<T>(fullUrl, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
      case 'PATCH':
        return this.http.patch<T>(fullUrl, data, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
    }
  }

  /**
   * TEXT形式のリクエストを送信する
   * @param method "POST","PUT","DELETE","PATCH"
   * @param url 送信先URL
   * @param params パラメータ(オプション)
   * @param text 送信テキスト(オプション)
   */ textRequestWithLoadingLegacy<T>(
    method: SupportedMethod,
    url: string,
    params: any[] = [],
    text: string = ''
  ): Observable<any> {
    const fullUrl = this.concatParamsToUrl(url, params);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/text' })
    };

    this.switchLoading(true);
    switch (method) {
      case 'POST':
        return this.http.post<T>(fullUrl, text, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
      case 'PUT':
        return this.http.put<T>(fullUrl, text, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
      case 'DELETE':
        return this.http.delete<T>(fullUrl, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
      case 'PATCH':
        return this.http.patch<T>(fullUrl, text, httpOptions).pipe(
          tap(() => {
            this.switchLoading(false);
          })
        );
    }
  }

  /**
   * JSON形式のリクエストを送信する
   * ファイルをダウンロードする際に利用
   * @param method "POST","PUT","DELETE","PATCH"
   * @param url 送信先URL
   * @param data 送信データ
   * @param params パラメータ(オプション)
   */
  fileRequest<T>(
    method: SupportedMethod,
    url: string,
    data: T,
    params: any[] = []
  ): Observable<any> {
    const fullUrl = this.concatParamsToUrl(url, params);
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    switch (method) {
      case 'POST':
        return this.http.post<T>(fullUrl, data, httpOptions);
      case 'PUT':
        return this.http.put<T>(fullUrl, data, httpOptions);
      case 'DELETE':
        return this.http.delete<T>(fullUrl, httpOptions);
      case 'PATCH':
        return this.http.patch<T>(fullUrl, data, httpOptions);
    }
  }

  /**
   * ローディングスピナーの非表示/表示を切り替える
   * @param mode (true: 表示, false: 非表示)
   */
  private switchLoading(mode: boolean) {
    this.store.setLoading(mode);
  }

  /**　パラメータをURLに結合する */
  private concatParamsToUrl(url: string, params: any[]): string {
    return url + '/' + params.map((p) => encodeURIComponent(p)).join('/');
  }
}

export type SupportedMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH';
