// calendar.js

import StorageApi from './storageApi.js';

document.addEventListener('alpine:init', () => {
    Alpine.data('calendar', () => ({
        init() {
            const savedEvents = StorageApi.getData('calendarEvents');
            if (savedEvents) {
                this.events = savedEvents;
            }
            this.updateCalendarDates();
        },

        currentDate: new Date(),
        selectedMonth: new Date().getMonth(),
        selectedYear: new Date().getFullYear(),
        selectedDay: null,
        newEvent: '',
        events: {},
        dates: [],
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월",
            "7월", "8월", "9월", "10월", "11월", "12월"],

        // JSON 파일 내보내기
        exportToJson() {
            StorageApi.exportToJson('calendarEvents',
                `calendar-events-${this.selectedYear}-${this.selectedMonth + 1}.json`);
        },

        // JSON 파일 불러오기
        importFromJson(event) {
            const file = event.target.files[0];
            if (file) {
                StorageApi.importFromJson('calendarEvents', file)
                    .then(() => {
                        this.events = StorageApi.getData('calendarEvents');
                        this.updateCalendarDates();
                        alert('일정을 성공적으로 불러왔습니다.');
                    })
                    .catch(error => {
                        alert('올바르지 않은 JSON 파일입니다.');
                        console.error('Import error:', error);
                    });
            }
        },

        saveEventsToStorage() {
            StorageApi.setData('calendarEvents', this.events);
        },

        updateCalendarDates() {
            const dates = [];
            const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
            const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0);
            const lastMonthLastDay = new Date(this.selectedYear, this.selectedMonth, 0);

            for (let i = 0; i < firstDay.getDay(); i++) {
                const day = lastMonthLastDay.getDate() - (firstDay.getDay() - i - 1);
                dates.push({
                    id: `prev-${day}`,
                    day: day,
                    isCurrentMonth: false
                });
            }

            for (let i = 1; i <= lastDay.getDate(); i++) {
                dates.push({
                    id: `current-${i}`,
                    day: i,
                    isCurrentMonth: true
                });
            }

            const remainingDays = 7 - (dates.length % 7);
            if (remainingDays < 7) {
                for (let i = 1; i <= remainingDays; i++) {
                    dates.push({
                        id: `next-${i}`,
                        day: i,
                        isCurrentMonth: false
                    });
                }
            }

            this.dates = dates;
        },

        get currentEvents() {
            return this.events[this.getDateKey(this.selectedDay)] || [];
        },

        isToday(day) {
            return this.selectedYear === this.currentDate.getFullYear() &&
                this.selectedMonth === this.currentDate.getMonth() &&
                day === this.currentDate.getDate();
        },

        getDateKey(day) {
            return `${this.selectedYear}-${this.selectedMonth + 1}-${day}`;
        },

        hasEvents(day) {
            const events = this.events[this.getDateKey(day)] || [];
            return events.length > 0;
        },

        getDateEvents(day) {
            return this.events[this.getDateKey(day)] || [];
        },

        showEvents(day) {
            if (day) {
                this.selectedDay = day;
            }
        },

        addEvent() {
            if (this.newEvent.trim() && this.selectedDay) {
                const dateKey = this.getDateKey(this.selectedDay);
                if (!this.events[dateKey]) {
                    this.events[dateKey] = [];
                }
                this.events[dateKey].push(this.newEvent.trim());
                this.newEvent = '';
                this.saveEventsToStorage();
            }
        },

        deleteEvent(index) {
            const dateKey = this.getDateKey(this.selectedDay);
            if (this.events[dateKey]) {
                this.events[dateKey].splice(index, 1);
                this.saveEventsToStorage();
            }
        },

        previousMonth() {
            this.selectedMonth--;
            if (this.selectedMonth < 0) {
                this.selectedMonth = 11;
                this.selectedYear--;
            }
            this.updateCalendarDates();
        },

        nextMonth() {
            this.selectedMonth++;
            if (this.selectedMonth > 11) {
                this.selectedMonth = 0;
                this.selectedYear++;
            }
            this.updateCalendarDates();
        }
    }));
});