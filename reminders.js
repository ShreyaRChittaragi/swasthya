document.addEventListener('DOMContentLoaded', function() {
    setInterval(checkReminders, 60000);
    checkReminders();
});

function checkReminders() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${currentHours}:${currentMinutes < 10 ? '0' + currentMinutes : currentMinutes}`;
    
    const savedReminders = localStorage.getItem('healthReminders');
    if (!savedReminders) return;
    
    const reminders = JSON.parse(savedReminders);
    const triggeredReminders = localStorage.getItem('triggeredReminders') || '{}';
    const triggered = JSON.parse(triggeredReminders);
    
    reminders.forEach(reminder => {
        if (triggered[reminder.id] === getTodayDate()) {
            return;
        }
        
        const [hours, minutes] = reminder.time.split(':').map(Number);
        
        if (hours === currentHours && minutes === currentMinutes) {
            showReminderNotification(reminder);
            
            triggered[reminder.id] = getTodayDate();
            localStorage.setItem('triggeredReminders', JSON.stringify(triggered));
        }
    });
}

function getTodayDate() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function showReminderNotification(reminder) {
    if (typeof addBotMessage === 'function') {
        addBotMessage(`Reminder: It's time to ${reminder.name}. ${reminder.notes ? `Notes: ${reminder.notes}` : ''}`, true);
    }
    
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`SwasthyaBot Reminder`, {
            body: `It's time to ${reminder.name}`,
            icon: 'assets/images/icon.png'
        });
    }
}