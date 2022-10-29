import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html'
})
export class EventosComponent implements OnInit {
  eventos = [];
  novo: boolean = false;
  evento = {
    imagem: null,
    titulo: null,
    data: null,
    artista: null,
    descricao: null,
    
  }
  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  color;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) { }

  //Upload de imagem
  onFileSelected($event) {
    var n = Date.now();
    const file = $event.target.files[0];
    const filePath = `imagens/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`imagens/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            //Salva a URL gerada para o arquivo
            if (url) {
              this.fb = url;
              this.evento.imagem = this.fb;
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  carregar() {
   
    //Listar produtos
    this.afs.firestore.collection('eventos').get()
      .then((r) => {
        let eventos = [];
        r.forEach((rr) => {
          let obj = rr.data();
          obj['id'] = rr.id;
          eventos.push(obj);
        });

        this.eventos = eventos;
        console.log(this.eventos);
      })
  }

  ngOnInit(): void {
    // this.afAuth.signInAnonymously();
    this.carregar()
  }

  excluir(id) {
    this.afs.firestore.collection('eventos').doc(id).delete()
      .then(() => {
        this.carregar()
      })
  }

  salvar() {
    if (
      this.evento.titulo && this.evento.imagem && this.evento.descricao && this.evento.artista
    ) {
      this.afs.firestore.collection('eventos').add(this.evento)
        .then(() => {
          this.carregar();
          this.novo = false;
          this.evento = {
            imagem: null,
            titulo: null,
            data: null,
            artista: null,
            descricao: null,
          }
        })
    }
    else {
      alert('Por favor, preencha todos os campos');
    }
  }
}
