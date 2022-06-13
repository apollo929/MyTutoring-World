import { ConfigResolver } from '../shared/resolver/config.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './safety/signup.component';

const routes: Routes = [

  {
    path: 'safety',
    component: SignupComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
