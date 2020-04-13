import { Component, OnInit } from "@angular/core";
import { IAd } from "../../utils/interfaces";
import { AdminsService } from "../../services/admins.service";

@Component({
  selector: "app-ads",
  templateUrl: "./ads.component.html",
  styleUrls: ["./ads.component.css"]
})
export class AdsComponent implements OnInit {
  ads: Array<IAd>;
  ad: IAd;
  constructor(private adminService: AdminsService) {}

  ngOnInit(): void {
    this.getIAds();
  }

  getIAds() {
    this.adminService.getAds().subscribe((d: Array<IAd>) => (this.ads = d));
  }

  showAd(ad: IAd) {
    this.ad = ad;
  }

  deleteAd(ad: IAd, index) {
    this.adminService.deleteAd(ad._id).subscribe((d: IAd) => {
      this.ads.splice(index, 1);
      this.ad = null;
    });
  }
}
