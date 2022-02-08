import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { Subscription } from 'rxjs';
import {
  FileInfoListGQL,
  FileInfoListQuery,
  FileInfoListQueryVariables,
  FileType,
} from 'src/app/graphql';

type FileInfo = FileInfoListQuery['fileInfoList']['items'][number];

export interface FileTableItem extends FileInfo {
  typeFinalized: string | null;
  sizeFinalized: string | null;
}

@Component({
  selector: 'app-file-table',
  templateUrl: './file-table.component.html',
  styleUrls: ['./file-table.component.less'],
})
export class FileTableComponent implements OnInit, OnDestroy {
  items: FileTableItem[] = [];
  private itemsChecked = new Set<FileTableItem>();
  page = 1;
  limit = 10;
  total = 10;
  loading = false;
  fileInfoListQuery?: QueryRef<FileInfoListQuery, FileInfoListQueryVariables>;
  private fileInfoListSubscription?: Subscription;

  tracker: TrackByFunction<FileInfo> = (_, item): string => item.id;

  constructor(
    public menuService: NzContextMenuService,
    private fileInfoListGql: FileInfoListGQL,
  ) {}

  ngOnInit(): void {
    this.query();
  }

  ngOnDestroy(): void {
    this.fileInfoListSubscription?.unsubscribe();
  }

  query(): void {
    if (this.loading) return;

    this.setAllItemsCheckedStatus(false);

    const offset = (this.page - 1) * this.limit;
    this.fileInfoListQuery = this.fileInfoListGql.watch({
      path: '/',
      offset,
      limit: this.limit,
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
          typeFinalized: item.type == FileType.Directory ? null : item.type,
          sizeFinalized:
            item.type == FileType.Directory ? null : item.sizeFormatted,
        }));
      });
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
