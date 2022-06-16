import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FileSelectComponent, MediaModalComponent } from './components/media-select.component';
import { FileUploadComponent } from './components/file-upload.component';
import { MediaPreviewComponent } from './components/preview.component';
import { MediaService } from './service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule, FileUploadModule, ImageCropperModule],
  exports: [FileSelectComponent, FileUploadComponent, MediaPreviewComponent],
  declarations: [FileSelectComponent, FileUploadComponent, MediaModalComponent, MediaPreviewComponent],
  entryComponents: [MediaModalComponent],
  providers: [MediaService]
})
export class MediaModule {}
