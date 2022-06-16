import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '../../services/translation.service';

@Component({
  templateUrl: 'translation.html'
})
export class TranslationComponent implements OnInit {
  public items = [];
  public page = 1;
  public total = 0;
  public search: any = {
    text: '',
    translation: ''
  };
  private lang = '';

  constructor(private route: ActivatedRoute, private service: TranslationService, private toasty: ToastrService) {}

  ngOnInit() {
    this.lang = this.route.snapshot.params.lang;
    this.query();
  }

  query() {
    this.service
      .search(
        Object.assign(this.search, {
          page: this.page,
          lang: this.lang
        })
      )
      .then(resp => {
        this.items = (resp.data && resp.data.items && resp.data.items) || [];
        this.total = (resp.data && resp.data.count && resp.data.count) || 0;
      })
      .catch(e => {
        alert('Something went wrong, please try again!');
      });
  }

  update(item: any) {
    if (!item.translation) {
      return this.toasty.error('Please enter translation');
    }

    this.service
      .update(item._id, { translation: item.translation })
      .then(resp => this.toasty.success('Updated'))
      .catch(e =>
        this.toasty.error(
          e.data.data && e.data.data.message ? e.data.data.message : 'Something went wrong, please try again!'
        )
      );
  }

  pull() {
    this.service
      .pull(this.lang)
      .then(() => window.location.reload())
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }
}
