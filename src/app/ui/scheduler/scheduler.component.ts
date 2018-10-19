import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DayPilot, DayPilotSchedulerComponent } from 'daypilot-pro-angular';
import { DataService, CreateEventParams, MoveEventParams } from './data.service'; { }

@Component({
    selector: 'scheduler-component',
    template: `<daypilot-scheduler [config]="config" [events]="events" (viewChange)="viewChange($event)" #scheduler></daypilot-scheduler>`,
    styles: [``]
})
export class SchedulerComponent {

    @ViewChild('scheduler')
    scheduler: DayPilotSchedulerComponent;

    events: any[] = [];
    config: any = {
        timeHeaders: [{ "groupBy": "Month" }, { "groupBy": "Day", "format": "d" }],
        scale: "Day",
        treeEnabled: true,
        //days: DayPilot.Date.today().daysInYear(),
        days: 60,
        startDate: DayPilot.Date.today().firstDayOfMonth(),
        //scrollTo: DayPilot.Date.today().firstDayOfMonth(),
        theme: "scheduler_8",
        durationBarVisible: true,
        onTimeRangeSelected: args => {
            let name = prompt("New reservation:", "Guest Name");
            this.scheduler.control.clearSelection();
            if (!name) {
                return;
            }
            let params: CreateEventParams = {
                start: args.start.toString(),
                end: args.end.toString(),
                text: name,
                resource: args.resource
            };
            this.ds.createEvent(params).subscribe(result => {
                this.events.push();
                this.scheduler.control.message("Event created");
            });
        },
        onEventResized: args => {
            console.log("at event resized: ", args);
            
        },
        onEventMove: args => {
            let params: MoveEventParams = {
                id: args.e.id(),
                start: args.newStart.toString(),
                end: args.newEnd.toString(),
                resource: args.newResource
            };
            this.ds.moveEvent(params).subscribe(result => {
                this.scheduler.control.message("Event moved");
            });
        }
    };

    get durationBarNotSupported(): boolean {
        return this.themes.find(item => item.value === this.config.theme).noDurationBarSupport;
    }

    themes: any[] = [
        { name: "Default", value: "scheduler_default" },
        { name: "Green", value: "scheduler_green" },
        { name: "Traditional", value: "scheduler_traditional" },
        { name: "Transparent", value: "scheduler_transparent" },
        { name: "White", value: "scheduler_white" },
        { name: "Theme 8", value: "scheduler_8", noDurationBarSupport: true }
    ];

    constructor(private ds: DataService) {
    }

    ngAfterViewInit(): void {
        this.ds.getResources().subscribe(result => this.config.resources = result);

        const from = this.scheduler.control.visibleStart();
        const to = this.scheduler.control.visibleEnd();
        this.ds.getEvents(from, to).subscribe(result => {
            this.events = result;
            console.log("after getting events: ", result);

        });
    }

    viewChange(args) {
        console.log("in view change: ", args, this.scheduler.control.visibleStart(), this.scheduler.control.visibleEnd());

        // quit if the date range hasn't changed
        if (!args.visibleRangeChanged) {
            return;
        }

        let from = this.scheduler.control.visibleStart();
        let to = this.scheduler.control.visibleEnd();
    }



}