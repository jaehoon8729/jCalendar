// calendar.js
document.addEventListener('alpine:init', () => {
    Alpine.data('calendar', () => ({
        init() {
            this.updateCalendarDates();
        },

        currentDate: new Date(),
        selectedMonth: new Date().getMonth(),
        selectedYear: new Date().getFullYear(),
        selectedDay: null,
        newEvent: '',
        events: {},
        dates: [], // 달력 날짜 저장용 배열
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월",
            "7월", "8월", "9월", "10월", "11월", "12월"],

        updateCalendarDates() {
            const dates = [];
            const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
            const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0);
            const lastMonthLastDay = new Date(this.selectedYear, this.selectedMonth, 0);

            // 이전 달의 날짜들
            for (let i = 0; i < firstDay.getDay(); i++) {
                const day = lastMonthLastDay.getDate() - (firstDay.getDay() - i - 1);
                dates.push({
                    id: `prev-${day}`, // unique key를 위한 id 추가
                    day: day,
                    isCurrentMonth: false
                });
            }

            // 현재 달의 날짜들
            for (let i = 1; i <= lastDay.getDate(); i++) {
                dates.push({
                    id: `current-${i}`, // unique key를 위한 id 추가
                    day: i,
                    isCurrentMonth: true
                });
            }

            // 다음 달의 날짜들
            const remainingDays = 7 - (dates.length % 7);
            if (remainingDays < 7) {
                for (let i = 1; i <= remainingDays; i++) {
                    dates.push({
                        id: `next-${i}`, // unique key를 위한 id 추가
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
            }
        },

        deleteEvent(index) {
            const dateKey = this.getDateKey(this.selectedDay);
            if (this.events[dateKey]) {
                this.events[dateKey].splice(index, 1);
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