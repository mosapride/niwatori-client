import { Injectable } from '@angular/core';

type TMapInstanceOption = {
  hasExitConditions?: boolean;
  forFinalEvent?: boolean;
};

type TMapInstance = {
  intervalId: number;
  task: () => void | boolean;
  checkIntervalMS: number;
  option: TMapInstanceOption;
};

const FIRST_FLG = -1;
/**
 * 定期実行サービス.
 */
@Injectable({
  providedIn: 'root',
})
export class IntervalTaskRunnerService {
  taskManager: Map<string, TMapInstance> = new Map();
  pauseFlg = false;
  constructor() {}

  create(tag: string, intervalTask: () => void | boolean, checkIntervalMS: number, option?: TMapInstanceOption): void {
    if (!option) {
      option = { hasExitConditions: false, forFinalEvent: false };
    }

    if (option.hasExitConditions === undefined) {
      option.hasExitConditions = false;
    }

    if (option.forFinalEvent === undefined) {
      option.forFinalEvent = false;
    }
    this.taskManager.set(tag, { intervalId: FIRST_FLG, task: intervalTask, checkIntervalMS, option });
  }

  run(tag: string): void {
    const task = this.taskManager.get(tag);
    if (!task) {
      return;
    }
    if (task.option.hasExitConditions === false && task.option.forFinalEvent === false) {
      if (task.intervalId === FIRST_FLG) {
        const intervalId = window.setInterval(() => {
          task.task();
        }, task.checkIntervalMS);
        task.intervalId = intervalId;
      }
      return;
    }
    if (task.option.hasExitConditions === false && task.option.forFinalEvent === true) {
      if (task.intervalId !== FIRST_FLG) {
        clearInterval(task.intervalId);
      }
      const intervalId = window.setInterval(() => {
        task.task();
        clearInterval(task.intervalId);
        task.intervalId = FIRST_FLG;
      }, task.checkIntervalMS);
      task.intervalId = intervalId;
      return;
    }
    if (task.option.hasExitConditions === true && task.option.forFinalEvent === false) {
      if (task.intervalId === FIRST_FLG) {
        const intervalId = window.setInterval(() => {
          const rtnFlg = task.task();
          if (rtnFlg === true) {
            this.destroy(tag);
          }
        }, task.checkIntervalMS);
        task.intervalId = intervalId;
      }
      return;
    }
    if (task.option.hasExitConditions === true && task.option.forFinalEvent === true) {
      if (task.intervalId !== FIRST_FLG) {
        clearInterval(task.intervalId);
      }
      const intervalId = window.setInterval(() => {
        const rtnFlg = task.task();
        if (rtnFlg === true) {
          this.destroy(tag);
        }
      }, task.checkIntervalMS);
      task.intervalId = intervalId;
      return;
    }

    return;
  }

  /**
   * 定期実行タスクの破棄を行う。
   */
  destroy(tag: string): void {
    const obj = this.taskManager.get(tag);
    if (!obj) {
      return;
    }
    window.clearInterval(obj.intervalId);
    this.taskManager.delete(tag);
  }
}
