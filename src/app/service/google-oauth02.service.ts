import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleOauth02Service {
  constructor(private readonly httpClient: HttpClient) {}

  guard(): void {
    this.httpClient.get(`${environment.apiUrl}google/login`).subscribe(data => console.log(data));
  }

}
