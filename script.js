document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const deleteSelectedBtn = document.getElementById('delete-selected');
    const selectAllBtn = document.getElementById('select-all');
    const numbersContainer = document.getElementById('numbers-container');
    const numberDisplay = document.querySelector('.number-display');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    let currentNumbers = [];
    let isAllSelected = false;
    let currentPage = 1;
    const itemsPerPage = 4;

    // 创建背景文字效果
    createBackgroundText();

    // 事件监听
    generateBtn.addEventListener('click', generateNumbers);
    deleteSelectedBtn.addEventListener('click', deleteSelected);
    selectAllBtn.addEventListener('click', toggleSelectAll);
    prevPageBtn.addEventListener('click', () => changePage(-1));
    nextPageBtn.addEventListener('click', () => changePage(1));

    function generateNumbers() {
        // 生成6个红球号码（1-33）
        let redNumbers = [];
        while (redNumbers.length < 6) {
            const num = Math.floor(Math.random() * 33) + 1;
            if (!redNumbers.includes(num)) {
                redNumbers.push(num);
            }
        }
        redNumbers.sort((a, b) => a - b);

        // 生成1个蓝球号码（1-16）
        const blueNumber = Math.floor(Math.random() * 16) + 1;

        // 创建新的号码组
        const numberGroup = {
            red: redNumbers,
            blue: blueNumber,
            timestamp: formatDate(new Date()),
            id: Date.now()
        };

        // 显示当前号码
        displayCurrentNumber(numberGroup);

        // 添加到记录
        currentNumbers.unshift(numberGroup);
        currentPage = 1; // 新生成的号码时回到第一页
        renderHistory();
        updatePagination();
    }

    function displayCurrentNumber(group) {
        numberDisplay.innerHTML = '';
        
        // 添加红球
        group.red.forEach(num => {
            const ball = createBall(num, '#ff4d4f');
            numberDisplay.appendChild(ball);
        });

        // 添加蓝球
        const blueBall = createBall(group.blue, '#1890ff');
        numberDisplay.appendChild(blueBall);
    }

    function renderHistory() {
        numbersContainer.innerHTML = '';
        
        // 计算当前页的数据
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageNumbers = currentNumbers.slice(startIndex, endIndex);

        pageNumbers.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'number-group';
            groupDiv.dataset.id = group.id;

            // 创建自定义复选框容器
            const checkboxContainer = document.createElement('label');
            checkboxContainer.className = 'checkbox-container';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';

            const checkmark = document.createElement('span');
            checkmark.className = 'checkmark';

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(checkmark);
            groupDiv.appendChild(checkboxContainer);

            // 添加红球
            group.red.forEach(num => {
                const ball = createBall(num, '#ff4d4f');
                groupDiv.appendChild(ball);
            });

            // 添加蓝球
            const blueBall = createBall(group.blue, '#1890ff');
            groupDiv.appendChild(blueBall);

            // 添加时间戳
            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = group.timestamp;
            groupDiv.appendChild(timestamp);

            numbersContainer.appendChild(groupDiv);
        });
    }

    function createBall(number, color) {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.backgroundColor = color;
        ball.textContent = number.toString().padStart(2, '0');
        return ball;
    }

    function formatDate(date) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month}-${day} ${hours}:${minutes}`;
    }

    function updatePagination() {
        const totalPages = Math.ceil(currentNumbers.length / itemsPerPage);
        pageInfo.textContent = `第 ${currentPage} 页`;
        
        // 更新按钮状态
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    function changePage(delta) {
        const totalPages = Math.ceil(currentNumbers.length / itemsPerPage);
        const newPage = currentPage + delta;
        
        if (newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            renderHistory();
            updatePagination();
            // 重置全选状态
            isAllSelected = false;
            selectAllBtn.textContent = '全选';
        }
    }

    function deleteSelected() {
        const selectedIds = Array.from(document.querySelectorAll('.number-group input:checked'))
            .map(checkbox => checkbox.closest('.number-group').dataset.id);
        
        if (selectedIds.length === 0) {
            alert('请先选择要删除的号码');
            return;
        }

        currentNumbers = currentNumbers.filter(group => !selectedIds.includes(group.id.toString()));
        
        // 调整当前页
        const totalPages = Math.ceil(currentNumbers.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        
        renderHistory();
        updatePagination();
        // 重置全选状态
        isAllSelected = false;
        selectAllBtn.textContent = '全选';
    }

    function toggleSelectAll() {
        isAllSelected = !isAllSelected;
        document.querySelectorAll('.number-group .checkbox')
            .forEach(checkbox => checkbox.checked = isAllSelected);
        selectAllBtn.textContent = isAllSelected ? '取消全选' : '全选';
    }

    function createBackgroundText() {
        const container = document.querySelector('.background-text');
        const rowHeight = 36;
        const screenHeight = window.innerHeight;
        const rows = Math.ceil(screenHeight / rowHeight);
        
        container.innerHTML = '';
        const text = "必中 ".repeat(50);

        for (let i = 0; i < rows; i++) {
            const textRow = document.createElement('div');
            textRow.className = 'text-row';
            textRow.textContent = text;
            const direction = i % 2 === 0 ? 'normal' : 'reverse';
            const duration = 30 + Math.random() * 20;
            textRow.style.animation = `scrollText ${duration}s linear infinite ${direction}`;
            container.appendChild(textRow);
        }
    }
}); 