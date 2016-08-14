import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl
} from '@angular/forms';

interface Option {
  text: string;
  value: string;
}

@Component({
  moduleId: module.id,
  selector: 'app-newuser',
  templateUrl: 'newuser.component.html',
  styleUrls: ['newuser.component.css'],
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
})
export class NewuserComponent implements OnInit {

  joinId: string = null;
  joinForm: FormGroup;
  firstname: AbstractControl;
  colour: AbstractControl;
  colourList: Option[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    fb: FormBuilder
  ) {
    this.joinForm = fb.group({
      firstname: ['', Validators.required],
      colour: ['blue']
    });
    this.firstname = this.joinForm.controls['firstname'];
    this.colour = this.joinForm.controls['colour'];
  }

  ngOnInit() {
    this.setColourList()
    this.route.params.subscribe(params => {
      if (params['id']) { this.joinId = params['id']; }
    });
  }

  ngAfterViewInit() {
    document.getElementById('nameInput').focus();
  }

  setColourList() {
    this.colourList = [
      { text: 'red', value: 'red' },
      { text: 'blue', value: 'blue' },
      { text: 'green', value: 'green' },
      { text: 'black', value: 'black' },
      { text: 'purple', value: 'purple' },
      { text: 'orange', value: 'orange' }
    ];
  }

  join(form: any): void {
    this.router.navigate([this.makeUrl(), form], { relativeTo: this.route });
  }

  makeUrl(): string {
    return '/join/' + this.joinId + '/';
  }

}
