import { Component, OnInit } from "@angular/core";
import { IFilter } from "../../utils/interfaces";
import { AdminsService } from "../../services/admins.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.css"]
})
export class FiltersComponent implements OnInit {
  filters: Array<IFilter>;
  focus: any;
  form = new FormGroup({
    text: new FormControl("", [Validators.required])
  });

  constructor(private adminService: AdminsService) {}

  ngOnInit(): void {
    this.getFilters();
  }

  getFilters() {
    this.adminService
      .getFilters()
      .subscribe((d: Array<IFilter>) => (this.filters = d));
  }

  onSubmit() {
    this.adminService.addFilters(this.form.value).subscribe(
      (data: Array<IFilter>) => {
        this.filters = data;
        this.form.reset();
      },
      err => console.log(err)
    );
  }

  deleteFilter(filter: IFilter) {
    this.adminService
      .deleteFilters(filter._id)
      .subscribe((data: Array<IFilter>) => {
        this.filters = data;
      });
  }
}
