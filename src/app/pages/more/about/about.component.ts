import { AfterViewChecked, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements AfterViewChecked {
  constructor(private readonly titleService: Title) {}
  ngAfterViewChecked(): void {
    this.titleService.setTitle('About - 箱庭');
  }
}
