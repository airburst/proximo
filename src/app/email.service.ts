import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';
import { EmailTemplates } from './email-templates';

@Injectable()
export class EmailService {

  url: string = 'http://api.fairhursts.net/email';
  //from: string = 'noreply@proximate.fairhursts.net';

  constructor(private http: Http) { }

  sendInvitation(to: string, id: string): Observable<any> {
    return this.send(
      to,
      EmailTemplates.invitation.subject,
      EmailTemplates.invitation.text(id),
      EmailTemplates.invitation.html(id)
    );
  }

  send(to: string, subject: string, text: string, html?: string): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(
      this.url,
      this.payload(to, subject, text, html),
      { headers: headers }
    ).map(res => res.json());
  }

  payload(to: string, subject: string, text: string, html?: string): any {
    return {
      to: to,
      subject: subject,
      text: text,
      html: (html) ? html : text
    };
  }

}
