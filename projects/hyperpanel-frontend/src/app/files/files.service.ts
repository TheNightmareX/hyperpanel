import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import streamSaver from 'streamsaver';

import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private authService: AuthService) {}

  // TODO: cancel the streams when user canceled the download.
  async save(path: string, name: string, size?: number): Promise<void> {
    const url = `${environment.serverUrl}/files${path}`;
    const response = await fetch(url, {
      headers: this.authService.getRequestHeaders(),
    });
    const writableStream = streamSaver.createWriteStream(name, { size });
    return response.body?.pipeTo(writableStream);
  }
}
