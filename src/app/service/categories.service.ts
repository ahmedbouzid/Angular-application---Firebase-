import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(
    private fireStore: AngularFirestore,
    private toastr: ToastrService
  ) {}
  saveData(data: any) {
    this.fireStore
      .collection('categories')
      .add(data)
      .then((docRef) => {
        this.toastr.success('Category Added Succufullly');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //Afficher tous les elements de categorie
  loadData() {
    return this.fireStore
      .collection('categories')
      .snapshotChanges()
      .pipe(
        map((actons) => {
          return actons.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }
  updateData(id: any, EditData: any) {
    this.fireStore
      .doc(`categories/${id}`)
      .update(EditData)
      .then((docRef) => {
        this.toastr.success('Data Updated succifuly');
      });
  }
  deleteData(id: any) {
    this.fireStore
      .doc(`categories/${id}`)
      .delete()
      .then((docRef) => {
        this.toastr.success('Deleted Succufully ');
      });
  }
}
