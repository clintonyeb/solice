import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IUser } from "../../utils/interfaces";
import { UsersService } from "../../services/users.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-feed-friend",
  templateUrl: "./feed-friend.component.html",
  styleUrls: ["./feed-friend.component.css"]
})
export class FeedFriendComponent implements OnInit {
  @Input() type: string;
  @Output() profile = new EventEmitter<string>();
  people: Array<IUser>;
  query = new FormControl("");

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getPeople();
  }

  getPeople() {
    if (this.type === "all") {
      return this.userService.getUsers().subscribe(
        (data: Array<IUser>) => (this.people = data),
        err => console.error(err)
      );
    }
    return this.userService.getUsersFilter(this.type).subscribe(
      (data: Array<IUser>) => (this.people = data),
      err => console.error(err)
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
    this.profile.emit(personId);
  }

  isFollowing(user): boolean {
    if (!user || !user.followers) return false;
    const id = localStorage.getItem("userId");
    return user.followers.indexOf(id) > -1;
  }

  searchPeople() {
    this.userService.searchPeople(this.query.value, this.type).subscribe(
      (data: Array<IUser>) => (this.people = data),
      err => console.error(err)
    );
  }
}
