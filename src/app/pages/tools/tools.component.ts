import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IntervalTaskRunnerService } from 'src/app/service/interval-task-runner.service';

// https://josex2r.github.io/jQuery-SlotMachine/
@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class ToolsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('target') target: ElementRef | undefined;
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    console.log(`event`);
    this.intervalTaskRunnerService.run('tag1');
  }
  constructor(private intervalTaskRunnerService: IntervalTaskRunnerService) {
    intervalTaskRunnerService.create(
      'tag1',
      () => {
        return this.task();
      },
      500,
      { hasExitConditions: false, forFinalEvent: true }
    );
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    console.log(`target`);
    console.log(this.target);
  }
  ngOnDestroy(): void {}

  task(): boolean {
    console.log(this.target?.nativeElement.getBoundingClientRect().top);
    if (this.target?.nativeElement.getBoundingClientRect().top <= 800) {
      return true;
    }
    return false;
  }

  debug(): void {
    this.task();
    console.log(this.target);
  }
}
