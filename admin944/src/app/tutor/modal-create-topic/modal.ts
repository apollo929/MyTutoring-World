import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { pick } from 'lodash';
import { TopicService } from '../../topic/topic.service';
@Component({
  selector: 'app-modal-create-category',
  templateUrl: './form.html'
})
export class MyTopicFormComponent implements OnInit {
  @Input() topics: any[];
  @Input() myTopic: any = {
    isActive: true
  };
  @Input() selectedSubject: any;

  public submitted: boolean = false;
  constructor(private toasty: ToastrService, public activeModal: NgbActiveModal, private topicService: TopicService) {}

  ngOnInit() {
    console.log(this.selectedSubject);

    if (this.selectedSubject) {
      this.queryTopic();
    }
  }

  submit(frm: any) {
    this.submitted = true;
    if (!frm.valid) {
      return this.toasty.error('Please complete the required fields!');
    }
    this.activeModal.close(pick(this.myTopic, ['originalTopicId', 'isActive', 'price']));
  }

  queryTopic() {
    console.log('weqedfad');

    this.topicService.search({ subjectIds: this.selectedSubject.originalSubjectId, take: 1000 }).then(resp => {
      if (resp.data && resp.data.items && resp.data.items.length > 0) {
        this.topics = resp.data.items;
      } else {
        this.topics = [];
      }
    });
  }
}
