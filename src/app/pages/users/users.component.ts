import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestUserList } from 'src/app/dto/user.dto';
import { RequestClientService } from 'src/app/service/request-client.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: RequestUserList[] = [];
  usersOrg: RequestUserList[] = [];
  readonly viewerCount = 12;
  activePage = 0;
  constructor(private readonly router: ActivatedRoute, private readonly requestClientService: RequestClientService) {}

  ngOnInit(): void {
    this.router.queryParams.subscribe((params) => {
      // tslint:disable-next-line: no-string-literal
      const page = params['p'];
      if (Number.isInteger(+page)) {
        this.activePage = +page;
      }
    });
    this.requestClientService.getUsers().subscribe((data) => {
      this.users = data;
      this.usersOrg = data;
    });
  }

  replaceUrlState(p: number): void {
    history.replaceState('', '', `u?p=${p}`);
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

  search(targetYoutubeChannelIds: string[]): void {
    console.log(targetYoutubeChannelIds);
    if (targetYoutubeChannelIds.length === 0) {
      this.users = this.usersOrg;
      return;
    }
    this.activePage = 0;
    this.users = this.usersOrg.filter((u) => {
      for (const id of targetYoutubeChannelIds) {
        if (u.youtubeChannelId === id) {
          return true;
        }
      }
      return false;
    });
  }
}
