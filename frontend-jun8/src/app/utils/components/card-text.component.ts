import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-text',
  template: `
    <div class="ql-container ql-core app-card-text" style="border-width: 0; height: auto">
      <div class="ql-editor" [innerHTML]="content | ellipsis: showChar" [hidden]="!showChar"></div>
      <div class="ql-editor" [innerHTML]="content" [hidden]="showChar"></div>
      <a href="javascript:void(0)" class="morelink" *ngIf="showMore && showChar > 0" (click)="show(0)"
        ><span translate>Read More</span>...</a
      >
      <a href="javascript:void(0)" class="morelink" *ngIf="showMore && !showChar" (click)="show(oldShowChar)"
        >...<span translate>Read Less</span></a
      >
    </div>
  `
})
export class CardTextComponent implements OnInit {
  @Input() content: string = '';
  @Input() showChar: number = 500;
  public showMore: boolean = false;
  public oldShowChar: number = 0;
  constructor() {}

  ngOnInit() {
    this.oldShowChar = this.showChar;
    if (this.content && this.content.length > this.showChar) {
      this.showMore = true;
    }
  }

  show(char: number) {
    this.showChar = char;
  }
}
