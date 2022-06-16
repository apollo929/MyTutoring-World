import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  templateUrl: 'sendmail.html'
})
export class SendmailComponent implements OnInit {
  public data = {
    subject: '',
    content: '',
    userType: ''
  };
  public submitted: Boolean = false;
  public quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ font: [] }],
        [{ align: [] }],

        ['clean']
        // ['image']
      ]
    },
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: (range, context) => {
            return true;
          }
        }
      }
    }
  };

  constructor(private service: NewsletterService, private toasty: ToastrService) {}

  ngOnInit() {}

  submit(frm: any) {
    this.submitted = true;
    if (frm.invalid || this.data.subject === '') {
      this.submitted = false;
      return this.toasty.error('Please enter subject');
    }
    const check = window.setTimeout(() => {
      this.checkContent(check);
    }, 2000);
  }

  checkContent(check) {
    if (this.data.content !== '') {
      this.data.content = this.data.content.replace(
        '<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>',
        ''
      );
      window.clearTimeout(check);
      this.service
        .sendMail(this.data)
        .then(() => {
          this.submitted = false;
          this.toasty.success('Mail has been sent!');
          window.setTimeout(() => window.location.reload(), 1500);
        })
        .catch(() => this.toasty.error('Something went wrong, please try again!'));
    } else {
      this.submitted = false;
      return this.toasty.error('Please enter content');
    }
  }
}
