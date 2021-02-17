import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseFindGenre } from 'src/app/dto/genre.dto';
import { RequestClientService } from 'src/app/service/request-client.service';

// ASC = 昇順
// DESC = 降順
export enum OrderBy {
  'createdAtDESC',
  'latestPostVideoAtDESC',
  'viewCountDESC',
  'subscriberCountDESC',
}

export type TGenreIdsEmitterVal = {
  ids: number[];
  refresh: boolean;
};

export type TOrderByEmitterVal = {
  order: OrderBy;
  refresh: boolean;
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  responseFindGenres: ResponseFindGenre[] = [];
  activeOrderby: OrderBy = OrderBy.latestPostVideoAtDESC;
  orderBy = OrderBy;
  @Output() genreEmit = new EventEmitter<TGenreIdsEmitterVal>();
  @Output() orderByEmit = new EventEmitter<TOrderByEmitterVal>();
  constructor(private readonly activatedRoute: ActivatedRoute, private readonly requestClientService: RequestClientService) {}

  async ngOnInit(): Promise<void> {
    await this.requestClientService
      .genre()
      .toPromise()
      .then((data) => {
        for (const d of data) {
          d.items = d.items.filter((i) => {
            return i.count !== 0;
          });
        }

        data = data.filter((i) => {
          return i.items.length !== 0;
        });
        console.log(data);
        this.responseFindGenres = data;
      });

    this.activatedRoute.queryParams.subscribe((params) => {
      // tslint:disable-next-line: one-variable-per-declaration
      const targetGenres = params.g,
        orderBy = params.order;
      const wkTargetGenre: number[] = [];
      if (targetGenres) {
        const targetGenreList = (targetGenres + '').split(',');
        for (const t of targetGenreList) {
          if (Number.isInteger(+t)) {
            wkTargetGenre.push(+t);
          }
        }
      }
      if (wkTargetGenre.length !== 0) {
        this.responseFindGenres = this.responseFindGenres.map((rfg) => {
          rfg.items.map((item) => {
            for (const tg of wkTargetGenre) {
              if (item.id === tg) {
                item.has = true;
                break;
              }
            }
          });
          return rfg;
        });
        this.search(false);
      }
      if (orderBy) {
        if (Number.isInteger(+orderBy)) {
          this.emitActiveOrderBy(+orderBy, false);
        }
      }
    });
  }

  search(refresh = true): void {
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
      this.genreEmit.emit();
      return;
    }

    this.genreEmit.emit({ ids: genreIds, refresh });
  }

  emitActiveOrderBy(order: OrderBy, refresh = true): void {
    this.activeOrderby = order;
    this.orderByEmit.emit({ order: this.activeOrderby, refresh });
  }
}
