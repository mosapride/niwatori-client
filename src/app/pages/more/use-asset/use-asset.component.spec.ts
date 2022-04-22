import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseAssetComponent } from './use-asset.component';

describe('UseAssetComponent', () => {
  let component: UseAssetComponent;
  let fixture: ComponentFixture<UseAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseAssetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
