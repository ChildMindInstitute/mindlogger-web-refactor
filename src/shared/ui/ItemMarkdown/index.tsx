import { useMemo, useContext } from 'react';

import { TargetSubjectLine } from './TargetSubjectLine';
import { Markdown, MarkdownProps } from '../Markdown';

import { SurveyContext } from '~/features/PassSurvey';
import { Theme } from '~/shared/constants';
import { Box, Text } from '~/shared/ui';
import { insertAfterMedia, useCustomTranslation } from '~/shared/utils';

type ItemMarkdownProps = MarkdownProps & {
  isOptional?: boolean;
  targetSubjectId?: string | null;
};

export const ItemMarkdown = ({ markdown, isOptional, ...rest }: ItemMarkdownProps) => {
  const { t } = useCustomTranslation();
  const context = useContext(SurveyContext);

  const processedMarkdown = useMemo(() => {
    if (markdown !== null && markdown !== undefined) {
      if (!context.targetSubject) return markdown;

      return insertAfterMedia(markdown, '<div id="target-subject"></div>');
    }
    return markdown;
  }, [markdown, context.targetSubject]);

  return markdown ? (
    <Box display="flex" flexDirection="column" gap="12px">
      <Markdown
        markdown={processedMarkdown}
        components={
          context.targetSubject
            ? {
                div: (props) =>
                  props.id === 'target-subject' ? (
                    <TargetSubjectLine subject={context.targetSubject} />
                  ) : (
                    <div {...props} />
                  ),
              }
            : undefined
        }
        {...rest}
      />
      {isOptional && (
        <Text
          variant="body1"
          color={Theme.colors.light.outline}
          testid="optional-item-label"
          fontWeight="400"
          fontSize="18px"
          lineHeight="28px"
        >
          {`(${t('optional')})`}
        </Text>
      )}
    </Box>
  ) : null;
};
