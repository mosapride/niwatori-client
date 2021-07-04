/**
 * # クライアント(ブラウザ)専用 定期実行タスクRunner
 *
 * 発火条件がゆるいeventを条件に発火する実行タスクの負荷軽減。
 *
 * ## example
 *
 * scrollイベントなど頻繁に起こるEventに対して処理を行いたい場合、そのまま記載すると負荷が大きい。
 * スクロールを発火ポイントと捉え、scrollイベントの最終タイミングから特定時間後にイベントを発火させるなどを行い、負荷を軽減させる。
 *
 * ```ts
 * intervalTaskRunner: IntervalTaskRunner;
 *
 * @HostListener('window:scroll', ['$event'])
 * onScroll(event: Event): void {
 *   this.intervalTaskRunner.run();
 * }
 *
 * constructor() {
 *   this.intervalTaskRunner = new IntervalTaskRunner(this.task, 500, true);
 * }
 *
 * task(): boolean {
 *   return true;
 * }
 *
 * ngOnDestroy(): void {
 *   this.intervalTaskRunner.destroy();
 * }
 * ```
 *
 * ## 条件による終了
 *
 * `intervalTask():boolean`型を指定した場合に、任意に終了を行うことができる。
 *
 * | intervalTask()の戻り値 | runOnlyOnceFlg | 挙動 |
 * | -----------------------|----------------|------|
 * | true                   | true           | 終了 |
 * | true                   | false          | 継続 |
 * | false                  | true           | 継続 |
 * | false                  | false          | 継続 |
 *
 *
 * ## 終了処理
 *
 * SPAなどで、JSの処理が終了しない場合は明示的にdestroyを呼ぶことにより処理を終わらせる必要がある。
 *
 * ## 備考:Remarks
 *
 * エラー対策 : Cannot find namespace 'NodeJS' also with types node
 *
 * @link https://github.com/TypeStrong/atom-typescript/issues/1053#issuecomment-321126192
 *
 * ```ts
 * setInterval() の戻り値 -> NodeJS.Timeout
 * window.setInterval() の戻り値 -> number
 * ```
 *
 * `window`を明示しないと、NodeJS.Timeoutとして認識されてしまう。そのためnode.js上での実行では動作しない。
 */
export class IntervalTaskRunner {
  intervalId: number | undefined;
  pauseFlg = false;
  /**
   * @param intervalTask 実行するタスク
   * @param checkIntervalMS 遅延間隔
   * @param runOnlyOnceFlg intervalTask実行後にプロセスを終了するかどうか。default : false
   */

  constructor(intervalTask: () => void, checkIntervalMS: number);
  constructor(intervalTask: () => boolean, checkIntervalMS: number, runOnlyOnceFlg?: boolean);
  constructor(private intervalTask: () => void & boolean, private checkIntervalMS: number, private runOnlyOnceFlg?: boolean) {
    if (!runOnlyOnceFlg) {
      runOnlyOnceFlg = false;
    }
  }

  /**
   * タスクの実行を行う。
   * 定期実行しているタスクは多重起動しない。
   */
  run(): number | undefined {
    if (this.intervalId !== undefined) {
      return;
    }
    this.intervalId = window.setInterval(() => {
      if (this.pauseFlg) {
        return;
      }
      const rtnFlg = this.intervalTask();
      if (this.runOnlyOnceFlg && rtnFlg === true) {
        this.destroy();
      }
    }, this.checkIntervalMS);
    return this.intervalId;
  }

  /**
   * 定期実行タスクを一時停止させる。
   */
  pause(): void {
    this.pauseFlg = true;
  }

  /**
   * 定期実行タスクを再開させる。
   */
  resume(): void {
    this.pauseFlg = false;
  }

  /**
   * 定期実行タスクを一時停止/再開を切り替える。
   */
  toggle(): void {
    this.pauseFlg = !this.pauseFlg;
  }

  /**
   * 定期実行タスクの破棄を行う。
   */
  destroy(): void {
    if (this.intervalId !== undefined) {
      window.clearTimeout(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
