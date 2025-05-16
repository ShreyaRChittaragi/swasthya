document.addEventListener('DOMContentLoaded', function() {
    initModals();
    loadReminders();
});

function initModals() {
    const reminderModal = document.getElementById('reminder-modal');
    const addReminderBtn = document.getElementById('add-reminder');
    const closeReminderModal = reminderModal.querySelector('.close-modal');
    
    addReminderBtn.addEventListener('click', () => {
        reminderModal.classList.remove('hidden');
    });
    
    closeReminderModal.addEventListener('click', () => {
        reminderModal.classList.add('hidden');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === reminderModal) {
            reminderModal.classList.add('hidden');
        }
    });
}

function initReminderForm() {
    const reminderForm = document.getElementById('reminder-form');
    
    reminderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = document.getElementById('reminder-type').value;
        const name = document.getElementById('reminder-name').value;
        const time = document.getElementById('reminder-time').value;
        const notes = document.getElementById('reminder-notes').value;
        
        if (!name || !time) {
            alert('Please fill in all required fields');
            return;
        }
        
        const newReminder = {
            id: Date.now(),
            type,
            name,
            time,
            notes
        };
        
        saveReminder(newReminder);
        addReminderToDOM(newReminder);
        
        document.getElementById('reminder-modal').classList.add('hidden');
        reminderForm.reset();
        
        if (typeof addBotMessage === 'function') {
            addBotMessage(`I've added your ${type} reminder for ${formatTime(time)}.`);
        }
    });
}

function loadReminders() {
    const savedReminders = localStorage.getItem('healthReminders');
    const remindersList = document.getElementById('reminders-list');
    
    if (!remindersList) return;
    
    remindersList.innerHTML = '';
    
    if (savedReminders) {
        const reminders = JSON.parse(savedReminders);
        reminders.forEach(reminder => {
            addReminderToDOM(reminder);
        });
    }
}

function saveReminder(reminder) {
    let reminders = [];
    const savedReminders = localStorage.getItem('healthReminders');
    if (savedReminders) {
        reminders = JSON.parse(savedReminders);
    }
    reminders.push(reminder);
    localStorage.setItem('healthReminders', JSON.stringify(reminders));
}

function deleteReminder(id) {
    let reminders = [];
    const savedReminders = localStorage.getItem('healthReminders');
    if (savedReminders) {
        reminders = JSON.parse(savedReminders);
    }
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    localStorage.setItem('healthReminders', JSON.stringify(updatedReminders));
    loadReminders();
}

function addReminderToDOM(reminder) {
    const remindersList = document.getElementById('reminders-list');
    if (!remindersList) return;
    
    const li = document.createElement('li');
    li.className = 'reminder-item';
    li.dataset.id = reminder.id;
    
    const formattedTime = formatTime(reminder.time);
    
    li.innerHTML = `
        <span class="reminder-time">${formattedTime}</span>
        <span class="reminder-name">${reminder.name}</span>
        <span class="reminder-type">${reminder.type}</span>
        <button class="delete-reminder"><i class="fas fa-trash"></i></button>
    `;
    
    li.querySelector('.delete-reminder').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteReminder(reminder.id);
    });
    
    remindersList.appendChild(li);
}

function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    let period = 'AM';
    let formattedHours = parseInt(hours);
    
    if (formattedHours >= 12) {
        period = 'PM';
        if (formattedHours > 12) {
            formattedHours -= 12;
        }
    }
    
    if (formattedHours === 0) {
        formattedHours = 12;
    }
    
    return `${formattedHours}:${minutes.padStart(2, '0')} ${period}`;
}

// Initialize the reminder form
initReminderForm();