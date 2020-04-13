import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UsersService } from "app/services/users.service";
import { UploadService } from "app/services/upload.service";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { IPost } from "app/utils/interfaces";
import { IUser } from "../../utils/interfaces";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-update-profile",
  templateUrl: "./update-profile.component.html",
  styleUrls: ["./update-profile.component.css"],
})
export class UpdateProfileComponent implements OnInit {
  @Output() main = new EventEmitter<string>();
  minDate = { year: 1900, month: 1, day: 1 };
  maxDate = { year: new Date().getFullYear(), month: 1, day: 1 };
  startDate = { year: 1988, month: 1, day: 1 };
  loading = false;

  @ViewChild("myPond") myPond: any;
  pondOptions = {
    class: "my-filepond",
    multiple: false,
    labelIdle: "Drop files here or click to browse",
    acceptedFileTypes: "image/jpeg, image/png",
  };

  pondFiles = [];

  form = new FormGroup({
    firstname: new FormControl("", [Validators.required]),
    lastname: new FormControl("", [Validators.required]),
    bio: new FormControl("", [Validators.maxLength(100)]),
    dob: new FormControl(""),
  });

  currentUserSubject;

  constructor(
    private userService: UsersService,
    private toastService: ToastrService,
    private uploadService: UploadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  ngOnDestroy() {
    this.currentUserSubject && this.currentUserSubject.unsubscribe();
  }

  goToFeed() {
    this.router.navigate(["/users"]);
  }

  formatDate(date) {
    if (!date) return "";
    return `${date.month}/${date.day}/${date.year}`;
  }

  pondHandleAddFile(event: any) {
    console.log("A file was added", event);
    this.pondFiles.splice(0, 1, event.file.file);
  }

  pondHandleInit() {
    console.log("FilePond has initialized", this.myPond);
  }

  onSubmit() {
    this.loading = true;
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
              data["profile_pic"] = res.thumb.url;
            } else {
              data["profile_pic"] = res.image.url;
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
    this.userService
      .updateUser(data)
      .finally(() => (this.loading = false))
      .subscribe(
        (data: IUser) => {
          this.toastService.success(
            "User Profile",
            "Profile update successful..."
          );
          this.form.reset();
          this.userService.getUser();
          this.goToFeed();
        },
        (err) => console.log(err)
      );
  }

  processPhoto(file: File) {
    const url = "https://api.imgbb.com/1/upload";
    return this.uploadService.uploadFile(url, file);
  }

  getUserInfo() {
    this.userService.getUser();
    this.currentUserSubject = this.userService.currentUserSubject.subscribe(
      (data: IUser) => {
        if (!data) return;
        this.form.patchValue({
          firstname: data.firstname,
          lastname: data.lastname,
          bio: data.bio,
          dob: data.dob,
        });
      }
    );
  }
}
