import { FiInfo } from 'react-icons/fi'

export const AuthDemoNotice = () => {
  return (
    <aside className='mt-4 flex gap-3 rounded-xl border border-[#2a2a2b] bg-[#1e1e1f] p-4 text-left'>
      <FiInfo className='mt-0.5 h-4 w-4 shrink-0 text-[#5b9bea]' />
      <div className='space-y-1.5 text-xs leading-relaxed text-[#828282]'>
        <p className='text-sm font-medium text-[#e1e3e6]'>Это демо-приложение</p>
        <p>
          IN CHAT создан в ознакомительных целях как проект для портфолио. Пожалуйста, не
          загружайте сюда личные документы, пароли и другие конфиденциальные сведения.
        </p>
        <p>
          Владелец сайта не несёт ответственности за материалы, загруженные пользователями, а
          также за сохранность и использование данных, указанных при регистрации.
        </p>
      </div>
    </aside>
  )
}
