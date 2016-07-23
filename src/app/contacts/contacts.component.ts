import { Component, Input, EventEmitter } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { ILocation } from '../location';

@Component({
  moduleId: module.id,
  selector: 'app-contacts',
  inputs: ['contacts', 'show'],
  templateUrl: 'contacts.component.html',
  styleUrls: ['contacts.component.css'],
  directives: [MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_LIST_DIRECTIVES, MdIcon, MdToolbar],
  providers: [MdIconRegistry]
})
export class ContactsComponent {

  constructor() { }

  @Input() contacts: ILocation[];
  @Input() show: boolean;
  //@Output() clear = new EventEmitter();

}
