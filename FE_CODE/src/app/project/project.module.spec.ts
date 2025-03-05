import {TestBed} from '@angular/core/testing';
import {ProjectModule} from '@tungle/project/project.module';

describe('ProjectModule', () => {
  let module: ProjectModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectModule]
    });
    module = TestBed.inject(ProjectModule);
  });

  it('should have Project Module', () => {
    expect(module).toBeTruthy();
  });
});
