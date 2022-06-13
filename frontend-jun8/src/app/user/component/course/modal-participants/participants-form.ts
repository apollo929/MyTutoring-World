import { WebinarService } from '../../../../webinar/webinar.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { pick } from 'lodash';

@Component({
  selector: 'participants-form',
  templateUrl: './participants-form.html'
})
export class ParticipantFormComponent implements OnInit {
  @Input() webinarId: string;
  public participants = [];
  public loading = false;
  public chunks = [];

  constructor(private webinarService: WebinarService, public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.loading = true;
    this.webinarService.getEnrolledList(this.webinarId).then(resp => {
      if (resp.data && resp.data.items && resp.data.items.length) {
        this.participants = resp.data.items.map(item => item.user);
      }

      if (this.participants.length > 11) {
        this.chunks = _.chunk(this.participants, 11);
      }
      this.loading = false;
    });
  }
}
