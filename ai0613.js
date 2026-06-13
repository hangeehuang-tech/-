document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    const addBtn = document.getElementById("add-btn");
    if (addBtn) {
        addBtn.addEventListener("click", addTodo);
    }
});

function notifyUser(task, time) {
    if (Notification.permission === "granted") {
        new Notification("🔔 任務到期提醒", {
            body: `記得做：${task}\n設定時間：${time.replace('T', ' ')}`
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
    } else {
        alert("⚠️ 提示：您設定的是過去的時間，將不會觸發瀏覽器通知喔！");
    }
}

function addTodo() {
    const todoInput = document.getElementById("todo-input");
    const todoTime = document.getElementById("todo-time");
    const newTodoText = todoInput.value.trim();
    const reminderTimeValue = todoTime.value;

    if (newTodoText !== "") {
        const todoList = document.getElementById("todo-list");
        
        const li = document.createElement("li");
        li.className = "todo-item";

        // 左側內容
        const contentDiv = document.createElement("div");
        contentDiv.style.cursor = "pointer";
        contentDiv.onclick = function() {
            this.parentElement.classList.toggle("completed");
        };

        const textSpan = document.createElement("span");
        textSpan.className = "todo-text";
        textSpan.innerText = newTodoText;
        contentDiv.appendChild(textSpan);

        const timeSpan = document.createElement("span");
        timeSpan.className = "time-span";
        timeSpan.innerText = reminderTimeValue ? ` 📅 ${reminderTimeValue.replace('T', ' ')}` : " 📅 未設時間";
        contentDiv.appendChild(timeSpan);
        
        li.appendChild(contentDiv);

        // 【AI優化亮點功能】：精美獨立刪除按鈕，點擊才刪除，不與單擊劃線衝突
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "✕";
        deleteBtn.onclick = function(e) {
            e.stopPropagation(); // 防止觸發劃線
            li.remove();
        };
        li.appendChild(deleteBtn);

        todoList.appendChild(li);

        if (reminderTimeValue) {
            scheduleReminder(newTodoText, reminderTimeValue);
        }

        todoInput.value = "";
        todoTime.value = "";
    } else {
        alert("請輸入代辦事項內容！");
    }
}