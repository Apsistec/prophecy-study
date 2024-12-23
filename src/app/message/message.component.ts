import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  Platform,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForward, heart, heartOutline } from 'ionicons/icons';
import { MessageService, Message } from '../services/message.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItem, IonLabel, DatePipe, IonButton, IonIcon],
})
export class MessageComponent {
  selectedMessage!: Message;
  favoriteSelected = false;

  private platform = inject(Platform);
  @Input() message?: Message;
  isIos() {
    return this.platform.is('ios');
  }
  constructor(private messageService: MessageService) {
    addIcons({ chevronForward, heartOutline, heart });
  }

  selectMessage(message: Message) {
    this.messageService.setSelectedMessage(message);
  }

  selectFavorite(){
    this.favoriteSelected = !this.favoriteSelected;
  
  }
}
