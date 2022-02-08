import { Component, OnInit } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import {
  FileInfoListGQL,
  FileInfoListQuery,
  FileInfoListQueryVariables,
} from 'src/app/graphql';

type FileInfoList = FileInfoListQuery['fileInfoList'];

@Component({
  selector: 'app-file-table',
  templateUrl: './file-table.component.html',
  styleUrls: ['./file-table.component.less'],
})
export class FileTableComponent implements OnInit {
  fileInfoList$!: Observable<FileInfoList>;
  fileInfoListQuery!: QueryRef<FileInfoListQuery, FileInfoListQueryVariables>;

  page = 1;
  limit = 10;
  loading = false;

  constructor(private fileInfoListGql: FileInfoListGQL) {}

  ngOnInit(): void {}

  load(): void {
    if (this.loading) return;

    const offset = (this.page - 1) * this.limit;
    this.fileInfoListQuery = this.fileInfoListGql.watch({
      path: '/',
      offset,
      limit: this.limit,
    });

    this.loading = true;
    this.fileInfoList$ = this.fileInfoListQuery.valueChanges.pipe(
      tap(() => (this.loading = false)),
      map((result) => result.data.fileInfoList),
    );
  }
}
