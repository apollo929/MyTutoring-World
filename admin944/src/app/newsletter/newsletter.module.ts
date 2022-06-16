import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactsComponent } from './components/contacts/contacts.component';
import { SendmailComponent } from './components/sendmail/sendmail.component';
import { NewsletterService } from './services/newsletter.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { QuillModule } from 'ngx-quill';

const routes: Routes = [
  {
    path: 'contacts',
    component: ContactsComponent,
    data: {
      title: 'Manage newsletter contact',
      urls: [{ title: 'Newsletter', url: '/newsletter/contact' }, { title: 'Contact' }]
    }
  },
  {
    path: 'sendmail',
    component: SendmailComponent,
    data: {
      title: 'Send newsletter email',
      urls: [{ title: 'Newsletter contact', url: '/newsletter/contact' }, { title: 'Send newsletter email' }]
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    FroalaEditorModule,
    FroalaViewModule,
    QuillModule.forRoot()
  ],
  declarations: [ContactsComponent, SendmailComponent],
  providers: [NewsletterService],
  exports: [],
  entryComponents: []
})
export class NewsletterModule {}
