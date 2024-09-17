import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { parse } from 'yaml';

export class YamlHttpLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    public prefix: string = '../assets/i18n/',
    public suffix: string = '.yaml'
  ) {}

  public getTranslation(lang: string): Observable<Object> {
    return this.http
      .get(`${this.prefix}${lang}${this.suffix}`, { responseType: 'text' })
      .pipe(map((data) => parse(data)));
  }
}
