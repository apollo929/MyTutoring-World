import { Component, Input, OnInit } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-text-ellipsis',
  template: `<div class="card-text" *ngIf="content">
    <p class="more" [innerHTML]="content"></p>
    <a [routerLink]="[path, param]" class="morelink"><span translate>Read more</span>...</a>
  </div>`
})
export class TextEllipsisComponent implements OnInit {
  @Input() content: string = '';
  @Input() showChar: number = 50;
  @Input() path: string = '';
  @Input() param: string = '';
  constructor() {}

  ngOnInit() {
    const showChar = this.showChar;
    if (this.content) {
      (function ($) {
        $(document).ready(function () {
          //   const showChar = showChar; // How many characters are shown by default
          const ellipsestext = '...';
          let content = '';
          $('.more').each(function () {
            content = $(this).text();
            if (content.length > showChar) {
              const c = content.substr(0, showChar);
              const html =
                c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span>' + `</span>&nbsp;&nbsp;` + '</span>';
              $(this).html(html);
            } else {
              const html =
                content + '<span class="moreellipses">' + '&nbsp;</span>' + `</span>&nbsp;&nbsp;` + '</span>';
              $(this).html(html);
            }
          });
        });
      })(jQuery);
    }
  }
}
