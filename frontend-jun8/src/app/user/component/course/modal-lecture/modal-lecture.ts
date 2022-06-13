import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { LectureSectionService } from 'app/shared/services/lecture-section.service';
import { ICourseSection, ICourseLecture } from 'app/course/interface';
import { LectureService } from 'app/shared/services/lecture.service';

@Component({
    selector: 'modal-lecture',
    templateUrl: './modal-lecture.html'
})
export class ModalLecture implements OnInit, OnChanges {

    @Input() course;
    @Input() tutor;
    @Input() section: ICourseSection = new ICourseSection();
    @Input() lecture: ICourseLecture = new ICourseLecture();

    public mediaOptionsModal: any;
    public medias: any = [];
    public mediasObj: any = [];
    maxFileSize = window.appConfig.maximumFileSize;
    isEdit = false;
    public filesSelected: any[] = [];

    mediaType = "video";
    pdfDuration = "";

    constructor(public activeModal: NgbActiveModal, private translate: TranslateService, private toasty: ToastrService, private api: LectureService) { }

    ngOnInit() {
        if (this.lecture._id) {
            this.medias = this.lecture.media
            this.mediasObj = JSON.parse(this.lecture.mediaInfo)
        }
        if (!this.lecture.mediaIds) {
            this.lecture.mediaIds = new Array();
        }
        this.mediaOptionsModal = {
            url: window.appConfig.apiBaseUrl + '/media/files',
            fileFieldName: 'file',
            multiple: true,
            // onFinish: resp => {
            //     this.lecture.mediaIds.push(resp.data._id);
            //     this.medias.push(resp.data);
            //     this.mediasObj.push({
            //         media_id: resp.data._id,
            //         type: this.mediaType,
            //     })

            // },
            onFinishAlternative: resp => {
                // this.lecture.mediaIds = []
                // this.medias = []
                // this.mediasObj = []

                resp.data.forEach(r => {

                    let isThere = false;

                    if (this.lecture.mediaIds.includes(r[0].data._id))
                        isThere = true

                    if (!isThere) {
                        this.lecture.mediaIds.push(r[0].data._id);
                        const v = r[0].data;


                        var urlSt = URL.createObjectURL(r[1]._file);

                        let duration = '';

                        if (this.mediaType == 'audio') {
                            var audio = new Audio(urlSt);
                            audio.addEventListener('loadeddata', () => {
                                const hours = Math.floor(audio.duration / 60 / 60);
                                const minutes = Math.floor(audio.duration / 60) - (hours * 60);

                                const seconds = Math.floor(audio.duration % 60);
                                duration = "" + (hours ? hours + ':' : '') + (minutes ? (minutes > 10 ? minutes + ':' : '0' + minutes + ':') : '00:') + (seconds ? (seconds > 10 ? seconds : '0' + seconds) : '')

                                v.duration = duration
                                this.medias.push(v);

                                this.mediasObj.push({
                                    media_id: r[0].data._id,
                                    type: this.mediaType,
                                    duration: duration
                                })
                            })
                        } else if (this.mediaType == 'video') {
                            var video = document.createElement('video');
                            video.preload = 'metadata';

                            video.onloadedmetadata = () => {
                                window.URL.revokeObjectURL(video.src);
                                //   duration = video.duration; // here you could get the duration
                                const hours = Math.floor(video.duration / 60 / 60);
                                const minutes = Math.floor(video.duration / 60) - (hours * 60);

                                // 42
                                const seconds = Math.floor(video.duration % 60);
                                let d = "" + (hours ? hours + ':' : '') + (minutes ? (minutes > 10 ? minutes + ':' : '0' + minutes + ':') : '00:') + (seconds ? (seconds > 10 ? seconds : '0' + seconds) : '')
                                duration = d;
                                v.duration = duration
                                this.medias.push(v);

                                this.mediasObj.push({
                                    media_id: r[0].data._id,
                                    type: this.mediaType,
                                    duration: duration
                                })

                            }

                            video.src = urlSt
                        } else if (this.mediaType == 'pdf') {
                            const hours = Math.floor(parseInt(this.pdfDuration) / 60 / 60);
                            const minutes = Math.floor(parseInt(this.pdfDuration) / 60) - (hours * 60);

                            // 42
                            const seconds = Math.floor(parseInt(this.pdfDuration) % 60);
                            let d = "" + (hours ? hours + ':' : '') + (minutes ? (minutes > 10 ? minutes + ':' : '0' + minutes + ':') : '00:') + (seconds ? (seconds > 10 ? seconds : '0' + seconds) : '')
                            duration = d;
                            this.pdfDuration = ''
                            v.duration = duration
                            this.medias.push(v);

                            this.mediasObj.push({
                                media_id: r[0].data._id,
                                type: this.mediaType,
                                duration: duration
                            })
                        }
                    }


                })

            },
            accept: '.mp4,.mov',
            onFileSelect: resp => (this.filesSelected = resp),
            id: 'media-upload'
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.lecture.title) {
            this.isEdit = true;

        } else {
            this.lecture = new ICourseLecture();
            this.lecture.mediaIds = new Array();
        }

    }

    getValue(id) {
        for (let index = 0; index < this.mediasObj.length; index++) {
            const element = this.mediasObj[index];

            if (element.media_id == id) {
                return element
            }
        }
        return null;
    }

    removeMedia(i: any) {
        // this.course.mediaIds.splice(i, 1);
        // this.medias.splice(i, 1);
    }

    handleChange(event) {
        if (event.target.value == 'audio') {
            this.mediaOptionsModal.accept = '.mp3';
        }
        if (event.target.value == 'video') {
            this.mediaOptionsModal.accept = '.mp4,.mov';
        }
        if (event.target.value == 'pdf') {
            this.mediaOptionsModal.accept = '.pdf';
        }
    }

    deleteMedia(item) {

        const l1 = this.lecture.mediaIds.findIndex((i) => item._id == i)
        if (l1 >= 0) {
            this.lecture.mediaIds.splice(l1, 1)
        }

        const l2 = this.medias.findIndex(m => m.id == item._id)
        if (l2 >= 0) {
            this.medias.splice(l2, 1)
        }

        const l3 = this.mediasObj.findIndex(m =>
            m.media_id == item._id
        )
        if (l3 >= 0) {
            this.mediasObj.splice(l3, 1)
        }
    }

    submit(frm: any) {
        let d: any = frm.value;
        d.courseId = this.course._id
        d.tutorId = this.tutor._id
        d.sectionId = this.section._id
        d.mediaInfo = JSON.stringify(this.mediasObj)
        d.mediaIds = this.lecture.mediaIds;

        delete d['total-length']
        delete d.media

        if (d._id) {
            d._id = this.lecture._id;
        }

        if (!frm.valid) {
            return this.toasty.error(this.translate.instant('Please complete the required fields!'));
        }

        if (this.lecture._id) {
            this.api.update(this.lecture._id, d).then(res => {
                this.activeModal.close(true)
            }).catch(e => {
                this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
            });
        } else {
            this.api.create(d).then(res => {
                this.activeModal.close(true)
            }).catch(e => {
                this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
            });
        }




    }

}
