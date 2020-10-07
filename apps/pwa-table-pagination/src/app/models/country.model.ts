export class Country {
  id: string
  name: string;
  capital: string;
  alpha2: string;
  currency: string;
  language: string;

  constructor(country?: Partial<Country>) {
    this.id = country?.id ?? '';
    this.name = country?.name ?? '';
    this.capital = country?.capital ?? '';
    this.alpha2 = country?.alpha2 ?? '';
    this.currency = country?.currency ?? '';
    this.language = country?.language ?? '';
  }
}
