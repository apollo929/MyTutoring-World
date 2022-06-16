import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../shared/services';
import { MediaService } from '../service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-media-modal',
  templateUrl: './media-modal.html'
})
export class MediaModalComponent implements OnInit, AfterViewInit {
  @Input() options: any;
  public uploadedFiles = [];
  public tab: string = 'library';
  public files = [];
  public page: any = 1;
  public totalMedia = 0;
  public hasBaseDropZoneOver: Boolean = false;
  public filesQueue: any = [];
  public fileSelectOptions: any;
  public imageBase64: any = '';
  public croppedImage: any = '';
  public keyword: any = {
    name: '',
    description: ''
  };
  public loading: Boolean = false;

  private croppedFile: any;
  public activeEditMedia: any;
  public submitted: Boolean = false;

  // TODO - define active tab

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private mediaService: MediaService,
    private toasty: ToastrService
  ) {}
  ngOnInit() {
    if (!this.options) {
      this.options = {};
    }
    this.fileSelectOptions = Object.assign(this.options, {
      onCompleteItem: resp => this.uploadedFiles.push(resp.data),
      onFileSelect: this.onFileSelect.bind(this)
    });
  }

  ngAfterViewInit() {
    this.loadLibrary();
  }

  getPreview(file: any) {
    if (file.type) {
      // do nothing if it already set
      return;
    }

    if (file.file.type.indexOf('image') > -1) {
      file.type = 'photo';

      const reader = new FileReader();
      reader.onload = (e: any) => (file.previewContent = e.target.result);

      // read the image file as a data URL.
      reader.readAsDataURL(file._file);
    } else if (file.file.type.indexOf('video') > -1) {
      file.type = 'video';
    } else {
      file.type = 'file';
    }
  }

  onFileSelect(queue) {
    const _this = this;
    this.filesQueue = queue;
    this.filesQueue.forEach((q: any) => _this.getPreview(q));
  }

  remove(item: any) {
    this.fileSelectOptions.uploader.removeFromQueue(item);
  }

  select(media: any) {
    this.activeModal.close(media);
  }

  loadLibrary() {
    this.loading = true;
    this.mediaService
      .search(
        Object.assign(
          {
            page: this.page,
            take: 12
          },
          this.options && this.options.query ? this.options.query : {},
          this.keyword
        )
      )
      .then(resp => {
        this.files = resp.data.items;
        this.totalMedia = resp.data.count;
        this.loading = false;
      });
  }

  changeTab(tab) {
    if (this.tab !== 'library' && tab == 'library') {
      this.files = [];
      this.loadLibrary();
    }

    this.tab = tab;
  }

  imageCropped(image: String) {
    this.croppedImage = image;
  }

  selectCrop(image: any) {
    this.croppedFile = image;
    this.imageBase64 = image.previewContent;
  }

  crop() {
    this.croppedFile.uploadFileType = 'base64';
    this.croppedFile.previewContent = this.croppedImage;
    this.imageBase64 = null;

    // do upload for this file
    this.mediaService
      .upload(this.croppedImage, {
        name: this.croppedFile.file.name
      })
      .then(resp => {
        this.toasty.success('File has been cropped and uploaded');
        this.remove(this.croppedFile);
      })
      .catch(e => this.toasty.error(e.data.message || 'Have error, please try again'));
  }

  search() {
    this.page = 1;
    this.files = [];
    this.loadLibrary();
  }

  selectToEdit(media: any) {
    this.submitted = false;
    this.activeEditMedia = media;
  }

  update(frm: any) {
    this.submitted = true;

    if (frm.invalid) {
      return;
    }

    this.mediaService
      .update(this.activeEditMedia._id, {
        name: this.activeEditMedia.name,
        description: this.activeEditMedia.description
      })
      .then(resp => {
        this.toasty.success('Updated');
      })
      .catch(err => this.toasty.error(err.data.message || 'Something went wrong!'));
  }
}

@Component({
  selector: 'app-media-select',
  template: `<span class="pointer media-select-btn" (click)="open()"><i class="fa fa-folder-open"></i> Browse</span>`
})
export class FileSelectComponent {
  @Output() onSelect = new EventEmitter();
  /**
   * option format
   * {
   *  customFields: { key: value } // additional field will be added to the form
   *  query: { key: value } // custom query String
   * }
   */
  @Input() options: any;
  constructor(private modalService: NgbModal) {}

  open() {
    const modalRef = this.modalService.open(MediaModalComponent, {
      size: 'lg',
      windowClass: 'modal-media'
    });

    modalRef.componentInstance.options = this.options;
    modalRef.result.then(
      result => this.onSelect.emit(result),
      () => null
    );
  }
}
