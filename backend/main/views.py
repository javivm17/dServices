from django.shortcuts import render
import os
import time
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED as ST_201,
    HTTP_400_BAD_REQUEST as ST_400,
    HTTP_404_NOT_FOUND,
)
from . import serializers
from . import models
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
#Create an api endpoint that will return all messages by a specific sender and receiver

class SendMessage(generics.CreateAPIView):
    @csrf_exempt
    def post(self, request):
        body = request.data
        sender = body['sender']
        receiver = body['receiver']
        message = body['message']
        models.Message.objects.create(sender=sender, receiver=receiver, message=message)
        return Response(status=HTTP_200_OK)

class GetMessage(generics.CreateAPIView):
    @csrf_exempt
    def post(self, request):
        body = request.data
        sender = body['sender']
        receiver = body['receiver']
        messages_1 = models.Message.objects.filter(sender=sender, receiver=receiver)
        messages_2 = models.Message.objects.filter(sender=receiver, receiver=sender)
        messages = messages_1 | messages_2
        #Order messages by timestamp
        messages = messages.order_by('timestamp')
        #Convert messages to json
        serializer = serializers.MessageSerializer(messages, many=True)
        return Response(serializer.data, status=HTTP_200_OK)

class ShowAccount(generics.CreateAPIView):
    @csrf_exempt
    def post(self, request):
        body = request.data
        account = body['account']
        messages_1 = models.Message.objects.filter(sender=account)
        messages_2 = models.Message.objects.filter(receiver=account)
        messages = messages_1 | messages_2
        result=[]
        for i in messages:
            if i.sender == account:
                result.append(i.receiver)
            else:
                result.append(i.sender)
        result = set(result)
        #Order messages by timestamp
        #Convert messages to json
        return Response(result, status=HTTP_200_OK)
