import { GoogleCloudDialogflowV2WebhookRequest } from 'actions-on-google';
import { GoogleCloudDialogflowV2WebhookResponse } from 'actions-on-google';
import { ApiClientObjectMap } from 'actions-on-google/dist/common';

export class DialogFlow {
    private handlers:RequestHandler[];
    
    constructor(){
        this.handlers = [];
    }
    
    create(): DialogFlow {
        return this;
    }

    async invoke(request: GoogleCloudDialogflowV2WebhookRequest,　context: any): Promise<GoogleCloudDialogflowV2WebhookResponse> {
        let handlerInput = new HandlerInput(request, context);

        let target: RequestHandler|null = null;
        this.handlers.forEach( handler => {
            if(target == null && handler.canHandle(handlerInput)){
                target = handler;
            }
        })
        if (target == null) {
            throw Error('Could not find a handler that can handle it.')
        } 
        return await (target as RequestHandler).handle(handlerInput);
    }

    addRequestHandlers(...requestHandlers : RequestHandler[]): DialogFlow {
        for ( const requestHandler of requestHandlers ) {
            this.handlers.push(requestHandler);
        }
        return this;
    }
}

export interface RequestHandler {
    canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean;
    handle(handlerInput: HandlerInput): Promise<GoogleCloudDialogflowV2WebhookResponse> | GoogleCloudDialogflowV2WebhookResponse;
}

export class HandlerInput {
    requestEnvelope: RequestEnvelope;
    context?: any;
    responseBuilder: ResponseBuilder;
    constructor(request: GoogleCloudDialogflowV2WebhookRequest,　context: any){
        this.context = context;
        this.responseBuilder = new ResponseBuilder();
        this.requestEnvelope = new RequestEnvelope(request);
    }
}

export class ResponseBuilder {
    private response: GoogleCloudDialogflowV2WebhookResponse;
    constructor(){
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
        }
    }
    speak(speechOutput: string): this {
        if (this.response.payload && this.response.payload.google) {
            let google = this.response.payload.google
            if (google.richResponse && google.richResponse.items ) {
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

    withShouldEndSession(val: boolean): this {
        if( this.response.payload ) {
            if(this.response.payload.google ) {
                if(this.response.payload.google.expectUserResponse ) {
                    this.response.payload.google.expectUserResponse = val;
                }
            }
        }
        return this;
    }

    getResponse(): GoogleCloudDialogflowV2WebhookResponse{
        return this.response;
    }
}

export class RequestEnvelope {
    intentName: string;
    query: string;
    parameters: ApiClientObjectMap<any>;
    userId: string;
    
    constructor(request: GoogleCloudDialogflowV2WebhookRequest) {
        if (request.queryResult){
            if( request.queryResult.intent && request.queryResult.intent.displayName ) {
                this.intentName = request.queryResult.intent.displayName;
            }
            if( request.queryResult.queryText ) {
                this.query = request.queryResult.queryText;
            }
            if( request.queryResult.parameters ) {
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

