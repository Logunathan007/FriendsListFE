import { Component, OnInit } from '@angular/core';
import { FriendsService } from './friends.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'FriendsListFE';
  friends: string[] = [];
  newFriendName = '';
  isLoading = false;

  constructor(private friendsService: FriendsService) {}

  ngOnInit() {
    this.loadFriends();
  }

  loadFriends() {
    this.isLoading = true;
    this.friendsService.getAllFriends().subscribe({
      next: (data: any) => {
        this.friends = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  addFriend() {
    if (!this.newFriendName.trim()) return;
    this.isLoading = true;
    this.friendsService.addFriend(this.newFriendName).subscribe({
      next: (res: any) => {
        if(res?.Failed === false){
          this.friends.push(this.newFriendName);
          this.newFriendName = '';
        } else {
          console.log('Failed to add friend:', res || 'Unknown error');
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  deleteFriend(name: string) {
    this.isLoading = true;
    this.friendsService.deleteFriend(name).subscribe({
      next: (res: any) => {
        if(res?.Failed === false){
          this.friends = this.friends.filter(friend => friend !== name);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
