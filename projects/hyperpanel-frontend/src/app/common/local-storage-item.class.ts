import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

const INITIAL = Symbol();

export class LocalStorageItem<Value> {
  get value(): Value {
    return this._value;
  }
  private _value!: Value;

  value$: Observable<Value>;
  private _value$ = new BehaviorSubject<Value | typeof INITIAL>(INITIAL);

  constructor(
    public key: string,
    private validator: (dirty: unknown) => boolean,
    private initial: Value | (() => Value),
  ) {
    this.value$ = this._value$
      .asObservable()
      .pipe(filter((value): value is Value => value != INITIAL));
    this.load().save();
  }

  /**
   * Update the current value.
   * @param value
   * @returns
   */
  next<Next extends Value>(value: Next): LocalStorageItem<Next> {
    this._value = value;
    this._value$.next(value);
    return this as unknown as LocalStorageItem<Next>;
  }

  /**
   * Load a value from `LocalStorage` and overwrite the current one.
   * @returns
   */
  load(): this {
    const VALUE_NOT_EXIST = Symbol();
    const VALUE_NOT_VALID = Symbol();
    try {
      const raw = localStorage.getItem(this.key);
      if (raw == null) throw VALUE_NOT_EXIST;
      const dirty = JSON.parse(raw);
      if (!this.validator(dirty)) throw VALUE_NOT_VALID;
      const validated = dirty;
      this.next(validated);
    } catch (error) {
      if (
        error == VALUE_NOT_EXIST ||
        error == VALUE_NOT_VALID ||
        error instanceof SyntaxError
      )
        this.next(
          this.initial instanceof Function ? this.initial() : this.initial,
        );
      else throw error;
    } finally {
      return this;
    }
  }

  /**
   * Save the current value to `LocalStorage`.
   * @returns
   */
  save(): this {
    localStorage.setItem(this.key, JSON.stringify(this.value));
    return this;
  }
}
