import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { ILocation, LatLng } from '../location';
import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'app-contacts',
  inputs: ['contacts', 'me', 'show'],
  templateUrl: 'contacts.component.html',
  styleUrls: ['contacts.component.css'],
  directives: [MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_LIST_DIRECTIVES, MdIcon, MdToolbar],
  providers: [MdIconRegistry]
})
export class ContactsComponent implements OnInit {

  constructor() { }

  conversion: number = 1.6142;

  @Input() contacts: ILocation[];
  @Input() me: ILocation;
  @Input() show: boolean;
  //@Output() clear = new EventEmitter();

  ngOnInit() { }

  formatDate(dateTime: string): string {
    return moment(dateTime).fromNow();
  }

  distanceTo(contact: ILocation): number {
    return this.distanceBetween(this.me.position, contact.position) / this.conversion;
  }

  distanceBetween(latLng1: LatLng, latLng2: LatLng): number {
    var R = 6371;
    var dLat = this.deg2rad(latLng2.lat - latLng1.lat);
    var dLon = this.deg2rad(latLng2.lng - latLng1.lng);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(latLng1.lat)) * Math.cos(this.deg2rad(latLng2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }

}
