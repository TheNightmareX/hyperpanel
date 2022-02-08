import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-table-navigator',
  templateUrl: './file-table-navigator.component.html',
  styleUrls: ['./file-table-navigator.component.less'],
})
export class FileTableNavigatorComponent implements OnInit {
  @Input() path = '/';

  constructor() {}

  ngOnInit(): void {}
}
