import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private storage: AngularFireStorage,
    private angularFireStore: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) {}

  uploadImage(selectedImage: any, postData: any, formStatus: any, id: string) {
    const filePath = `postImg/${Date.now()}`;
    console.log(filePath);
    this.storage.upload(filePath, selectedImage).then(() => {
      console.log('Image uplaoded');
      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((URL) => {
          postData.postImgPath = URL;
          if (formStatus == 'Edit') {
            this.updatePost(id, postData);
          } else {
            this.saveData(postData);
          }
        });
    });
  }
  saveData(postData: any) {
    this.angularFireStore
      .collection('posts')
      .add(postData)
      .then((res) => {
        this.toastr.success('Data Insert Succufulluy');
        this.router.navigate(['/posts']);
      });
  }
  //get All Data
  loadData() {
    return this.angularFireStore
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }
  //pour load une seule post à fin de nous aider à applique la MAJ === get by id
  loadOneData(id: any) {
    return this.angularFireStore.doc(`posts/${id}`).valueChanges();
  }

  updatePost(id: string, postData: any) {
    if (!id) {
      console.error('No ID provided for updatePost');
      return;
    }
    this.angularFireStore
      .doc(`posts/${id}`)
      .update(postData)
      .then(() => {
        this.toastr.success('Post update succufuly');
        this.router.navigate(['/posts']);
      });
  }
  deleteImage(postImgPath: any, id: any) {
    this.storage.storage
      .refFromURL(postImgPath)
      .delete()
      .then(() => {
        this.deleteData(id);
      });
  }
  deleteData(id: any) {
    this.angularFireStore
      .doc(`posts/${id}`)
      .delete()
      .then(() => {
        this.toastr.warning('Post Deleted');
      });
  }
  featured(id: any, featureData: any) {
    this.angularFireStore
      .doc(`posts/${id}`)
      .update(featureData)
      .then(() => {
        this.toastr.info('Featured status update');
      });
  }
}
