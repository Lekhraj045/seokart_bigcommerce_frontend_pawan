'use client'
import {updateLanguage} from '@/app/_api/action'
import {useLocale, useTranslations} from 'next-intl';

export default function Home() {
  const locale = useLocale();

  const handleOnchange = async (e:any)=>{
    await updateLanguage(e.target.value)
  }
  return (<>
    <select defaultValue={locale} onChange={handleOnchange}>
      <option value='en'>en</option>
      <option value='hi'>hi</option>
    </select>
  </>)
}