import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent, DialogData } from '../confirm-dialog/confirm-dialog.component';

declare var GLightbox: any;

@Component({
  selector: 'app-lightbox-img-grid',
  templateUrl: './lightbox-img-grid.component.html',
  styleUrls: ['./lightbox-img-grid.component.scss'],
})
export class LightboxImgGridComponent {
  /**
   * 画像ファイルのベースURLを保持する。
   * http://サーバー名/画像フォルダ/
   */
  imgBaseUrl: string;
  /**
   * 表示する画像ファイル名。
   */
  imageFiles: string[] = [];
  @Input() doDelete = false;
  @Input() set images(val: string[]) {
    this.imageFiles = val;
    const elements: { href: string; type: 'image' }[] = [];
    for (const p of this.imageFiles) {
      elements.push({ href: `${environment.imageUrl}${p}`, type: 'image' });
    }
  }
  @Input() index = 0;
  @Output() deleteImageEmitter = new EventEmitter<string>();

  constructor(private readonly dialog: MatDialog) {
    this.imgBaseUrl = environment.imageUrl;
  }

  view(ix: number): void {
    const elements: { href: string; type: 'image' }[] = [];
    for (const img of this.imageFiles) {
      elements.push({ href: `${environment.imageUrl}${img}`, type: 'image' });
    }
    GLightbox({
      elements,
      startAt: ix,
    }).open();
  }

  delete(imageFile: string): void {
    const confirmDialog = this.dialog.open<ConfirmDialogComponent, DialogData, boolean | undefined>(ConfirmDialogComponent, {
      data: { title: '確認', message: '指定した画像を削除しますか？' },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteImageEmitter.emit(imageFile);
      }
    });
  }
}
