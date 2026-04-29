"use client"

import { useEffect, useCallback } from "react"
import { toast } from "sonner"

interface MaintenanceReminder {
  id: string
  title: string
  message: string
  dueDate: Date
}

export function useNotifications(reminders: MaintenanceReminder[]) {
  const checkReminders = useCallback(() => {
    const now = new Date()

    reminders.forEach((reminder) => {
      const timeDiff = reminder.dueDate.getTime() - now.getTime()
      const daysUntilDue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

      if (daysUntilDue <= 7 && daysUntilDue > 0) {
        toast.info(`${reminder.title}: ${reminder.message}`, {
          duration: 5000,
          id: `reminder-${reminder.id}`,
        })
      }
    })
  }, [reminders])

  useEffect(() => {
    // Check on mount
    checkReminders()

    // Check every hour
    const interval = setInterval(checkReminders, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [checkReminders])

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === "granted"
  }, [])

  const showNotification = useCallback((title: string, body: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return
    }

    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
      })
    }
  }, [])

  return {
    requestPermission,
    showNotification,
    checkReminders,
  }
}
