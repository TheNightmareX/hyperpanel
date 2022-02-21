import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { defineAccessor } from 'src/app/common/utilities';
import {
  FileInfoListGQL,
  FileInfoListItemFragment,
  FileType,
} from 'src/app/graphql';

import { FileTableNavigator } from './file-table-navigator.service';
import { FileTableSorter } from './file-table-sorter.service';

export interface FileTableItem {
  raw?: FileInfoListItemFragment;
  id: string;
  icon: string;
  name: string;
  type: FileType;
  typeFinalized: FileType | null;
  size: number;
  sizeFinalized: string | null;
  modifiedAt: Date;
  checked: boolean;
}

@Component({
  selector: 'app-file-table',
  templateUrl: './file-table.component.html',
  styleUrls: ['./file-table.component.less'],
  providers: [FileTableNavigator, FileTableSorter],
})
export class FileTableComponent implements OnInit, OnDestroy {
  path = '/';
  page = 1;
  size = 100;

  items: FileTableItem[] = [];
  itemsChecked = new Set<FileTableItem>();
  private itemIndexLastClicked = 0;
  total?: number;
  loading = false;

  tracker: TrackByFunction<FileTableItem> = (...[, item]): string => item.id;

  private subscription?: Subscription;

  constructor(
    public sorter: FileTableSorter,
    private notifier: NzMessageService,
    private navigator: FileTableNavigator,
    private fileInfoListGql: FileInfoListGQL,
  ) {}

  ngOnInit(): void {
    this.navigator.path$.subscribe((path) => {
      this.path = path;
      this.page = 1;
      this.handleQueryParamChange();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  checkAll(): void {
    this.items.forEach((item) => this.itemsChecked.add(item));
  }

  checkNone(): void {
    this.itemsChecked.clear();
  }

  handleQueryParamChange(): void {
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
          this.itemIndexLastClicked = 0;
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
          this.notifier.error(`Query files failed: ${err.message}`);
          if (this.navigator.canBackward) this.navigator.backward();
          else this.navigator.navigate('/');
        },
      });
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
      if (!ctrl) this.checkNone();
      const indexLast = this.itemIndexLastClicked;
      const itemsCovered = items.slice(
        ...(indexLast < index
          ? [indexLast, index + 1]
          : [index, indexLast + 1]),
      );
      itemsCovered.forEach((item) => (item.checked = true));
    } else if (ctrl) {
      item.checked = !item.checked;
    } else {
      this.checkNone();
      item.checked = true;
    }
    this.itemIndexLastClicked = index;
  }

  openItem(item: FileTableItem): void {
    if (!item.raw) return;
    if (item.type == FileType.Directory) this.navigator.navigate(item.raw.path);
  }

  private parseItem(raw: FileInfoListItemFragment): FileTableItem {
    const item: FileTableItem = {
      raw,
      id: raw.id,
      name: raw.name,
      icon: raw.type == FileType.Directory ? 'folder-open' : 'file-text',
      size: raw.size,
      sizeFinalized: raw.type == FileType.Directory ? null : raw.sizeFormatted,
      type: raw.type,
      typeFinalized: raw.type == FileType.Directory ? null : raw.type,
      modifiedAt: new Date(raw.modifiedAt),
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
