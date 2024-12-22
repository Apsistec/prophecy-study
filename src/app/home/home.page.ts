import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonSpinner,
} from '@ionic/angular/standalone';
import { MessageComponent } from '../message/message.component';

import { MessageService, Message } from '../services/message.service';
import { ViewMessagePage } from '../view-message/view-message.page';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    MessageComponent,
    IonGrid,
    IonRow,
    IonCol,
    ViewMessagePage,
    AsyncPipe,
    IonItem,
    IonSpinner
  ],
})
export class HomePage {
  messages$!: Observable<Message[]>;

  private messageService = inject(MessageService);

  constructor() {
    this.messages$ = this.messageService.getMessages();
  }

  selectMessage(message: Message) {
    this.messageService.setSelectedMessage(message);
  }
}
