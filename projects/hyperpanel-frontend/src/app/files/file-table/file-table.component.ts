import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryRef } from 'apollo-angular';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
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
  private itemsChecked = new Set<FileTableItem>();
  page = 1;
  size = 100;
  total?: number;
  loading = false;
  fileInfoListQuery?: QueryRef<FileInfoListQuery, FileInfoListQueryVariables>;
  private fileInfoListSubscription?: Subscription;

  tracker: TrackByFunction<FileInfo> = (_, item): string => item.id;

  constructor(
    public menuService: NzContextMenuService,
    private router: Router,
    private route: ActivatedRoute,
    private fileInfoListGql: FileInfoListGQL,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.path = params['path'] ?? '/';
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
          typeFinalized: item.type == FileType.Directory ? null : item.type,
          sizeFinalized:
            item.type == FileType.Directory ? null : item.sizeFormatted,
        }));
        this.itemsChecked.clear();
      });
  }

  openItem(item: FileTableItem): void {
    if (item.type == FileType.Directory)
      this.router.navigate([{ path: item.path }], { relativeTo: this.route });
  }

  selectItem(item: FileTableItem): void {
    this.setAllItemsCheckedStatus(false);
    this.setItemCheckedStatus(item, true);
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
}
