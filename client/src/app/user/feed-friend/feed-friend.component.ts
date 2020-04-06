import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { IUser } from "../../utils/interfaces";
import { UsersService } from "../../services/users.service";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { SessionService } from "../../services/session.service";

@Component({
  selector: "app-feed-friend",
  templateUrl: "./feed-friend.component.html",
  styleUrls: ["./feed-friend.component.css"],
})
export class FeedFriendComponent implements OnInit {
  people: Array<IUser>;
  query = new FormControl("");
  user: IUser;

  constructor(
    private userService: UsersService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.getPeople();
    this.sessionService.currentUserSubject.subscribe(
      (user: IUser) => (this.user = user)
    );
  }

  getFeedType() {
    const url = this.router.url;
    if (url === "/users/main/feeds/following") {
      return "following";
    } else if (url === "/users/main/feeds/followers") {
      return "followers";
    } else {
      return "all";
    }
  }

  getPeople() {
    let type = this.getFeedType();
    if (type === "all") {
      return this.userService.getUsers().subscribe(
        (data: Array<IUser>) => (this.people = data),
        (err) => console.error(err)
      );
    }
    return this.userService.getUsersFilter(type).subscribe(
      (data: Array<IUser>) => (this.people = data),
      (err) => console.error(err)
    );
  }

  followUser(personId, index) {
    this.userService
      .followUser(personId)
      .subscribe((data: IUser) => this.people.splice(index, 1, data));
  }

  unFollowUser(personId, index) {
    this.userService
      .unFollowUser(personId)
      .subscribe((data: IUser) => this.people.splice(index, 1, data));
  }

  visitProfile(personId) {
    this.router.navigate(["/users/main/profiles", personId]);
  }

  isFollowing(user): boolean {
    if (!user || !user.followers) return false;
    const id = this.user._id;
    return user.followers.indexOf(id) > -1;
  }

  searchPeople() {
    let type = this.getFeedType();
    this.userService.searchPeople(this.query.value, type).subscribe(
      (data: Array<IUser>) => (this.people = data),
      (err) => console.error(err)
    );
  }
}
