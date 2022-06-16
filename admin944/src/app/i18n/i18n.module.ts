import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LanguagesComponent, NewLanguageModalComponent } from './components/languages/languages.component';
import { LanguageService } from './services/language.service';
import { TextService } from './services/text.service';
import { TranslationService } from './services/translation.service';
import { TextComponent } from './components/text/text.component';
import { TranslationComponent } from './components/translation/translation.component';
import { MediaModule } from '../media/media.module';
const routes: Routes = [
  {
    path: 'languages',
    component: LanguagesComponent,
    data: {
      title: 'Manage languages',
      urls: [{ title: 'Languages', url: '/i18n/languages' }, { title: 'Listing' }]
    }
  },
  {
    path: 'text',
    component: TextComponent,
    data: {
      title: 'Manage text',
      urls: [{ title: 'Text', url: '/i18n/text' }, { title: 'Listing' }]
    }
  },
  {
    path: 'translations/:lang',
    component: TranslationComponent,
    data: {
      title: 'Manage translations',
      urls: [{ title: 'Translations' }, { title: 'Listing' }]
    }
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), NgbModule, NgSelectModule, MediaModule],
  declarations: [LanguagesComponent, NewLanguageModalComponent, TextComponent, TranslationComponent],
  providers: [LanguageService, TextService, TranslationService],
  exports: [],
  entryComponents: [NewLanguageModalComponent]
})
export class I18nModule {}
