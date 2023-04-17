import { getLocaleMonthNames } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/service/categories.service';
import { PostsService } from 'src/app/service/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permaLink: string = ' ';
  imgSrc: any = './assets/placeholder.jpg';
  selectedImage: any;
  categories!: Array<any>;
  postForm!: FormGroup;
  post: any;
  formStatus: string = 'Add New';
  postId!: string;

  constructor(
    private categorieService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute
  ) {
    ///Formulaire de MAJ
    this.route.queryParams.subscribe((res: any) => {
      this.postId = res.id;
      if (this.postId) {
        this.postService.loadOneData(res.id).subscribe((post: any) => {
          this.post = post;
          this.postForm = this.fb.group({
            title: [
              this.post.title,
              [Validators.required, Validators.minLength(8)],
            ],
            permaLink: [this.post.permaLink, Validators.required],
            excerpt: [
              this.post.excerpt,
              [Validators.required, Validators.minLength(40)],
            ],
            categorie: [
              `${this.post.categorie.categorieId}-${this.post.categorie.categorie}`,
              Validators.required,
            ],
            postImg: [this.post.postImg, Validators.required],
            content: [this.post.content, Validators.required],
          });
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit';
        });
      }
      /// Ceci pour l'ajout
      else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(8)]],
          permaLink: ['', Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(40)]],
          categorie: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required],
        });
      }
    });
  }
  ngOnInit(): void {
    this.categorieService.loadData().subscribe((res) => {
      this.categories = res;
    });
  }
  get fc() {
    return this.postForm.controls;
  }
  onTitleChanged($event: any) {
    //remplace les espace par '-'
    const title = $event.target.value;
    this.permaLink = title.replace(
      /* Remplace tous  les espaces par rgx  /\s/g */ /\s/g,
      '-'
    );
  }
  //// Pour afficher l'image lorsque tu l'importer au coté de l'input
  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imgSrc = e.target.result;
    };
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImage = $event.target.files[0];
  }
  /// Creation d'un boutton d'ajout selon l'interface post
  onSubmit() {
    // on l'utiliser pour prendre le categorie et le categorie id
    let splitedCatgorie = this.postForm.value.categorie.split('-');

    const postData: Post = {
      title: this.postForm.value.title,
      permaLink: this.postForm.value.permaLink,
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      cratedAt: new Date(),
      postImgPath: '',
      categorie: {
        categorieId: splitedCatgorie[0],
        categorie: splitedCatgorie[1],
      },
    };
    console.log(postData);
    this.postService.uploadImage(
      this.selectedImage,
      this.post,
      this.formStatus,
      this.postId
    );

    this.postForm.reset();
    this.imgSrc = './assets/placeholder.jpg';
  }
}
