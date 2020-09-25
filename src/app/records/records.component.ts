import { Component, OnInit } from '@angular/core';
import { Record } from '../record';
import { RecordService } from '../record.service';
import { MessageService } from '../message.service';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {
  records: Record[];

  constructor(private recordService: RecordService) { }

  ngOnInit() {
    this.getRecords();
  }

  getRecords(): void {
    this.recordService.getRecords()
    .subscribe(records => this.records = records);
  }

  add(name: string): void {
    let id: number = this.genId(this.records);
    name = name.trim();
    if (!name) { return; }
    this.recordService.addRecord({ id, name } as Record)
      .subscribe(record => {
        this.records.push(record);
      });
  }

  delete(record: Record): void {
    this.records = this.records.filter(r => r !== record);
    this.recordService.deleteRecord(record).subscribe();
  }

  genId(records: Record[]): number {
    return records.length > 0 ? Math.max(...records.map(record => record.id)) + 1 : 1;
  }
}