import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-invite',
  templateUrl: 'invite.component.html',
  styleUrls: ['invite.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class InviteComponent implements OnInit {

  joinId: string = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      if (params['id']) { this.joinId = params['id']; }
    });
  }

  ngOnInit() {
  }

  onSubmit(form: any): void {
    console.log('you submitted value:', form);
  }

}
