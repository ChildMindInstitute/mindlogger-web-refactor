import { canItemHaveAnswer } from '../lib';
import { AnswerAlerts } from '../lib/types';

import {
  CheckboxItem,
  MultiSelectionRowsItem,
  RadioItem,
  SingleSelectionRowsItem,
  SliderItem,
  SliderRowsItem,
} from '~/entities/activity/lib';
import { appletModel } from '~/entities/applet';

class AlertsExtractor {
  public extractFromRadio(radioItem: RadioItem): AnswerAlerts {
    const alerts: AnswerAlerts = [];

    const radioAnswer = radioItem.answer[0];

    const alertOption = radioItem.responseValues.options.find(
      (o) => o.alert && o.value === Number(radioAnswer),
    );

    if (alertOption && alertOption.alert) {
      alerts.push({
        activityItemId: radioItem.id,
        message: alertOption.alert,
      });
    }

    return alerts;
  }

  public extractFromCheckbox(checkboxItem: CheckboxItem): AnswerAlerts {
    const checkboxAnswers = checkboxItem.answer;

    const alertOptions = checkboxItem.responseValues.options.filter((o) => {
      const checkboxAnswerAlert = checkboxAnswers?.find((checkboxAnswer) => {
        return Number(checkboxAnswer) === o.value;
      });

      return checkboxAnswerAlert && o.alert;
    });

    const alerts = alertOptions
      .filter((alertOption) => !!alertOption.alert)
      .map((alertOption) => {
        return {
          activityItemId: checkboxItem.id,
          message: alertOption.alert as string,
        };
      });

    return alerts;
  }

  public extractFromSlider(sliderItem: SliderItem): AnswerAlerts {
    const sliderAnswer = sliderItem.answer;
    const isContinuousSlider = sliderItem.config.continuousSlider;

    if (!sliderItem.responseValues.alerts || sliderAnswer.length === 0) {
      return [];
    }

    const alerts: AnswerAlerts = [];

    sliderItem.responseValues.alerts.forEach((alert) => {
      const isValueInRange =
        alert.minValue !== null &&
        alert.maxValue !== null &&
        Number(sliderAnswer) >= alert.minValue &&
        Number(sliderAnswer) <= alert.maxValue;

      if (!isContinuousSlider && alert.value === Number(sliderAnswer)) {
        alerts.push({
          activityItemId: sliderItem.id,
          message: alert.alert,
        });
      }

      if (isContinuousSlider && isValueInRange) {
        alerts.push({
          activityItemId: sliderItem.id,
          message: alert.alert,
        });
      }
    });

    return alerts;
  }

  public extractFromStackedRadio(stackedRadioItem: SingleSelectionRowsItem): AnswerAlerts {
    const stackedRadioAnswer = stackedRadioItem.answer;

    const alerts: AnswerAlerts = [];

    stackedRadioItem.responseValues.dataMatrix.forEach((row, rowIndex) => {
      row.options.forEach((option) => {
        stackedRadioAnswer.forEach((itemAnswer, answerIndex) => {
          if (rowIndex === answerIndex && itemAnswer === option.optionId) {
            option.alert &&
              alerts.push({
                activityItemId: stackedRadioItem.id,
                message: option.alert,
              });
          }
        });
      });
    });

    return alerts;
  }

  public extractFromStackedCheckbox(item: MultiSelectionRowsItem): AnswerAlerts {
    const itemAnswer = item.answer;

    if (!itemAnswer) {
      return [];
    }

    const alerts: AnswerAlerts = [];

    itemAnswer.forEach((answer, answerIndex) => {
      const isEmptyRow = answer.every((el) => el === null);

      if (!isEmptyRow) {
        const currentDataMartix = item.responseValues.dataMatrix[answerIndex];

        answer.forEach((value, index) => {
          if (value) {
            const option = item.responseValues.options[index];

            const dataMatrixOption = currentDataMartix.options.find(
              (o) => o.optionId === option?.id,
            );

            if (dataMatrixOption && dataMatrixOption.alert) {
              alerts.push({
                activityItemId: item.id,
                message: dataMatrixOption.alert,
              });
            }
          }
        });
      }
    });

    return alerts;
  }

  public extractFromStackedSlider(item: SliderRowsItem): AnswerAlerts {
    const sliderAnswer = item.answer;

    if (!sliderAnswer) return [];

    const alerts: AnswerAlerts = [];

    item.responseValues.rows.forEach((row, rowIndex) => {
      if (row.alerts) {
        row.alerts.forEach((alert) => {
          if (alert.value === sliderAnswer[rowIndex]) {
            alerts.push({
              activityItemId: item.id,
              message: alert.alert,
            });
          }
        });
      }
    });

    return alerts;
  }

  private extractFromItem(item: appletModel.ItemRecord): AnswerAlerts {
    switch (item.responseType) {
      case 'singleSelect':
        return this.extractFromRadio(item);

      case 'multiSelect':
        return this.extractFromCheckbox(item);

      case 'singleSelectRows':
        return this.extractFromStackedRadio(item);

      case 'multiSelectRows':
        return this.extractFromStackedCheckbox(item);

      case 'slider':
        return this.extractFromSlider(item);

      case 'sliderRows':
        return this.extractFromStackedSlider(item);

      default:
        return [];
    }
  }

  private extractInternal(items: appletModel.ItemRecord[]): AnswerAlerts {
    const alerts = items
      .flatMap((item) => {
        const canHaveAnswer = canItemHaveAnswer(item.responseType);

        if (canHaveAnswer) {
          return this.extractFromItem(item);
        }

        return null;
      })
      .filter((x) => x !== null)
      .map((x) => x!);

    return alerts;
  }

  public extractForSummary(items: appletModel.ItemRecord[]): AnswerAlerts {
    try {
      return this.extractInternal(items);
    } catch (error) {
      return [
        {
          message: '[Error occurred]',
          activityItemId: 'unknown',
        },
      ];
    }
  }
}

export default new AlertsExtractor();
