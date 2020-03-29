import { UserComponent } from "./user.component";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LandingComponent } from "../user/landing/landing.component";
import { ProfileComponent } from "../user/profile/profile.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { FeedComponent } from "./feed/feed.component";
import { ActivityComponent } from "./activity/activity.component";
import { BioComponent } from "./bio/bio.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { StoryComponent } from "./story/story.component";

// import filepond module
import { FilePondModule, registerPlugin } from 'ngx-filepond';
// import and register filepond file type validation plugin
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import { BrowserModule } from '@angular/platform-browser';
registerPlugin(FilePondPluginFileValidateType);
// registerPlugin(FilePondPluginImagePreview);

import { TimeagoModule } from "ngx-timeago";

@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    RouterModule,
    CommonModule,
    SharedModule,
    BrowserModule,
    FilePondModule,
    TimeagoModule.forRoot()
  ],
  declarations: [
    LandingComponent,
    ProfileComponent,
    UserComponent,
    FeedComponent,
    ActivityComponent,
    BioComponent,
    DashboardComponent,
    StoryComponent
  ]
})
export class UserModule {}
