import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private httpClient: HttpClient) {}

  // TODO: support large files. (Probably by forwarding a `ReadableStream`)
  save(path: string, name: string): void {
    const url = `${environment.serverUrl}/files${path}`;
    this.httpClient.get(url, { responseType: 'blob' }).subscribe((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const $a = document.createElement('a');
      $a.href = blobUrl;
      $a.download = name;
      $a.click();
      URL.revokeObjectURL(blobUrl);
    });
  }
}
