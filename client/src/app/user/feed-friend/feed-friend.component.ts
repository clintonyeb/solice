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
  loading = false;
  currentUserSubject;

  constructor(
    private userService: UsersService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.getPeople();
    this.currentUserSubject = this.sessionService.currentUserSubject.subscribe(
      (user: IUser) => (this.user = user)
    );
  }

  ngOnDestroy() {
    this.currentUserSubject.unsubscribe();
  }

  getFeedType() {
    const url = this.router.url;
    if (url === "/users/main/feeds/subscriptions") {
      return "subscriptions";
    } else if (url === "/users/main/feeds/subscribers") {
      return "subscribers";
    } else {
      return "all";
    }
  }

  getPeople() {
    this.loading = true;
    let type = this.getFeedType();
    if (type === "all") {
      return this.userService
        .getUsers()
        .finally(() => (this.loading = false))
        .subscribe(
          (data: Array<IUser>) => (this.people = data),
          (err) => console.error(err)
        );
    }
    return this.userService
      .getUsersFilter(type)
      .finally(() => (this.loading = false))
      .subscribe(
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
    if (!user || !user.subscribers) return false;
    const id = this.user._id;
    return user.subscribers.indexOf(id) > -1;
  }

  searchPeople() {
    let type = this.getFeedType();
    this.userService
      .searchPeople(this.query.value, type)
      .finally(() => (this.loading = false))
      .subscribe(
        (data: Array<IUser>) => (this.people = data),
        (err) => console.error(err)
      );
  }
}
