import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor( private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.queryParamMap.subscribe(data => {
      console.log(data);
    });
  }

}
