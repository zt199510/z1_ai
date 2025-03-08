import React from 'react';

interface GreetingHeaderProps {
  greetingText: string;
}

export default function GreetingHeader({ greetingText }: GreetingHeaderProps) {
  return (
    <h2 className='text-3xl font-bold text-center mb-8'>
      {greetingText && (
        <>
          👋 {greetingText}{(',有什么可以帮忙的？')}
        </>
      )}
      &nbsp;
    </h2>
  );
} 