import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  curruntUser: { password: string } = { password: null };

  constructor(
    private http: HttpClient,
  ) { }

  getCenters(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/collect/center_master/`);
  }

  submitData(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/collect/users/`, data);
  }
}
