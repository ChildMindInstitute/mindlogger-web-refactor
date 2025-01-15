import { useEffect, useRef, useState } from 'react';

export const useCustomWordWrap = (text: string) => {
  const textAsArray = text.split(' ');
  const mustBreakWord = useRef<HTMLElement>(null);
  const originalWord = useRef<string>('');
  const [resize, setResize] = useState(0);
  const debounceTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleResize = () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        setResize((prev) => prev + 1);
      }, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mustBreakWord.current) {
      if (!originalWord.current && mustBreakWord.current.textContent) {
        originalWord.current = mustBreakWord.current.textContent;
      }

      if (originalWord.current) {
        const characters = originalWord.current.split('');
        mustBreakWord.current.innerHTML = characters
          .map((letter) => `<span>${letter}</span>`)
          .join('');
      }

      const mustBreakWordCharacters = Array.from(mustBreakWord.current.children);
      for (let i = 0; i < mustBreakWordCharacters.length; i++) {
        const currentCharacter = mustBreakWordCharacters[i] as HTMLElement;
        const previousCharacter = i > 0 ? (mustBreakWordCharacters[i - 1] as HTMLElement) : null;

        if (
          previousCharacter &&
          !previousCharacter.innerText.includes('-') &&
          currentCharacter.offsetTop > previousCharacter?.offsetTop
        ) {
          (mustBreakWordCharacters[i - 3] as HTMLElement).innerText += '-\n';
        }
      }
    }
  }, [resize]);

  const processedWords = textAsArray.map((word: string, index) => {
    if (word.length > 15)
      return {
        word,
        needsWrap: true,
        ref: mustBreakWord,
      };

    return {
      word,
      needsWrap: false,
      ref: null,
    };
  });

  return { processedWords };
};
