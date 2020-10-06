import { Injectable } from '@angular/core';
import { Observable, fromEvent, merge, of, BehaviorSubject, } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  connectionStateObservable$: Observable<boolean>;

  constructor() { }

  start() {
    this.initSubjects();
  }

  initSubjects() {
    this.connectionStateObservable$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );
  }
}
