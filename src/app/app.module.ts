import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './main/login/login.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatRadioModule, MatSelectModule, MatCheckboxModule } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataEntryComponent } from './main/data-entry/data-entry.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotifierModule } from "angular-notifier";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DataEntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    NgSelectModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right'
        },
        vertical: {
          position: 'top',
        }
      }
    }),

    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
