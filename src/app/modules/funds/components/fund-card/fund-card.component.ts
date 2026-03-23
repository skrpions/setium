import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Fund } from '../../../../core/domain/entities/fund.model';

@Component({
  selector: 'app-fund-card',
  imports: [CurrencyPipe, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './fund-card.component.html',
  styleUrl: './fund-card.component.scss',
})
export class FundCardComponent {
  readonly fund = input.required<Fund>();
  readonly isSubscribed = input<boolean>(false);
  readonly onSubscribe = output<Fund>();
  readonly onCancel = output<Fund>();
}
