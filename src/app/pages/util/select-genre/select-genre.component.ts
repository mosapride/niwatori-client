import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResponseFindGenre } from 'src/app/dto/genre.dto';
import { RequestClientService } from 'src/app/service/request-client.service';

@Component({
  selector: 'app-select-genre',
  templateUrl: './select-genre.component.html',
  styleUrls: ['./select-genre.component.scss'],
})
export class SelectGenreComponent {
  @Input() genres: ResponseFindGenre[] = [];
  @Output() genresChange = new EventEmitter<ResponseFindGenre[]>();
  @Output() initialized = new EventEmitter<void>();
  constructor() {

  }
}
