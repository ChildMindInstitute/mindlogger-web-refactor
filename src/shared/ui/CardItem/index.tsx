import { PropsWithChildren, useContext, useMemo } from 'react';

import { TargetSubjectLine } from './TargetSubjectLine';

import { SurveyContext } from '~/features/PassSurvey';
import { Theme } from '~/shared/constants';
import { Box, Markdown, Text } from '~/shared/ui';
import { insertAfterMedia, useCustomMediaQuery, useCustomTranslation } from '~/shared/utils';

interface CardItemProps extends PropsWithChildren {
  watermark?: string;
  isInvalid?: boolean;
  isOptional?: boolean;
  markdown?: string | null;
  testId?: string;
}

export const CardItem = ({ children, markdown, isOptional, testId }: CardItemProps) => {
  const { greaterThanSM } = useCustomMediaQuery();

  const { t } = useCustomTranslation();

  const context = useContext(SurveyContext);

  const processedMarkdown = useMemo(() => {
    if (markdown !== null && markdown !== undefined) {
      if (!context.targetSubject) return markdown;
      return insertAfterMedia(markdown, '<div id="target-subject"></div>');
    }
    return markdown;
  }, [markdown, context.targetSubject]);

  return (
    <Box
      data-testid={testId || 'active-item'}
      display="flex"
      flex={1}
      padding={greaterThanSM ? '72px 48px' : '36px 16px'}
      flexDirection="column"
      gap="48px"
      sx={{ fontWeight: '400', fontSize: '18px', lineHeight: '28px' }}
    >
      {processedMarkdown ? (
        <Box>
          <Markdown
            markdown={processedMarkdown}
            components={{
              div: (props) =>
                props.id === 'target-subject' ? (
                  <TargetSubjectLine subject={context.targetSubject} />
                ) : (
                  <div {...props} />
                ),
            }}
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
      ) : null}
      <Box>{children}</Box>
    </Box>
  );
};
