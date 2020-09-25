import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Record } from '../record';
import { RecordService } from '../record.service';

@Component({
  selector: 'app-record-search',
  templateUrl: './record-search.component.html',
  styleUrls: [ './record-search.component.css' ]
})
export class RecordSearchComponent implements OnInit {
  records$: Observable<Record[]>;
  private searchTerms = new Subject<string>();

  constructor(private recordService: RecordService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.records$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.recordService.searchRecords(term)),
    );
  }
}