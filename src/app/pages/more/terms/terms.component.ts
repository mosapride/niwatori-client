import { AfterViewChecked, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['../more.scss'],
})
export class TermsComponent implements AfterViewChecked {
  constructor(private readonly titleService: Title) {}
  ngAfterViewChecked(): void {
    this.titleService.setTitle('利用規約 - 箱庭');
  }
}
