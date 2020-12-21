import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000';

@Injectable({
  providedIn: 'root'
})
export class ClubsService {

  constructor(private httpClient: HttpClient) {}

  readAll(): Observable<any> {
    return this.httpClient.get(baseURL+'/clubs');
  }

  saveAll(data): Observable<any> {
    return this.httpClient.post(baseURL+'/clubslist',{"all_data":data});
  }

  update(clubId,data): Observable<any> {
    return this.httpClient.put(baseURL+'/clubs/'+clubId, data);
  }

}
