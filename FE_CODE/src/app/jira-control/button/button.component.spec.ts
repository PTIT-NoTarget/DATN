import { ButtonComponent } from '@tungle/jira-control/button/button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;

  beforeEach(() => {
    component = new ButtonComponent();
  });

  it('should be able to create', () => {
    expect(component).toBeTruthy();
  });
});
