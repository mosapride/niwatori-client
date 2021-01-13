import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RequestProfileUsers } from 'src/app/dto/user.dto';
import { RequestClientService } from 'src/app/service/request-client.service';

@Component({
  selector: 'app-user-link',
  templateUrl: './user-link.component.html',
  styleUrls: ['./user-link.component.scss'],
})
export class UserLinkComponent implements OnInit {
  requestProfileUsers: RequestProfileUsers | undefined;
  @Output() formSubmit: EventEmitter<string> = new EventEmitter<string>();
  constructor(private readonly requestClientService: RequestClientService) {}
  ngOnInit(): void {
    this.getProfileSelectUsers(0);
  }

  getProfileSelectUsers(page: number): void {
    this.requestClientService.getProfileSelectUsers(page).subscribe((data) => {
      this.requestProfileUsers = data;
    });
  }

  select(data: string): void {
    this.formSubmit.emit(data);
  }

  getSelectUsersByLeft(): void {
    if (this.requestProfileUsers) {
      this.getProfileSelectUsers(this.requestProfileUsers.page - 1);
    }
  }

  getSelectUsersByRight(): void {
    if (this.requestProfileUsers) {
      this.getProfileSelectUsers(this.requestProfileUsers.page + 1);
    }
  }
}
