import { DatePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonHeader,
  IonButton,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonContent,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { Message, MessageService } from '../services/message.service';

@Component({
  selector: 'app-prophecy-modal',
  templateUrl: './prophecy-modal.component.html',
  styleUrls: ['./prophecy-modal.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonCardContent,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonContent,
    DatePipe,
    IonIcon
  ],
})
export class ProphecyModalComponent{
  constructor(private modalCtrl: ModalController) {}
  @Input() message!: Message;

private messageService = inject(MessageService)

toggleFavorite(event: Event, message: Message) {
  if (!message.id) {
    console.error('Message ID is required for toggling favorite status');
    return;
  }
  message.isFavorite = !message.isFavorite;
  const newStatus = !message.isFavorite;
  this.messageService.toggleFavorite(message.id, newStatus);
}


  cancel() {
    this.modalCtrl.dismiss(this.message, 'cancel');
  }
}
