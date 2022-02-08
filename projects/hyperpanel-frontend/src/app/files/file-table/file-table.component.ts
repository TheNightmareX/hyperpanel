import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { Subscription } from 'rxjs';
import {
  FileInfoListGQL,
  FileInfoListQuery,
  FileInfoListQueryVariables,
} from 'src/app/graphql';

type FileInfoList = FileInfoListQuery['fileInfoList'];
type FileInfo = FileInfoList['items'][number];

@Component({
  selector: 'app-file-table',
  templateUrl: './file-table.component.html',
  styleUrls: ['./file-table.component.less'],
})
export class FileTableComponent implements OnInit, OnDestroy {
  fileInfoList: FileInfoList = { items: [], total: 0 };
  fileInfoListQuery?: QueryRef<FileInfoListQuery, FileInfoListQueryVariables>;

  page = 1;
  limit = 10;
  loading = false;

  tracker: TrackByFunction<FileInfo> = (_, item): string => item.id;

  private fileInfoListSubscription?: Subscription;

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
        this.fileInfoList = result.data.fileInfoList;
      });
  }
}
