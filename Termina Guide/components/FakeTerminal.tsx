import React, { useState, useRef, useEffect } from 'react';
import { Selectable } from 'kysely';
import { useTranslation } from '../helpers/useTranslation';
import { PracticeExercises } from '../helpers/schema';
import { Terminal, CheckCircle, XCircle } from 'lucide-react';
import styles from './FakeTerminal.module.css';

interface FakeTerminalProps {
  exercise: Selectable<PracticeExercises>;
  onCommandSuccess: () => void;
  className?: string;
}

type OutputLine = {
  type: 'command' | 'output' | 'success' | 'error';
  text: string;
};

export const FakeTerminal = ({
  exercise,
  onCommandSuccess,
  className,
}: FakeTerminalProps) => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfTerminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex === -1
            ? history.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1);
        if (newIndex === historyIndex && historyIndex === history.length - 1) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  const processCommand = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const newOutput: OutputLine[] = [...output, { type: 'command', text: trimmedInput }];
    
    if (trimmedInput === exercise.commandToExecute) {
      newOutput.push({ type: 'success', text: t('practice.commandCorrect') });
      if (exercise.expectedOutput) {
        newOutput.push({ type: 'output', text: exercise.expectedOutput });
      }
      setTimeout(onCommandSuccess, 1000);
    } else {
      newOutput.push({ type: 'error', text: t('practice.commandIncorrect', { expected: exercise.commandToExecute }) });
    }

    setOutput(newOutput);
    setHistory(prev => [...prev, trimmedInput]);
    setHistoryIndex(-1);
    setInput('');
  };

  return (
    <div
      className={`${styles.terminal} ${className || ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className={styles.header}>
        <Terminal size={16} />
        <span>{t('practice.terminalTitle')}</span>
      </div>
      <div className={styles.content}>
        {output.map((line, index) => (
          <div key={index} className={styles.line}>
            {line.type === 'command' && <span className={styles.prompt}>$</span>}
            {line.type === 'success' && <CheckCircle className={styles.successIcon} size={16} />}
            {line.type === 'error' && <XCircle className={styles.errorIcon} size={16} />}
            <pre className={styles[line.type]}>{line.text}</pre>
          </div>
        ))}
        <div className={styles.inputLine}>
          <span className={styles.prompt}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={styles.input}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
        <div ref={endOfTerminalRef} />
      </div>
    </div>
  );
};