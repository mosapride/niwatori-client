import { AfterViewChecked, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['../more.scss'],
})
export class PrivacyComponent implements AfterViewChecked {
  constructor(private readonly titleService: Title) {}
  ngAfterViewChecked(): void {
    this.titleService.setTitle('プライバシーポリシー - 箱庭');
    throw new Error('Method not implemented.');
  }
}
