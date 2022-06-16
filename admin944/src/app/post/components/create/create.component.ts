import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-create',
  templateUrl: './create.html'
})
export class PostCreateComponent implements OnInit {
  public post: any = {
    title: '',
    alias: '',
    content: '',
    type: 'page'
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

  constructor(private router: Router, private postService: PostService, private toasty: ToastrService) {}

  ngOnInit() {}

  submit(frm: any) {
    if (!frm.valid) {
      return this.toasty.error('Invalid form, please try again.');
    }
    if (this.post.content) {
      this.post.content = this.post.content.replace(
        '<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>',
        ''
      );
    }
    this.submitted = true;
    this.postService.create(this.post).then(
      () => {
        this.toasty.success('Post has been created');
        this.router.navigate(['/posts/list']);
      },
      err => this.toasty.error(err.data.message || 'Something went wrong!')
    );
  }
}
