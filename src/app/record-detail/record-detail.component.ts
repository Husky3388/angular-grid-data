import { Component, OnInit, Input } from '@angular/core';
import { Record } from '../record';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { RecordService } from '../record.service';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.css']
})
export class RecordDetailComponent implements OnInit {

  record: Record;

  constructor(
    private route: ActivatedRoute,
    private recordService: RecordService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getRecord();
  }
  
  getRecord(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.recordService.getRecord(id)
      .subscribe(record => this.record = record);
  }

  save(): void {
    this.recordService.updateRecord(this.record)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
