# 庭箱

[箱庭](https://hako.v-kurore.com)のclientサイドプロジェクト。

clientサイトなのでOSSでもいいと公開。

※apiサーバーコードは非公開。

Youtuberのコミュニティーを目的としたサイト。

## development

```bash
npm install
npm start
```

## release

```bash
npm install
npm run build -- --aot=true --prod=true --sourceMap=false --outputPath=/usr/share/nginx/html
```

## 使用画像

- https://www.flaticon.com/free-icon/chicken_3272990?related_id=3272990
- https://sozai-good.com/illust/free-background/cute/29847
- https://www.irasutoya.com/2013/09/blog-post_9127.html

```html
<div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
```html

## License

MIT

