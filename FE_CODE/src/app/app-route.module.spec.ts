import {TestBed} from '@angular/core/testing';
import {AppRoutingModule} from '@tungle/app-routing.module';
import {RouterTestingModule} from '@angular/router/testing';

describe('AppRoutingModule', () => {
  let module: AppRoutingModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, RouterTestingModule]
    });
    module = TestBed.inject(AppRoutingModule);
  });

  it('should have App Routing Module', () => {
    expect(module).toBeTruthy();
  });
});
