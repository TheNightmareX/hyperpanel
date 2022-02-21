import { Observable, timer } from 'rxjs';

/**
 * Activate the source observable, ensure the subscriber won't be called for a
 * period, emit all the deferred output, and then directly forward any output.
 * @param time
 * @returns
 */
export const deferTime =
  (time: number) =>
  <T>(source: Observable<T>): Observable<T> => {
    return new Observable<T>((subscriber) => {
      let needDefer = true;

      const deferredItems: (
        | ['value', T]
        | ['error', Error]
        | ['complete', null]
      )[] = [];

      source.subscribe({
        next: (value) => {
          if (needDefer) deferredItems.push(['value', value]);
          else subscriber.next(value);
        },
        error: (error) => {
          if (needDefer) deferredItems.push(['error', error]);
          else subscriber.error(error);
        },
        complete: () => {
          if (needDefer) deferredItems.push(['complete', null]);
          else subscriber.complete();
        },
      });

      timer(time).subscribe(() => {
        needDefer = false;
        deferredItems.forEach(([action, payload]) => {
          if (action == 'value') subscriber.next(payload as T);
          else if (action == 'error') subscriber.error(payload);
          else if (action == 'complete') subscriber.complete();
        });
      });
    });
  };
