// src/app/movie-card/movie-card.component.ts
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserStateService } from '../user-state.service';
import { Subscription } from 'rxjs';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})


export class MovieCardComponent implements OnInit, OnDestroy {
  @Input() movie={
    _id: '',
    Title: '',
    Description: '',
    ImagePath: '',
    Genre: {Name: '', Description: ''},
    Director: {Name: '', Bio: '', Birthday: '', Death_day: '', TopMovies:{Title: ''}},
  };
  // movies: any[] = [];
  user: any = null;
  private subscriptions: Subscription[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    private userState: UserStateService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.userState.getUserData().subscribe((userData) => {
        this.user = userData;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  isFavorite(movieId: string): boolean {
    return this.user?.FavoriteMovies?.includes(movieId) || false;
  }

  toggleFavorite(movieId: string): void {
    if (!this.user) return;

    const username = this.user.Username;
    if (this.isFavorite(movieId)) {
      this.fetchApiData.deleteFavorite(username, movieId).subscribe(() => {
        this.userState.refreshUserData();
      });
    } else {
      this.fetchApiData.addFavorite(username, movieId).subscribe(() => {
        this.userState.refreshUserData();
      });
    }
  }
  isToWatch(movieId: string): boolean {
    return this.user?.ToWatch?.includes(movieId) || false;
  }

  toggleToWatch(movieId: string): void {
    if (!this.user) return;

    const username = this.user.Username;
    if (this.isToWatch(movieId)) {
      this.fetchApiData.deleteToWatch(username, movieId).subscribe(() => {
        this.userState.refreshUserData();
      });
    } else {
      this.fetchApiData.addToWatch(username, movieId).subscribe(() => {
        this.userState.refreshUserData();
      });
    }
  }
  openGenreDialog(movie: any): void {
    const dialogRef = this.dialog.open(GenreDialogComponent, {
      maxWidth: '450px',
      width: '95%',
      maxHeight: '100vh',
      autoFocus: false,
      panelClass: 'genre-dialog-container',
      data: { movie: movie }
    });
  }

}
