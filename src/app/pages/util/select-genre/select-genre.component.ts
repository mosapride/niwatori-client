import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResponseFindGenre } from 'src/app/dto/genre.dto';

@Component({
  selector: 'app-select-genre',
  templateUrl: './select-genre.component.html',
  styleUrls: ['./select-genre.component.scss'],
})
export class SelectGenreComponent {
  @Input() genres: ResponseFindGenre[] = [];
  @Output() genresChange = new EventEmitter<ResponseFindGenre[]>();
  @Output() initialized = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<void>();
  constructor() {}

  valChangeEmitter(): void {
    this.valueChange.emit();
  }
}
