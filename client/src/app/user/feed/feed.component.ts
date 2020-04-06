import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../../services/users.service";
import { IPost, IUser } from "../../utils/interfaces";
import { UploadService } from "../../services/upload.service";
import { HttpResponse, HttpEventType } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Input } from "@angular/core";
import { SessionService } from "../../services/session.service";

@Component({
  selector: "app-feed",
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.css"],
})
export class FeedComponent implements OnInit {
  @ViewChild("myPond") myPond: any;
  @ViewChild("feed") feed: any;
  @ViewChild("feed") posts: any;
  @Output() profile = new EventEmitter<string>();
  user: IUser;
  @ViewChild("navbar") nav: any;
  focus;

  // post form
  form = new FormGroup({
    text: new FormControl("", [Validators.required]),
    notify: new FormControl(true),
  });

  pondOptions = {
    class: "my-filepond",
    multiple: false,
    labelIdle: "Drop files here or click to browse",
    acceptedFileTypes: "image/jpeg, image/png",
  };

  pondFiles = [];
  active;

  constructor(
    private modalService: NgbModal,
    private userService: UsersService,
    private toastService: ToastrService,
    private uploadService: UploadService,
    public router: Router,
    private sessionService: SessionService
  ) {}

  routes = [
    { id: 1, path: "/users/main/feeds/timeline", title: "Timeline", value: "" },
    { id: 2, path: "/users/main/feeds/posts", title: "Posts", value: "" },
    {
      id: 3,
      path: "/users/main/feeds/following",
      title: "Following",
      value: "",
    },
    {
      id: 4,
      path: "/users/main/feeds/followers",
      title: "Followers",
      value: "",
    },
    { id: 5, path: "/users/main/feeds/people", title: "People", value: "" },
  ];

  ngOnInit(): void {
    this.sessionService.currentUserSubject.subscribe(
      (user: IUser) => (this.user = user)
    );
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  pondHandleInit() {
    console.log("FilePond has initialized", this.myPond);
  }

  pondHandleAddFile(event: any) {
    console.log("A file was added", event);
    this.pondFiles.splice(0, 1, event.file.file);
  }

  onPostSubmit() {
    if (this.pondFiles.length) {
      this.processPhoto(this.pondFiles[0]).subscribe(
        (event) => {
          if (event.type == HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * event.loaded) / event.total);
            console.log(`File is ${percentDone}% loaded.`);
          } else if (event instanceof HttpResponse) {
            console.log("File is completely loaded!");
            const res = event.body.data;
            const data = this.form.value;
            if (res.thumb) {
              data["photo"] = res.thumb.url;
            } else {
              data["photo"] = res.image.url;
            }

            this.submit(data);
          }
        },
        () => {}
      );
    } else {
      this.submit(this.form.value);
    }
  }

  submit(data) {
    this.userService.createPost(data).subscribe(
      (data: IPost) => {
        this.modalService.dismissAll();
        this.toastService.success("Post", "Post created successfully...");
        this.form.reset();
        this.pondFiles = [];

        this.userService.newPostObserver.next(data);
      },
      (err) => console.log(err)
    );
  }

  processPhoto(file: File) {
    const url = "https://api.imgbb.com/1/upload";
    return this.uploadService.uploadFile(url, file);
  }

  goToAdmin() {
    this.router.navigate(["/admins"]);
  }
}
