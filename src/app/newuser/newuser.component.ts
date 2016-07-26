import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdToolbar } from '@angular2-material/toolbar';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
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
  directives: [ROUTER_DIRECTIVES, MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_LIST_DIRECTIVES, MD_INPUT_DIRECTIVES, MdIcon, MdToolbar, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, NgClass],
  providers: [MdIconRegistry, FormBuilder]
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
    console.log(form)           //
    //this.router.navigate(['/'], { relativeTo: this.route });
  }

}
