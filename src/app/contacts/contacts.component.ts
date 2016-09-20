import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Location, ILocation, LatLng } from '../location';
import { ISettings } from '../store';
import * as moment from 'moment';

interface Contact extends ILocation {
  clicked: boolean;
}

@Component({
  selector: 'app-contacts',
  templateUrl: 'contacts.component.html',
  styleUrls: ['contacts.component.css']
})
export class ContactsComponent implements OnInit {

  constructor() {
    this.emptySelectedContact();
  }

  conversion: number = 1.6142;
  showConfirmDialog: boolean = false;
  selectedContact: ILocation;

  @Input() settings: ISettings;
  @Input() show: boolean;
  @Output() centre = new EventEmitter();
  @Output() remove = new EventEmitter();

  ngOnInit() { }

  formatDate(dateTime: string): string {
    return moment(dateTime).fromNow();
  }

  distanceTo(contact: ILocation): number {
    return this.distanceBetween(this.settings.myLocation.position, contact.position) / this.conversion;
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

  // Show a remove button for 2 seconds
  clicked(contact: Contact) {
    contact.clicked = true;
    setTimeout(() => contact.clicked = false, 2000);
  }

  openConfirmDialog(contact: ILocation) {
    this.selectedContact = contact;
    this.showConfirmDialog = true;
  }

  closeConfirmDialog() {
    this.showConfirmDialog = false;
    this.emptySelectedContact()
  }

  removeContact(contact: ILocation) {
    this.remove.emit(contact);
    this.closeConfirmDialog();
  }

  emptySelectedContact() {
    this.selectedContact = new Location({ lat: 0, lng: 0 });
  }

}
