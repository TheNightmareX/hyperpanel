import { Component, Input, OnInit } from '@angular/core';
import { FileInfoListQuery } from 'src/app/graphql';

type FileInfo = FileInfoListQuery['fileInfoList']['items'][number];

@Component({
  selector: 'tr[app-file-table-row]',
  templateUrl: './file-table-row.component.html',
  styleUrls: ['./file-table-row.component.less'],
})
export class FileTableRowComponent implements OnInit {
  @Input() fileInfo?: FileInfo;

  constructor() {}

  ngOnInit(): void {}
}
