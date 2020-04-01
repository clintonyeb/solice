import { Component, OnInit } from "@angular/core";
import { AdminsService } from "../../services/admins.service";
import { IPost } from "app/utils/interfaces";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"]
})
export class PostsComponent implements OnInit {
  posts: Array<IPost>;
  post: IPost;
  constructor(private adminService: AdminsService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.adminService
      .getPosts()
      .subscribe((d: Array<IPost>) => (this.posts = d));
  }

  showPost(post: IPost) {
    this.post = post;
  }

  enablePost(post: IPost) {
    this.adminService.enablePost(post._id).subscribe((d: IPost) => {
      var foundIndex = this.posts.findIndex(p => p._id === d._id);
      this.posts.splice(foundIndex, 1, d);
      this.post = d;
    });
  }

  disablePost(post: IPost) {
    this.adminService.disablePost(post._id).subscribe((d: IPost) => {
      var foundIndex = this.posts.findIndex(p => p._id === d._id);
      this.posts.splice(foundIndex, 1, d);
      this.post = d;
    });
  }

  deletePost(post: IPost) {
    this.adminService.deletePost(post._id).subscribe((d: IPost) => {
      var foundIndex = this.posts.findIndex(p => p._id === d._id);
      this.posts.splice(foundIndex, 1);
      this.post = null;
    });
  }
}
