import { AfterViewChecked, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-use-asset',
  templateUrl: './use-asset.component.html',
  styleUrls: ['./use-asset.component.scss'],
})
export class UseAssetComponent implements AfterViewChecked {
  constructor(private readonly titleService: Title) {}
  ngAfterViewChecked(): void {
    this.titleService.setTitle('使用画像/フレームワーク - 箱庭');
  }
}
