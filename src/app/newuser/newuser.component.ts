import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import {
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
  styleUrls: ['newuser.component.css']
})
export class NewuserComponent implements OnInit {

  @Input() newUser: boolean;
  @Output() updateContact = new EventEmitter();
  newUserForm: FormGroup;
  firstname: AbstractControl;
  colour: AbstractControl;
  colourList: Option[];

  constructor(fb: FormBuilder) {
    this.newUserForm = fb.group({
      firstname: ['', Validators.required],
      colour: ['blue']
    });
    this.firstname = this.newUserForm.controls['firstname'];
    this.colour = this.newUserForm.controls['colour'];
  }

  ngOnInit() {
    this.setColourList()
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

  // join(form: any): void {
  //   this.router.navigate([this.makeUrl(), form], { relativeTo: this.route });
  // }

  // makeUrl(): string {
  //   return '/join/' + this.joinId + '/';
  // }

}
