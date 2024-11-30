// 用于存储问题和流程控制的全局变量
let questions = {};  // 用于存储问题内容
let tree = [];       // 用于存储问题的跳转流程
let currentQuestion = '';  // 当前问题ID
let score = 0;            // 总得分

// 解析 tree.txt 文件，构建问答流程
function parseTree(treeText) {
    const lines = treeText.split('\n');
    lines.forEach(line => {
        if (line.trim()) {
            const [from, to] = line.split('->').map(s => s.trim());
            tree.push({ from, to });
        }
    });
}

// 解析问题配置文件夹下的所有文件（模拟读取），存储每个问题和选项
function parseQuestions() {
    const questionFiles = ['question1.txt', 'question2.txt', 'question3.txt'];  // 假设文件名
    questionFiles.forEach(file => {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                const question = parseQuestionFile(data);
                questions[question.id] = question;
                if (!currentQuestion) currentQuestion = question.id;
                renderQuestion();
            });
    });
}

// 解析单个问题文件内容
function parseQuestionFile(data) {
    const lines = data.split('\n');
    const id = lines[0].split(':')[0].trim();
    const questionText = lines[0].split(':')[1].trim();
    const options = [];

    for (let i = 1; i < lines.length; i++) {
        const optionText = lines[i].split('|')[0].trim();
        const scoreValue = parseInt(lines[i].split('|')[1].trim());
        options.push({ text: optionText, score: scoreValue });
    }

    return { id, text: questionText, options };
}

// 渲染当前问题和选项
function renderQuestion() {
    const question = questions[currentQuestion];
    if (!question) return;

    // 显示问题文本
    document.getElementById('question-text').innerText = question.text;

    // 显示选项
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';  // 清空选项
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.onclick = () => handleOptionClick(option);
        optionsContainer.appendChild(button);
    });
}

// 处理选项点击事件
function handleOptionClick(option) {
    score += option.score;

    // 找到当前问题的跳转
    const nextQuestion = tree.find(item => item.from === currentQuestion)?.to;
    if (nextQuestion === 'END') {
        alert(`游戏结束！你的得分是：${score}`);
    } else {
        currentQuestion = nextQuestion;
        renderQuestion();
    }
}

// 加载初始化文件
fetch('tree.txt')
    .then(response => response.text())
    .then(data => {
        parseTree(data);  // 解析流程
        parseQuestions();  // 解析问题
    });
