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
class DialogFlow {
    constructor() {
        this.handlers = [];
    }
    create() {
        return this;
    }
    invoke(request, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let handlerInput = new HandlerInput(request, context);
            let target = null;
            this.handlers.forEach(handler => {
                if (target == null && handler.canHandle(handlerInput)) {
                    target = handler;
                }
            });
            if (target == null) {
                throw Error('Could not find a handler that can handle it.');
            }
            return yield target.handle(handlerInput);
            //return JSON.stringify(response);
        });
    }
    addRequestHandlers(...requestHandlers) {
        for (const requestHandler of requestHandlers) {
            this.handlers.push(requestHandler);
        }
        return this;
    }
}
exports.DialogFlow = DialogFlow;
class HandlerInput {
    constructor(request, context) {
        this.context = context;
        this.responseBuilder = new ResponseBuilder();
        this.requestEnvelope = new RequestEnvelope(request);
    }
}
exports.HandlerInput = HandlerInput;
// Dialogflow Webhook Format
// https://developers.google.com/actions/build/json/dialogflow-webhook-json
class ResponseBuilder {
    constructor() {
        this.response = {
            payload: {
                google: {
                    expectUserResponse: true,
                    richResponse: {
                        items: [
                            {
                                simpleResponse: {
                                    textToSpeech: ''
                                }
                            }
                        ]
                    }
                }
            }
        };
    }
    speak(speechOutput) {
        if (this.response.payload && this.response.payload.google) {
            let google = this.response.payload.google;
            if (google.richResponse && google.richResponse.items) {
                let items = google.richResponse.items;
                if (items.length > 0) {
                    if (items[0].simpleResponse) {
                        items[0].simpleResponse.textToSpeech = speechOutput;
                    }
                }
            }
        }
        return this;
    }
    withShouldEndSession(val) {
        if (this.response.payload) {
            if (this.response.payload.google) {
                if (this.response.payload.google.expectUserResponse) {
                    this.response.payload.google.expectUserResponse = val;
                }
            }
        }
        return this;
    }
    getResponse() {
        return this.response;
    }
}
exports.ResponseBuilder = ResponseBuilder;
class RequestEnvelope {
    constructor(request) {
        if (request.queryResult) {
            if (request.queryResult.intent && request.queryResult.intent.displayName) {
                this.intentName = request.queryResult.intent.displayName;
            }
            if (request.queryResult.queryText) {
                this.query = request.queryResult.queryText;
            }
            if (request.queryResult.parameters) {
                this.parameters = request.queryResult.parameters;
            }
        }
        if (request.responseId) {
            this.userId = request.responseId;
        }
        // console.log('IntentName: ' + this.intentName);
        // console.log('Query: ' + this.query);
        // console.log('Parameters: ' + JSON.stringify(this.parameters));
        // console.log('UserId: ' + this.userId);
    }
}
exports.RequestEnvelope = RequestEnvelope;
/*
// Webhook　Request
export interface GoogleCloudDialogflowV2WebhookRequest {
    session?: string;
    responseId?: string;
    queryResult?: GoogleCloudDialogflowV2QueryResult;
    originalDetectIntentRequest?: GoogleCloudDialogflowV2OriginalDetectIntentRequest;
}

// Webhook　Response
// https://cloud.google.com/dialogflow-enterprise/docs/reference/rest/Shared.Types/WebhookResponse
export interface GoogleCloudDialogflowV2WebhookResponse {
    fulfillmentText?: string; // 画面に表示されるテキスト
    fulfillmentMessages?: GoogleCloudDialogflowV2IntentMessage[]; // ユーザーに提示する豊富なメッセージの集合
    source?: string;
    payload?: ApiClientObjectMap<any>;
    outputContexts?: GoogleCloudDialogflowV2Context[];// 出力コンテキストの集合
    followupEventInput?: GoogleCloudDialogflowV2EventInput; // プラットフォームが、指定されたイベントを入力として、内部的に別のsessions.detectIntent呼び出しを直ちに起動するようにする
}
*/ 
//# sourceMappingURL=DialogFlow.js.map