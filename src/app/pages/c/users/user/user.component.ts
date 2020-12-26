import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestUser } from 'src/app/dto/user.dto';
import { RequestClientService } from 'src/app/service/request-client.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  youtubeChannelId = '';
  user: RequestUser | undefined;
  constructor(private readonly route: ActivatedRoute, private readonly requestClientService: RequestClientService) {}

  ngOnInit(): void {
    this.youtubeChannelId = this.route.snapshot.paramMap.get('youtubeChannelId') + '';
    this.requestClientService.getUser(this.youtubeChannelId).subscribe((data) => {
      this.user = data;
      // console.log(this.user);
    });
  }
}
