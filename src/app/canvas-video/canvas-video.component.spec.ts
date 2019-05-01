import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasVideoComponent } from './canvas-video.component';

describe('CanvasVideoComponent', () => {
  let component: CanvasVideoComponent;
  let fixture: ComponentFixture<CanvasVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
