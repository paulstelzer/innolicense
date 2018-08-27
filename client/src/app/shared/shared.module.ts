import { UserModule } from '../modules/user/user.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FullWidthComponent } from './components/full-width/full-width.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { MiddleBoxComponent } from './components/middle-box/middle-box.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

const classesToInclude = [
  FullWidthComponent,
  LeftSidebarComponent,
  MiddleBoxComponent,
];
const modules = [
  CommonModule,
  FormsModule,
  IonicModule,
  UserModule
]
@NgModule({
  imports: [
    ...modules,
    RouterModule,
    HttpClientModule
  ],
  declarations: [
    ...classesToInclude,

  ],
  exports: [
    ...modules,
    ...classesToInclude,
  ],
})
export class SharedModule {

}
