import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { NzTableSortFn } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import {
  FileInfoListGQL,
  FileInfoListQuery,
  FileInfoListQueryVariables,
  FileType,
} from 'src/app/graphql';

import { FileTableNavigator } from './file-table-navigator.service';

type FileInfo = FileInfoListQuery['fileInfoList']['items'][number];

export interface FileTableItem extends FileInfo {
  icon: string;
  modifiedAt: Date;
  typeFinalized: string | null;
  sizeFinalized: string | null;
}

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

  fileInfoListQuery?: QueryRef<FileInfoListQuery, FileInfoListQueryVariables>;
  private fileInfoListSubscription?: Subscription;

  tracker: TrackByFunction<FileInfo> = (_, item): string => item.id;
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

  constructor(
    private menuService: NzContextMenuService,
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
      this.fileInfoListQuery.valueChanges.subscribe((result) => {
        this.loading = false;
        const { total, items } = result.data.fileInfoList;
        this.total = total;
        this.items = items.map((item) => ({
          ...item,
          icon: item.type == FileType.Directory ? 'folder-open' : 'file-text',
          modifiedAt: new Date(item.modifiedAt),
          typeFinalized: item.type == FileType.Directory ? null : item.type,
          sizeFinalized:
            item.type == FileType.Directory ? null : item.sizeFormatted,
        }));
        this.itemsChecked.clear();
      });
  }

  openItem(item: FileTableItem): void {
    if (item.type == FileType.Directory) this.navigator.navigate(item.path);
  }

  selectItem(item: FileTableItem): void {
    this.setAllItemsCheckedStatus(false);
    this.setItemCheckedStatus(item, true);
  }

  openMenu(
    item: FileTableItem,
    event: MouseEvent,
    menu: NzDropdownMenuComponent,
  ): void {
    if (!this.itemsChecked.has(item)) this.selectItem(item);
    this.menuService.create(event, menu);
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
