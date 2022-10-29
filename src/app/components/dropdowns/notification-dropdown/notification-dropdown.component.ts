import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import Popper from "popper.js";

@Component({
  selector: "app-notification-dropdown",
  templateUrl: "./notification-dropdown.component.html",
})
export class NotificationDropdownComponent implements OnInit {
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  popper = document.createElement("div");
  ngOnInit() {
    this.popper.innerHTML = `<div class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1" style="min-width:12rem" #popoverDropdownRef>
</div>`;
  }

}
