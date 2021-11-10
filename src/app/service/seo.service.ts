import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface TypingProperty {
  property: string;
  content: string;
}

export interface TypingName {
  name: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private readonly metaService: Meta, private readonly titleService: Title) {}

  setDefault(title?: string, url?: string): void {
    const description = '箱庭はYoutube配信者のコミュニティーサービスを提供します。自由に登録、自由に脱退が本望。';
    const img = 'https://freeboll.com/assets/og-image1200x630.png';
    if (!url) {
      url = location.href;
    }
    if (!title) {
      title = '箱庭 - Hakoniwa';
    }
    this.titleService.setTitle(title);

    this.setPropertyTag({ property: 'og:title', content: title });
    this.setPropertyTag({ property: 'og:description', content: description });
    this.setPropertyTag({ property: 'og:image', content: img });
    this.setPropertyTag({ property: 'og:url', content: url });

    this.setNameTag({ name: 'description', content: description });
    this.setNameTag({ name: 'twitter:description', content: description });
    this.setNameTag({ name: 'twitter:title', content: title });
    this.setNameTag({ name: 'twitter:card', content: 'summary' });
    this.setNameTag({ name: 'twitter:image', content: img });
    this.setNameTag({ name: 'twitter:url', content: url });
  }

  setUserInfo(youtubeChannelName: string, youtubeChannelId: string, description: string, img: string): void {
    const title = `${youtubeChannelName} - 箱庭`;
    description = description
      .replace(/\r?\n|/g, '')
      .replace(/\x20+|\u3000+/g, ' ')
      .slice(0, 100);
    const url = `https://freeboll.com/u/${youtubeChannelId}`;
    this.titleService.setTitle(title);
    this.setPropertyTag({ property: 'og:title', content: title });
    this.setPropertyTag({ property: 'og:description', content: description });
    this.setPropertyTag({ property: 'og:image', content: img });
    this.setPropertyTag({ property: 'og:url', content: url });

    this.setNameTag({ name: 'description', content: description });
    this.setNameTag({ name: 'twitter:description', content: description });
    this.setNameTag({ name: 'twitter:title', content: title });
    this.setNameTag({ name: 'twitter:card', content: 'summary' });
    this.setNameTag({ name: 'twitter:image', content: img });
    this.setNameTag({ name: 'twitter:url', content: url });
  }

  /**
   * @description Set Property Tag
   * @param prop: TypingProperty
   * @return void
   */
  private setPropertyTag(prop: TypingProperty): void {
    const property = {
      property: prop.property,
      content: prop.content,
    };
    if (this.metaService.getTag(`property="${property.property}"`)) {
      this.metaService.updateTag(property);
    } else {
      this.metaService.addTag(property);
    }
  }

  /**
   * @description Set Name Tag
   * @param name: TypingName
   * @return void
   */
  private setNameTag(name: TypingName): void {
    const property = {
      name: name.name,
      content: name.content,
    };

    if (this.metaService.getTag(`name="${property.name}"`)) {
      this.metaService.updateTag(property);
    } else {
      this.metaService.addTag(property);
    }
  }
}
