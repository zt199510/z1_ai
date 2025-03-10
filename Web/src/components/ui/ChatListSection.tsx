import React from 'react';
import { Skeleton, Dropdown } from 'antd';
import Link from 'antd/lib/typography/Link';
import clsx from 'clsx';
import MenuSection from './MenuSection';

// You'll need to import these icons or replace them with your own
import { More, PlusIcon, ThumbtackIcon } from '@/components/icons';

interface ChatListSectionProps {
  t: (key: string) => string;
  chatListStatus: string;
  chatList: any[];
  currentChatId: string;
  pathname: string;
  highlightedChat: string;
  handleOpenChange: (isOpen: boolean, chatId: string) => void;
  deleteChat: (chatId: string) => void;
  setNewChatName: (name: string) => void;
  setRenameChatId: (id: string) => void;
  showEditModal: () => void;
  toggleStar: (chatId: string, isStar: boolean) => void;
  getItems: (isStar: boolean) => any[];
  getBotActionItems: (isStar: boolean) => any[];
}

const ChatListSection: React.FC<ChatListSectionProps> = ({
  t,
  chatListStatus,
  chatList,
  currentChatId,
  pathname,
  highlightedChat,
  handleOpenChange,
  deleteChat,
  setNewChatName,
  setRenameChatId,
  showEditModal,
  toggleStar,
  getItems,
  getBotActionItems
}) => {
  const top8ChatsWithoutBot = chatList
    .filter(chat => !chat.isWithBot)
    .slice(0, 8);
  
  const isOver8 = chatList.filter(chat => !chat.isWithBot).length > 8;

  return (
    <div className="rounded-xl overflow-hidden mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <MenuSection
        title={t('recentChat')}
        icon={<MessageIcon width='20' height='20' />}
        defaultExpanded={true}>

        {chatListStatus !== 'done' ?
          <div className='pl-8 py-4 pr-6'>
            <Skeleton title={false} paragraph={{ rows: 6, width: ['60%', '70%', '70%', '60%', '70%', '70%'] }} active />
          </div> :
          <>
            {chatList.filter(chat => !chat.isWithBot).length === 0 && <div className='flex flex-col'>
              <span className='my-2 text-xs text-gray-400 ml-8'>{t('historyNotice')}</span>
            </div>
            }
            <ul className="pr-4">
              {top8ChatsWithoutBot.map((chat) => (
                <Link key={chat.id} href={`/chat/${chat.id}`}>
                  <li key={chat.id}
                    style={{ fontSize: '13px' }}
                    className={clsx({ "bg-white hover:bg-white font-medium text-gray-800": chat.id === currentChatId }, { "bg-gray-200": highlightedChat === chat.id }, "pr-2 ml-5 pl-3 py-1.5 rounded-xl text-gray-500 relative group mt-1 hover:bg-gray-200")}>
                    <div className="flex items-center justify-between w-full grow">
                      <div className="whitespace-nowrap w-0 grow overflow-hidden text-ellipsis"
                      >{chat.title}</div>
                      <Dropdown
                        menu={{
                          items: getItems(chat.isStar || false), onClick: (e) => {
                            e.domEvent.preventDefault();
                            if (e.key === 'delete') {
                              deleteChat(chat.id);
                            }
                            if (e.key === 'edit') {
                              setNewChatName(chat.title || '');
                              setRenameChatId(chat.id);
                              showEditModal();
                            }
                          }
                        }}
                        onOpenChange={(isOpen) => {
                          handleOpenChange(isOpen, chat.id)
                        }}
                        trigger={['click']}>
                        <div onClick={(e) => e.preventDefault()} className={clsx({ 'bg-gray-100': highlightedChat === chat.id }, 'rounded hover:bg-gray-100')} >
                          <More
                            theme="outline"
                            size="20"
                            className={clsx({ "visible": highlightedChat === chat.id, "invisible": highlightedChat !== chat.id }, 'h-5 w-5 group-hover:visible hover:bg-gray-100')}
                            fill="#9ca3af"
                            strokeWidth={2} />
                        </div>
                      </Dropdown>
                    </div>
                  </li>
                </Link>
              ))}
              {isOver8 && <Link href='/chat/thread/list'>
                <li
                  style={{ fontSize: '13px' }}
                  className={clsx({ "bg-white hover:bg-white font-medium text-gray-800": '/chat/thread/list' === pathname }, "pr-2 ml-5 pl-3 py-1.5 rounded-xl text-gray-500 relative group mt-1 hover:bg-gray-200")}>
                  <div className="flex items-center justify-between w-full grow">
                    <div className="whitespace-nowrap w-0 grow overflow-hidden text-ellipsis"
                    >{t('viewAll')}...</div>
                  </div>
                </li>
              </Link>}
            </ul>
          </>
        }
      </MenuSection>

      <MenuSection title={t('myBots')} icon={<Spark width={20} height={20} alt='spark' />} defaultExpanded={false}>
        <ul className="pr-4">
          <Link href={`/chat/bot/discover`}>
            <li
              style={{ fontSize: '13px' }}
              className={clsx({ 'bg-white font-medium text-gray-800': pathname === '/bot/discover' }, "pr-2 ml-0 pl-2 py-2 rounded-xl text-gray-500 relative group mt-1 hover:bg-gray-200")}>
              <div className="flex items-center justify-between w-full grow">
                <div style={{ width: '20px', height: '20px' }} className="flex items-center justify-center">
                  <PlusIcon width={18} height={18} alt='add' />
                </div>
                <div className="ml-1 whitespace-nowrap w-0 grow overflow-hidden text-ellipsis"
                >{t('discoverBots')}</div>
              </div>
            </li>
          </Link>
          {chatList.filter(chat => chat.isWithBot).sort((a, b) => {
            if (a?.isStar && a.starAt && b?.isStar && b.starAt) {
              return b.starAt.getTime() - a.starAt.getTime();
            }
            if (a?.isStar && !b?.isStar) {
              return -1;
            }
            if (!a?.isStar && b?.isStar) {
              return 1;
            } else {
              return a.createdAt.getTime() - b.createdAt.getTime();
            }
          }
          ).map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <li key={chat.id}
                style={{ fontSize: '13px' }}
                className={clsx({ "bg-white hover:bg-white font-medium text-gray-800": chat.id === currentChatId }, { "bg-gray-200": highlightedChat === chat.id }, "pr-2 ml-0 pl-2 py-2 rounded-xl text-gray-500 relative group mt-1 hover:bg-gray-200")}>
                <div className="flex items-center justify-between w-full grow">
                  <div style={{ width: '22px', height: '22px' }} className="flex items-center justify-center bg-slate-200 rounded-full">
                    {chat.avatarType === 'emoji' &&
                      <span className='text-base'>{chat.avatar}</span>}
                    {chat.avatarType === 'url' &&
                      <img
                        src={chat.avatar as string}
                        className='rounded-full'
                        width={20}
                        height={20}
                        alt='chat bot'
                      />}
                  </div>
                  <div className="ml-1 flex flex-row whitespace-nowrap w-0 grow"
                  >
                    <span className='text-ellipsis overflow-hidden'>{chat.title}</span>
                    {chat?.isStar && <ThumbtackIcon className='ml-2' width={16} height={16} alt='thumbtack' />}</div>
                  <Dropdown
                    menu={{
                      items: getBotActionItems(Boolean(chat.isStar)), onClick: (e) => {
                        e.domEvent.preventDefault();
                        if (e.key === 'delete') {
                          deleteChat(chat.id);
                        }
                        if (e.key === 'top') {
                          toggleStar(chat.id, !chat.isStar);
                        }
                      }
                    }}
                    onOpenChange={(isOpen) => {
                      handleOpenChange(isOpen, chat.id)
                    }}
                    trigger={['click']}>
                    <div onClick={(e) => e.preventDefault()} className={clsx({ 'bg-gray-100': highlightedChat === chat.id }, 'rounded hover:bg-gray-100')} >
                      <More
                        theme="outline"
                        size="20"
                        className={clsx({ "visible": highlightedChat === chat.id, "invisible": highlightedChat !== chat.id }, 'h-5 w-5 group-hover:visible hover:bg-gray-100')}
                        fill="#9ca3af"
                        strokeWidth={2} />
                    </div>
                  </Dropdown>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </MenuSection>
    </div>
  );
};

// You'll need to define these components or import them
const MessageIcon = ({ width, height }: { width: string, height: string }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Spark = ({ width, height, alt }: { width: number, height: number, alt: string }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L14.5 8.5L21 9.5L16.5 14L18 20.5L12 17.5L6 20.5L7.5 14L3 9.5L9.5 8.5L12 3Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ChatListSection; 