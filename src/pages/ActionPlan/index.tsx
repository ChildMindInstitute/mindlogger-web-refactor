import React, { useCallback, useState } from 'react';

import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import html2canvas from 'html2canvas';

import DownloadIconLight from '~/assets/download-icon-light.svg';
import DownloadIconDark from '~/assets/download-icon.svg';
import { SurveyManageButtons } from '~/features/PassSurvey';
import { ActionPlanPDFDocument } from '~/pages/ActionPlan/ActionPlanPDFDocument';
import { Phrase } from '~/pages/ActionPlan/types';
import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import SurveyLayout from '~/widgets/Survey/ui/SurveyLayout';

function ActionPlanPage() {
  const [downloadIcon, setDownloadIcon] = useState(DownloadIconDark);
  const title = 'Project Body Neutrality';
  const responseItems = {
    BN_01: 'I can’t wear this, it makes me feel sad',
    BN_02: ['Eat yummy food', 'Spend time with friends', 'Spend time outdoors'],
    BN_03: 'Today, I’m going to focus on things that have nothing to do with how I look.',
    BN_04:
      'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus. Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus.',
    BN_05: [
      'Eat yummy food',
      'Spend time with friends',
      'Spend time outdoors',
      'Eat yummy food',
      'Spend time with friends',
      'Spend time outdoors',
    ],
  };
  const phrases: Phrase[] = [
    {
      id: '1',
      image:
        'https://s3-alpha-sig.figma.com/img/5193/3af8/8096d9331dd5df050d5ae56c3a11ec08?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SjbvU7ZiYkCU1eHA5GgbIPL58UN5VuQNsP4BspFA5etF6WjZ-Ydo84pS1nCEGc2NGT2x0L0nmu3MIJE~rfXk98pxnI7cF3Id78dsVtLMYLIvotMbgy5S0j3SlXws4n5W3KwTCH~DcBhDtt3U6NjocZsQpS4kg3keB5b6yjaTNvENLeRnxs1xpwFzQ0n4qSoobmsbyByDh9FoV-2Tn-rqmmTzX9khckL7D3rSx0-Qud4BLffo6Y0NFEue-uQEvSzYNWrkAFBl2jPWlp2ENToZ3rLhTP2GimI0hB-4N6HAwE1bm~WaYKLzlXpQEK9z32Ec9EZ33AbNNzT-yLZtgIqzYw__',
      parts: [
        { type: 'text', text: 'When I have a negative thought about my body like' },
        { type: 'responseItem', responseItem: responseItems.BN_01 },
        { type: 'text', text: ', I have the power to challenge that thought' },
      ],
    },
    {
      id: '2',
      image: null,
      // 'https://s3-alpha-sig.figma.com/img/ed1e/dc40/1263449fdbb24466fd7406aab737b502?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nnP6QiH5xsg7iqNe0VA9k1ThiP1rJYC3BA1PjWCpA-DSIipxbsh-yL07OodEkFIuhkeWVuiX1~QE9JxhaKp9sxnArJvLoa9UFY5gmAKewlur6z4IJ1NcYTbpoqsHddcEk6byfkfJ4SnMKCHalf6KeZKdHE~gNbdFLiOhsCxmczNXC3OkZ4GJzi4zE3MrmRxrnAis~UFlcoMxoQTlLopJ75~1Dzd627iBn7njt6tVXMp1ISFyQrs-GrXRtir5DN~Gt0UjhDM~U5HbvMWlKeRT2ZCo~yHpaNiIbgOPP5FaKims1V-NkaVNVRl-KJJ-4s35PzkdS8L7bJLz31tmuZxkZA__',
      parts: [
        {
          type: 'text',
          text: 'I can remind myself of the things my body helps me do that I appreciate, like:',
        },
        { type: 'responseItem', responseItem: responseItems.BN_02 },
      ],
    },
    {
      id: '3',
      image:
        'https://s3-alpha-sig.figma.com/img/27c2/d535/6fc8bd571d5e8daf5970e39ec018dc06?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ZxTE6RNr1fw5YpEfZtDVNcPIGbIyV3pdzpCpN5NkanfO96Jfs8W39i886J6~ev13mWz4cI7zJZvksHTcaGIEBPB1AeQlsOkx0tV8XyuUToHoMxYW-iaWz~dcKC-bhGf134YuDE9ygY3~ToJO~JONbtwvr8z2kmrhF4RVtiUD~4hFzyllaH~ayay6oG55kkQcvs48Skvl04osH~cR7H-rrahMtuKvkLJ8fKet74Ge7nI5QAGnt4eblwRuMH92hfiZ7QLBuNpW-WwbAZuOmSiXvW3~zNYP3XdtbTHEb33IVHwoP-wlqkK~P4~8AOH0qYgxDg8ox9oNvMBSDJkqAi~VuQ__',
      parts: [
        {
          type: 'text',
          text: 'And I can hold onto a Body Neutral thought:',
        },
        { type: 'responseItem', responseItem: responseItems.BN_03 },
      ],
    },
    {
      id: '4',
      image:
        'https://s3-alpha-sig.figma.com/img/598c/78c8/0e6f9ef81eabe587a4247c85d46601f0?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ec09pNf2zvv36UjgZww4McnscHXMT7k5EGw4jrYliIHDmJxqheGw1UiU66Jkl01DDYt4CQjaxAh8d~fKumD4lZ7xftR~UPnNKD41HVTdTZtCgTQSWtiCpdNw9wBVRYu1R8DV-xBJzErG8U~FC2PrF7OjRLjHH2Ugr5hQzYYLqZi-DSTTWUNpivPF4XOIv1FmO44KIB-arzgp8LSInPrWprUWXODC-nNmvTHvpcBcRhtCGUw7eYiR3YrDZi3yx0mZeO64ayeJsv8ydOv1x9XHvvaxRV6FcWxL~eYvyPiePllNxfwajCVDa5SPBrJM0uaiH2~brgp9lhrvlt6mpGVPrg__',
      parts: [
        {
          type: 'text',
          text: 'And I can hold onto a Body Neutral thought:',
        },
        { type: 'responseItem', responseItem: responseItems.BN_03 },
      ],
    },
    {
      id: '5',
      image:
        'https://s3-alpha-sig.figma.com/img/1fad/9346/7948ae765848cfa088dcb854bed25ed5?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=PrpS4bBcbLTQDchZWM9cBdeNoRMEq2qfczQGcq079MZbFvpGTcuygsN6pXtg6DLeElyG4uVeRlcg7UmHXxNlOHmhCY9wzw6TOVl~q84AN1RpEWmB1cEkqeR-O~UTJeYbKgyhXYBHxlUmjPJ0asT9uhOQo2OoC70u6NEF8gVON5HRr1EMunsXF7QlCAN0aT2UucQy79l23RlOLMIg80gRwipdPJu6rof3wibpsApPZzDOfzPXY8TV~0dL1PufSkM~7tZOHmGI-AK8PrQzRchEcFcmfLYZjHQpgapNYoUjf6Xg5TtG5LWLw6LGx2PIp8fg4EHNEX~LSIdcbgzhP5MwXg__',
      parts: [
        {
          type: 'text',
          text: 'And I can hold onto a Body Neutral thought:',
        },
        { type: 'responseItem', responseItem: responseItems.BN_04 },
      ],
    },
    {
      id: '6',
      image:
        'https://s3-alpha-sig.figma.com/img/9796/b222/e9860966a0c8e0fdeecfe7cb044acf33?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Iuzyz3EOTEiQvMbgRgqkOz3bj8duTSQyqIQyFzC5yh2fE--9f2J~kuhxwQ~W5DAFjtqh2Fr0~2Pr54tTTA8e2SOX4MIK8Pbgug-S6q1thHFdPvKKMw3JE5i0Rp4Fz-7vagcVe8CZSghq7XKR3qTzN2s9ZWBMqwjhXLxeZrb-u0QVYZBpCSmalN71bxvzdY9we~l5ft4Ff1yLBY5FbFlNhkpiMDHVC87iAoj9CIbNiRVQHlrvRGRah6H74UEpkpU1pCP3vxUdkv~wVyo~f8HRspN7A5Nv6J5kdHOLlbkIdZVbgUEQGdloiNPWaoNzL5TzaVQKEcInfantZSXTSvyrdA__',
      parts: [
        {
          type: 'text',
          text: 'I can remind myself of the things my body helps me do that I appreciate, like:',
        },
        { type: 'responseItem', responseItem: responseItems.BN_05 },
      ],
    },
  ];
  const ref = React.createRef<HTMLDivElement>();

  const handleDownloadImage = useCallback(async () => {
    if (!ref.current) {
      return;
    }
    const element = ref.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');

    link.href = data;
    link.download = `${title} Action Plan.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [ref]);

  return (
    <SurveyLayout
      isSaveAndExitButtonShown={false}
      title={title}
      progress={93}
      footerActions={
        <SurveyManageButtons
          isLoading={false}
          isBackShown={true}
          onNextButtonClick={() => {}}
          backButtonText={'Back'}
          nextButtonText={'Done'}
        />
      }
    >
      <Box
        gap="24px"
        display={'flex'}
        flexDirection={'column'}
        alignItems="center"
        mt="40px"
        padding="36px 24px"
      >
        <Box gap="8px" display={'flex'} flexDirection={'column'} alignItems="center">
          <Text fontWeight="400" fontSize="24px" lineHeight="32px">
            Here&apos;s your plan
          </Text>
          <Text
            fontWeight="400"
            fontSize="16px"
            lineHeight="24px"
            letterSpacing="0.15px"
            sx={{ textAlign: 'center' }}
          >
            Download your Action Plan for reference when you need them later.
          </Text>
        </Box>
        <Button
          type="button"
          variant="contained"
          disableElevation={true}
          onMouseEnter={() => setDownloadIcon(DownloadIconLight)}
          onMouseLeave={() => setDownloadIcon(DownloadIconDark)}
          onClick={handleDownloadImage}
          sx={{
            width: '172px',
            height: '48px',
            padding: '10px 24px 10px 16px',
            borderRadius: '100px',
            backgroundColor: Theme.colors.light.secondaryContainer,

            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '20px',
            letterSpacing: '0.1px',
            color: Theme.colors.light.onSecondaryContainer,
            textTransform: 'none',

            // Hover styles
            '&:hover': {
              color: Theme.colors.light.onPrimary,
            },
          }}
          startIcon={
            <Avatar src={downloadIcon} variant="square" sx={{ width: '18px', height: '18px' }} />
          }
        >
          Download
        </Button>
        <ActionPlanPDFDocument title={title} phrases={phrases} ref={ref} />
      </Box>
    </SurveyLayout>
  );
}

export default ActionPlanPage;
