import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Platform,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle } from 'ionicons/icons';
import { MessageService, Message } from '../services/message.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonItem,
    IonIcon,
    IonLabel,
    AsyncPipe
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
