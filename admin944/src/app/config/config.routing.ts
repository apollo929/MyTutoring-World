import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigsComponent } from './list/configs.component';
import { MailerServiceSupportedComponent } from './mailer-service/mailer-service.component';
const routes: Routes = [
  {
    path: '',
    component: ConfigsComponent,
    data: {
      title: 'System configs',
      urls: [{ title: 'System configs', url: '/configs' }, { title: 'Update config' }]
    }
  },
  {
    path: 'mailer-service-supported',
    component: MailerServiceSupportedComponent,
    data: {
      title: 'Mailer services supported',
      urls: [{ title: 'System configs', url: '/configs' }, { title: 'Update config' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule {}
