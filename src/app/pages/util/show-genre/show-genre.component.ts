import { Component, Input } from '@angular/core';
import { ResponseFindGenre } from '../../../dto/genre.dto';

@Component({
  selector: 'app-show-genre',
  templateUrl: './show-genre.component.html',
  styleUrls: ['./show-genre.component.scss'],
})
export class ShowGenreComponent {
  @Input() genres: ResponseFindGenre[] = [];
  constructor() {}
}
