import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpRequest, HttpClient, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class UploadService {
  constructor(private http: HttpClient) {}

  // file from event.target.files[0]
  uploadFile(url: string, file: File): Observable<HttpEvent<any>> {
    const token = environment.FILE_UPLOAD;
    let formData = new FormData();
    formData.append("image", file);
    formData.append("key", token);

    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true
    };

    const req = new HttpRequest("POST", url, formData, options);
    return this.http.request(req);
  }
}
