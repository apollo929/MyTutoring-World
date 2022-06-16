import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TextService } from '../../services/text.service';

@Component({
  templateUrl: 'text.html'
})
export class TextComponent implements OnInit {
  public items = [];
  public page = 1;
  public total = 0;
  public newText = { text: '' };
  public search = { text: '' };

  constructor(private router: Router, private service: TextService, private toasty: ToastrService) {}

  ngOnInit() {
    this.query();
  }

  query() {
    this.service
      .search({
        page: this.page,
        text: this.search.text
      })
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this text?')) {
      this.service
        .remove(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
        })
        .catch(e =>
          this.toasty.error(
            e.data.data && e.data.data.message ? e.data.data.message : 'Something went wrong, please try again!'
          )
        );
    }
  }

  add() {
    if (!this.newText.text) {
      return this.toasty.error('Please enter text');
    }

    this.service
      .create(this.newText)
      .then(resp => this.items.push(resp.data))
      .catch(e =>
        this.toasty.error(
          e.data.data && e.data.data.message ? e.data.data.message : 'Something went wrong, please try again!'
        )
      );
  }
}
