import { Component, Input } from '@angular/core';

@Component({
  selector: 'j-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() type = 'button';
  @Input() className = 'btn-primary';
  @Input() icon: string = '';
  @Input() iconSize = 18;
  @Input() isWorking: boolean = false;
  @Input() isActive: boolean | null = null;
  @Input() disabled: boolean = false;

  constructor() {}

}
