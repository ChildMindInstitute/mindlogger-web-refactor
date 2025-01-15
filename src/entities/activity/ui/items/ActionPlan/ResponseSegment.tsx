import { useXScaledDimension } from './hooks';

import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

type ItemResponseText = {
  itemResponseType: 'text';
  text: string;
};

type ItemResponseList = {
  itemResponseType: 'list';
  items: string[];
};

type ResponseSegmentProps = {
  itemResponse: ItemResponseText | ItemResponseList;
  isAtStart: boolean;
};

export const ResponseSegment = ({ itemResponse, isAtStart }: ResponseSegmentProps) => {
  const listPadding = useXScaledDimension(40);

  return (
    <Text component="span" fontWeight="700" fontSize="inherit" lineHeight="inherit">
      {itemResponse.itemResponseType === 'list' ? (
        <>
          {isAtStart ? null : (
            <span>
              &nbsp;
              <br />
            </span>
          )}
          <Box
            component="ul"
            marginTop={isAtStart ? `0px` : undefined}
            paddingLeft={`${listPadding}px`}
          >
            {itemResponse.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </Box>
        </>
      ) : (
        <>
          {isAtStart ? '' : ' '}
          {itemResponse.text}
        </>
      )}
    </Text>
  );
};
