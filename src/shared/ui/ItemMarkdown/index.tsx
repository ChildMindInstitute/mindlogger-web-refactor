import { useContext, useMemo } from 'react';

import { Markdown, MarkdownProps } from '../Markdown';
import { TargetSubjectLine } from './TargetSubjectLine';

import { SurveyContext } from '~/features/PassSurvey';
import { variables } from '~/shared/constants/theme/variables';
import { Box, Text } from '~/shared/ui';
import { insertAfterMedia, useCustomTranslation } from '~/shared/utils';

type ItemMarkdownProps = MarkdownProps & {
  isOptional?: boolean;
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
        <Text color={variables.palette.outline} testid="optional-item-label" variant="bodyLarger">
          {`(${t('optional')})`}
        </Text>
      )}
    </Box>
  ) : null;
};
