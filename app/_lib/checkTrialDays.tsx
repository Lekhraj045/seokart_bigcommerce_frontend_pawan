import { differenceInDays } from 'date-fns'

export const checkTrialDays = (trialInfo: any) => {
 const date = new Date((trialInfo.timestamp) * 1000)
 const daysDiff = differenceInDays(new Date(), date)
 if (trialInfo.isPaid == 1) {
  return { userStatus: 'paid', trialDays: 10 - daysDiff }
 }
 if (daysDiff > 10) {
  return { userStatus: 'free', trialDays: 10 - daysDiff }
 } else {
  return { userStatus: 'trial', trialDays: 10 - daysDiff }
 }
}