import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  youtubeChannelId = '';
  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.youtubeChannelId = this.route.snapshot.paramMap.get('youtubeChannelId') + '';
  }
}
