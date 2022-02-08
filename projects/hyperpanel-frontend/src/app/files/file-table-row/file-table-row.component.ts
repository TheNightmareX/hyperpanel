import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FileInfoListQuery, FileType } from 'src/app/graphql';

type FileInfo = FileInfoListQuery['fileInfoList']['items'][number];

@Component({
  selector: 'tr[app-file-table-row]',
  templateUrl: './file-table-row.component.html',
  styleUrls: ['./file-table-row.component.less'],
})
export class FileTableRowComponent implements OnInit {
  @Input() set fileInfo(value: FileInfo) {
    this.update(value);
  }

  checked = false;
  name?: string;
  modifiedAt?: string;
  type?: FileType | null;
  size?: string | null;

  constructor() {}

  ngOnInit(): void {}

  update(fileInfo: FileInfo): void {
    this.name = fileInfo.name;
    this.modifiedAt = fileInfo.modifiedAt;
    this.type = fileInfo.type == FileType.Directory ? null : fileInfo.type;
    this.size =
      fileInfo.type == FileType.Directory ? null : fileInfo.sizeFormatted;
  }

  @HostListener('click')
  onHostClick(): void {
    this.checked = !this.checked;
  }
}
