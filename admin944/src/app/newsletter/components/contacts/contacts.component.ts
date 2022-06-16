import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  templateUrl: 'contacts.html'
})
export class ContactsComponent implements OnInit {
  public items = [];
  public page = 1;
  public total = 0;
  public search = { text: '' };

  constructor(private router: Router, private service: NewsletterService, private toasty: ToastrService) {}

  ngOnInit() {
    this.query();
  }

  query() {
    this.service
      .contacts({
        page: this.page,
        email: this.search.text
      })
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this contact?')) {
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
}
