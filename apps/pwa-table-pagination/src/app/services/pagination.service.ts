import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
  Query,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject, EMPTY, Subscription } from 'rxjs';
import { debounceTime, mergeMap, tap } from 'rxjs/operators';

interface QueryConfig {
  /** Path to collection */
  path: string;
  /** Field and value to match in document, used for `where` clause */
  filter: {
    field: string;
    value: string;
  }; // field to where
  sort: string; // field to orderBy
  limit: number; // limit per query
  reverse: boolean; // reverse order?
  prepend: boolean; // prepend to source?
}

interface QueryResponse<T> {
  doc: QueryDocumentSnapshot<T>;
  data: T;
  id: string;
  docAction: DocumentChangeAction<T>;
}

/** This service is based on
 * https://fireship.io/lessons/infinite-scroll-firestore-angular/ but updated
 * and with some tweaks to accomplish realtime listening from collection
 */
@Injectable({
  providedIn: 'root',
})
export class PaginationService<T> {
  constructor(private afs: AngularFirestore) {}

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject<QueryResponse<T>[]>([]);

  private query: QueryConfig;

  // Observable data
  data: Observable<QueryResponse<T>[]>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  initSub: Subscription;
  cursor$ = new BehaviorSubject<QueryDocumentSnapshot<T>>(null);

  initializeCollection(initCursor?: QueryDocumentSnapshot<T>) {
    return this.afs.collection<T>(this.query.path, (ref: Query) => {
      if (this.query.filter) {
        ref = ref.where(this.query.filter.field, '==', this.query.filter.value);
      }
      ref = ref
        .orderBy(this.query.sort, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
      if (initCursor) {
        ref = ref.endAt(initCursor);
      }
      return ref;
    });
  }

  /**
   * Initial query sets options and defines the Observable passing opts will
   * override the defaults
   */
  init(path: string, sort: string, opts?: any) {
    this.query = {
      path,
      sort,
      limit: 5,
      reverse: false,
      prepend: false,
      ...opts,
    };

    this.initializeCollection()
      .get()
      .toPromise()
      .then((snapshots) => {
        const initCursor = snapshots.docs[
          snapshots.docs.length - 1
        ] as QueryDocumentSnapshot<T>;
        const first = this.initializeCollection(initCursor);
        this.initSub = this.mapAndUpdate(first).subscribe();
      });

    // Create the observable array for consumption in components
    this.data = this._data.asObservable();
  }

  clearInitSub() {
    if (this.initSub) {
      this.initSub.unsubscribe();
    }
  }

  /** Retrieves additional data from firestore */
  more() {
    const cursor = this.getCursor();
    this.cursor$.next(cursor);
  }

  getUpdatedData() {
    return this.cursor$.pipe(
      debounceTime(0),
      mergeMap((cursor: QueryDocumentSnapshot<T>) => {
        let more: AngularFirestoreCollection<T> = null;
        if (cursor) {
          more = this.afs.collection<T>(this.query.path, (ref: Query) => {
            if (this.query.filter) {
              ref = ref.where(
                this.query.filter.field,
                '==',
                this.query.filter.value
              );
            }
            ref = ref
              .orderBy(this.query.sort, this.query.reverse ? 'desc' : 'asc')
              .limit(this.query.limit)
              .startAfter(cursor);
            return ref;
          });
        }
        return cursor ? this.mapAndUpdate(more) : EMPTY;
      })
    );
  }

  /** Determines the doc snapshot to paginate query */
  private getCursor() {
    const current = this._data.value;
    if (current.length) {
      const currentSnap = this.query.prepend
        ? current[0]
        : current[current.length - 1];
      return currentSnap.doc;
    }
    return null;
  }

  /** Maps the snapshot to usable format the updates source */
  private mapAndUpdate(col: AngularFirestoreCollection<T>) {
    // if (this._done.value || this._loading.value) {
    //   return EMPTY;
    // }

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col.stateChanges().pipe(
      tap((arr) => {
        let values: QueryResponse<T>[] = arr.map((snap) => {
          const data = snap.payload.doc.data();
          const doc = snap.payload.doc;
          const docId = snap.payload.doc.id;
          const docAction = snap;
          return { data, id: docId, doc, docAction };
        });

        // If prepending, reverse the batch order
        values = this.query.prepend ? values.reverse() : values;
        // console.log('Collection Values', values);

        // update source with new values, done loading
        this._data.next(values);
        this._loading.next(false);

        // no more values, mark done
        // if (!values.length) {
        //   this._done.next(true);
        // }
      })
      // The take allow us to stop the stream as soon as emits a value.
      // take(1)
    );
  }
}
