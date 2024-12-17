import Alpine from '../lib/alpinejs@3.14.1.esm.min.js';
import StorageApi from './storageApi.js';

Alpine.data('classManagement', () => ({
    init() {
        const savedClasses = StorageApi.getData('rotationClasses');
        if (savedClasses) {
            // 저장된 데이터를 order 순으로 정렬
            savedClasses.morning.sort((a, b) => a.order - b.order);
            savedClasses.afternoon.sort((a, b) => a.order - b.order);
            this.classes = savedClasses;
        } else {
            // 초기 데이터도 order 순으로 정렬
            this.classes.morning.sort((a, b) => a.order - b.order);
            this.classes.afternoon.sort((a, b) => a.order - b.order);
        }

        this.$nextTick(() => {
            this.initSortable('morningTbody', 'morning');
            this.initSortable('afternoonTbody', 'afternoon');
        });
    },

    classes: {
        morning: [
            {id: 1, name: '개나리', teacher: '아무개1', order: 0},
            {id: 2, name: '백목', teacher: '아무개2', order: 1},
            {id: 3, name: '튤립마루', teacher: '아무개3', order: 2}
        ],
        afternoon: [
            {id: 4, name: '장미', teacher: '아무개4', order: 0},
            {id: 5, name: '국화', teacher: '아무개5', order: 1}
        ]
    },
    activeTab: 'morning',
    showModal: false,
    editingClass: null,
    isEditing: false,
    newClass: {
        name: '',
        teacher: ''
    },
    currentPeriod: 'morning',

    initSortable(refName, period) {
        const el = this.$refs[refName];
        if (!el) {
            console.error('Element not found:', refName);
            return;
        }

        new Sortable(el, {
            animation: 150,
            handle: '.handle',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            forceFallback: true,
            fallbackClass: 'sortable-fallback',
            fallbackOnBody: true,
            scroll: true,
            bubbleScroll: true,
            onStart: (evt) => {
                const row = evt.item;
                row.classList.add('dragging');
            },
            onEnd: (evt) => {
                const row = evt.item;
                row.classList.remove('dragging');

                // DOM에서 현재 순서 가져오기
                const rows = Array.from(el.getElementsByTagName('tr'));
                const newOrder = rows.map((row, idx) => {
                    const index = row.getAttribute('data-index');
                    const num = index.toString().charAt(2);
                    this.classes[period][num].order = idx;
                    console.log("num", num);
                    console.log("class",this.classes[period][num]);
                    return this.classes[period][index.toString().charAt(2)];
                });
                console.log("activeTab", this.activeTab);
                console.log("new", {[period] : newOrder});

                // 상태 업데이트
                this.classes = {
                    [period] : newOrder,
                    ...this.classes,
                };

                // 저장
                this.saveClasses();
            }
        });
    },

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

    saveClasses() {
        StorageApi.setData('rotationClasses', this.classes);
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
        this.saveClasses();
        this.closeModal();
    },

    deleteClass(period, id) {
        if (confirm('정말 삭제하시겠습니까?')) {
            this.classes[period] = this.classes[period].filter(c => c.id !== id);
            this.saveClasses();
        }
    }
}));