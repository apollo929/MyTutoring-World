import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'view-documnet-modal',
  templateUrl: './view-document.html'
})
export class DocumentModalComponent implements OnInit {
  @Input() fileUrl: string;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
}
