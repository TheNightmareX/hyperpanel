import { Injectable } from '@angular/core';
import { NzTableSortFn } from 'ng-zorro-antd/table';
import { FileType } from 'src/app/graphql';

import { FileTableItem } from './file-table.component';

type Field = keyof FileTableItem;
type Comparer = NzTableSortFn<FileTableItem>;

@Injectable()
export class FileTableSorter {
  private storage = new Map<Field, Comparer>();

  constructor() {
    this.register({
      field: 'name',
      comparer: (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
    });

    this.register({
      field: 'modifiedAt',
      comparer: (a, b) => a.modifiedAt.getTime() - b.modifiedAt.getTime(),
    });

    this.register({
      field: 'type',
      comparer: (a, b) => (a.type > b.type ? 1 : a.type < b.type ? -1 : 0),
    });

    this.register({
      field: 'size',
      comparer: (a, b) =>
        (a.type == FileType.File ? a.size : 0) -
        (b.type == FileType.File ? b.size : 0),
    });
  }

  resolve(field: Field): Comparer {
    const result = this.storage.get(field);
    if (!result) throw new Error();
    return result;
  }

  private register({
    field,
    comparer,
  }: {
    field: Field;
    comparer: Comparer;
  }): void {
    const comparerWrapped: Comparer = (a, b) =>
      a.type != b.type
        ? a.type == FileType.Directory
          ? -1
          : b.type == FileType.Directory
          ? 1
          : comparer(a, b)
        : comparer(a, b);
    this.storage.set(field, comparerWrapped);
  }
}
