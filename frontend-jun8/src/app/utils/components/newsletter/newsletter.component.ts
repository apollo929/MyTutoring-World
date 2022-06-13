import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NewsletterService } from '../../services/newsletter.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'newsletter',
  templateUrl: './newsletter.html'
})
export class NewsleterComponent {
  public submitted: boolean = false;
  public info: any = {
    email: ''
  };
  constructor(private service: NewsletterService, private toasty: ToastrService, private translate: TranslateService) {}

  submit(frm: any) {
    this.submitted = true;
    if (frm.invalid) {
      return;
    }

    this.service
      .register(this.info)
      .then(resp => this.toasty.success(this.translate.instant('Thank you. Your email has been registered.')))
      .catch(() => this.toasty.error(this.translate.instant('An error occurred. Please try again!')));
  }
}
