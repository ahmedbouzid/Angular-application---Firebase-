import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/service/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css'],
})
export class AllPostComponent implements OnInit {
  postArray!: Array<any>;
  constructor(private postService: PostsService) {}
  ngOnInit(): void {
    this.postService.loadData().subscribe((res) => {
      console.log(res);
      let posts = res;
      this.postArray = posts;
    });
  }
  onDelete(postImgpath: any, id: any) {
    this.postService.deleteImage(postImgpath, id);
  }
  onFeatured(id: any, value: any) {
    const onFeatured = {
      isFeatured: value,
    };
    this.postService.featured(id, onFeatured);
  }
}
