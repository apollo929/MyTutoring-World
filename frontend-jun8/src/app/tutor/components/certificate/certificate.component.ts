import { Component, OnInit, Input } from '@angular/core';
import { ITutorCertificate } from '../../../user/interface';
@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.html'
})
export class CertificateComponent implements OnInit {
  @Input() certificate: ITutorCertificate;
  ngOnInit() {}
  constructor() {}
}
