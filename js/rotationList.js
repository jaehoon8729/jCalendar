document.addEventListener('alpine:init', () => {
    Alpine.data('classManagement', () => ({
        classes: {
            morning: [
                {id: 1, name: '개나리', teacher: '아무개1'},
                {id: 2, name: '백목', teacher: '아무개2'},
                {id: 3, name: '튤립마루', teacher: '아무개3'}
            ],
            afternoon: [
                {id: 4, name: '장미', teacher: '아무개4'},
                {id: 5, name: '국화', teacher: '아무개5'}
            ]
        },
        activeTab: 'morning', // 추가: 현재 활성화된 탭 상태
        showModal: false,
        editingClass: null,
        isEditing: false,
        newClass: {
            name: '',
            teacher: ''
        },
        currentPeriod: 'morning',

        openModal(period, classItem = null) {
            this.currentPeriod = period;
            if (classItem) {
                this.isEditing = true;
                this.editingClass = classItem;
                this.newClass = {...classItem};
            } else {
                this.isEditing = false;
                this.newClass = {name: '', teacher: ''};
            }
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.newClass = {name: '', teacher: ''};
            this.editingClass = null;
        },

        saveClass() {
            if (!this.newClass.name || !this.newClass.teacher) {
                alert('모든 필드를 입력해주세요.');
                return;
            }

            if (this.isEditing) {
                const index = this.classes[this.currentPeriod].findIndex(c => c.id === this.editingClass.id);
                if (index !== -1) {
                    this.classes[this.currentPeriod][index] = {
                        ...this.editingClass,
                        name: this.newClass.name,
                        teacher: this.newClass.teacher
                    };
                }
            } else {
                const newId = Math.max(...[...this.classes.morning, ...this.classes.afternoon].map(c => c.id), 0) + 1;
                this.classes[this.currentPeriod].push({
                    id: newId,
                    name: this.newClass.name,
                    teacher: this.newClass.teacher
                });
            }
            this.closeModal();
        },

        deleteClass(period, id) {
            if (confirm('정말 삭제하시겠습니까?')) {
                this.classes[period] = this.classes[period].filter(c => c.id !== id);
            }
        }
    }));
});