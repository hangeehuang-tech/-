console.log('Javascript 已連結，準備進行互動...');

// 1. 宣告全域變數並詢問名字
let visitorname = prompt('你好，我是你的助理，請問我應該要怎麼稱呼您：');

if (visitorname === '' || visitorname === null) {
    visitorname = '訪客';
}

window.alert('Hello ' + visitorname + '，歡迎來到我的網站！');

// 2. 初始化修改網站 Logo 與主標題
const logoElement = document.getElementById('main-logo');
logoElement.innerText = "11152237 " + visitorname;

const titleElement = document.getElementById('hero-title');
titleElement.innerHTML = 'Welcome to <span class="highlight" id="name-highlight">' + visitorname + "</span>'s land";


// ==========================================
// 功能一：🎵 音樂播放器控制
// ==========================================
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

document.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            musicBtn.innerText = "⏸️ 暫停音樂";
        }).catch(err => console.log("瀏覽器阻擋自動播放，等待使用者主動點擊按鈕"));
    }
}, { once: true });

musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicBtn.innerText = "⏸️ 暫停音樂";
    } else {
        bgMusic.pause();
        musicBtn.innerText = "🎵 播放音樂";
    }
});


// ==========================================
// 功能二：🎨 訪客名字變色鈕
// ==========================================
const changeColorBtn = document.getElementById('change-color-btn');
changeColorBtn.addEventListener('click', () => {
    const nameHighlight = document.getElementById('name-highlight');
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    nameHighlight.style.color = `rgb(${r}, ${g}, ${b})`;
});


// ==========================================
// 🤖 功能三：神級 AI 助理指令解析 (支援「包含時間」的進階語意分析)
// ==========================================
const themeBtn = document.getElementById('theme-btn');
const themeInput = document.getElementById('theme-input');

themeBtn.addEventListener('click', () => {
    const rawInput = themeInput.value.trim();
    
    // 檢查是否為待辦事項指令
    if (rawInput.startsWith('新增 ') || rawInput.startsWith('提醒 ')) {
        const fullContent = rawInput.substring(3).trim();
        
        if (fullContent !== "") {
            // 使用正規表達式自動尋找字串末尾是否符合 YYYY-MM-DD HH:MM 的時間格式
            // 例如：2026-06-30 18:00
            const timeRegex = /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})$/;
            const match = fullContent.match(timeRegex);
            
            let taskText = fullContent;
            let finalTime = "";
            let alertMsg = "";

            if (match) {
                // 如果抓到了時間格式，就把任務主體跟時間拆開
                const datePart = match[1]; // 2026-06-30
                const timePart = match[2]; // 18:00
                
                // 把標準時間格式組裝成 <input type="datetime-local"> 需要的 T 分隔格式 (YYYY-MM-DDTHH:MM)
                finalTime = `${datePart}T${timePart}`;
                
                // 去除掉字串末尾的時間，留下的就是純任務內容
                taskText = fullContent.replace(timeRegex, "").trim();
                alertMsg = `🤖 AI 助理：遵命！已設定排程任務！\n\n📝 事項：${taskText}\n⏰ 提醒時間：${datePart} 的 ${timePart}`;
            } else {
                // 沒有帶時間，就單純新增事項
                alertMsg = `🤖 AI 助理：收到指令！已幫您把沒有設定時間的『${taskText}』加入清單！`;
            }
            
            // 彈窗通知並加入清單
            alert(alertMsg);
            createTodoElement(taskText, finalTime);
            themeInput.value = ''; // 清空輸入框
        } else {
            alert('🤖 AI 助理：您好像沒有輸入具體的待辦內容喔！');
        }
    } 
    // 原本的切換深淺色模式
    else if (rawInput === '深色' || rawInput === '駭客') {
        document.body.classList.add('dark-mode');
        themeInput.value = '';
    } else if (rawInput === '淺色' || rawInput === '白天') {
        document.body.classList.remove('dark-mode');
        themeInput.value = '';
    } else {
        alert('🤖 AI 助理提示：\n\n切換主題：輸入「深色」或「淺色」\nAI 指派任務範例：\n👉 輸入「新增 聽新歌」\n👉 輸入「新增 繳交網頁作業 2026-06-30 18:00」(中間要有空格哦！)');
    }
});


// ==========================================
// 功能四：📝 To-Do List 待辦事項核心功能與瀏覽器通知
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
});

const todoAddBtn = document.getElementById('todo-add-btn');
if (todoAddBtn) {
    todoAddBtn.addEventListener('click', () => {
        const todoInput = document.getElementById("todo-input");
        const todoTime = document.getElementById("todo-time");
        const newTodoText = todoInput.value.trim();
        const reminderTimeValue = todoTime.value;

        if (newTodoText !== "") {
            createTodoElement(newTodoText, reminderTimeValue);
            todoInput.value = "";
            todoTime.value = "";
        } else {
            alert("請先輸入代辦事項內容！");
        }
    });
}

function createTodoElement(text, timeValue) {
    const todoList = document.getElementById("todo-list");
    
    const li = document.createElement("li");
    li.className = "todo-item";

    const textSpan = document.createElement("span");
    textSpan.innerText = text;
    li.appendChild(textSpan);

    const timeSpan = document.createElement("span");
    timeSpan.className = "time-span";
    timeSpan.innerText = timeValue ? ` (提醒時間: ${timeValue.replace('T', ' ')})` : " (沒有設定提醒時間)";
    li.appendChild(timeSpan);

    // 單擊劃線完成
    li.addEventListener("click", function() {
        this.classList.toggle("completed");
    });

    // 雙擊刪除
    li.addEventListener("dblclick", function() {
        this.remove();
    });

    todoList.appendChild(li);

    if (timeValue) {
        scheduleReminder(text, timeValue);
    }
}

function notifyUser(task, time) {
    if (Notification.permission === "granted") {
        new Notification("📌 任務到期提醒", {
            body: `提醒：${task}\n時間：${time.replace('T', ' ')}`
        });
    }
}

function scheduleReminder(task, T) {
    const now = new Date();
    const reminderTime = new Date(T);
    const delay = reminderTime.getTime() - now.getTime();

    if (delay > 0) {
        setTimeout(() => {
            notifyUser(task, T);
        }, delay);
    }
}