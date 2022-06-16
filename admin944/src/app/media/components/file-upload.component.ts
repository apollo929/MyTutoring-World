import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import {
  FileUploadModule,
  FileSelectDirective,
  FileDropDirective,
  FileUploader,
  FileItem,
  FileLikeObject
} from 'ng2-file-upload';
import { AuthService } from '../../shared/services';
import { MediaService } from '../service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-file-upload',
  template: ` <div class="text-center upload-zone">
    <ul *ngIf="fileSelects.length" style="padding-left: 20px; text-align: 'left'">
      <li *ngFor="let file of fileSelects">{{ file.name }} selected.</li>
    </ul>
    <div
      ng2FileDrop
      [ngClass]="{ 'nv-file-over': hasBaseDropZoneOver }"
      (fileOver)="fileOverBase($event)"
      [uploader]="uploader"
      class="well my-drop-zone"
      (onFileDrop)="fileDrop($event)"
    >
      <p class="text-center">{{ options.hintText || 'Drop or click to select file' }}</p>
      <br />
      <p class="text-center" *ngIf="options.maxSize">{{ 'File size must under ' + options.maxSize + 'MB!' }}</p>
      <label class="custom-file">
        <input
          type="file"
          ng2FileSelect
          [uploader]="uploader"
          name="mediaPath"
          [multiple]="multiple"
          (onFileSelected)="fileSelect($event)"
          class="custom-file-input"
          [accept]="accept"
        />
        <span class="custom-file-control"></span>
      </label>
    </div>
    <div class="progress" [hidden]="!progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated" [ngStyle]="{ width: progress + '%' }"></div>
    </div>
    <p *ngIf="uploader.queue.length && !autoUpload">
      <button type="button" class="btn btn-primary" *ngIf="!uploadOnSelect" (click)="upload()">
        {{ options.uploadText || 'Upload' }}
      </button>
    </p>
  </div>`
})
export class FileUploadComponent implements OnInit, AfterViewInit {
  /**
   * option format
   * {
   *  customFields: { key: value } // additional field will be added to the form
   *  query: { key: value } // custom query String
   * }
   */
  @Input() options: any;
  public hasBaseDropZoneOver: Boolean = false;
  public uploader: FileUploader;
  public multiple: Boolean = false;
  public uploadOnSelect: Boolean = false;
  public autoUpload: Boolean = false;
  public progress: any = 0;
  private uploadedItems: any = [];
  public accept: any;
  public fileSelects: any[] = [];
  constructor(private authService: AuthService, private mediaService: MediaService, private toasty: ToastrService) {}

  ngOnInit() {
    // TODO - upload default file url and custom field here
    this.multiple = this.options && this.options.multiple;
    this.accept = this.options && this.options.accept;
    this.uploadOnSelect = this.options && this.options.uploadOnSelect;
    this.autoUpload = this.options && this.options.autoUpload;
    if (!this.options) {
      this.options = {};
    }

    // https://github.com/valor-software/ng2-file-upload/blob/development/src/file-upload/file-uploader.class.ts
    this.uploader = new FileUploader({
      url: window.appConfig.apiBaseUrl + '/media',
      authToken: 'Bearer ' + this.authService.getAccessToken(),
      autoUpload: this.options.autoUpload || false,
      maxFileSize: window.appConfig.maximumFileSize * 1024 * 1024
    });

    this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
      fileItem.alias = this.options.fileFieldName || 'file';
      // append the form
      if (this.options.customFields) {
        Object.keys(this.options.customFields).forEach(key => form.append(key, this.options.customFields[key]));
      }

      if (this.options.url) {
        fileItem.url = this.options.url;
      } else {
        let ep = 'files';
        if (fileItem.file.type.indexOf('image') > -1) {
          ep = 'photos';
        } else if (fileItem.file.type.indexOf('video') > -1) {
          ep = 'videos';
        }

        fileItem.url = `${window.appConfig.apiBaseUrl}/media/${ep}`;
      }
    };

    this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => (fileItem.progress = progress);

    this.uploader.onProgressAll = (progress: any) => (this.progress = progress);

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.uploader.removeFromQueue(item);

      // TODO - handle error event too
      const resp = JSON.parse(response);
      this.uploadedItems.push(resp);
      if (this.options.onCompleteItem) {
        this.options.onCompleteItem(resp);
      }
    };
    this.options.uploader = this.uploader;
  }

  ngAfterViewInit() {
    this.uploader.onAfterAddingFile = item => (item.withCredentials = false);
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  fileSelect(event: EventEmitter<File[]>) {
    const file: File = event[0];
    const size = file.size / 1024 / 1024; // MB
    if (this.options.maxSize && size > this.options.maxSize) {
      return this.toasty.error(`File size exceeds ${this.options.maxSize} MB`);
    }
    const fileLikeObject: FileLikeObject = event[0];

    if (!this.uploader._fileSizeFilter(fileLikeObject)) {
      return this.toasty.error('File size is larger than maximum size!');
    }
    if (!this.multiple) {
      this.uploader.clearQueue();
      this.fileSelects = [];
      this.fileSelects.push(file);
      this.uploader.addToQueue([file]);
    } else {
      this.uploader.addToQueue(event[0]);
    }

    // if (this.options.onFileSelect) {
    //   this.options.onFileSelect(this.uploader.queue);
    // }
  }

  fileDrop(event: EventEmitter<File[]>) {
    const file: File = event[0];
    const size = file.size / 1024 / 1024; // MB
    const fileLikeObject: FileLikeObject = event[0];

    if (!this.uploader._fileSizeFilter(fileLikeObject)) {
      return this.toasty.error('File size is larger than maximum size!');
    }
    if (this.options.accept) {
      const accept = this.acceptFile(file.type, this.options.accept);
      if (!accept) {
        this.uploader.clearQueue();
        return this.toasty.error('Invalid file type');
      }
    }
    if (this.options.maxSize && size > this.options.maxSize) {
      this.uploader.clearQueue();
      return this.toasty.error(`File size exceeds ${this.options.maxSize} MB`);
    }
    if (!this.multiple) {
      this.uploader.clearQueue();
      this.fileSelects = [];
      this.fileSelects.push(file);
      this.uploader.addToQueue([file]);
    } else {
      this.uploader.addToQueue(event[0]);
    }
    if (this.options.onFileSelect) {
      this.options.onFileSelect(this.uploader.queue);
    }
    if (this.options.uploadOnSelect) {
      this.uploader.uploadAll();
    }
  }

  acceptFile(fileType: string, accept: any) {
    const typeRegex = new RegExp(accept.replace(/\*/g, '.*').replace(/\,/g, '|'));
    return typeRegex.test(fileType);
  }

  upload(frm: any) {
    if (!this.uploader.queue.length) {
      return alert('Please select file');
    }

    this.uploader.onCompleteAll = () => {
      // TODO - do something
      this.uploader.clearQueue();
      if (this.options.onFinish) {
        this.options.onFinish(this.options.multiple ? this.uploadedItems : this.uploadedItems[0]);
      }

      // reset because Queue reset too
      this.uploadedItems = [];
      this.fileSelects = [];
      this.progress = 0;
    };

    this.uploader.uploadAll();
  }
}
