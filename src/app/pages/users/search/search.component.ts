import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ResponseFindGenre } from 'src/app/dto/genre.dto';
import { RequestClientService } from 'src/app/service/request-client.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  targetYoutubeChannelIds: string[] = [];
  responseFindGenres: ResponseFindGenre[] = [];
  @Output() targetSearch = new EventEmitter<string[]>();
  constructor(private readonly requestClientService: RequestClientService) {}

  ngOnInit() {
    this.requestClientService.genre().subscribe((data) => {
      this.responseFindGenres = data;
    });
  }

  search(): void {
    const ids = this.responseFindGenres.map((v) => {
      v.items.map((i) => i.has ?? i.id, '');
    });

    const genreIds: number[] = [];

    for (const v of this.responseFindGenres) {
      for (const i of v.items) {
        if (i.has) {
          genreIds.push(i.id);
        }
      }
    }

    this.requestClientService.matchGenre(genreIds).subscribe((userIds) => {
      console.log(userIds);
      this.targetSearch.emit(userIds);
    });
  }

  debug(): void {
    console.log(this.responseFindGenres);
  }
}
