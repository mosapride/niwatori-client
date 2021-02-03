import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestUserList } from 'src/app/dto/user.dto';
import { RequestClientService } from 'src/app/service/request-client.service';
import { environment } from 'src/environments/environment';
import { OrderBy, TGenreIdsEmitterVal, TOrderByEmitterVal } from './search/search.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: RequestUserList[] = [];
  usersOrg: RequestUserList[] = [];
  readonly viewerCount = 12;
  selectActivePage = 0;
  selectTargetGenre: number[] = [];
  selectOrderBy: OrderBy = OrderBy.latestPostVideoAtDESC;
  constructor(private readonly activatedRoute: ActivatedRoute, private readonly requestClientService: RequestClientService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      // tslint:disable-next-line: one-variable-per-declaration
      const page = params.p,
        targetGenres = params.g,
        orderBy = params.order;
      if (Number.isInteger(+page)) {
        this.selectActivePage = +page;
        console.log(this.selectActivePage);
      }

      const wkTargetGenre: number[] = [];
      if (targetGenres) {
        const targetGenreList = (targetGenres + '').split(',');
        for (const t of targetGenreList) {
          if (Number.isInteger(+t)) {
            wkTargetGenre.push(+t);
          }
        }
      }

      this.genreFilter(wkTargetGenre, false);

      if (orderBy) {
        console.log(orderBy);
        this.orderBy(orderBy, false);
      }
    });


    this.requestClientService.getUsers().subscribe((data) => {
      data = data.filter((v) => {
        if (!v.videoCount) {
          return false;
        }
        if (v.videoCount === 0) {
          return false;
        }
        return true;
      });
      this.users = data;
      this.orderBy(this.selectOrderBy , false);
      this.usersOrg = data;
    });
  }

  /**
   * ブラウザURLを変更する。
   *
   * 戻る(browser back)をした場合に元のページに自然に遷移元に戻るために実装
   *
   * @param p ページナンバー
   */
  replaceUrlState(): void {
    let parameter = `u?p=${this.selectActivePage}&order=${this.selectOrderBy}`;
    if (this.selectTargetGenre.length !== 0) {
      parameter += `&g=${this.selectTargetGenre.join()}`;
    }

    history.replaceState('', '', parameter);
  }

  /**
   * ページ数を取得する.
   *
   * `*ngFor`のためにページ数そのものではなく、配列を返す。
   * example:7ページの場合、[0,1,2,3,4,5,6]の配列を返す。
   */
  getPager(): number[] {
    const maxPage = Math.ceil(this.users.length / this.viewerCount);
    const pager: number[] = [];
    for (let i = 0; i < maxPage; i++) {
      pager.push(i);
    }
    return pager;
  }

  genreListener(val: TGenreIdsEmitterVal): void {
    this.genreFilter(val?.ids, val?.refresh);
  }

  genreFilter(genreIds?: number[], pageReset = true): void {
    if (!genreIds || genreIds.length === 0) {
      this.users = this.usersOrg;
      this.selectTargetGenre = [];
      this.replaceUrlState();
      return;
    }
    this.selectTargetGenre = genreIds;
    this.replaceUrlState();
    this.requestClientService.matchGenre(genreIds).subscribe((userIds) => {
      this.users = this.usersOrg.filter((u) => {
        for (const id of userIds) {
          if (u.youtubeChannelId === id) {
            return true;
          }
        }
        return false;
      });
    });
    if (pageReset) {
      this.selectActivePage = 0;
    }
  }

  orderByListener(val: TOrderByEmitterVal): void {
    this.orderBy(val.order, val.refresh);
    this.replaceUrlState();
  }
  orderBy(order: OrderBy, pageReset = true): void {
    this.selectOrderBy = order;
    this.replaceUrlState();
    this.users = this.users.sort((a, b) => {
      switch (order) {
        case OrderBy.createdAtDESC:
          if (a.createdAt > b.createdAt) {
            return -1;
          }
          if (a.createdAt < b.createdAt) {
            return 1;
          }
          break;
        case OrderBy.latestPostVideoAtDESC:
          if (a.latestPostVideoAt > b.latestPostVideoAt) {
            return -1;
          }
          if (b.latestPostVideoAt < b.latestPostVideoAt) {
            return 1;
          }
          break;
        case OrderBy.viewCountDESC:
          if (!a.viewCount || !b.viewCount) {
            return 0;
          }
          if (a.viewCount > b?.viewCount) {
            return -1;
          }
          if (a.viewCount < b.viewCount) {
            return 1;
          }
          break;
        case OrderBy.subscriberCountDESC:
          if (!a.subscriberCount || !b.subscriberCount) {
            return 0;
          }
          if (a.subscriberCount > b.subscriberCount) {
            return -1;
          }
          if (a.subscriberCount < b.subscriberCount) {
            return 1;
          }
      }
      return 0;
    });
    if (pageReset) {
      this.selectActivePage = 0;
    }
  }

  openWindowsByUser(e: MouseEvent, youtubeChannelId: string): void {
    if (e.buttons === 4) {
      window.open(`${environment.host}/u/${youtubeChannelId}`, undefined)?.blur();
    }
    e.preventDefault();
  }
}
