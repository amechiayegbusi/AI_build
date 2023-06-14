import Currency from 'models/currency';
import Draw from 'models/draw';
import GroupLottery from 'models/grouplottery';
import GroupUser from 'models/groupuser';
import Lottery from 'models/lottery';
import Ticket from 'models/ticket';
import moment from 'moment';

import * as LtechService from './LtechService';

export const getCustomDraw = async (idDraw: number): Promise<Draw | boolean> => {
  let draw = await Draw.findOne({
    include: [
        {
          model: Ticket,
          include: [
            {
              model: Lottery,
            }
          ]
        }
      ],
    where: {
      id: idDraw,
      prize: null
    } 
  });

  if (!draw) return false;

  if (draw.prize) return draw;

  let lottoDraw = await LtechService.getOrderedTicket(draw.token);

  if (lottoDraw.lines && lottoDraw.lines.length > 0) {
    if (
      lottoDraw.lines[0].draws
      && lottoDraw.lines[0].draws[0]
      && lottoDraw.lines[0].draws[0].date
    ) {
      draw.drawDayLtech = moment(lottoDraw.lines[0].draws[0].date).unix();
      let prize = lottoDraw.lines[0].draws[0].prize;
      if (prize) {
        draw.prize = await Currency.convert(prize, draw.ticket?.lottery?.currency!);
      } else {
        draw.prize = null;
      }
    }

    if (lottoDraw.lines[0].numbers
      && lottoDraw.lines[0].numbers.main
    ) {
      for (let k in lottoDraw.lines[0].numbers) {
        let v = lottoDraw.lines[0].numbers[k];
        if (k === 'main') {
          draw.mainNumbersPlayed = JSON.stringify(v);
        } else {
          draw.bonusNumbersPlayed = JSON.stringify(Array.isArray(v) ? v : [v]);
          break;
        }
      }

      draw = await draw.save();
      
      if (draw) {
        let winningNumbers = await draw.getWinningNumbers();

        if (draw.prize && winningNumbers) {
          try {
            if (draw.ticket?.idGroup) {
              //Group play
              let groupLottery = await GroupLottery.findOne({
                include: [
                  {
                    model: GroupUser,
                  }
                ],
                where: {
                  id: draw.ticket?.idGroup
                }
              });

              for (let i = 0; i < groupLottery?.groupUsers.length!; i++) {
                let guser = groupLottery?.groupUsers[i];
                
                if (!guser) continue;

                let sharePrize: number = draw.prize! * guser.shares / groupLottery?.shares!;
              
                draw.prize = sharePrize;
                // pending
                // let emailData = { draw: draw };

                // Yii::$app->mailer
                // ->compose('results-html', $emailData)
                // ->setFrom([Yii::$app->params['noReplyEmail'] => Yii::$app->params['appName']])
                // ->setTo($draw->ticket->user->email)
                // ->setSubject(Yii::t('task/email', 'Results for Your ticket are being received'))
                // ->send();
              }
            } else {
              // pending
              // let emailData = { draw: draw };

              // Yii::$app->mailer
              // ->compose('results-html', $emailData)
              // ->setFrom([Yii::$app->params['noReplyEmail'] => Yii::$app->params['appName']])
              // ->setTo($draw->ticket->user->email)
              // ->setSubject(Yii::t('task/email', 'Results for Your ticket are being received'))
              // ->send();
            }
          } catch (error) {
            console.log('Error while been sending results letter.');
          }
        }

        return draw;
      }
    }
  }
  
  return false;
}