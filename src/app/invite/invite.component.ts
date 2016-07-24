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
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {EmailService} from '../email.service';

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
  myForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private emailService: EmailService,
    private fb: FormBuilder
  ) {
    this.route.params.subscribe(params => {
      if (params['id']) { this.joinId = params['id']; }
    });

    this.myForm = fb.group({
      'firstname': ['ABC123'],
      'email': ['']
    });
  }

  ngOnInit() {
  }

  onSubmit(form: any): void {
    console.log('you submitted value:', form);
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
