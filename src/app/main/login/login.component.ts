import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/service';
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _apiService: ApiService,
    private _notifierService: NotifierService,
  ) { }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      password: [null, Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  async submit() {
    try {
      if (this.f.password.value === environment.masterPasswod) {
        this._apiService.curruntUser.password = this.f.password.value;
        this._notifierService.notify('success', `Login successfully`);
        this._router.navigate(['data-entry']);
      } else {
        const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        const result = environment.password.filter(t => t.date.getTime() == today.getTime())[0];
        console.log('Res', result.password, this.f.password.value);
        if (result && result.password === this.f.password.value) {
          this._apiService.curruntUser.password = this.f.password.value;
          this._notifierService.notify('success', `Login successfully`);
          this._router.navigate(['data-entry']);
        } else {
          throw 'Password Incorrect';
        }
      }
    } catch (error) {
      console.error(`${error}`, error);
      this._notifierService.notify('error', `${error}`);
    }
  }

}
