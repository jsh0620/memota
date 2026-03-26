import { format, startOfWeek, addDays, addWeeks, subWeeks, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

export const DAYS = ['mon','tue','wed','thu','fri','sat','sun']
export const DAY_KO  = { mon:'월',tue:'화',wed:'수',thu:'목',fri:'금',sat:'토',sun:'일' }
export const DAY_FULL = { mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday',sun:'Sunday' }
export const DAY_FULL_KO = { mon:'월요일',tue:'화요일',wed:'수요일',thu:'목요일',fri:'금요일',sat:'토요일',sun:'일요일' }

export function getWeekKey(date = new Date()) {
  const s = startOfWeek(date, { weekStartsOn: 1 })
  return format(s, 'yyyy-MM-dd')
}

export function getWeekDates(weekKey) {
  const s = parseISO(weekKey)
  return DAYS.reduce((acc, d, i) => { acc[d] = addDays(s, i); return acc }, {})
}

export function prevWeekKey(wk) { return format(subWeeks(parseISO(wk), 1), 'yyyy-MM-dd') }
export function nextWeekKey(wk) { return format(addWeeks(parseISO(wk), 1), 'yyyy-MM-dd') }

export function formatWeekRange(wk) {
  const s = parseISO(wk)
  const e = addDays(s, 6)
  return `${format(s,'M.d')} – ${format(e,'M.d',{locale:ko})}`
}

export function isToday(date) {
  return format(date,'yyyy-MM-dd') === format(new Date(),'yyyy-MM-dd')
}

export function todayDayKey() {
  const d = new Date().getDay() // 0=sun
  return ['sun','mon','tue','wed','thu','fri','sat'][d]
}

export function formatMonthDay(date) {
  return format(date, 'M/d', { locale: ko })
}
