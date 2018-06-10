import { GoogleCloudDialogflowV2WebhookRequest } from 'actions-on-google';
import { DialogFlow, HandlerInput, RequestHandler } from './DialogFlow';

const CalcIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    // CalcIntentを処理する
    return handlerInput.requestEnvelope.intentName == 'CalcIntent';
  },
  handle(handlerInput: HandlerInput) {
    let params = handlerInput.requestEnvelope.parameters;

    const birthday = new Date(params.year, params.month - 1, params.day); // 誕生日
    const today = new Date();　//今日
	  const ms = today.getTime() - birthday.getTime(); // 日付差(ミリ秒)
  	const days = Math.floor(ms / (1000 * 60 * 60 *24)); // ミリ秒から日付へ変換
    
    const speechText = '今日は、あなたが生まれてから、' + (days + 1) + '日目です';

    return handlerInput.responseBuilder
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
  }
};

export async function handle(event: GoogleCloudDialogflowV2WebhookRequest, context: any) {
  console.log(JSON.stringify(event));
  const dialogFlow = new DialogFlow()
    .addRequestHandlers(
      CalcIntentHandler)
    .create();
  return dialogFlow.invoke(event, context);
}

