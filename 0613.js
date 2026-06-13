document.addEventListener('DOMContentLoaded', () => {
    // 1. 頁面載入時，主動向使用者請求瀏覽器通知權限
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // 2. 綁定按鈕點擊事件（安全綁定，絕不重複觸發）
    const addBtn = document.getElementById("add-btn");
    if (addBtn) {
        addBtn.addEventListener("click", addTodo);
    }
});

// 設定通知內容的函式
function notifyUser(task, time) {
    if (Notification.permission === "granted") {
        new Notification("Reminder", {
            body: `Time for: ${task} at ${time}`
        });
    }
}

// 設定何時跳出通知的排程功能（計算時間差）
function scheduleReminder(task, T) {
    const now = new Date();
    const reminderTime = new Date(T);
    const delay = reminderTime.getTime() - now.getTime(); // 毫秒差

    if (delay > 0) {
        setTimeout(() => {
            notifyUser(task, T);
        }, delay);
    }
}

// 新增代辦事項的主功能
function addTodo() {
    const todoInput = document.getElementById("todo-input");
    const todoTime = document.getElementById("todo-time");

    // 移除前後空白字元
    const newTodoText = todoInput.value.trim();
    const reminderTimeValue = todoTime.value;

    // 判斷輸入框不為空才執行
    if (newTodoText !== "") {
        const todoList = document.getElementById("todo-list");
        
        // 建立新的 li 列表項目
        const li = document.createElement("li");
        li.className = "todo-item";

        // 建立代辦事項文字
        const textSpan = document.createElement("span");
        textSpan.innerText = newTodoText;
        li.appendChild(textSpan);

        // 建立時間顯示（若無設定則顯示預設文字）
        const timeSpan = document.createElement("span");
        timeSpan.className = "time-span";
        timeSpan.innerText = reminderTimeValue ? ` (提醒時間: ${reminderTimeValue})` : " (沒有設定提醒時間)";
        li.appendChild(timeSpan);

        // 【事件綁定一】點擊單次：切換完成狀態（劃線）
        li.addEventListener("click", function() {
            this.classList.toggle("completed");
        });

        // 【事件綁定二】點擊兩下（雙擊）：直接刪除該項目
        li.addEventListener("dblclick", function() {
            this.remove();
        });

        // 將製作好的 li 放進 ul 清單中
        todoList.appendChild(li);

        // 如果有設定時間，則啟動倒數排程通知
        if (reminderTimeValue) {
            scheduleReminder(newTodoText, reminderTimeValue);
        }

        // 清空輸入欄位回復原始狀態
        todoInput.value = "";
        todoTime.value = "";
    } else {
        // 只有在真正空白時才會跳出這個提示
        alert("請先輸入代辦事項內容！");
    }
}