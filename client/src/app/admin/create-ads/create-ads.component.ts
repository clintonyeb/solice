import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { UploadService } from "app/services/upload.service";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { AdminsService } from "../../services/admins.service";
import { IAd, ITarget } from "../../utils/interfaces";

const urlReg = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?";

@Component({
  selector: "app-create-ads",
  templateUrl: "./create-ads.component.html",
  styleUrls: ["./create-ads.component.css"]
})
export class CreateAdsComponent implements OnInit {
  focus;
  @ViewChild("myPond") myPond: any;
  // post form
  targetForm = new FormGroup({
    field: new FormControl("age", [Validators.required]),
    operator: new FormControl("==", [Validators.required]),
    value: new FormControl("", [Validators.required])
  });

  form = new FormGroup({
    text: new FormControl("", [Validators.required]),
    url: new FormControl("", [Validators.required, Validators.pattern(urlReg)]),
    targets: this.targetForm
  });

  pondOptions = {
    class: "my-filepond",
    multiple: false,
    labelIdle: "Ad Image",
    acceptedFileTypes: "image/jpeg, image/png"
  };

  pondFiles = [];

  // filters
  targets: Array<ITarget> = [];

  constructor(
    private toastService: ToastrService,
    private uploadService: UploadService,
    private adminService: AdminsService
  ) {}

  ngOnInit(): void {}

  pondHandleInit() {
    console.log("FilePond has initialized", this.myPond);
  }

  pondHandleAddFile(event: any) {
    console.log("A file was added", event);
    this.pondFiles.splice(0, 1, event.file.file);
  }

  onSubmit() {
    if (!this.targets.length) {
      this.toastService.info("At least specify one target audience");
      return;
    }
    
    if (this.pondFiles.length) {
      this.processPhoto(this.pondFiles[0]).subscribe(
        event => {
          if (event.type == HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * event.loaded) / event.total);
            console.log(`File is ${percentDone}% loaded.`);
          } else if (event instanceof HttpResponse) {
            console.log("File is completely loaded!");
            const res = event.body.data;
            const data = this.form.value;
            if (res.thumb) {
              data["image"] = res.thumb.url;
            } else {
              data["image"] = res.image.url;
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
    this.adminService.createAd(data).subscribe(
      (data: IAd) => {
        this.toastService.success("Ad", "Ad created successfully...");
        this.form.reset();
        this.pondFiles = [];
        this.targets = [];
      },
      err => console.log(err)
    );
  }

  processPhoto(file: File) {
    const url = "https://api.imgbb.com/1/upload";
    return this.uploadService.uploadFile(url, file);
  }

  deleteTarget(t, index) {
    this.targets.splice(index, 1);
  }

  onTargetSubmit() {
    console.log("here");
    this.targets.push(this.targetForm.value);
  }
}
