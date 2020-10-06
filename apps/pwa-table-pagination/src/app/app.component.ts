import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { ConnectionService } from './services/connection.service';

@Component({
  selector: 'afs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'pwa-table-pagination';
  online = true;

  private connectionSub: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private connection: ConnectionService,
  ) {}

  ngOnInit(): void {
    this.connectionSub = this.connection.connectionStateObservable$.subscribe(online => {
      this.online = online;
      if (!this.online) {
        this.snackBar.open('You are offline!', 'OK', { duration: 3000 });
      } else {
        this.snackBar.dismiss();
      }
    });
  }

  ngOnDestroy() {
    this.connectionSub.unsubscribe();
  }
}
