import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollElement } from './scroll-element.component';

describe('ScrollElement', () => {
  let component: ScrollElement;
  let fixture: ComponentFixture<ScrollElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollElement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
