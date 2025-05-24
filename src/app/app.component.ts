import { Component, OnInit, OnDestroy } from '@angular/core';
import { FriendsService } from './friends.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'FriendsListFE';
  friends: string[] = [];
  newFriendName = '';
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private friendsService: FriendsService) {}

  ngOnInit() {
    this.loadFriends();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFriends() {
    this.isLoading = true;
    this.friendsService.getAllFriends()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
    this.friendsService.addFriend(this.newFriendName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
    this.friendsService.deleteFriend(name)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
