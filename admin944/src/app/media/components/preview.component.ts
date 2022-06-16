import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'media-preview',
  template: `
  <span class="media-preview">
    <img class="img-fluid img-thumbnail media-gallery-item"
      [src]="media?.thumbUrl" alt=""
      *ngIf="media?.type === 'photo'" />
    <i class="fa media-gallery-item" *ngIf="media?.type !== 'photo'" [ngClass]="customClass"></i>
    <br />
    <span>{{media?.name}}</span>
  </span>
  `
})
export class MediaPreviewComponent implements OnInit {
  @Input() media: any;

  public customClass = {};
  ngOnInit() {
    if (!this.media) {
      return;
    }

    if (this.media.type === 'video' || this.media.mimeType && this.media.mimeType.indexOf('video') > -1) {
      this.customClass = {
        'fa-video-camera': true
      };
    } else {
      this.customClass = {
        'fa-file': true
      };
    }
  }
}
