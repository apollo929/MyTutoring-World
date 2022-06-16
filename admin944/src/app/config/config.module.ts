import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigRoutingModule } from './config.routing';
import { ConfigsComponent } from './list/configs.component';
import { ConfigService } from './service';
import { MediaModule } from '../media/media.module';
import { MailerServiceSupportedComponent } from './mailer-service/mailer-service.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MediaModule,
    NgSelectModule,
    //our custom module
    ConfigRoutingModule
  ],
  declarations: [ConfigsComponent, MailerServiceSupportedComponent],
  providers: [ConfigService]
})
export class ConfigModule {}
