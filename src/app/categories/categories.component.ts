import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CategoriesService } from '../service/categories.service';
import { Categorie } from '../models/categorie';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  catArray!: Array<any>;
  formCategorie!: string;
  categorieId!: string;
  // Pour changer a status edit ou Ajout selon le click de boutton à l'aide de {{ formStatus }} coté HTML
  formStatus: string = 'Add';
  constructor(
    private fireStore: AngularFirestore,
    private categorieService: CategoriesService
  ) {}
  ngOnInit(): void {
    //load Absevable methode
    this.categorieService.loadData().subscribe((val) => {
      this.catArray = val;
    });
  }
  onSubmit(formData: any) {
    let categorieData: Categorie = {
      categorie: formData.value.categorie,
    };
    // pour filtrer si le le boutton d'ajout ou bien de MAJ
    if (this.formStatus == 'Add') {
      this.categorieService.saveData(categorieData);
    } else if (this.formStatus == 'Edit') {
      this.categorieService.updateData(this.categorieId, categorieData);
      formData.reset();
      this.formStatus = 'Add';
    }
  }
  /// pour afficher le la categorie a MAJ  dans le input d'ajout une categorie garce à  [(ngModel)]="formCategorie"
  onEdit(categorie: any, id: any) {
    this.formCategorie = categorie;
    this.formStatus = 'Edit';
    this.categorieId = id;
  }
  onDelete(id: any) {
    this.categorieService.deleteData(id);
  }
}

/*  let subcategorieData = {
      subcatagorie: 'subcategorie1',
    };
    this.fireStore
      .collection('categories')
      .add(categorieData)
      .then((docRef) => {
        console.log(docRef);
        this.fireStore
          .doc(`categories/${docRef.id}`)
          .collection('subcategories')
          .add(subcategorieData);
        this.fireStore
          .collection('categories')
          .doc(docRef.id)
          .collection('subcategories')
          .add(subcategorieData)
          .then((docRef1) => {
            console.log(docRef1);
              this.fireStore
              .doc(`/categories/${docRef.id}/subcategories/${docRef1.id}`)
              .collection('subsubcategories')
              .add(subcategorieData);
            this.fireStore
              .collection('categories')
              .doc(docRef.id)
              .collection('subcategories')
              .doc(docRef1.id)
              .collection('subsubcategories')
              .add(subcategorieData)
              .then((docRef2) => {
                console.log('categorie added succufully');
              });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } */
