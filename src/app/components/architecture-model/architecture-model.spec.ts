import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureModel } from './architecture-model';

describe('ArchitectureModel', () => {
  let component: ArchitectureModel;
  let fixture: ComponentFixture<ArchitectureModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchitectureModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchitectureModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
