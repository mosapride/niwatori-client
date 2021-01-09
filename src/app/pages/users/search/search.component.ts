import { Component, OnInit } from '@angular/core';
import { ResponseFindGenre } from 'src/app/dto/genre.dto';
import { RequestClientService } from 'src/app/service/request-client.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  targetYoutubeChannelIds: string[] = [];
  responseFindGenre: ResponseFindGenre[] = [];
  constructor(private readonly requestClientService: RequestClientService) {}

  ngOnInit(): void {
    this.requestClientService.genre().subscribe((data) => (this.responseFindGenre = data));
  }

  search(): void {}
}
