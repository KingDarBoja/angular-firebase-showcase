import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { SelectionColumnsData } from './components/custom-table/custom-table.component';
import { ConnectionService } from './services/connection.service';
import { CountriesService } from './services/countries.service';
import { Country } from './models/country.model';

@Component({
  selector: 'afs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'pwa-table-pagination';
  online = true;

  tableCountryData: Country[] = [];
  tableCountryColumns: SelectionColumnsData<Country>[] = [
    {
      name: 'Name',
      property: 'name',
      flexBasis: 0.2,
    },
    {
      name: 'Capital',
      property: 'capital',
      flexBasis: 0.2,
    },
    {
      name: 'Currency',
      property: 'currency',
      flexBasis: 0.2,
    },
    {
      name: 'Language',
      property: 'language',
      flexBasis: 0.2,
    },
    {
      name: 'Alpha2 Code',
      property: 'alpha2',
      flexBasis: 0.2,
    },
  ];

  private countriesSub: Subscription;
  private connectionSub: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private connection: ConnectionService,
    private countriesService: CountriesService,
  ) {
    // Connection checker
    this.connectionSub = this.connection.connectionStateObservable$.subscribe(online => {
      this.online = online;
      if (!this.online) {
        this.snackBar.open('You are offline!', 'OK', { duration: 3000 });
      } else {
        this.snackBar.dismiss();
      }
    });
  }

  ngOnInit(): void {
    // Countries Init
    this.countriesSub = this.countriesService.getAllCountriesObs().subscribe(() => {
      this.tableCountryData = [...this.countriesService.getAllCountries()];
      console.log(this.tableCountryData);
    });
  }

  ngOnDestroy() {
    this.countriesSub.unsubscribe();
    this.connectionSub.unsubscribe();
  }
}
