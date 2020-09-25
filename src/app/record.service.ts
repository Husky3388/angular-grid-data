import { Injectable } from '@angular/core';
import { Record } from './record';
import { RECORDS } from './mock-records';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  //private recordsUrl = 'api/records';  // URL to web api
  private recordsUrl = 'https://localhost:5001/api/Records';  // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET records from the server */
  getRecords(): Observable<Record[]> {
    return this.http.get<Record[]>(this.recordsUrl)
      .pipe(
        tap(_ => this.log('fetched records')),
        catchError(this.handleError<Record[]>('getRecords', []))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getRecord(id: number): Observable<Record> {
    const url = `${this.recordsUrl}/${id}`;
    return this.http.get<Record>(url).pipe(
      tap(_ => this.log(`fetched record id=${id}`)),
      catchError(this.handleError<Record>(`getRecord id=${id}`))
    );
  }

  /** PUT: update the record on the server */
  updateRecord(record: Record): Observable<any> {
    const url = `${this.recordsUrl}/${record.id}`;
    return this.http.put(url, record, this.httpOptions).pipe(
      tap(_ => this.log(`updated record id=${record.id}`)),
      catchError(this.handleError<any>('updateRecord'))
    );
  }

  /** POST: add a new record to the server */
  addRecord(record: Record): Observable<Record> {
    return this.http.post<Record>(this.recordsUrl, record, this.httpOptions).pipe(
      tap((newRecord: Record) => this.log(`added record w/ id=${newRecord.id}`)),
      catchError(this.handleError<Record>('addRecord'))
    );
  }

  /** DELETE: delete the record from the server */
  deleteRecord(record: Record | number): Observable<Record> {
    const id = typeof record === 'number' ? record : record.id;
    const url = `${this.recordsUrl}/${id}`;

    return this.http.delete<Record>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted record id=${id}`)),
      catchError(this.handleError<Record>('deleteRecord'))
    );
  }

  /* GET records whose name contains search term */
  searchRecords(term: string): Observable<Record[]> {
    if (!term.trim()) {
      // if not search term, return empty record array.
      return of([]);
    }
    return this.http.get<Record[]>(`${this.recordsUrl}/search?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found records matching "${term}"`) :
        this.log(`no records matching "${term}"`)),
      catchError(this.handleError<Record[]>('searchRecords', []))
    );
  }

  /** Log a RecordService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`RecordService: ${message}`);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
