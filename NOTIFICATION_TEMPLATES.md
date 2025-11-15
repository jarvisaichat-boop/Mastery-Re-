# Push Notification Message Templates

## Overview
These are intriguing, attention-grabbing notification messages designed to be sent every 2-3 days to keep users engaged. Inspired by the motivation philosophy: celebrate everything, make it social-media-style addictive, use Stoic coach tone.

## Design Principles
1. **Intriguing Questions**: Different every time, attention-grabbing
2. **Positive Framing**: Even "failures" are wins ("Just answering is a win")
3. **Stoic Coach Tone**: Direct, supportive, firm - "You're a king, don't sweat the small stuff"
4. **Generational/Cultural Adaptation**: Words can change depending on user demographics
5. **Social Media Mechanics**: TikTok-style attention grabbing

## Notification Categories

### Daily Win Check-Ins (Every 2-3 days)
```
"Did you win yourself yesterday? 🔥"
→ On tap: Opens quick yes/no + optional reflection

"Real talk: Did you show up today?"
→ Emphasizes authenticity over perfection

"One question: What's one thing you crushed today?"
→ Forces positive reflection
```

### Intriguing Reflection Prompts
```
"What would happen if you actually did it?"
→ Future-focused motivation

"Who are you becoming?"
→ Identity-based question

"What are you avoiding right now?"
→ Direct, confrontational in a supportive way

"If not now, when?"
→ Classic Stoic urgency
```

### Celebration Triggers (After streak milestones)
```
"3 days straight! You're building something real. 👑"

"Week 1 done. Most people quit by day 3. Not you."

"14 days! You've officially built a habit. This is who you are now."

"30-day streak! You're in the top 1%. Keep going, king."
```

### Accountability Nudges
```
"Who knows about your goal? (Hint: They should.)"
→ Prompts sharing

"You told someone, right? Make it real."
→ Social pressure reminder

"Accountability check: Did you share your commitment?"
→ Direct reminder
```

### Stoic Wisdom Drops
```
"Motivation is overrated. Discipline is everything."

"You don't need to feel like it. You just need to do it."

"Small wins compound. You're building momentum whether you see it or not."

"Every day you show up is a vote for who you're becoming."

"The path to mastery is paved with mistakes. Keep going."
```

### Recovery Messages (After missed days)
```
"You missed a day. So what? Get back up."

"Streaks end. Progress doesn't. What's your next move?"

"Yesterday's gone. Today's a new vote. What are you choosing?"

"Failure is feedback. What did you learn?"
```

## Implementation Notes

### Timing Strategy
- **Morning (6-9am)**: Win check-ins, reflection prompts
- **Afternoon (2-4pm)**: Accountability nudges, Stoic wisdom
- **Evening (7-9pm)**: Celebration triggers (after habit completion)
- **Variable**: Every 2-3 days to avoid notification fatigue

### Personalization Hooks
- Use user's actual goal in messages when relevant
- Reference specific habits they're tracking
- Adapt language based on user age/demographics (future feature)
- Increase frequency during active streaks

### Future Enhancements
1. **AI-Generated Messages**: Personalized based on user's specific struggles
2. **Time Zone Awareness**: Smart delivery based on user location
3. **Engagement Analytics**: Track which messages drive most opens
4. **A/B Testing**: Test different tones and phrasings
5. **Emoji Variations**: Test which emojis drive engagement

## Technical Requirements

### Service Worker Setup (Future)
```javascript
// notifications.ts
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.register('/sw.js');
    // Request notification permission
    const permission = await Notification.requestPermission();
    return { registration, permission };
  }
};

export const scheduleNotification = (message: string, delayMs: number) => {
  // Implementation using Web Push API
};
```

### Backend Integration (Future)
- Use Firebase Cloud Messaging (FCM) or similar push service
- Store user notification preferences (frequency, time of day)
- Track notification open rates and engagement
- Implement notification scheduling logic

## Example Notification Flow

### Day 1 (Morning)
**Notification**: "Did you win yourself yesterday? 🔥"
**Action**: User taps → Opens ChatDailyCheckIn

### Day 3 (Afternoon)
**Notification**: "Who knows about your goal? (Hint: They should.)"
**Action**: User taps → Opens accountability sharing

### Day 7 (Evening)
**Notification**: "Week 1 done! Most people quit by day 3. Not you. 👑"
**Action**: User taps → Shows celebration modal

### Day 10 (Morning)
**Notification**: "What are you avoiding right now?"
**Action**: User taps → Opens reflection prompt

## Notes for Developers
- All messages stored in constants file for easy editing
- Messages should be rotated randomly within category
- Never repeat same message within 30 days
- Track which messages user has seen
- Allow users to customize notification frequency in settings (future)
