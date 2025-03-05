import { EmptyError, Observable, Observer, Subscription, lastValueFrom, of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';

export class CustomObservableLogic {
  public static transCustomObservable<T>(
    observable: Observable<T> | null | undefined
  ): CustomObservable<T | null | undefined> {
    if (observable === null) {
      const emptyObservable = new CustomObservable<T | null | undefined>();
      // Set the observable's custom behaviors
      emptyObservable.toPromise = () => Promise.resolve(null);
      return emptyObservable;
    } else if (observable === undefined) {
      const emptyObservable = new CustomObservable<T | null | undefined>();
      emptyObservable.toPromise = () => Promise.resolve(undefined);
      return emptyObservable;
    }

    const customObservable = new CustomObservable<T | null | undefined>();

    // Custom implementation for toPromise
    customObservable.toPromise = () => {
      return lastValueFrom(
        observable.pipe(
          last(),
          catchError((error) => {
            if (error instanceof EmptyError) {
              return of(undefined);
            } else {
              throw error;
            }
          })
        )
      );
    };

    // Custom implementation for subscribeLegacy
    customObservable.subscribeLegacy = (
      next?: (value: T) => void,
      error?: (error: any) => void,
      complete?: () => void
    ) => {
      return observable.subscribe({
        next,
        error,
        complete
      });
    };

    return customObservable;
  }

  public static transPromise<T>(observable: Observable<T>): Promise<T | null | undefined> {
    if (observable === null) {
      return Promise.resolve(null);
    } else if (observable === undefined) {
      return Promise.resolve(undefined);
    }

    return lastValueFrom(
      observable.pipe(
        last(),
        catchError((error) => {
          if (error instanceof EmptyError) {
            return of(undefined);
          } else {
            throw error;
          }
        })
      )
    );
  }
}

export class CustomObservable<T> extends Observable<T> {
  //オーバーライド
  toPromise(): Promise<T | undefined> {
    return Promise.resolve(undefined);
  }

  subscribeLegacy?(
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return new Subscription();
  }
}
