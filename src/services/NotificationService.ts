// Notification Service - Browser notification management with escalation
// Built for easy migration to Expo notifications later

export interface NotificationSchedule {
  habitId: number;
  habitName: string;
  scheduledTime: string; // HH:MM format
  enabled: boolean;
}

export interface ScheduledNotification {
  id: string;
  habitId: number;
  timeoutId?: number;
  type: 'gentle' | 'urgent' | 'buzzing';
  triggerTime: Date;
}

class NotificationServiceClass {
  private schedules: NotificationSchedule[] = [];
  private activeNotifications: ScheduledNotification[] = [];
  private permissionGranted = false;
  private onNotificationClick?: (habitId: number) => void;

  constructor() {
    // Check if permission is already granted on initialization
    if ('Notification' in window && Notification.permission === 'granted') {
      this.permissionGranted = true;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    }

    return false;
  }

  setClickHandler(handler: (habitId: number) => void) {
    this.onNotificationClick = handler;
  }

  private showNotification(
    habitId: number,
    habitName: string,
    type: 'gentle' | 'urgent' | 'buzzing'
  ) {
    if (!this.permissionGranted) {
      console.warn(`❌ [Notification] Cannot show ${type} notification for "${habitName}" - permission not granted`);
      return;
    }
    
    console.log(`📣 [Notification] Showing ${type} notification for "${habitName}"`);

    const messages = {
      gentle: {
        title: `Time to ${habitName} 🌟`,
        body: 'Your habit is coming up in 5 minutes',
        icon: '⏰',
      },
      urgent: {
        title: `${habitName} - START NOW`,
        body: 'Your habit starts right now. Hold to ignite!',
        icon: '🔥',
      },
      buzzing: {
        title: `${habitName} - YOU\'RE LATE!`,
        body: 'You missed your window. Quick 60s action NOW!',
        icon: '⚡',
      },
    };

    const config = messages[type];
    const notification = new Notification(config.title, {
      body: config.body,
      icon: config.icon,
      requireInteraction: type !== 'gentle',
      tag: `habit-${habitId}-${type}`,
    });

    notification.onclick = () => {
      notification.close();
      window.focus();
      if (this.onNotificationClick) {
        this.onNotificationClick(habitId);
      }
    };
  }

  private scheduleNotificationSequence(
    habitId: number,
    habitName: string,
    scheduledTime: string
  ) {
    // Clear existing notifications for this habit
    this.clearHabitNotifications(habitId);

    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const now = new Date();
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);

    // If scheduled time is in the past today, schedule for tomorrow
    if (scheduledDate <= now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
      console.log(`📅 [Notification] "${habitName}" scheduled time (${scheduledTime}) already passed today, scheduling for tomorrow`);
    }

    // Calculate trigger times
    const gentleTime = new Date(scheduledDate.getTime() - 5 * 60 * 1000); // T-5 minutes
    const urgentTime = new Date(scheduledDate.getTime()); // T-0
    const buzzingTime = new Date(scheduledDate.getTime() + 5 * 60 * 1000); // T+5 minutes

    console.log(`🔔 [Notification] Scheduling notifications for "${habitName}":
  - Gentle reminder (T-5): ${gentleTime.toLocaleTimeString()}
  - Urgent (T-0): ${urgentTime.toLocaleTimeString()}
  - Buzzing (T+5): ${buzzingTime.toLocaleTimeString()}
  Permission granted: ${this.permissionGranted}`);

    // Schedule notifications
    const scheduleNotif = (
      type: 'gentle' | 'urgent' | 'buzzing',
      triggerTime: Date
    ) => {
      const delay = triggerTime.getTime() - now.getTime();
      if (delay > 0) {
        const timeoutId = window.setTimeout(() => {
          console.log(`🔥 [Notification] Firing ${type} notification for "${habitName}"`);
          this.showNotification(habitId, habitName, type);
        }, delay);

        this.activeNotifications.push({
          id: `${habitId}-${type}`,
          habitId,
          timeoutId,
          type,
          triggerTime,
        });
        
        console.log(`✅ [Notification] ${type} scheduled in ${Math.round(delay / 1000)}s (${triggerTime.toLocaleTimeString()})`);
      } else {
        console.log(`⏭️ [Notification] ${type} time already passed, skipping`);
      }
    };

    scheduleNotif('gentle', gentleTime);
    scheduleNotif('urgent', urgentTime);
    scheduleNotif('buzzing', buzzingTime);
  }

  private clearHabitNotifications(habitId: number) {
    this.activeNotifications = this.activeNotifications.filter((notif) => {
      if (notif.habitId === habitId) {
        if (notif.timeoutId) {
          clearTimeout(notif.timeoutId);
        }
        return false;
      }
      return true;
    });
  }

  scheduleHabit(habitId: number, habitName: string, time: string) {
    // Update or add schedule
    const existingIndex = this.schedules.findIndex((s) => s.habitId === habitId);
    const schedule: NotificationSchedule = {
      habitId,
      habitName,
      scheduledTime: time,
      enabled: true,
    };

    if (existingIndex >= 0) {
      this.schedules[existingIndex] = schedule;
    } else {
      this.schedules.push(schedule);
    }

    // Schedule notification sequence
    this.scheduleNotificationSequence(habitId, habitName, time);
  }

  unscheduleHabit(habitId: number) {
    this.schedules = this.schedules.filter((s) => s.habitId !== habitId);
    this.clearHabitNotifications(habitId);
  }

  toggleHabitSchedule(habitId: number, enabled: boolean) {
    const schedule = this.schedules.find((s) => s.habitId === habitId);
    if (schedule) {
      schedule.enabled = enabled;
      if (enabled) {
        this.scheduleNotificationSequence(
          schedule.habitId,
          schedule.habitName,
          schedule.scheduledTime
        );
      } else {
        this.clearHabitNotifications(habitId);
      }
    }
  }

  getSchedule(habitId: number): NotificationSchedule | undefined {
    return this.schedules.find((s) => s.habitId === habitId);
  }

  getAllSchedules(): NotificationSchedule[] {
    return this.schedules;
  }

  clearAll() {
    this.activeNotifications.forEach((notif) => {
      if (notif.timeoutId) {
        clearTimeout(notif.timeoutId);
      }
    });
    this.activeNotifications = [];
    this.schedules = [];
  }

  // Testing & Debugging Methods
  testNotification(habitName: string = 'Test Habit') {
    console.log(`🧪 [Notification] Firing test notification for "${habitName}"`);
    if (!this.permissionGranted) {
      console.warn('❌ [Notification] Test failed - permission not granted');
      alert('Notification permission not granted. Please enable notifications in your browser settings.');
      return;
    }
    this.showNotification(999, habitName, 'urgent');
  }

  getDebugInfo() {
    return {
      permissionGranted: this.permissionGranted,
      browserSupport: 'Notification' in window,
      browserPermission: 'Notification' in window ? Notification.permission : 'N/A',
      activeSchedules: this.schedules,
      activeNotifications: this.activeNotifications.map(n => ({
        id: n.id,
        type: n.type,
        triggerTime: n.triggerTime.toLocaleTimeString(),
        timeRemaining: Math.round((n.triggerTime.getTime() - Date.now()) / 1000) + 's'
      }))
    };
  }

  logDebugInfo() {
    const info = this.getDebugInfo();
    console.log('🔍 [Notification Debug Info]', info);
    return info;
  }
}

export const NotificationService = new NotificationServiceClass();
