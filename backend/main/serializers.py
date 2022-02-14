from rest_framework import serializers


class MessageSerializer(serializers.Serializer):
    sender = serializers.CharField(max_length=200)
    receiver = serializers.CharField(max_length=200)
    message = serializers.CharField(max_length=500)
    timestamp = serializers.DateTimeField()