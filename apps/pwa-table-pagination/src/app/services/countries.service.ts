import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Country } from '../models/country.model';
import { AppCollectionService } from './app-collection.service';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private _countries: Country[] = [];

  constructor(private afs: AngularFirestore) {}

  clearCountriesOnDestroy() {
    this._countries = [];
  }

  getAllCountriesObs() {
    return this.afs
      .collection<Country>(AppCollectionService.COUNTRY_COLLECTION)
      .stateChanges()
      .pipe(
        map((snap) => {
          this._countries = snap.map((doc) => {
            if (doc.payload.doc.exists) {
              console.log(doc.payload.doc.data())
              return new Country({
                id: doc.payload.doc.id,
                ...doc.payload.doc.data(),
              });
            }
          });
        })
      );
  }

  getAllCountries() {
    return this._countries;
  }
}
