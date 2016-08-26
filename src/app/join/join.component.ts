import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ILocation } from '../location';
import { timeStamp, uniqueArray } from '../utils';
import { select } from 'ng2-redux';
import { LocationsService } from '../locations.service';
import { ISettings } from '../store';

@Component({
  selector: 'app-join',
  templateUrl: 'join.component.html',
  styleUrls: ['join.component.css'],
  providers: [LocationsService]
})
export class JoinComponent implements OnInit {

  @select() settings$: Observable<ISettings>;

  app: Observable<any>;
  settings: any;            // Todo: strong type
  joinId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationsService: LocationsService
  ) { }

  ngOnInit() {
    this.settings$.subscribe((settings) => {
      if (settings.initialised) {
        this.settings = settings;
        this.setJoinIdFromUrl();
      }
    });
  }

  setJoinIdFromUrl() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.joinId = params['id'];
        if (this.joinId !== this.settings.locationId) { this.linkUsers(this.joinId); }
      }
    });
  }

  linkUsers(theirId: string) {                          //TODO move into locationsService
    this.locationsService.getLocationByKey(theirId)
      .then((match) => {
        this.linkMeToThem(theirId);
        this.linkThemToMe(match);
        this.joinId = null;
        this.goToMap();
      })
      .catch(error => console.log(error));
  }

  linkMeToThem(theirId: string) {
    let c: string[] = [theirId];
    if (this.settings.myLocation.contacts) { c = uniqueArray(c.concat(this.settings.myLocation.contacts)); }
    this.locationsService.updateByKey(this.settings.locationId, { contacts: c, updated: timeStamp });
  }

  linkThemToMe(theirLocation: ILocation) {
    let c: string[] = [this.settings.locationId];
    if (theirLocation.contacts) { c = uniqueArray(c.concat(theirLocation.contacts)); }
    this.locationsService.updateByKey(theirLocation.$key, { contacts: c, updated: timeStamp });
  }

  goToMap() {
    this.router.navigate(['/'], { relativeTo: this.route });
  }

}
