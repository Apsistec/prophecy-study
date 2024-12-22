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
  IonNote,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';
import { MessageService, Message } from '../services/message.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItem, IonLabel],
})
export class MessageComponent {
  private platform = inject(Platform);
  @Input() message?: Message;
  isIos() {
    return this.platform.is('ios');
  }
  constructor(private messageService: MessageService) {
    addIcons({ chevronForward });
  }

  selectMessage(message: Message) {
    this.messageService.setSelectedMessage(message);
  }
}
