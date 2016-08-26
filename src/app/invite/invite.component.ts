import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl
} from '@angular/forms';
import {EmailService} from '../email.service';
import {validateEmail} from '../validators';

@Component({
  selector: 'app-invite',
  templateUrl: 'invite.component.html',
  styleUrls: ['invite.component.css'],
  providers: [EmailService, FormBuilder]
})
export class InviteComponent implements OnInit, AfterViewInit {

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
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) { this.joinId = params['id']; }
    });
  }

  ngAfterViewInit() {
    document.getElementById('nameInput').focus();
  }

  onSubmit(form: any): void {
    this.emailService.sendInvitation(form.email, this.joinId, form.firstname)
      .subscribe(
        data => this.router.navigate(['/'], { relativeTo: this.route }),
        err => console.log('Error sending email', err)
      );
  }

  back($event) {
    this.router.navigate(['/map'], { relativeTo: this.route });
  }

}
