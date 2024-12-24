import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { MessageService, Message } from '../services/message.service';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    AsyncPipe,
    DatePipe,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
  ],
})
export class ViewMessagePage {
  private messageService = inject(MessageService);
  selectedMessage$ = this.messageService.selectedMessage$;

  toggleFavorite(message: Message) {
    if (!message.id) {
      console.error('Message ID is required for toggling favorite status');
      return;
    }
    this.messageService.toggleFavorite(message.id, !message.isFavorite);
  }
}