import { Component, inject, OnInit } from '@angular/core';
import {
  Platform,
  IonHeader,
  IonToolbar,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle } from 'ionicons/icons';
import { MessageService, Message } from '../services/message.service';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    AsyncPipe,
    DatePipe,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonTitle
],
})
export class ViewMessagePage implements OnInit {
  public selectedMessage!: Message;
  private platform = inject(Platform);

  private messageService = inject(MessageService);

  selectedMessage$ = this.messageService.selectedMessage$;

  constructor() {
    addIcons({ personCircle });
  }

  ngOnInit() {}

  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? 'Inbox' : '';
  }
}
