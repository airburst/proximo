import { Component, OnInit } from '@angular/core';
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
import {EmailService} from '../email.service';
import {validateEmail} from '../validators';

@Component({
  moduleId: module.id,
  selector: 'app-invite',
  templateUrl: 'invite.component.html',
  styleUrls: ['invite.component.css'],
  directives: [ROUTER_DIRECTIVES, MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_LIST_DIRECTIVES, MD_INPUT_DIRECTIVES, MdIcon, MdToolbar, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  providers: [MdIconRegistry, EmailService, FormBuilder]
})
export class InviteComponent implements OnInit {

  joinId: string = null;
  inviteForm: FormGroup;
  firstname: AbstractControl;
  email: AbstractControl;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private emailService: EmailService,
    fb: FormBuilder
  ) {
    this.inviteForm = fb.group({
      firstname: ['', Validators.required],
      email: ['', [Validators.required, validateEmail]]
    });
    this.firstname = this.inviteForm.controls['firstname'];
    this.email = this.inviteForm.controls['email'];
    // this.inviteForm.valueChanges.subscribe((v) => {
    //   console.log(v);
    //   console.log(this.inviteForm.valid);
    // });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) { this.joinId = params['id']; }
    });
  }

  onSubmit(form: any): void {
    console.log('Sending an email to', form.email, 'with id', this.joinId, 'and name', form.firstname);
    //this.emailService.sendInvitation('mark.fairhurst@outlook.com', this.locationId)
    // .subscribe(
    // data => console.log(data),
    // err => console.log('Error sending email', err)
    // );
  }

  back($event) {
    this.router.navigate(['/'], { relativeTo: this.route });
  }

}
