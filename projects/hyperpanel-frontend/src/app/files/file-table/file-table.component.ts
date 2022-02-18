import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableSortFn } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { defineAccessor } from 'src/app/common/utilities';
import {
  FileInfoListGQL,
  FileInfoListItemFragment,
  FileType,
} from 'src/app/graphql';

import { FileTableMenuComponent } from '../file-table-menu/file-table-menu.component';
import { FileTableNavigator } from './file-table-navigator.service';

export interface FileTableItem extends FileInfoListItemFragment {
  icon: string;
  modifiedAt: Date;
  typeFinalized: string | null;
  sizeFinalized: string | null;
  checked: boolean;
}

@Component({
  selector: 'app-file-table',
  templateUrl: './file-table.component.html',
  styleUrls: ['./file-table.component.less'],
  providers: [FileTableNavigator],
})
export class FileTableComponent implements OnInit, OnDestroy {
  path = '/';
  page = 1;
  size = 100;

  items: FileTableItem[] = [];
  itemsChecked = new Set<FileTableItem>();
  total?: number;
  loading = false;

  get tableChecked(): boolean {
    return (
      !!this.itemsChecked.size && this.itemsChecked.size == this.items.length
    );
  }
  set tableChecked(v: boolean) {
    if (v) this.items.forEach((item) => this.itemsChecked.add(item));
    else this.itemsChecked.clear();
  }

  get tableIndeterminate(): boolean {
    return (
      !!this.itemsChecked.size && this.itemsChecked.size != this.items.length
    );
  }

  tracker: TrackByFunction<FileTableItem> = (...[, item]): string => item.id;
  sorters: NzTableSortFn<FileTableItem>[] = [
    this.getSorter((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)),
    this.getSorter((a, b) => a.modifiedAt.getTime() - b.modifiedAt.getTime()),
    this.getSorter((a, b) => (a.type > b.type ? 1 : a.type < b.type ? -1 : 0)),
    this.getSorter(
      (a, b) =>
        (a.type == FileType.File ? a.size : 0) -
        (b.type == FileType.File ? b.size : 0),
    ),
  ];

  private tableDataIndexLastClicked = 0;

  private subscription?: Subscription;

  constructor(
    private messageService: NzMessageService,
    private navigator: FileTableNavigator,
    private fileInfoListGql: FileInfoListGQL,
  ) {}

  ngOnInit(): void {
    this.navigator.path$.subscribe((path) => {
      this.path = path;
      this.page = 1;
      this.updateQuery();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  handlePageChange(value: number): void {
    this.page = value;
    this.updateQuery();
  }

  handleSizeChange(value: number): void {
    this.size = value;
    this.page = 1;
    this.updateQuery();
  }

  /**
   * - Shift + Ctrl: Select the items between the last clicked item and the
   * current item.
   * - Shift: Select **only** the items between the last clicked item and the
   * current item.
   * - Ctrl: Switch the clicked item's checked status.
   * - [None]: Select **only** the clicked item.
   *
   * @param index
   * @param item
   * @param event
   */
  handleItemClick(
    index: number,
    item: FileTableItem,
    items: readonly FileTableItem[],
    event: MouseEvent,
  ): void {
    const ctrl = event.ctrlKey;
    const shift = event.shiftKey;
    // TODO: optimize implementation
    if (shift) {
      if (!ctrl) this.tableChecked = false;
      const indexLast = this.tableDataIndexLastClicked;
      const itemsCovered = items.slice(
        ...(indexLast < index
          ? [indexLast, index + 1]
          : [index, indexLast + 1]),
      );
      itemsCovered.forEach((item) => (item.checked = true));
    } else if (ctrl) {
      item.checked = !item.checked;
    } else {
      this.tableChecked = false;
      item.checked = true;
    }
    this.tableDataIndexLastClicked = index;
  }

  openItem(item: FileTableItem): void {
    if (item.type == FileType.Directory) this.navigator.navigate(item.path);
  }

  openMenu(
    item: FileTableItem,
    event: MouseEvent,
    menu: FileTableMenuComponent,
  ): void {
    if (!item.checked) this.tableChecked = false;

    menu.open(event);
  }

  private updateQuery(): void {
    if (this.loading) return;

    const offset = (this.page - 1) * this.size;

    this.loading = true;
    this.subscription?.unsubscribe();
    this.subscription = this.fileInfoListGql
      .watch({
        path: this.path,
        offset,
        limit: this.size,
      })
      .valueChanges.subscribe({
        next: (result) => {
          this.loading = false;
          this.itemsChecked.clear();
          this.tableDataIndexLastClicked = 0;
          const { total, items } = result.data.fileInfoList;
          this.total = total;
          this.items = items
            .filter(
              (item): item is FileInfoListItemFragment =>
                !!(item as FileInfoListItemFragment).id,
            )
            .map((item) => this.parseItem(item));
        },
        error: (err) => {
          this.loading = false;
          this.messageService.error(`Query files failed: ${err.message}`);
          if (this.navigator.canBackward) this.navigator.backward();
          else this.navigator.navigate('/');
        },
      });
  }

  /**
   * Ensure that directories are always sorted before files.
   * @param base
   * @returns
   */
  private getSorter(
    base: NzTableSortFn<FileTableItem>,
  ): NzTableSortFn<FileTableItem> {
    return (a, b) =>
      a.type != b.type
        ? a.type == FileType.Directory
          ? -1
          : b.type == FileType.Directory
          ? 1
          : base(a, b)
        : base(a, b);
  }

  private parseItem(raw: FileInfoListItemFragment): FileTableItem {
    const item: FileTableItem = {
      ...raw,
      icon: raw.type == FileType.Directory ? 'folder-open' : 'file-text',
      modifiedAt: new Date(raw.modifiedAt),
      typeFinalized: raw.type == FileType.Directory ? null : raw.type,
      sizeFinalized: raw.type == FileType.Directory ? null : raw.sizeFormatted,
      checked: null as any,
    };
    defineAccessor(item, 'checked', {
      get: () => this.itemsChecked.has(item),
      set: (v) =>
        v ? this.itemsChecked.add(item) : this.itemsChecked.delete(item),
    });
    return item;
  }
}
