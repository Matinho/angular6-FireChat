import { Mensaje } from '../interface/mensaje.interface';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(  private afs: AngularFirestore,
                public afAuth: AngularFireAuth ) {

    this.afAuth.authState.subscribe( user => {
      console.log('Estado del Usuario: ', user);

      if ( !user ) {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;

    } );

  }

  login( proveedor: string ) {

    if ( proveedor === 'google') {
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    } else {
      this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
    }
  }

  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  cargarMensajes() {
    // en this.afs.collection<Mensaje>('chats', ref) mandamos los querys
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc')
                                                                            .limit(5));
    return this.itemsCollection.valueChanges()
                  .pipe(
                      map( (mensajes: Mensaje[]) => { // map se ejecuta cuando alguien se subcribe
                        console.log(mensajes);

                        this.chats = [];

                        for (const mensaje of mensajes) {
                          this.chats.unshift( mensaje ); // unshift() inserta siempre en la primera posición
                        }
                        return this.chats;
                  }));
  }

  agregarMensaje( texto: string) {

    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };

    return this.itemsCollection.add( mensaje ); // con esto hago una inserto en Firebase (regrasa una promesa)
  }
}
