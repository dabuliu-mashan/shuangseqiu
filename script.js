document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const redBallsContainer = document.querySelector('.red-balls');
    const blueBallContainer = document.querySelector('.blue-ball');
    const historyList = document.getElementById('history-list');

    // 从localStorage加载历史记录
    let history = JSON.parse(localStorage.getItem('lotteryHistory')) || [];
    renderHistory();

    // 创建背景文字效果
    createBackgroundText();

    generateBtn.addEventListener('click', generateNumbers);

    function generateNumbers() {
        // 清空现有号码
        redBallsContainer.innerHTML = '';
        blueBallContainer.innerHTML = '';

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

        // 显示号码
        redNumbers.forEach(num => {
            const ball = createBall(num, 'red');
            redBallsContainer.appendChild(ball);
        });

        const blueBall = createBall(blueNumber, 'blue');
        blueBallContainer.appendChild(blueBall);

        // 保存到历史记录
        const record = {
            red: redNumbers,
            blue: blueNumber,
            timestamp: new Date().toLocaleString()
        };
        history.unshift(record);
        if (history.length > 50) history.pop(); // 限制历史记录数量
        localStorage.setItem('lotteryHistory', JSON.stringify(history));
        renderHistory();
    }

    function createBall(number, type) {
        const ball = document.createElement('div');
        ball.className = `ball ${type}`;
        ball.textContent = number.toString().padStart(2, '0');
        return ball;
    }

    function renderHistory() {
        historyList.innerHTML = '';
        history.forEach(record => {
            const li = document.createElement('li');
            const redNumbers = record.red.map(n => n.toString().padStart(2, '0')).join(' ');
            const blueNumber = record.blue.toString().padStart(2, '0');
            li.textContent = `${record.timestamp}: ${redNumbers} + ${blueNumber}`;
            historyList.appendChild(li);
        });
    }

    function createBackgroundText() {
        const container = document.querySelector('.background-text');
        // 计算需要的行数（根据视窗高度）
        const rowHeight = 36; // 24px字体 + 1.5行高
        const screenHeight = window.innerHeight;
        const rows = Math.ceil(screenHeight / rowHeight);
        
        // 清空现有内容
        container.innerHTML = '';
        
        // 创建足够多的文字内容
        const text = "必中 ".repeat(50); // 增加重复次数确保足够宽

        for (let i = 0; i < rows; i++) {
            const textRow = document.createElement('div');
            textRow.className = 'text-row';
            textRow.textContent = text;
            // 交替方向
            const direction = i % 2 === 0 ? 'normal' : 'reverse';
            // 随机化动画持续时间
            const duration = 30 + Math.random() * 20;
            textRow.style.animation = `scrollText ${duration}s linear infinite ${direction}`;
            container.appendChild(textRow);
        }

        // 监听窗口大小变化，重新计算行数
        window.addEventListener('resize', () => {
            createBackgroundText();
        });
    }
}); 