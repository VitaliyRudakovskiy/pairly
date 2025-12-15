import { booleanAttribute, Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  label = input<string>('');
  variant = input<ButtonVariant>('primary');
  type = input<ButtonType>('button');
  size = input<ButtonSize>('md');
  loading = input(false);
  fullWidth = input(false, { transform: booleanAttribute });
  iconBefore = input<string | null>(null);
  iconAfter = input<string | null>(null);
  disabled = input(false);

  click = output<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.click.emit(event);
    }
  }
}
