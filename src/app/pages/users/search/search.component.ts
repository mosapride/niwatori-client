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

  ngOnInit(): void {
    this.requestClientService.genre().subscribe((data) => {

      for (const d of data) {
        d.items = d.items.filter(i => {
          return (i.count !== 0);
        });
      }
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
    if (genreIds.length === 0) {
      this.targetSearch.emit([]);
      return;
    }

    this.requestClientService.matchGenre(genreIds).subscribe((userIds) => {
      this.targetSearch.emit(userIds);
    });
  }

  debug(): void {
    console.log(this.responseFindGenres);
  }
}
