import { Component, OnInit } from '@angular/core';
import { Genre, GenreEnvironment, RequestGenre } from 'src/app/dto/genre.dto';
import { RequestClientService } from 'src/app/service/request-client.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  genre: Pick<Genre, 'id' | 'environment' | 'name'>[] = [];
  constructor(private readonly requestClientService: RequestClientService) {}

  ngOnInit(): void {
    this.reloadGenre();
  }

  reloadGenre(): void {
    this.requestClientService.genreOriginal().subscribe((data) => {
      this.genre = data;
      this.genre.sort((a, b) => {
        if (a.environment > b.environment) {
          return 1;
        }
        if (a.environment < b.environment) {
          return -1;
        }
        return 0;
      });
    });
  }

  add(env: string, name: string): void {
    this.genre.push({ id: 999, environment: env as GenreEnvironment, name });
  }

  syncGenre(): void {
    const syncData: RequestGenre[] = [];
    for (const g of this.genre) {
      syncData.push({ environment: g.environment, name: g.name });
    }
    this.requestClientService.postGenre(syncData).subscribe(() => {
      this.reloadGenre();
    });
  }

  del(id: number): void {
    this.requestClientService.deleteGenre(id + '').subscribe(() => {
      this.reloadGenre();
    });
  }


  addChannel(youtubeChannelId: string): void {
    this.requestClientService.addUser(youtubeChannelId).subscribe(
      () => {},
      (error: any) => {
        console.log(error);
      },
      () => {
        console.log(`add user = ${youtubeChannelId}`);
      }
    );
  }

  delChannel(youtubeChannelId: string): void {
    this.requestClientService.delUser(youtubeChannelId).subscribe(
      () => {},
      (error: any) => {
        console.log(error);
      },
      () => {
        console.log(`del user = ${youtubeChannelId}`);
      }
    );
  }
}
