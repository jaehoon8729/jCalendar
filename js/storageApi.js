// storageApi.js

const StorageApi = {
    // 키에 해당하는 데이터 가져오기
    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`getData 에러 (${key}):`, error);
            return null;
        }
    },

    // 데이터 저장하기
    setData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`setData 에러 (${key}):`, error);
            return false;
        }
    },

    // 특정 키의 데이터 삭제
    removeData(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`removeData 에러 (${key}):`, error);
            return false;
        }
    },

    // 데이터 업데이트하기
    updateData(key, updateFn) {
        try {
            const currentData = this.getData(key);
            const updatedData = updateFn(currentData);
            return this.setData(key, updatedData);
        } catch (error) {
            console.error(`updateData 에러 (${key}):`, error);
            return false;
        }
    },

    // JSON 파일로 내보내기
    exportToJson(key, filename) {
        try {
            const data = this.getData(key);
            if (!data) return false;

            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error(`exportToJson 에러 (${key}):`, error);
            return false;
        }
    },

    // JSON 파일 불러오기
    async importFromJson(key, file) {
        try {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        this.setData(key, importedData);
                        resolve(true);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(new Error('파일 읽기 실패'));
                reader.readAsText(file);
            });
        } catch (error) {
            console.error(`importFromJson 에러 (${key}):`, error);
            return false;
        }
    }
};

export default StorageApi;