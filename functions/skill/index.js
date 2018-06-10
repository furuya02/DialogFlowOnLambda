"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DialogFlow_1 = require("./DialogFlow");
const CalcIntentHandler = {
    canHandle(handlerInput) {
        // CalcIntentを処理する
        return handlerInput.requestEnvelope.intentName == 'CalcIntent';
    },
    handle(handlerInput) {
        let params = handlerInput.requestEnvelope.parameters;
        const birthday = new Date(params.year, params.month - 1, params.day); // 誕生日
        const today = new Date(); //今日
        const ms = today.getTime() - birthday.getTime(); // 日付差(ミリ秒)
        const days = Math.floor(ms / (1000 * 60 * 60 * 24)); // ミリ秒から日付へ変換
        const speechText = '今日は、あなたが生まれてから、' + (days + 1) + '日目です';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};
function handle(event, context) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(JSON.stringify(event));
        const dialogFlow = new DialogFlow_1.DialogFlow()
            .addRequestHandlers(CalcIntentHandler)
            .create();
        return dialogFlow.invoke(event, context);
    });
}
exports.handle = handle;
//# sourceMappingURL=index.js.map