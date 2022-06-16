import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { PostService } from '../../services/post.service';
import { Location } from '@angular/common';

@Component({
  selector: 'update-post',
  templateUrl: './update.html'
})
export class PostUpdateComponent implements OnInit {
  public post: any = {};
  private pId: any;
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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toasty: ToastrService,
    private postService: PostService,
    private location: Location
  ) {}

  ngOnInit() {
    this.pId = this.route.snapshot.paramMap.get('id');
    this.postService.findOne(this.pId).then(resp => {
      this.post = _.pick(resp.data, ['title', 'alias', 'content', 'type']);
    });
  }

  submit(frm: any) {
    this.submitted = true;
    if (!frm.valid) {
      return this.toasty.error('Something went wrong, please check and try again!');
    }
    if (this.post.content) {
      this.post.content = this.post.content.replace(
        '<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>',
        ''
      );
    }
    this.postService
      .update(this.pId, this.post)
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.router.navigate(['/posts/list']);
      })
      .catch(err => this.toasty.error('Something went wrong, please check and try again!'));
  }
}
