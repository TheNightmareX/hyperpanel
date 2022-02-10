import {
  Component,
  OnDestroy,
  OnInit,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableComponent, NzTableSortFn } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import {
  FileInfoListGQL,
  FileInfoListItemFragment,
  FileInfoListQuery,
  FileInfoListQueryVariables,
  FileType,
} from 'src/app/graphql';

import { FileTableMenuComponent } from '../file-table-menu/file-table-menu.component';
import { FileTableNavigator } from './file-table-navigator.service';

export interface FileTableItem extends FileInfoListItemFragment {
  icon: string;
  modifiedAt: Date;
  typeFinalized: string | null;
  sizeFinalized: string | null;
}

type FileTableItemEntry = [number, FileTableItem];

@Component({
  selector: 'app-file-table',
  templateUrl: './file-table.component.html',
  styleUrls: ['./file-table.component.less'],
  providers: [FileTableNavigator],
})
export class FileTableComponent implements OnInit, OnDestroy {
  path = '/';

  items: FileTableItem[] = [];
  itemsChecked = new Set<FileTableItem>();

  page = 1;
  size = 100;
  total?: number;
  loading = false;

  tracker: TrackByFunction<FileTableItemEntry> = (...[, [, item]]): string =>
    item.id;
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

  @ViewChild(NzTableComponent) private table!: NzTableComponent<FileTableItem>;
  private tableDataIndexLastClicked = 0;

  private fileInfoListQuery?: QueryRef<
    FileInfoListQuery,
    FileInfoListQueryVariables
  >;
  private fileInfoListSubscription?: Subscription;

  constructor(
    private messageService: NzMessageService,
    private navigator: FileTableNavigator,
    private fileInfoListGql: FileInfoListGQL,
  ) {}

  ngOnInit(): void {
    this.navigator.path$.subscribe((path) => {
      this.path = path;
      this.page = 1;
      this.query();
    });
  }

  ngOnDestroy(): void {
    this.fileInfoListSubscription?.unsubscribe();
  }

  query(): void {
    if (this.loading) return;

    const offset = (this.page - 1) * this.size;
    this.fileInfoListQuery = this.fileInfoListGql.watch({
      path: this.path,
      offset,
      limit: this.size,
    });

    this.loading = true;
    this.fileInfoListSubscription?.unsubscribe();
    this.fileInfoListSubscription =
      this.fileInfoListQuery.valueChanges.subscribe({
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
            .map((item) => ({
              ...item,
              icon:
                item.type == FileType.Directory ? 'folder-open' : 'file-text',
              modifiedAt: new Date(item.modifiedAt),
              typeFinalized: item.type == FileType.Directory ? null : item.type,
              sizeFinalized:
                item.type == FileType.Directory ? null : item.sizeFormatted,
            }));
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
  handleItemClick(index: number, item: FileTableItem, event: MouseEvent): void {
    const ctrl = event.ctrlKey;
    const shift = event.shiftKey;
    // TODO: optimize implementation
    if (shift) {
      if (!ctrl) this.setAllItemsCheckedStatus(false);
      const indexLast = this.tableDataIndexLastClicked;
      const itemsCovered = this.table.data.slice(
        ...(indexLast < index
          ? [indexLast, index + 1]
          : [index, indexLast + 1]),
      );
      itemsCovered.forEach((item) => this.setItemCheckedStatus(item, true));
    } else if (ctrl) {
      const checked = this.getItemCheckedStatus(item);
      this.setItemCheckedStatus(item, !checked);
    } else {
      this.setAllItemsCheckedStatus(false);
      this.setItemCheckedStatus(item, true);
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
    if (!this.getItemCheckedStatus(item)) {
      this.setAllItemsCheckedStatus(false);
      this.setItemCheckedStatus(item, true);
    }
    menu.open(event);
  }

  getItemCheckedStatus(item: FileTableItem): boolean {
    return this.itemsChecked.has(item);
  }

  setItemCheckedStatus(item: FileTableItem, checked: boolean): void {
    if (checked) this.itemsChecked.add(item);
    else this.itemsChecked.delete(item);
  }

  getAllItemsCheckedStatus(): boolean | null {
    return !this.itemsChecked.size
      ? false
      : this.itemsChecked.size == this.items.length
      ? true
      : null;
  }

  setAllItemsCheckedStatus(checked: boolean): void {
    if (checked) this.items.forEach((item) => this.itemsChecked.add(item));
    else this.itemsChecked.clear();
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
}
