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
  IonButton,
  IonButtons,
  Platform,
  IonIcon,
} from '@ionic/angular/standalone';
import { MessageComponent } from '../message/message.component';
import { MessageService, Message } from '../services/message.service';
import { ViewMessagePage } from '../view-message/view-message.page';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { caretDown, caretUp } from 'ionicons/icons';
import { addIcons } from 'ionicons';

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
    IonSpinner,
    IonButton,
    IonButtons,
    IonIcon,
  ],
})
export class HomePage {
  sortDescending = true;
  favoritesFilterSet: boolean = false;
  desktop!: boolean;
  private platform = inject(Platform);
  private messageService = inject(MessageService);
  messages!: Message[];
  sortedMessages$: Observable<Message[]> = this.messageService
    .getMessages()
    .pipe(
      map((items) => {
        return [...items].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return this.sortDescending ? dateB - dateA : dateA - dateB;
        });
      })
    );

  selectedMessage$ = this.messageService.selectedMessage$;

  constructor() {
    addIcons({ caretUp, caretDown });
  }

  ngOnInit() {
    if (this.platform.is('desktop')) {
      this.desktop = true;
    } else {
      this.desktop = false;
    }
  }

  toggleSort() {
    this.sortDescending = !this.sortDescending;
    // Force the Observable to re-emit with new sort order
    this.sortedMessages$ = this.messageService.getMessages().pipe(
      map((items) => {
        return [...items].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return this.sortDescending ? dateB - dateA : dateA - dateB;
        });
      })
    );
  }

  favorites$: Observable<Message[]> =
    this.messageService.getFavoriteMessages(true);

  toggleFavoritesFilter() {
    this.favoritesFilterSet = !this.favoritesFilterSet;
  }
}
