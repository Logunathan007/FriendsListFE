import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private apiUrl = 'https://friendslistbe.onrender.com/'; // Change to your backend URL

  constructor(private http: HttpClient) {}

  getAllFriends(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl+'get');
  }

  addFriend(name: string): Observable<string> {
    return this.http.post<string>(this.apiUrl+'add', { name });
  }

  deleteFriend(name: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${name}`);
  }
}
