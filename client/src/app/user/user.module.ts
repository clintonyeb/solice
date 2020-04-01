import { UserComponent } from "./user.component";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

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
import { FilePondModule, registerPlugin } from "ngx-filepond";
// import and register filepond file type validation plugin
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
// import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import { BrowserModule } from "@angular/platform-browser";
registerPlugin(FilePondPluginFileValidateType);
// registerPlugin(FilePondPluginImagePreview);

import { TimeagoModule } from "ngx-timeago";
import { FeedFriendComponent } from "./feed-friend/feed-friend.component";
import { UpdateProfileComponent } from "./update-profile/update-profile.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { UsersService } from "../services/users.service";
import { PostComponent } from './post/post.component';

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
    InfiniteScrollModule,
    TimeagoModule.forRoot()
  ],
  declarations: [
    ProfileComponent,
    UserComponent,
    FeedComponent,
    ActivityComponent,
    BioComponent,
    DashboardComponent,
    StoryComponent,
    FeedFriendComponent,
    UpdateProfileComponent,
    PostComponent
  ],
  providers: [UsersService]
})
export class UserModule {}
