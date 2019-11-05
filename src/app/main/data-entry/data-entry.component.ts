import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSelectChange } from '@angular/material';
import { ApiService } from 'src/app/service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit {

  @ViewChild(NgSelectComponent, { static: true }) ngSelectComponent: NgSelectComponent;
  @ViewChild('f', { static: true }) ngForm: any;
  dataEntryForm: FormGroup;
  countries: string[] = ["Rest of India"];
  centers: any[] = [];
  subcenters: any[] = [];
  centerData: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _notifierService: NotifierService,
    private _spinner: NgxSpinnerService,
    private _apiService: ApiService,
  ) { }

  ngOnInit() {
    this.dataEntryForm = this._formBuilder.group({
      name: [null, Validators.required],
      age: [null, [Validators.required, Validators.pattern(/^[0-9]{1,2}[:.,-]?$/)]],
      gender: ['Male', Validators.required],
      mobile: [null, [Validators.pattern(/^[6-9]\d{9}$/)]],
      email: [null, [Validators.email]],
      country: [null, Validators.required],
      other_country: [null],
      city: [null, Validators.required],
      sub_city: [null, Validators.required],
      other_city: [null],
      education_affiliation: [false],
    });
    this.getCenters();
  }

  get f() {
    return this.dataEntryForm.controls;
  }

  reset() {
    this.dataEntryForm.reset();
    this.f.city.enable();
    this.f.gender.setValue('Male');
    if (this.countries.length > 0) {
      this.f.country.setValue('India');
    }
    if (this.centers.length > 0) {
      this.f.city.setValue('Mumbai');
      this.f.sub_city.reset();
      this.f.sub_city.setValidators(Validators.required);
      this.f.sub_city.updateValueAndValidity();
    }
    this.f.education_affiliation.setValue(false);
    this.f.other_country.setValidators(null);
    this.f.other_city.setValidators(null);
    this.f.other_country.updateValueAndValidity();
    this.f.other_city.updateValueAndValidity();
  }

  async getCenters() {
    try {
      this._spinner.show();
      const result = await this._apiService.getCenters().toPromise();
      this.centerData = result.data;
      console.log("Result", this.centerData);
      this.countries = [...Object.keys(this.centerData), ...this.countries];
      this.initData('India');
      this.reset();
      this._spinner.hide();
    } catch (error) {
      this._spinner.hide();
      console.error("Error", error);
    }
  }

  onCitySelect(event: { value: string; }) {
    if (event && event.value === "Rest of India") {
      this.f.other_city.reset();
      this.f.other_city.setValidators(Validators.required);
    } else if (event && event.value === "Mumbai") {
      this.f.sub_city.reset();
      this.f.sub_city.setValidators(Validators.required);
    } else {
      this.f.other_city.reset();
      this.f.sub_city.reset();
      this.f.other_city.setValidators(null);
      this.f.sub_city.setValidators(null);
    }
    this.f.other_city.updateValueAndValidity();
    this.f.sub_city.updateValueAndValidity();
  }

  onChangeCountry(matSelectChange: MatSelectChange) {
    if (matSelectChange.value === 'Rest of India') {
      this.f.other_country.reset();
      this.f.city.disable();
      this.f.city.setValue('Rest of India');
      this.f.other_country.setValidators(Validators.required);
      this.f.other_city.setValidators(Validators.required);
    } else {
      this.f.other_country.reset();
      this.f.city.reset();
      this.f.city.enable();
      if (matSelectChange.value === 'India' && this.centers.length > 0) {
        this.f.city.setValue('Mumbai');
        this.f.sub_city.reset();
        this.f.sub_city.setValidators(Validators.required);
        this.f.sub_city.updateValueAndValidity();
      } else {
        this.ngSelectComponent.handleClearClick();
      }
      this.initData(matSelectChange.value);
      this.f.other_country.setValidators(null);
      this.f.other_city.setValidators(null);
    }
    this.f.other_country.updateValueAndValidity();
    this.f.other_city.updateValueAndValidity();
  }

  initData(value: string) {
    let centers: any[] = this.centerData[value];
    if (value == 'India') {
      this.subcenters = centers[0]['Mumbai'];
      centers = centers.shift();
    }
    let obj_centers = [];
    for (let index = 0; index < centers.length; index++) {
      const element = centers[index];
      obj_centers.push({
        value: element
      });
    }
    this.centers = obj_centers;
  }

  async submit() {
    try {
      if (this.dataEntryForm.valid) {
        this._spinner.show();
        console.log('Form', this.dataEntryForm);
        const prepareData = this.dataEntryForm.value;
        prepareData.password = this._apiService.curruntUser.password;
        if (prepareData.city == 'Mumbai') {
          prepareData.city = prepareData.sub_city;
          delete prepareData.sub_city;
        }
        let result = await this._apiService.submitData(prepareData).toPromise();
        console.log("Submitted", result);
        this.reset();
        this._notifierService.notify('success', `Saved successfully`);
        this._spinner.hide();
      }
    } catch (error) {
      this._spinner.hide();
      console.error("error submit", error);
      this._notifierService.notify('error', `${error.statusText || error}`);
    }
  }

}
