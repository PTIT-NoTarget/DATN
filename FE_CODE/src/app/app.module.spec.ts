import { AppModule } from '@tungle/app.module';
import { TestBed } from '@angular/core/testing';

describe('AppModule', () => {
  let module: AppModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
    module = TestBed.inject(AppModule);
  });

  it('should have app module', () => {
    expect(module).toBeTruthy();
  });
});
