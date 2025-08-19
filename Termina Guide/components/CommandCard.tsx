import React, { useState } from 'react';
import { Copy, Check, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { CommandWithCategory } from '../endpoints/commands_GET.schema';
import { Button } from './Button';
import { Badge } from './Badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './Tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './Accordion';
import styles from './CommandCard.module.css';

interface CommandCardProps {
  command: CommandWithCategory;
}

export const CommandCard = ({ command }: CommandCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command.command).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      err => {
        console.error('Failed to copy command: ', err);
      },
    );
  };

  const hasCommonIssues = command.commonErrors && command.commonErrors.length > 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Badge
          style={{
            backgroundColor: command.categoryColor
              ? `color-mix(in srgb, ${command.categoryColor} 15%, transparent)`
              : undefined,
            color: command.categoryColor || undefined,
            borderColor: command.categoryColor
              ? `color-mix(in srgb, ${command.categoryColor} 20%, transparent)`
              : undefined,
          }}
        >
          {command.categoryName}
        </Badge>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCopy}
              aria-label="Copy command"
            >
              {copied ? <Check size={16} className={styles.checkIcon} /> : <Copy size={16} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? 'Copied!' : 'Copy command'}</TooltipContent>
        </Tooltip>
      </div>

      <div className={styles.commandSection}>
        <code className={styles.commandText}>{command.command}</code>
      </div>

      <p className={styles.description}>{command.description}</p>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <h4 className={styles.detailTitle}>Syntax</h4>
          <code className={styles.detailCode}>{command.syntax}</code>
        </div>
        {command.example && (
          <div className={styles.detailItem}>
            <h4 className={styles.detailTitle}>Example</h4>
            <code className={styles.detailCode}>{command.example}</code>
          </div>
        )}
      </div>

      {command.context && (
        <div className={styles.contextSection}>
          <div className={styles.sectionHeader}>
            <Info size={16} className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>When to use</h4>
          </div>
          <p className={styles.contextText}>{command.context}</p>
        </div>
      )}

      {hasCommonIssues && (
        <div className={styles.accordionSection}>
          <Accordion type="single" collapsible>
            <AccordionItem value="common-issues">
              <AccordionTrigger>
                <div className={styles.accordionTriggerContent}>
                  <AlertTriangle size={16} className={styles.warningIcon} />
                  <span>Common Issues & Solutions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className={styles.issuesContent}>
                  {command.commonErrors?.map((error, index) => (
                    <div key={index} className={styles.issueItem}>
                      <div className={styles.errorSection}>
                        <h5 className={styles.errorTitle}>
                          <AlertTriangle size={14} className={styles.errorIcon} />
                          Error
                        </h5>
                        <code className={styles.errorText}>{error}</code>
                      </div>
                      {command.solutions && command.solutions[index] && (
                        <div className={styles.solutionSection}>
                          <h5 className={styles.solutionTitle}>
                            <Lightbulb size={14} className={styles.solutionIcon} />
                            Solution
                          </h5>
                          <p className={styles.solutionText}>{command.solutions[index]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {command.tags && command.tags.length > 0 && (
        <div className={styles.tags}>
          {command.tags.map(tag => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};