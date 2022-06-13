import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SubjectService } from '../../../shared/services';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.html'
})
export class SearchBarComponent implements OnInit {
  @Input() config: any;
  public categoryId: any;
  public categories: any;

  constructor(private router: Router, private subjectService: SubjectService, private route: ActivatedRoute) {
    const categories = this.route.snapshot.data['categories'];
    this.categories = categories;
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ''
          ? []
          : this.categories.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      )
    );
  formatter = (x: any) => x.name;

  ngOnInit() {}

  submit() {
    if (!this.categoryId) {
      this.router.navigate(['/tutors']);
    } else this.router.navigate(['/tutors'], { queryParams: { categoryIds: [this.categoryId] } });
  }

  keyPress(event: any) {
    if (event.charCode === 13) {
      this.submit();
    }
  }

  onSelect(event: any) {
    this.categoryId = event.item && event.item.id ? event.item.id : '';
  }
}
