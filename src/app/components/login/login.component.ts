import { ChatService } from '../../providers/chat.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {

  constructor( private _chatService: ChatService) { }

  ingresar( proveedor: string ) {
    this._chatService.login(proveedor);
    // console.log( proveedor );
  }

}
