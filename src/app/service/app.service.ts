import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private readonly httpClient: HttpClient) {}

  public cookieCheck(): void {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.httpClient
      .get(`${environment.apiUrl}cookie-test2`, { withCredentials: true, headers, responseType: 'text' })
      .subscribe((data) => console.log(data));
  }

  public getUserInfo(): void {

  }
}
